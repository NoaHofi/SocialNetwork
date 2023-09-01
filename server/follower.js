const knex = require('./knex'); // Import the knex connection from the knex.js file

(async () => {
  const tableExists = await knex.schema.hasTable('follower');

  if (!tableExists) {
    // Create a new 'post's' table
    await knex.schema.createTable('follower', (table) => {
      table.increments('id').primary(); // Use 'id' as primary key
      table.integer('userID').notNullable();
      table.integer('followBy').notNullable();
    });
    console.log('Follower table created.');
  }
})();

// Follow user 
async function follow(userID, followBy) {
  try {
    // Check if userID exists in the users table
    const userToBeFollowedExists = await knex('users').where({ userID }).first();
    if (!userToBeFollowedExists) {
      throw new Error(`User with ID: ${userID} does not exist.`);
    }

    // Check if followBy user exists in the users table
    const followingUserExists = await knex('users').where({ userID: followBy }).first();
    if (!followingUserExists) {
      throw new Error(`User with ID: ${followBy} does not exist.`);
    }

    const [followerId] = await knex('follower').insert({
      userID: userID,
      followBy: followBy,
    });

    console.log('Follower data saved with ID:', followerId);
    console.log(`user id:${userID} is followed by ${followBy}`)
    return followerId;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
}


// Unfollow user 
async function unFollow(userID, followBy) {
  try {
    const numDeleted = await knex('follower')
      .where({
        userID: userID,
        followBy: followBy,
      })
      .del();

    if (numDeleted === 0) {
      console.log('No follower data deleted.');
      return null; // Return null or throw an error based on your preference
    }

    console.log('Follower data deleted for user:', userID);
    return numDeleted; // Return the number of deleted rows
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
}

// Get followers 
async function getFollowers(userID) {
  try {
    // Check if userID exists in the users table
    const userExists = await knex('users').where({ userID }).first();

    if (!userExists) {
      throw new Error(`User with ID: ${userID} does not exist.`);
    }

    const followers = await knex('follower')
      .select('userID')
      .where({
        followBy: userID,
      });

    console.log('get followers for user', userID);
    return followers;
  } catch (error) {
    console.error('Error getting followers:', error);
    throw error;
  }
}


const getAllUsers = async () => {
  return knex('users').select('userID', 'username');
};

async function checkFollowing(loggedInUserID, targetUserID) {
  const result = await knex('follower').where({
    userID: targetUserID,
    followBy: loggedInUserID
  }).first();

  return !!result; // returns true if following, otherwise false
};

module.exports = {
  follow,
  unFollow,
  getFollowers,
  checkFollowing,
  getAllUsers,
};