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
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        hello: String
    }
    type Mutation{
        register(registerInput:  RegisterInput): User!
        login(username: String!, password: String!): User!
    }
`;

const server = new ApolloServer({
    typeDefs,
    resolvers
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