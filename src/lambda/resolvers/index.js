const usersResolvers = require('./users');

module.exports = {
    Query: {
        ...usersResolvers.Query,
        hello: (parent, args, context) => {
            return "Hello, world!";
        }
    },
    Mutation: {
        ...usersResolvers.Mutation,
    }
}