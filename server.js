const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION. 💣💣 shutting down.');
  console.log('error name: ', err.name, 'error message: ', err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');
const db = process.env.DATABASE;
const port = process.env.PORT || 3000;

mongoose.connect(db).then(() => {
  console.log('connected to MongoDB');
});

const server = app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down... 💣💣');
  console.error('err name:', err.name, 'err message:', err.message);
  server.close(() => process.exit(1));
});
