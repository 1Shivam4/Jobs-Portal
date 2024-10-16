const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Job = require('../models/jobModel');

// Load environment variables from .env file
dotenv.config({ path: '../config.env' });

const db = process.env.DATABASE;
console.log(db);

// Ensure the database connection string is correct
if (!db) {
  throw new Error(
    'Database connection string (DATABASE) is not defined in .env file'
  );
}

mongoose
  .connect(db)
  .then(() => console.log('Connection successful'))
  .catch((err) => console.error('DB connection error:', err));

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const jobs = JSON.parse(fs.readFileSync(`${__dirname}/jobs.json`, 'utf-8'));

const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Job.create(jobs);
    console.log('Data successfully loaded');
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Job.deleteMany();
    console.log('All data has been deleted');
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
