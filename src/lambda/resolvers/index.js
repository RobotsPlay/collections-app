const usersResolvers = require('./users');
const collectionsResolvers = require('./collections');

module.exports = {
    Collection: collectionsResolvers.Collection,
    Query: {
        ...usersResolvers.Query,
        ...collectionsResolvers.Query,
        hello: (parent, args, context) => {
            return "Hello, world!";
        }
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...collectionsResolvers.Mutation
    }
}