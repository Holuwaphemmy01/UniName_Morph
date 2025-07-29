import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './graphql/schema/index.js';
import resolvers from './graphql/resolvers/index.js';
import dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 Server running at ${url}`);
});
