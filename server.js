var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
 
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Person {
    id: Int,
    name: String,
    age: Int,
  }
  type Query {
    hello: String
    persons(name: String): [Person]
  }
`);
 
// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  persons: () => {
    return [
      {id:1, name:'aaa', age:10},
      {id:2, name:'bbb', age:20},
      {id:3, name:'ccc', age:30}
    ]
  },
};
 
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(5000);
console.log('Running a GraphQL API server at http://localhost:5000/graphql');