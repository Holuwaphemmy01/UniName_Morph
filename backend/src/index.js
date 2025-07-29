const ApolloServer = require('@apollo/server');
const startStandaloneServer = require('@apollo/server/standalone');
const typeDefs = require('./graphql/schema/index.js');
const resolvers = require('./graphql/resolvers/index.js');
const dotenv = require('dotenv');

dotenv.config();

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 Server running at ${url}`);
});
