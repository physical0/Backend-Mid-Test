const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

// Note: for users components comments i used bahasa indonesia
// while bank-users and authentication components comments are in english

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

let logcount = 0;

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      logcount++;
      // Using date module
      const date = new Date();
      // convert date to full time address
      date.getTime();
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        `[${date}] User ${email} gagal login. Max fail hanya 5 kali. Attempt = ${logcount}`
      );
    }

    /**
     * Doesn't work as intended  
     * 
      if (logcount === 5) {
        const date = new Date();
        date.getTime();
        throw errorResponder(
          errorTypes.INVALID_PASSWORD,
          `[${date}] User ${email} gagal login. Attempt = ${logcount}. Limit Reached`
        );
      }
    */

    logcount = 0;

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
