const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge.js');


module.exports = {
    events: async () => {
        try {
            const events = await Event.find().populate('creator');
            return events.map((event) => {
                return transformEvent(event);
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
            createdEvent = transformEvent(result);
            
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
    }
}