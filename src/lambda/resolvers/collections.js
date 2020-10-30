const {AuthenticationError, UserInputError} = require('apollo-server-lambda');

const Collection = require('../models/Collection');
const User = require('../models/User');
const checkAuth = require('../utils/checkAuth');

module.exports = {
    Collection: {
        user: parent => {
            return User.findById(parent.user)
        },
    },
    Query: {
        async getCollections() {
            try{
                const collections = await Collection.find().sort({createdAt: -1});
                return collections;
            } catch(err) {
                throw new Error(err);
            }
        },

        async getCollection(_, {collectionId}) {
            try {
                const collection = await Collection.findById(collectionId);
                if(collection) {
                    return collection;
                }
                else {
                    throw new Error('Collection not found');
                }
            } catch(err) {
                throw new Error(err);
            }
        }
    },

    Mutation: {
        async createCollection(_, {name}, context) {
            const user = checkAuth(context);
            console.log(user)

            if(name.trim() === '') {
                throw new UserInputError('Unnamed collection', {
                    errors: {
                        body: 'Collection must have a name'
                    }
                })
            }

            const newCollection = new Collection({
                name,
                user: user.id,
                createdAt: new Date().toISOString()
            });

            const collection = await newCollection.save();

            return collection;
        },

        async deleteCollection(_, {collectionId}, context) {
            const user = checkAuth(context);

            try {
                const collection = await Collection.findById(collectionId);
                if(1 || user.id === collection.user.id) {
                    await collection.delete();
                    return 'Collection deleted Successfully';
                } 
                else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch(err) {
                throw new Error(err);
            }
        }
    }
}