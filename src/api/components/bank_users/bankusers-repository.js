const { BankUser } = require('../../../models');

/**
 * Get a list of bank accounts
 * @returns {Promise}
 */
async function getBankUsers() {
  return BankUser.find({});
}

/**
 * Get bank account detail by country id
 * @param {string} country_id - Country ID
 * @returns {Promise}
 */
async function getUserByCountryId(country_id) {
  return BankUser.findOne({ country_id });
}

/**
 * Get bank account by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return BankUser.findOne({ email });
}

/**
 * Create new bank account
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} country_id - Country ID
 * @param {string} birth_date - Birth date
 * @param {string} debit_card_type - Card type
 * @param {string} deposit_money - Deposit money
 * @param {string} password - Hashed password
 * @returns {Promise}
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
  return BankUser.create({
    country_id,
    name,
    email,
    birth_date,
    debit_card_type,
    deposit_money,
    password,
  });
}

/**
 * Delete a bank account
 * @param {string} country_id - Country ID
 * @returns {Promise}
 */
async function deleteBankAcc(country_id) {
  return BankUser.deleteOne({ country_id });
}

/**
 * Deposit or obtain money into/from bank account by country id
 * @param {string} country_id - Country ID
 * @param {number} deposit_money - Updated deposit money
 * @returns {Promise}
 */
async function updateBalance(country_id, deposit_money) {
  return BankUser.updateOne(
    {
      country_id,
    },
    {
      $set: {
        deposit_money,
      },
    }
  );
}

module.exports = {
  getBankUsers,
  getUserByCountryId,
  createBankAcc,
  getUserByEmail,
  deleteBankAcc,
  updateBalance,
};
