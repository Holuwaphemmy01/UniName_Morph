// import { ApolloServer } from '@apollo/server';
const { ApolloServer } = require('@apollo/server');
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './graphql/schema/index.js';
import resolvers from './graphql/resolvers/index.js';
import dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 Backend GraphQL API running at ${url}`);
});
