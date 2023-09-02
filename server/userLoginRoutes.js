const Router = require("express").Router();
const persist = require('./persist');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const secret = require('./secret');
const middleware = require('./Middleware');

// validate the token for the remember me
Router.post('/validateToken', (req, res, next) => {
  next();
}, middleware.jwtMiddleware, (req, res) => {
  res.status(200).json({ valid: true });
});


// registration
Router.post('/register', async (req, res) => {
    const { username, password } = req.body;

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
      const existingUser = await persist.isUserExist(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken.' });
      }
  
      const userId = await persist.insertUser(username, password);
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
// User Login
Router.post('/login', async (req, res) => {
  const { username, password, rememberMe } = req.body;
  try {
  console.log(`---------login ${username} rememberMe: ${rememberMe}------`)
  const isExsit = await persist.isUserExist(username);
  if (!isExsit) {
    return res.status(400).json({ message: 'Username not exist.' });
  }
  const user = await persist.login(username,password);
  if (user) {
    const expirationDuration = rememberMe ? "10d" : "1h";
    const cookieMaxAge = rememberMe ? 10 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    const token = jwt.sign({ id: user.userID }, secret, {
      algorithm: 'HS256',
      expiresIn: expirationDuration
  });
    
    console.log('User login successfully.')
    res.cookie("accessToken",token,{ 
      httpOnly: true,
      maxAge: cookieMaxAge
    }).status(200).json({ user });
  }
  else{
    console.log('The password is incorrect.')
    return res.status(400).json({ message: 'The password is incorrect.' });
  }
  } catch (error) {
    console.error('Error during Login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }

});

// User Logout
Router.post('/logout', async (req, res) => {
  const { username } = req.body;
  try {
  const isExsit = await persist.isUserExist(username);
  if (!isExsit) {
    return res.status(400).json({ message: 'username not exist.' });
  }
  persist.logout(username);
  res.clearCookie("accessToken");
  res.status(200).json({ message: 'User logout successfully.' });
  } catch (error) {
    console.error('Error during Logout:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }

});


// Get loggedinUser
Router.get('/getLoggedInUser', middleware.verifyTokenAndAddUserInfo, async (req, res) => {
  console.log("in logged in user")
  try {
    console.log(req.userInfo.id);
    const username = await persist.getUsernameByUserID(req.userInfo.id);
    console.log(username)
    return res.status(200).json({ username: `${username}`, userID: req.userInfo.id });
} catch (error) {
    if (error.name === 'JsonWebTokenError') {
        console.error('Token verification failed:', error);
        return res.status(403).json({ message: "Token is not valid!", error: error.message });
    }
    console.error('Error during Get username:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
}
});

// search users by prefix
Router.get('/searchUser', async (req, res) => {
  const username_prefix = req.query.username;

  if (!username_prefix) {
      return res.status(400).send('Please provide a username prefix.');
  }

  try {
      const usersResult = await persist.searchUserByPrefix(username_prefix);
      res.json(usersResult);
  } catch (error) {
      console.error('Error during search:', error);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = Router;