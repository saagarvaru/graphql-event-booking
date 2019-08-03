const Booking = require('../../models/booking');
const Event = require('../../models/event');

const { transformBooking } = require('./merge.js');

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map((booking) => {
                return transformBooking(booking);
            });
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async (args) => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        if (!fetchedEvent) {
            throw new Error('Event not found');
        }
        const booking = new Booking({
            user: '5d4494dbc7b526eee3429ac4',
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId});
            return event;
        } catch (error) {
            throw error;
        }
    }
}