const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get sorting detail
 * @param {string} sort - Sort Setting
 * @param {Array} users - Users
 * @returns {Array}
 */
async function Sorting(sort, users) {
  const [sortby, order] = sort.split(':');

  try {
    // tanpa order, ascending sort
    let ord = 1;

    // order ascending
    if (order === 'asc') {
      ord = 1;
    }

    // order descending
    if (order === 'desc') {
      ord = -1;
    }

    const finishedsorter = users.slice().sort((random, random2) => {
      if (random[sortby] > random2[sortby]) {
        // dari user diambil random & random2, jika random memiliki sortby lebih besar/awal
        // secara default, maka akan dikeluarkan urutan dari depan
        // Sort menjadi descend jika ord = -1; -1*1 = -1 dan email yg lebih kecil/akhir muncul di awal
        return ord * 1;
      }

      if (random[sortby] < random2[sortby]) {
        // fungsi serupa, jika random2 memiliki sortby lebih besar/awal
        // secara default, maka akan dikeluarkan urutan dari belakang
        // Sort menjadi descend jika ord = -1; -1*-1 = 1 dan email yg lebih kecil/akhir muncul di awal
        return ord * -1;
      }
      return 1;
    });

    return finishedsorter;
  } catch (err) {
    return null;
  }
}

/**
 *
 * @param {Array} countusers - Users
 * @param {integer} page_number - Page Number
 *  @param {integer} page_size - Page Size
 * @param {Array} sorted_users - Sorted Users
 * @returns {Array}
 */

async function Pagination(countusers, page_number, page_size, sorted_users) {
  const total_pages = Math.ceil(countusers / page_size);

  // collect user dari halaman yang dibuka dengan indexing dari 0
  const start_user = (page_number - 1) * page_size;
  const end_user = start_user + page_size;

  // mengecek halaman sebelumnya jika berada pada halaman 2, 3, dst.
  // dan halaman setelahnya jika ada halaman setelah page number
  const previous_page = page_number > 1;
  const next_page = page_number < total_pages;

  // mengambil users dari potongan
  const sliced_data_from_page = sorted_users.slice(start_user, end_user);

  results = [];

  results.push({
    page_number,
    page_size,
    count: countusers,
    total_pages,
    previous_page,
    next_page,
    sliced_data_from_page,
  });

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
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
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  Sorting,
  Pagination,
};
