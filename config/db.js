const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');

const db = config.get('mongoURI');

// Async Await instead of Promise
// Promise would have been:
// mongoose.connect(db) - way I have done before
// NEW WAY:

// Important***

// In most cases using Async/Await.. you will be wrapping
// it in a Try - Catch block

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log(chalk.green.inverse('MongoDB Connected...'));
  } catch (err) {
    console.error(err.messsage);
    // Exit the process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
