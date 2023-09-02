const BASE_URL = 'http://localhost:8000';


// helper function for the tests to send endpoints requests
const testEndpoint = async (method, endpoint, body = null, headers = {}) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
    credentials: 'include',
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

  // delete the user first
  await testEndpoint('DELETE', '/admin/remove-user?username=testUser');
  // Register a user
  await testEndpoint('POST', '/userLogin/register', { username: 'testUser', password: 'testPass' });
  // User Login
  await testEndpoint('POST', '/userLogin/login', { username: 'testUser', password: 'testPass', rememberMe: false });

  // Search User
  await testEndpoint('GET', '/userLogin/searchUser?username=testUser');

  // Logout user
  await testEndpoint('POST', '/userLogin/logout', { username: 'testUser' });

    // sample ids for testing
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
    await testEndpoint('POST', '/post/createPost', { userID: 'testUser', postData: 'This is a test post.' });

    // Test editing a post
    await testEndpoint('PUT', '/post/editPost/1', { newPostData: 'This is the edited post content.' });
    // Test liking a post
    await testEndpoint('PUT', '/post/likePost', { userID: 'testUser', postID: '1' });

    // Test unliking a post
    await testEndpoint('PUT', '/post/unlikePost', { userID: 'testUser', postID: '1' });

    // Test to fetch the like count for a post
    await testEndpoint('GET', '/post/likeCount/1');

    //admin tests
    await testEndpoint('GET', '/admin/activity-log');
    await testEndpoint('PUT', '/admin/enable-disable/pages', { pageID: 'samplePageID', enabled: true });
    await testEndpoint('PUT', '/admin/enable-disable/features', { featureID: 'sampleFeatureID', enabled: true });
    await testEndpoint('GET', '/admin/pages');
    await testEndpoint('GET', '/admin/features');

  };

runTests();
