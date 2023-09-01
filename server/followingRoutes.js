const Router = require("express").Router();


const persist = require('./persist');

// Get followers
Router.get('/followers', async (req, res) => {
  const { userID } = req.query;
  try {
    if (!userID) {
      return res.status(400).json({ message: 'UserID is required.' });
    }

    const userFollowers = await persist.getFollowers(userID);

    res.status(200).json({ followers: userFollowers });
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Following User
Router.post('/follow', async (req, res) => {
  const { userID, targetUser } = req.body;
  try {
    if (!userID || !targetUser) {
      return res.status(400).json({ message: 'Both userID and targetUser are required.' });
    }

    const followerId = await persist.follow(userID, targetUser);

    res.status(201).json({ message: `User ${userID} is now following ${targetUser}. Follower ID: ${followerId}` });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Unfollowing User
Router.post('/unfollow', async (req, res) => {
  const { userID, targetUser } = req.body;
  try {
    if (!userID || !targetUser) {
      return res.status(400).json({ message: 'Both userID and targetUser are required.' });
    }

    const numDeleted = await persist.unFollow(userID, targetUser);

    if (numDeleted === null) {
      return res.status(404).json({ message: 'No follower data found to unfollow.' });
    }

    res.status(200).json({ message: `User ${userID} unfollowed ${targetUser}. ${numDeleted} follower data deleted.` });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
  
});


Router.get('/allUsers', async (req, res) => {
  try {
    const users = await persist.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// The checkFollowing endpoint is optional and depends on your use case
Router.get('/checkFollowing/:loggedInUserID/:targetUserID', async (req, res) => {
  try {
    const { loggedInUserID, targetUserID } = req.params;
    const isFollowing = await persist.checkFollowing(loggedInUserID, targetUserID);
    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = Router;