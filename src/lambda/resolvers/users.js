const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server-lambda');

const {validateRegisterInput, validateLoginInput} = require('../utils/validators')
const {SECRET_KEY} = require('../../../config');
const User = require('../models/User');

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, {expiresIn: '1h'} );
}

module.exports = {
    Mutation: {
        async login(parent, {username, password}, context, info) {
            const {valid, errors} = validateLoginInput(username, password);
            if(!valid) {
                throw new UserInputError('Errors', {errors})
            }

            const user = await User.findOne({username});

            if(!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', {errors});
            }

            // create token for user
            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },

        async register(parent, {registerInput: {username, email, password, confirmPassword}}, context, info){
            // Validate user fields
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid) {
                throw new UserInputError('Errors', {errors})
            }
            
            // Check username is not taken
            const user = await User.findOne({username});

            if(user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken.'
                    }
                })
            }

            // hash password 
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            // create token for user
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}