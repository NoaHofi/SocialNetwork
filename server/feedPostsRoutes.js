const Router = require("express").Router();
const posts = require('./feedPosts');
const jws = require('jws');

// Create Post
Router.post('/createPost',async (req, res) => {
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
Router.get('/getAllPosts', async (req, res) => {
  console.log(0)
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!")
  console.log(token)

   jws.verify(token, "HS256", "secretkey", (err,userInfo) => {
    if (err) return res.status(403).json("Token is not valid!")
    console.log(userInfo.id)
    try {
      //const postData = await posts.getPostData(userInfo.id); // Use await since savePostData is an async function
      //console.log(postData)
      //res.status(201).json({postData });
      es.status(201).json({"jfjffjffk":"ffff" });
    } catch (error) {
      console.error('Error during Get Post:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  })
 
});

// Edit Post
Router.put('/editPost/:postId', async (req, res) => {
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

Router.put('/likePost', async (req, res) => {
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

module.exports = Router;