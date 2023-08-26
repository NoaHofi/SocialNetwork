
const knex = require('./knex'); // Import the knex connection from the knex.js file
const admin = require('./admin');

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


async function searchUserByPrefix(username_prefix) {
  try {
    const users = await knex('users')
      .select('userID', 'username')
      .where('username', 'like', `${username_prefix}%`);
      console.log(users);
      
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
    const user = await knex('users')
      .select('*')
      .where('username', username)
      .first();
    
    const isExist = !!user; // Convert user object to boolean (true if user exists, false if not)
    console.log(`isExist: ${isExist}`);
    return isExist;
  } catch (error) {
    console.error('Error in isUserExist:', error);
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
    admin.insertActivity(`User ${username} successfully login`)
    return user; // Login successful
  } catch (err) {
    console.error('Error during login:', err.message);
    throw new Error('Login failed.');
  }
}

async function logout(username) {
  try {
    const user = await knex
      .select('*')
      .from('users')
      .where('username', username)
      .first();

    if (!user) {
      throw new Error('User not found.');
    }

    // Update isLogin to false in a transaction
    await knex.transaction(async (trx) => {
      await trx('users')
        .where('username', username)
        .update('isLogin', false);
    });
    admin.insertActivity(`User ${username} successfully logged out`);
    return true; // Logout successful
  } catch (err) {
    console.error('Error during logout:', err.message);
    throw new Error('Logout failed.');
  }
}

async function removeUserFromDB(username) {
  try {
    // Delete the user
    await knex('users').where('username', username).del();
  } catch (error) {
    console.error('Error removing user from the database:', error);
    throw new Error('Failed to remove user from the database.');
  }
}

async function isUserLoggedIn(username){
  try {
    console.log(`username: ${username}`);
    const user = await knex('users')
      .where('islogin', true)
      .where('username', username)
      .first();
    
    console.log(`isLoggedin: ${!!user}`);
    return !!user;  // This will convert the result to a boolean. If user exists, it will return true. Otherwise, false.
  } catch (error) {
    console.error('Error in isLogin:', error);
    throw error;
  }
}

async function getUsernameByUserID(userID){
  try {
    const user = await knex('users')
        .select('username')
        .where({ userID: userID })
        .first();

    if (!user) {
        throw new Error(`No user found with userID: ${userID}`);
    }

    return user.username;
  } catch (error) {
      console.error('Error fetching username:', error);
      throw error;
  }
}


module.exports = {
  getUserByUsername,
  insertUser,
  isUserExist,
  login,
  searchUserByPrefix,
  removeUserFromDB,
  logout,
  isUserLoggedIn,
  getUsernameByUserID

};
  