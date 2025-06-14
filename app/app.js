// Load environment variables first
dotenv = require('dotenv').config();

// npm packages
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
Promise = require('bluebird'); // eslint-disable-line

// app imports
const { ENV, MONGODB_URI } = require('./config');
const { loginHandler, errorHandler, userHandler } = require('./handlers');
const { storiesRouter, usersRouter } = require('./routers');

// global constants
const app = express();
const {
  bodyParserHandler,
  globalErrorHandler,
  fourOhFourHandler,
  fourOhFiveHandler
} = errorHandler;

// database
mongoose.Promise = Promise;
if (ENV === 'development') {
  mongoose.set('debug', true);
}

mongoose.connect(
  MONGODB_URI,
  { autoIndex: true, useNewUrlParser: true }
);

// body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParserHandler); // error handling specific to body parser only

// response headers setup
app.use(cors());

app.post('/signup', userHandler.createUser);
app.post('/login', loginHandler)
app.use('/stories', storiesRouter);
app.use('/users', usersRouter);
app.get('*', fourOhFourHandler); // catch-all for 404 "Not Found" errors
app.all('*', fourOhFiveHandler); // catch-all for 405 "Method Not Allowed" errors
app.use(globalErrorHandler);

module.exports = app;
