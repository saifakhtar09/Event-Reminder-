import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const { title, dateTime, image } = req.body;

    if (!title || !dateTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and dateTime'
      });
    }

    const event = await Event.create({
      title,
      dateTime,
      imageUrl: image, // Map 'image' to 'imageUrl'
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: {
        id: event._id,
        title: event.title,
        dateTime: event.dateTime,
        image: event.imageUrl,
        status: event.status,
        userId: event.userId,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id }).sort({ dateTime: 1 });

    events.forEach(event => event.updateStatus());
    await Promise.all(events.map(event => event.save()));

    const formattedEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      dateTime: event.dateTime,
      image: event.imageUrl,
      status: event.status,
      userId: event.userId,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: formattedEvents.length,
      data: formattedEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.updateStatus();
    await event.save();

    res.status(200).json({
      success: true,
      data: {
        id: event._id,
        title: event.title,
        dateTime: event.dateTime,
        image: event.imageUrl,
        status: event.status,
        userId: event.userId,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { title, dateTime, image } = req.body;

    let event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (title) event.title = title;
    if (dateTime) {
      event.dateTime = dateTime;
      event.reminderSent = false;
    }
    if (image) event.imageUrl = image;

    event.updateStatus();
    await event.save();

    res.status(200).json({
      success: true,
      data: {
        id: event._id,
        title: event.title,
        dateTime: event.dateTime,
        image: event.imageUrl,
        status: event.status,
        userId: event.userId,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};