// const express = require('express');
// const { graphqlHTTP } = require('express-graphql');
// const { buildSchema } = require('graphql');

// // Define schema
// const schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// // Define resolvers
// const root = {
//   hello: () => 'Hello from GraphQL with Express!',
// };

// // Create Express app
// const app = express();

// // Mount GraphQL endpoint
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true, 

// }));

// // Start server
// app.listen(3000, () => {
//   console.log('🚀 Server running at http://localhost:3000/graphql');

// });


const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// Define your schema
const typeDefs = `
  type Query {
    hello: String
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from Apollo Server!',
  },
};

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();