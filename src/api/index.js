const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const bankusers = require('./components/bank_users/bankusers-route');

module.exports = () => {
  const app = express.Router();

  bankusers(app);
  authentication(app);
  users(app);

  return app;
};
