const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const secret = require('./secret');

// Middleware for parsing cookies and request bodies
app.use(cookieParser());
app.use(express.json());


const cors = require('cors');


const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));


// Basic route
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