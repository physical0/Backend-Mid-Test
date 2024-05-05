const bankUsersRepository = require('./bankusers-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of bank acccounts
 * @returns {Array}
 */
async function getAllBankAcc() {
  const users = await bankUsersRepository.getBankUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      country_id: user.country_id,
      name: user.name,
      email: user.email,
      birth_date: user.birth_date,
      debit_card_type: user.debit_card_type,
      deposit_money: user.deposit_money,
    });
  }

  return results;
}

/**
 * Search for users in balance range
 * @param {Array} users - Bank Users
 * @param {integer} balance_max - balance max
 *  @param {integer} balance_min - balance min
 * @returns {Array}
 */

async function searchRange(users, balance_min, balance_max) {
  // Extra feature for searching bank account users based on balance range
  // Easen the teller in searching for an account based on range
  const searched_users = users.filter((user) => {
    const bank_balance = user.deposit_money;
    if (bank_balance <= balance_max && bank_balance >= balance_min) {
      return bank_balance;
    }
  });

  return searched_users;
}

/**
 * Get bank account details
 * @param {string} country_id - Country ID
 * @returns {Object}
 */
async function getBankAcc(country_id) {
  const user = await bankUsersRepository.getUserByCountryId(country_id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    country_id: user.country_id,
    name: user.name,
    email: user.email,
    birth_date: user.birth_date,
    debit_card_type: user.debit_card_type,
    deposit_money: user.deposit_money,
  };
}

/**
 * Create new bank account
 * @param {string} country_id - Country ID card number
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} birth_date - Birth date
 * @param {string} debit_card_type - Card type
 * @param {integer} deposit_money - Deposit money
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createBankAcc(
  country_id,
  name,
  email,
  birth_date,
  debit_card_type,
  deposit_money,
  password
) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await bankUsersRepository.createBankAcc(
      country_id,
      name,
      email,
      birth_date,
      debit_card_type,
      deposit_money,
      hashedPassword
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Insert money to bank acc deposit
 * @param {string} country_id - Country ID
 * @param {integer} deposited_money - Deposited money
 * @returns {boolean}
 */
async function insertMoney(country_id, deposited_money) {
  try {
    const user = await bankUsersRepository.getUserByCountryId(country_id);
    let currbalance = user.deposit_money;
    // Add to current balance
    currbalance += deposited_money;

    if (user) {
      await bankUsersRepository.updateBalance(country_id, currbalance);
    }
  } catch (error) {
    return null;
  }
  return true;
}

/**
 * Retrieve money from bank acc deposit
 * @param {string} country_id - Country ID
 * @param {integer} retrieved_money - Deposited money
 * @returns {boolean}
 */
async function obtainMoney(country_id, retrieved_money) {
  try {
    const user = await bankUsersRepository.getUserByCountryId(country_id);
    let currbalance = user.deposit_money;
    // Reduce current balance
    currbalance -= retrieved_money;

    if (user) {
      await bankUsersRepository.updateBalance(country_id, currbalance);
    }
  } catch (error) {
    return null;
  }
  return true;
}

/**
 * Delete bank user
 * @param {string} country_id - User ID
 * @returns {boolean}
 */
async function deleteBankAcc(country_id) {
  const user = await bankUsersRepository.getUserByCountryId(country_id);

  // if bank user not found
  if (!user) {
    return null;
  }

  try {
    await bankUsersRepository.deleteBankAcc(country_id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await bankUsersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the country id is registered
 * @param {string} country_id - country_id
 * @returns {boolean}
 */
async function countryIdIsRegistered(country_id) {
  const user = await bankUsersRepository.getUserByCountryId(country_id);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} country_id - Country Id
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(country_id, password) {
  const user = await bankUsersRepository.getUserByCountryId(country_id);

  if (user) {
    return passwordMatched(password, user.password);
  }

  return false;
}

module.exports = {
  getAllBankAcc,
  getBankAcc,
  countryIdIsRegistered,
  createBankAcc,
  emailIsRegistered,
  deleteBankAcc,
  insertMoney,
  obtainMoney,
  checkPassword,
  searchRange,
};
