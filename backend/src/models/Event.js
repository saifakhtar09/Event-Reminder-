import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  dateTime: {
    type: Date,
    required: [true, 'Please provide event date and time']
  },
  imageUrl: {
    type: String,
    default: null,
    trim: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed'],
    default: function() {
      return new Date(this.dateTime) > new Date() ? 'upcoming' : 'completed';
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

eventSchema.index({ userId: 1, dateTime: 1 });
eventSchema.index({ dateTime: 1, reminderSent: 1 });

eventSchema.methods.updateStatus = function() {
  const now = new Date();
  const eventDate = new Date(this.dateTime);
  this.status = eventDate > now ? 'upcoming' : 'completed';
  return this.status;
};

export default mongoose.model('Event', eventSchema);