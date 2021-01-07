const { join } = require("path");
const { ApolloServer } = require("apollo-server-lambda");
const { importSchema } = require("graphql-import");
const { resolvers } = require("./resolvers");

const typeDefs = importSchema(join(__dirname, "schema.graphql"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

exports.handler = server.createHandler();
