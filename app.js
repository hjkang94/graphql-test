const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { db } = require("./pgAdaptor");

const app = express();

const schema = buildSchema(`
  type Query {
    users: [User]
    user(id: Int): User
  }

  type Mutation {
    create_user(input: UserInput): User
  }

  type User {
    id: ID,
    name: String,
    age: Int,
    email: String,
  }

  input UserInput {
    name: String,
    age: Int,
    email: String,
  }
`);

// const resolver = {
//   user: () => {
//     return [
//       {id: 1, name: 'hjkang', age: 10, email: 'hjkang@mz.co.kr'},
//       {id: 2, name: 'bbb', age: 20, email: 'bbb@mz.co.kr'},
//       {id: 3, name: 'ccc', age: 30, email: 'ccc@mz.co.kr'},
//     ]
//   }
// }

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
  }
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolver,
  graphiql: true,
}));

app.listen(5000);
console.log('graphql 시작!!!!!!!!');