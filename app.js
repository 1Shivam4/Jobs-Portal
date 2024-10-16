const express = require('express');
const morgan = require('morgan');
const ejs = require('ejs');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const globalErrorHandler = require('./controllers/errorController');
const corsOptions = require('./controllers/corsOptions');
const AppError = require('./utils/appError');
const userRoutes = require('./routes/userRoutes');
const jobsRoutes = require('./routes/jobsRoute');
const viewRouter = require('./routes/viewRoute');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

// limit the request from the same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request form this IP, please  try again in an hour',
});

app.use('/api', limiter);

// body-parser, reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);
// Well this urlencoded middleware is required to get the form input data from the client
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// DATA SANITIZATION against NoSQL query injections
// this does to look for the req.body and req.query and req.params and then filter out all of the $signs and dots from the code
app.use(mongoSanitize());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.protocol);
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/jobs', jobsRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 400));
});

app.use(globalErrorHandler);
module.exports = app;
