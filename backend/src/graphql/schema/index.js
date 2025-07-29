const path = require('path');
const fs = require('fs');
const fileURLToPath = require('url').fileURLToPath;
const dirname = require('path').dirname;
const gql = require('graphql-tag');


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const schemaPath = path.join(__dirname, 'uniUser.graphql');
const typeDefs = gql(fs.readFileSync(schemaPath, 'utf8'));

module.exports = typeDefs;
