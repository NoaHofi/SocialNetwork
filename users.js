
const knex = require('./knex'); // Import the knex connection from the knex.js file

(async () => {
  const tableExists = await knex.schema.hasTable('users');

  if (!tableExists) {
    // Create a new 'users' table
    await knex.schema.createTable('users', (table) => {
      table.increments('userID').primary();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.boolean('islogin');
    });
    console.log('User table created.');
  }
})();


async function searchUser(username_prefix) {
  try {
    const users = await knex('users')
      .select('userID', 'username')
      .where('username', 'like', `${username_prefix}%`);

    return users;
  } catch (error) {
    console.error('Error in searchUser:', error);
    throw error;
  }
}

// Helper functions for database operations
async function isUserExist(username) {
  try {
    console.log(`username: ${username}`);
    console.log("getUserByUsername");
    const user = await knex('users')
      .select('*')
      .where('username', username)
      .first();
    
    const isExist = !!user; // Convert user object to boolean (true if user exists, false if not)
    console.log(`isExist: ${isExist}`);
    return isExist;
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    throw error;
  }
}
async function getUserByUsername(username) {
  try {
    console.log(`username: ${username}`);
    console.log("getUserByUsername");
    const user = await knex('users')
      .select('*')
      .where('username', username)
      .first();
    
    return user;
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    throw error;
  }
}

async function insertUser(username, password) {
  try {
    console.log("insertUser");
    const [userId] = await knex('users').insert({
      username: username,
      password: password,
      islogin: false,
    });
    
    console.log(`User inserted with ID: ${userId}`);
    return userId; // Return the inserted user's ID
  } catch (error) {
    console.error('Error in insertUser:', error);
    throw error;
  }
}

async function login(username, password) {
  try {
    const user = await knex
      .select('*')
      .from('users')
      .where('username', username)
      .first();

    if (!user) {
      throw new Error('User not found.');
    }

    // Compare hashed password
    const passwordMatch = password == user.password;
    if (!passwordMatch) {
      throw new Error('Incorrect password.');
    }

    // Password is correct, update isLogin to true in a transaction
    await knex.transaction(async (trx) => {
      await trx('users')
        .where('username', username)
        .update('isLogin', true);
    });

    return true; // Login successful
  } catch (err) {
    console.error('Error during login:', err.message);
    throw new Error('Login failed.');
  }
}

module.exports = {
  getUserByUsername,
  insertUser,
  isUserExist,
  login,
  searchUser
};
  