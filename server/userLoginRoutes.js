const Router = require("express").Router();
const users = require('./users');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const secret = require('./secret');

const jwtMiddleware = expressJwt.expressjwt({
  secret: secret,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrCookie(req) {
    if (req.cookies && req.cookies.accessToken) {
      return req.cookies.accessToken;
    }
    return null; // return null if no token found
  }
});


Router.post('/validateToken', (req, res, next) => {
  console.log(req.headers);
  console.log(req.cookies); // If you're using cookie-parser middleware
  next();
}, jwtMiddleware, (req, res) => {
  res.status(200).json({ valid: true });
});

const verifyTokenAndAddUserInfo = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
      const userInfo = jwt.verify(token, secret);
      req.userInfo = userInfo; // Add userInfo to the request object
      next(); // Continue to the next middleware or route handler
  } catch (error) {
      if (error.name === 'JsonWebTokenError') {
          console.error('Token verification failed:', error);
          return res.status(403).json({ message: "Token is not valid!", error: error.message });
      }
      console.error('Error during token verification:', error);
      res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};




// User Registration
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
Router.post('/login', async (req, res) => {
  const { username, password, rememberMe } = req.body;
  try {
  console.log(`---------login ${username} rememberMe: ${rememberMe}------`)
  const isExsit = await users.isUserExist(username);
  if (!isExsit) {
    return res.status(400).json({ message: 'Username not exist.' });
  }
  const user = await users.login(username,password);
  if (user) {
    const expirationDuration = rememberMe ? "10d" : "1h";
    const cookieMaxAge = rememberMe ? 10 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000; // in milliseconds
    const token = jwt.sign({ id: user.userID }, secret, {
      algorithm: 'HS256',
      expiresIn: expirationDuration // Optional: specify a duration for token expiration
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
  const isExsit = await users.isUserExist(username);
  if (!isExsit) {
    return res.status(400).json({ message: 'username not exist.' });
  }
  users.logout(username);
  res.clearCookie("accessToken");
  res.status(201).json({ message: 'User logout successfully.' });
  } catch (error) {
    console.error('Error during Logout:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }

});


// Get loggedinUser
Router.get('/getLoggedInUser', verifyTokenAndAddUserInfo, async (req, res) => {
  console.log("in logged in user")
 
  try {

    console.log(req.userInfo.id);
    const username = await users.getUsernameByUserID(req.userInfo.id);
    console.log(username)
    res.status(201).json({ username: `${username}`, userID: req.userInfo.id });
} catch (error) {
    if (error.name === 'JsonWebTokenError') {
        console.error('Token verification failed:', error);
        return res.status(403).json({ message: "Token is not valid!", error: error.message });
    }
    console.error('Error during Get username:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
}
});

Router.get('/searchUser', async (req, res) => {
  const username_prefix = req.query.username;  // get prefix from query params

  if (!username_prefix) {
      return res.status(400).send('Please provide a username prefix.');
  }

  try {
      const usersResult = await users.searchUserByPrefix(username_prefix);
      res.json(usersResult);
  } catch (error) {
      console.error('Error during search:', error);
      res.status(500).send('Internal Server Error');
  }
});



module.exports = Router;