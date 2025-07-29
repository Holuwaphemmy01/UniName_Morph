import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { gql } from 'graphql-tag';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaPath = path.join(__dirname, 'uniUser.graphql');
const typeDefs = gql(fs.readFileSync(schemaPath, 'utf8'));

export default typeDefs;
