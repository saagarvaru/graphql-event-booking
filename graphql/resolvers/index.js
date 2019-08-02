const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const user = async userId => {
    try {
        const users = await User.findById(userId)
        if (!user) {
            throw new Error('User not found');
        }
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
    
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return { 
                ...event._doc, 
                _id: event.id, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator),    
            }
        });
    } catch (err) {
        throw err;
    }
    
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find().populate('creator');
            return events.map((event) => {
                return { 
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator) 
                };
            });
        } catch (error) {
            throw error;
        }
        
    },
    createEvent: async (args) => {
        try {
            var event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5d4494dbc7b526eee3429ac4'
            });
            var createdEvent;
            const result = await event.save();
            createdEvent = { ...result._doc, id: event.id };
            
            const creator = await User.findById('5d4494dbc7b526eee3429ac4');
            if (!creator) {
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();  
            return createdEvent;
        } catch (error) {
            throw error
        }
    },
    createUser: async (args) => {
        try {
            var existingUser = await User.findOne({email: args.userInput.email});
            if (existingUser) {
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    
            var creator = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
    
            const result = await creator.save()
            return { ...result._doc, id: creator.id, password: null }
    
        } catch (error) {
            throw error;
        }


            
    }
}