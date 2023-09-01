const knex = require('./knex'); // Import the knex connection from the knex.js file

(async () => {
    const tableFollowerExists = await knex.schema.hasTable('follower');

    if (!tableFollowerExists) {
        // Create a new 'post's' table
        await knex.schema.createTable('follower', (table) => {
        table.increments('id').primary(); // Use 'id' as primary key
        table.integer('userID').notNullable();
        table.integer('followBy').notNullable();
        });
        console.log('Follower table created.');
    }
    const tableExists = await knex.schema.hasTable('pages');

    if (!tableExists) {
        // Create a new 'pages' table
        await knex.schema.createTable('pages', (table) => {
        table.increments('pageID').primary();
        table.string('pageName').notNullable().unique();
        table.boolean('enabled').notNullable();
        });
        console.log('Pages table created.');

        await knex('pages').insert([
        { pageName: 'HealthTips', enabled: true },
        { pageName: 'Scheduler', enabled: true }
        ]);
        console.log('HealthTips and Scheduler pages added.');
    }

    const fetatureTableExists = await knex.schema.hasTable('features');

    if (!fetatureTableExists) {
        // Create a new 'features' table
        await knex.schema.createTable('features', (table) => {
        table.increments('featureID').primary();
        table.string('featureName').notNullable().unique();
        table.boolean('enabled').notNullable();
        });
        console.log('features table created.');

        await knex('features').insert([
        { featureName: 'unlike post', enabled: true },
        { featureName: 'edit post', enabled: true }
        ]);
        console.log('unlike post and edit post features added.');
    }

    const activityTableExists = await knex.schema.hasTable('activityLog');

    if (!activityTableExists) {
        // Create a new 'activityLog' table
        await knex.schema.createTable('activityLog', (table) => {
        table.increments('activityID').primary();
        table.string('activityAction').notNullable();
        table.timestamp('timeStamp').defaultTo(knex.fn.now()); // Use timestamp type and default value
        });
        console.log('activityLog table created.');
    }


    const postsTableExists = await knex.schema.hasTable('posts');

    if (!postsTableExists) {
        // Create a new 'post's' table
        await knex.schema.createTable('posts', (table) => {
        table.increments('postID').primary(); // Use only postID as primary key
        table.integer('userID').notNullable(); // Add userID column
        table.string('postData').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        });
        console.log('Post table created.');
    }
    const likesTableExists = await knex.schema.hasTable('likes');

    if (!likesTableExists)
    {
        // Create a new 'like's' table
        await knex.schema.createTable('likes', (table) => {
        table.increments('id').primary(); // Use only postID as primary key
        table.integer('userID').notNullable(); // Add userID column
        table.integer('postID').notNullable();
        });
        console.log('Like table created.');
    }

    const tableUserExists = await knex.schema.hasTable('users');

    if (!tableUserExists) {
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
  
      const passwordMatch = password === user.password;
      if (!passwordMatch) {
        throw new Error('Incorrect password.');
      }
  
      // Password is correct, update isLogin to true in a transaction
      await knex.transaction(async (trx) => {
        await trx('users')
          .where('username', username)
          .update('isLogin', true);
      });
        insertActivity(`User ${username} successfully login`)
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
        insertActivity(`User ${username} successfully logged out`);
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
      console.log("user"+ username + "has been remvoed")
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

// Get all the post that made by the people the userID follow sorted by insertion time
async function getPostData(userID) {
    try {
        // Fetch the IDs of users this user is following
        const followedIDs = await knex('follower')
            .where('follower.userID', userID)
            .select('followBy');
  
        // Extract IDs and add the user's own ID
        const userIDs = followedIDs.map(follow => follow.followBy);
        userIDs.push(userID);
  
        // Now fetch the posts using the IDs list
        const posts = await knex('posts')
            .join('users', 'users.userID', '=', 'posts.userID')
            .select('posts.postID', 'posts.postData', 'posts.createdAt', 'posts.userID', 'users.username')
            .whereIn('posts.userID', userIDs)
            .orderBy('posts.createdAt', 'desc'); // Order by insertion time in descending order
  
        return posts;
    } catch (error) {
        console.error('Error getting posts:', error);
        throw error;
    }
  }
  
  
  // Function to Save Post Data
  async function savePostData(userID,postData) {
    try {
      const [postId] = await knex('posts').insert({
        userID: userID,
        postData: postData,
        createdAt: knex.fn.now(),
      });
  
      console.log('Post data saved with ID:', postId);
      insertActivity(`User ${userID} added a post: ${postData}`)
      return postId;
    } catch (error) {
      console.error('Error saving post data:', error);
      throw error;
    }
  }
  
  async function editPostData(postID,newPostData) {
    try {
      await knex('posts')
        .where('postID', postID)
        .update({
          postData: newPostData
        });
  
      console.log('Post data edited for post ID:', postID);
      return postID;
    } catch (error) {
      console.error('Error editing post data:', error);
      throw error;
    }
  }
  
  async function likePost(userID,postID) {
    try {
      await knex('likes').insert({
        userID: userID,
        postID: postID,
      });
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }
  async function unLikePost(userID,postID) {
    try {
      await knex('likes')
        .where({
          userID: userID,
          postID: postID,
        })
        .del();
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }
  
  async function isUserLikedPost(userID, postID) {
    try {
      const result = await knex('likes')
        .where({
          userID: userID,
          postID: postID,
        })
        .first();
  
      return !!result;  // Returns true if there's a result, otherwise false
    } catch (error) {
      console.error('Error checking if user liked post:', error);
      throw error;
    }
  }
  
  async function getPostLikeCount(postID) {
    try {
      const count = await knex('likes')
        .where({
          postID: postID,
        })
        .count('postID as likeCount');  // Count rows matching the postID
  
      return count[0].likeCount;  // Return the count
    } catch (error) {
      console.error('Error fetching like count:', error);
      throw error;
    }
  }


async function updatePageStatus(pageID, isEnabled) {
  try {
    await knex('pages')
      .where('pageID', pageID)
      .update({ enabled: isEnabled });
      console.log(`page updated with ID: ${pageID} to status ${isEnabled}`);
  } catch (error) {
    throw new Error('Failed to update page status in the database.');
  }
}

async function getAdditionalPages() {
  try {
    const pages = await knex('pages').select('pageID','pageName','enabled');
    console.log("pages:"+pages)
    return pages;
  } catch (error) {
    throw new Error('Failed to get additional pages status from the database.');
  }
}


async function updateFeatureStatus(featureID, isEnabled) {
  try {
    await knex('features')
      .where('featureID', featureID)
      .update({ enabled: isEnabled });
  } catch (error) {
    throw new Error('Failed to update feature status in the database.');
  }
}

async function getAdditionalFeatures() {
  try {
    const features = await knex('features').select('featureID','featureName','enabled');
    return features;
  } catch (error) {
    throw new Error('Failed to get additional features status from the database.');
  }
}

async function getAllActivityLog() {
  try {
    activities = await knex('activityLog').select('activityID','activityAction','timeStamp');
    return activities;
  } catch (error) {
    throw new Error('Failed to get all activities from the database.');
  }
}

async function insertActivity(activityAction) {
  try {
    await knex('activityLog').insert({
      activityAction: activityAction,
    });
    console.log(`activity added to DB: ${activityAction} `)
  } catch (error) {
    console.error('Error inserting activity:', error);
    throw new Error('Failed to insert activity into the database.');
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
    getUsernameByUserID,
    follow,
    unFollow,
    getFollowers,
    checkFollowing,
    getAllUsers,
    getPostData,
    savePostData,
    editPostData,
    likePost,
    unLikePost,
    isUserLikedPost,
    getPostLikeCount,
    updatePageStatus,
    updateFeatureStatus,
    getAdditionalPages,
    getAdditionalFeatures,
    getAllActivityLog,
    insertActivity
};