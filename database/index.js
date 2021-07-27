const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  await mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((response) => {
      console.log('MongoDB Connected');
    })
    .catch((err) => {
      // Exit process with failure
      process.exit(1);
    });
};

module.exports = connectDB;
