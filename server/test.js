

const BASE_URL = 'http://localhost:8000'; // Adjust this to your server's actual address and port

const testEndpoint = async (method, endpoint, body = null, headers = {}) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
    credentials: 'include', // Include this line
  };

  try {
    const response = await fetch(BASE_URL + endpoint, options);
    let data;
      try {
        data = await response.json();
      } catch(e) {
        console.error(`Failed to parse response as JSON. Raw response: ${await response.text()}`);
        throw e;
      }

    if (response.ok) {
      console.log(`✅ ${method} ${endpoint} - PASSED`);
    } else {
      console.error(`❌ ${method} ${endpoint} - FAILED. Received: ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    console.error(`❌ ${method} ${endpoint} - EXCEPTION. ${error.message}`);
  }
};

const runTests = async () => {
  let jwtToken;
  // Register a user
  await testEndpoint('POST', '/userLogin/register', { username: 'testUser', password: 'testPass' });
  // User Login
  const loginResponse = await testEndpoint('POST', '/userLogin/login', { username: 'testUser', password: 'testPass', rememberMe: false });
  jwtToken = loginResponse.token;
  
  // Validate Token
  // Note: This might need an actual token either in the headers or as a cookie
  await testEndpoint('POST', '/userLogin/validateToken', null, { withCredentials: true });


  // Search User (assuming you're looking for users that start with "test")
  await testEndpoint('GET', '/userLogin/searchUser?username=testUser');

  // Get logged-in user
  // Note: This would typically need an authenticated state to work
  await testEndpoint('GET', '/userLogin/getLoggedInUser');

  // Logout user
  await testEndpoint('POST', '/userLogin/logout', { username: 'testUser' });

    // Assuming a sample userID for the tests.
    const sampleUserID = "3";
    const sampleTargetUser = "4";
  
    // Test getting followers
    await testEndpoint('GET', `/following/followers?userID=${sampleUserID}`);
  
    // Test following a user
    await testEndpoint('POST', '/following/follow', { userID: sampleUserID, targetUser: sampleTargetUser });
  
    // Test unfollowing a user
    await testEndpoint('POST', '/following/unfollow', { userID: sampleUserID, targetUser: sampleTargetUser });
  
    // Test fetching all users
    await testEndpoint('GET', '/following/allUsers');
  
    // Test checkFollowing endpoint
    await testEndpoint('GET', `/following/checkFollowing/${sampleUserID}/${sampleTargetUser}`);

    // Test creating a post
    await testEndpoint('POST', '/post/createPost', { userID: 'testUser', postData: 'This is a test post.' }, { 'Authorization': `Bearer ${jwtToken}` });

    // Test creating a post with missing data (should fail)
    await testEndpoint('POST', '/post/createPost', { postData: 'This is a test post.' });
    await testEndpoint('POST', '/post/createPost', { userID: 'testUser' });
    // Test fetching all posts
    await testEndpoint('GET', '/post/Posts');
    // Test editing a post
    await testEndpoint('PUT', '/post/editPost/1', { newPostData: 'This is the edited post content.' });
    // Test liking a post
    await testEndpoint('PUT', '/post/likePost', { userID: 'testUser', postID: '1' });

    // Test unliking a post
    await testEndpoint('PUT', '/post/unlikePost', { userID: 'testUser', postID: '1' });
    // Test to check if user liked a post
    await testEndpoint('GET', '/post/isLiked/1', null, { 'Authorization': `Bearer ${jwtToken}` });

    // Test to fetch the like count for a post
    await testEndpoint('GET', '/post/likeCount/1');

    //admin tests
    await testEndpoint('GET', '/admin/activity-log');
    await testEndpoint('PUT', '/admin/enable-disable/pages', { pageID: 'samplePageID', enabled: true });
    await testEndpoint('PUT', '/admin/enable-disable/features', { featureID: 'sampleFeatureID', enabled: true });
    await testEndpoint('GET', '/admin/pages');
    await testEndpoint('GET', '/admin/features');
    await testEndpoint('DELETE', '/admin/remove-user?username=testUserToRemove');



  };

  // Add more tests as needed

runTests();
