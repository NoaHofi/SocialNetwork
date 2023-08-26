const express = require('express');
const app = express();

// Import required modules
const cookieParser = require('cookie-parser');

// Create an instance of Express

// Middleware for parsing cookies and request bodies
app.use(cookieParser());
app.use(express.json());


const cors = require('cors');


const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));


// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Social Network!');
});

app.use("/userLogin", require("./userLoginRoutes"));
app.use("/following", require("./followingRoutes"));
app.use("/post", require("./feedPostsRoutes"));
app.use("/admin", require("./adminRoutes"));

// Set the server to listen on a specific port
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Search Users by prefix
app.get('/users/search/:prefix', async(req, res) => {
  const { prefix } = req.params;

  try {
    const usersAfterSearch = await users.searchUserByPrefix(prefix);

    res.status(200).json({ users: usersAfterSearch });
  } catch (error) {
    console.error('Error searching users by prefix:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
