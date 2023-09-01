const Router = require("express").Router();
const persist = require('./persist');
const middleware = require('./Middleware');

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

    const postID = await persist.savePostData(userID, postData);
    console.log(`Post created with ID: ${postID}`);

    res.status(201).json({ message: `Post created successfully. postID: ${postID}` });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post.' });
  }
});

// Get Post
Router.get('/Posts',middleware.verifyTokenAndAddUserInfo, async (req, res) => {
  console.log(0)
  
  try {

    console.log(req.userInfo.id);
    const postData = await persist.getPostData(req.userInfo.id);
    res.status(201).json({ postData });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
        console.error('Token verification failed:', error);
        return res.status(403).json({ message: "Token is not valid!", error: error.message });
    }
    console.error('Error during Get Post:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
}
});

// Edit Post
Router.put('/editPost/:postId', async (req, res) => {
  const { postId } = req.params; // Extract postId from URL parameter
  const { newPostData } = req.body; // Extract newPostData from request body
  console.log(postId)
  console.log(newPostData)
  try {
    if (!newPostData) {
      return res.status(400).json({ message: 'New post data is required.' });
    }

    const editedPostId = await persist.editPostData(postId, newPostData); // Call the editPostData function

    res.status(200).json({ message: `Post edited successfully. postID: ${editedPostId}` });
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

Router.put('/likePost', async (req, res) => {
  const { userID,postID } =  req.body; // Extract postId from URL parameter

  try {
    if (!userID || !postID) {
      return res.status(400).json({ message: 'userID and postID are required.' });
    }

    await persist.likePost(userID,postID); // Call the editPostData function

    res.status(200).json({ message: `${userID} like post postID: ${postID}` });
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

Router.put('/unlikePost', async (req, res) => {
  const { userID, postID } = req.body;

  try {
    if (!userID || !postID) {
      return res.status(400).json({ message: 'userID and postID are required.' });
    }

    await persist.unLikePost(userID, postID); 

    res.status(200).json({ message: `${userID} unliked post with postID: ${postID}` });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

Router.get('/isLiked/:postID', middleware.verifyTokenAndAddUserInfo, async (req, res) => {
  const userID = req.userInfo.id;  // Assuming you have some authentication middleware setting the user in req.
  const { postID } = req.params;

  try {
    const isLiked = await persist.isUserLikedPost(userID, postID);
    res.status(200).json({ isLiked: isLiked });
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

Router.get('/likeCount/:postID', async (req, res) => {
  const { postID } = req.params;

  try {
    const likeCount = await persist.getPostLikeCount(postID);
    res.status(200).json({ likeCount: likeCount });
  } catch (error) {
    console.error('Error fetching like count:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



module.exports = Router;