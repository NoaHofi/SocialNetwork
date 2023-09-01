const knex = require('./knex'); // Import the knex connection from the knex.js file
const admin = require('./admin');

(async () => {
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

})();

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
    admin.insertActivity(`User ${userID} added a post: ${postData}`)
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


module.exports = {
  getPostData,
  savePostData,
  editPostData,
  likePost,
  unLikePost,
  isUserLikedPost,
  getPostLikeCount
};