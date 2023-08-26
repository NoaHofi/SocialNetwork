const Router = require("express").Router();
const users = require('./users');
const jws = require('jws');


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
  console.log(`login ${username}`)
  const isExsit = await users.isUserExist(username);
  if (!isExsit) {
    return res.status(400).json({ message: 'Username not exist.' });
  }
  isLoggedIn = await users.isUserLoggedIn(username);
  if (isLoggedIn){
    console.log('Username already logged in.')
    return res.status(400).json({ message: 'Username already logged in.' });
  }
  const user = await users.login(username,password);
  if (user) {
    const token = jws.sign({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: { id: user.userID },
      secret: "secretkey"
    });
    
    console.log('User login successfully.')
    res.cookie("accessToken",token,{ 
      httpOnly: true,
    }).status(201).json({ user });
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
  const { username } = req.query;
  try {
  const isExsit = await users.isUserExist(username);
  if (!isExsit) {
    return res.status(400).json({ message: 'username not exist.' });
  }
  users.logout(username);
  res.status(201).json({ message: 'User logout successfully.' });
  } catch (error) {
    console.error('Error during Logout:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }

});

module.exports = Router;