const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async (args) => {
        try {
            var existingUser = await User.findOne({email: args.userInput.email});
            if (existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    
            var creator = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
    
            const result = await creator.save();
            return { ...result._doc, id: creator.id, password: null };
    
        } catch (error) {
            throw error;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found.");
        }
        
        var isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect');
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email
        }, 'supersecretkey', {
            expiresIn: '1h'
        });

        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        };
    }
}