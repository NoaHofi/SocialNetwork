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
    const posts = await knex('posts')
      .join('follower', 'posts.userID', '=', 'follower.followBy')
      .select('posts.postID', 'posts.postData', 'posts.createdAt')
      .where('follower.userID', userID)
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
    admin.insertActivity(`User ${username} added a post: ${postData}`)
    return postId;
  } catch (error) {
    console.error('Error saving post data:', error);
    throw error;
  }
}

async function editPostData(postID) {
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


module.exports = {
  getPostData,
  savePostData,
  editPostData,
  likePost,
  unLikePost
};