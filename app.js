const express = require('express');
// GraphQL 공식 사이트에서 소개
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { db } = require("./pgAdaptor");

const app = express();

const schema = buildSchema(`
  type Query {
    users: [User]
    user(id: ID): User
  }

  type Mutation {
    create_user(input: UserInput): User
    update_user(id: ID, input: UserInput): User
    delete_user(id: ID): User
  }

  type User {
    id: ID
    name: String
    age: Int
    email: String
  }

  input UserInput {
    name: String
    age: Int
    email: String
  }
`);
// 데이터가 생기기 전에는 id는 없는 값이라 입력 전용인 input 타입으로 객체 생성

// const resolver = {
//   users: () => {
//     return [
//       {id: 1, name: 'hjkang', age: 10, email: 'hjkang@mz.co.kr'},
//       {id: 2, name: 'bbb', age: 20, email: 'bbb@mz.co.kr'},
//       {id: 3, name: 'ccc', age: 30, email: 'ccc@mz.co.kr'},
//     ]
//   }
// }

// 메소드의 요청마다 어떻게 실제 작업들이 진행될지 구현
const resolver = {
  users: () => {
    return db.many('select * from test.user');
  },
  user: ({id}) => {
    return db.one('select * from test.user where id = $1', id);
  },
  create_user: ({input}) => {
    const values = [input.name, input.age, input.email];
    return db.one('insert into test.user(name, age, email) values ($1, $2, $3) returning id', values);
  },
  update_user: ({id, input}) => {
    const values = [id, input.name, input.age, input.email];
    return db.one('update test.user set name = $2, age = $3, email = $4 where id = $1 returning *', values);
  },
  delete_user: ({id}) => {
    return db.one('delete from test.user where id = $1 returning *', id);
  }
}

app.use('/graphql', graphqlHTTP({
  schema: schema, // 받거나 줄 데이터에 대한 설명
  rootValue: resolver, // 스키마가 실제 어떤 동작을 하는지에 대한 처리
  graphiql: true,
}));

app.listen(5000);
console.log('graphql 시작!!!!!!!!');