const path = require('path');
const fs = require('fs');
const fileURLToPath = require('url').fileURLToPath;
const dirname = require('path').dirname;
const gql = require('graphql-tag');


const schemaPath = path.join(__dirname, 'uniUser.graphql');
const typeDefs = gql(fs.readFileSync(schemaPath, 'utf8'));

module.exports = typeDefs;
