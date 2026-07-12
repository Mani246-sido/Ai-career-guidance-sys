const Notification = require("../models/Notification");

const createNotification = async (userId, title, message, type = "info") => {
  try {
    await Notification.create({ user: userId, title, message, type });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

module.exports = { createNotification };
