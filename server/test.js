const fetch = require('node-fetch');

async function testGetRoute() {
  const response = await fetch('http://localhost:3000/some-get-route'); // Replace with your route URL
  const data = await response.json();

  // Add your assertions here to check if the response matches the expected result
  if (response.status === 200 && data.message === 'Expected message') {
    console.log('Test for GET route passed.');
  } else {
    console.error('Test for GET route failed.');
  }
}

// Call your test functions
testGetRoute();
