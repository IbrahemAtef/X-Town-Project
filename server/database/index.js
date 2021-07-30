const mongoose = require('mongoose')  
const config = require('config');
const mongoURI = config.get('mongoURI');

const connectDB = async () => {
  await mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((response) => {
      console.log('MongoDB Connected')
    })
    .catch((err) => {
      // Exit process with failure
      console.log(err.message);
      process.exit(1)
    })
}

module.exports = connectDB
