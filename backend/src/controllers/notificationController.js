import User from '../models/User.js';
import { sendPushNotification, generateVAPIDKeys } from '../utils/pushNotification.js';

export const subscribe = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: 'Subscription object is required'
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      pushSubscription: subscription
    });

    res.status(200).json({
      success: true,
      message: 'Subscription saved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      pushSubscription: null
    });

    res.status(200).json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPublicKey = async (req, res) => {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY;

    if (!publicKey) {
      const keys = generateVAPIDKeys();
      console.log('\nGenerated VAPID Keys:');
      console.log('Public Key:', keys.publicKey);
      console.log('Private Key:', keys.privateKey);
      console.log('\nAdd these to your .env file\n');

      return res.status(500).json({
        success: false,
        message: 'VAPID keys not configured. Check server logs for generated keys.'
      });
    }

    res.status(200).json({
      success: true,
      publicKey
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const sendTestNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.pushSubscription) {
      return res.status(400).json({
        success: false,
        message: 'User has no active push subscription'
      });
    }

    const payload = {
      title: 'Test Notification',
      body: 'This is a test notification from Event Reminder',
      icon: '/icon.png'
    };

    const result = await sendPushNotification(user.pushSubscription, payload);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Test notification sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send notification',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
