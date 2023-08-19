const fs = require('fs');
const path = require('path');

// Import required modules
const express = require('express');
const cookieParser = require('cookie-parser');

// Create an instance of Express
const app = express();

// Middleware for parsing cookies and request bodies
app.use(cookieParser());
app.use(express.json());


// Import the cors package
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

const users = require('./users');

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Social Network!');
});

app.use("/users", require("./userRoutes"));

// Set the server to listen on a specific port
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// User Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.query;
  try {
    // Check if the username is already taken
    if (username == null)
    {
      return res.status(400).json({ message: 'Username is null.' });
    }
    if (password == null)
    {
      return res.status(400).json({ message: 'Password is null.' });
    }
    const existingUser = await users.isUserExist(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const userId = await users.insertUser(username, password);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password, rememberMe } = req.query;
  try {
  const isExsit = await users.isUserExist(username);
  if (!isExsit) {
    return res.status(400).json({ message: 'Username not exist.' });
  }
  const isLogin = await users.login(username,password);
  if (isLogin) {
    res.status(201).json({ message: 'User login successfully.' });
  }
  else{
    return res.status(400).json({ message: 'The password is incorrect.' });
  }
  } catch (error) {
    console.error('Error during Login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }

});
const followers = require('./follower');
// Get followers
app.get('/followers', async (req, res) => {
  const { userID } = req.query;
  try {
    if (!userID) {
      return res.status(400).json({ message: 'UserID is required.' });
    }

    const followers = await followers.getFollowers(userID);

    res.status(200).json({ followers: followers });
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Following User
app.post('/follow', async (req, res) => {
  const { userID, targetUser } = req.body;
  try {
    if (!userID || !targetUser) {
      return res.status(400).json({ message: 'Both userID and targetUser are required.' });
    }

    const followerId = await followers.follow(userID, targetUser);

    res.status(201).json({ message: `User ${userID} is now following ${targetUser}. Follower ID: ${followerId}` });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Unfollowing User
app.post('/unfollow', async (req, res) => {
  const { userID, targetUser } = req.body;
  try {
    if (!userID || !targetUser) {
      return res.status(400).json({ message: 'Both userID and targetUser are required.' });
    }

    const numDeleted = await followers.unFollow(userID, targetUser);

    if (numDeleted === null) {
      return res.status(404).json({ message: 'No follower data found to unfollow.' });
    }

    res.status(200).json({ message: `User ${userID} unfollowed ${targetUser}. ${numDeleted} follower data deleted.` });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
  
});


const posts = require('./posts');
// Create Post
app.post('/post',async (req, res) => {
  const { userID , postData } = req.body;
  try {
    if (!userID) {
      return res.status(400).json({ message: 'UserID is required.' });
    }
    if (!postData) {
      return res.status(400).json({ message: 'PostData is required.' });
    }

    if (postData.length > 300) {
      return res.status(400).json({ message: 'Textual post is limited to 300 characters.' });
    }

    const postID = await posts.savePostData(userID, postData);
    console.log(`Post created with ID: ${postID}`);

    res.status(201).json({ message: `Post created successfully. postID: ${postID}` });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post.' });
  }
});

// Get Post
app.get('/post', async (req, res) => {
  const { userID} = req.query;
  try {
    if (postID == null) {
      return res.status(400).json({ message: 'userID is required.' });
    }
   
    const postData = await posts.getPostData(userID); // Use await since savePostData is an async function
    res.status(201).json({ message: `${postData}` });
  } catch (error) {
    console.error('Error during Get Post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
 
});

// Edit Post
app.put('/post/:postId', async (req, res) => {
  const { postId } = req.params; // Extract postId from URL parameter
  const { newPostData } = req.body; // Extract newPostData from request body

  try {
    if (!newPostData) {
      return res.status(400).json({ message: 'New post data is required.' });
    }

    const editedPostId = await posts.editPostData(postId, newPostData); // Call the editPostData function

    res.status(200).json({ message: `Post edited successfully. postID: ${editedPostId}` });
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.put('/post/likePost', async (req, res) => {
  const { userID,postID } = req.params; // Extract postId from URL parameter

  try {
    if (!userID || !postID) {
      return res.status(400).json({ message: 'userID and postID are required.' });
    }

    await posts.likePost(userID,postID); // Call the editPostData function

    res.status(200).json({ message: `${userID} like post postID: ${postID}` });
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Search Users by Suffix
app.get('/users/search/:suffix', async(req, res) => {
  const { suffix } = req.params;

  try {
    const usersAfterSearch = await users.searchUserBySuffix(suffix);

    res.status(200).json({ users: usersAfterSearch });
  } catch (error) {
    console.error('Error searching users by suffix:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Admin Screen: Get Activity Log
app.get('/admin/activity-log', (req, res) => {
  
});

// Admin Screen: Enable/Disable Additional Pages
app.put('/admin/enable-disable/pages', (req, res) => {
  
});

// Admin Screen: Enable/Disable Additional Features
app.put('/admin/enable-disable/features', (req, res) => {
  
});

// Admin Screen: Remove User from the Social Network
app.delete('/admin/remove-user/:username', (req, res) => {
  
});
