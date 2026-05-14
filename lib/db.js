const mongoose = require('mongoose');

const connectDb = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (mongoose.connection.readyState === 2) return;

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/team-task-manager';
  if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is required in production');
  }
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not set. Using local MongoDB fallback at mongodb://127.0.0.1:27017/team-task-manager');
  }

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDb;
