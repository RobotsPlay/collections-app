// src/lambda/graphql.js
const { ApolloServer, gql } = require("apollo-server-lambda");
const mongoose = require('mongoose');

const resolvers = require('./resolvers');
const {MONGODB} = require('../../config.js');

const typeDefs = gql`
    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
        collections: [Collection!]
    }
    type Collection{
        id: ID!
        name: String!
        createdAt: String!
        user: User!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        hello: String
        getCollections: [Collection]
        getCollection(collectionId: ID!): Collection
    }
    type Mutation{
        register(registerInput:  RegisterInput): User!
        login(username: String!, password: String!): User!
        createCollection(name: String!): Collection!
        deleteCollection(collectionId: ID!): String!
    }
`;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ event, context }) => ({
        headers: event.headers,
        functionName: context.functionName,
        event,
        context,    
    }),
});

mongoose.connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Mongo DB Connected');
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    })
    .catch(err => {
        console.log(err);
    });


exports.handler = server.createHandler();