const express = require('express');
var rateLimit = require('express-rate-limit');

const authenticationControllers = require('./authentication-controller');
const authenticationValidators = require('./authentication-validator');
const celebrate = require('../../../core/celebrate-wrappers');

const route = express.Router();

// using rate limit module for 30 minutes since use and 5 attempts limit
const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: 'Error 403 karena login melebihi limit attempt',
});

module.exports = (app) => {
  app.use('/authentication', route);

  route.post(
    '/login',
    celebrate(authenticationValidators.login),
    loginLimiter,
    authenticationControllers.login
  );
};
