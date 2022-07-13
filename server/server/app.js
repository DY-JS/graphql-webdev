const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('../schema/schema');

const app = express();
const PORT = 3005;

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
})); //как middleware

app.listen(PORT, (err) => {
  err ? console.log(error) : console.log('Server started!');
});
