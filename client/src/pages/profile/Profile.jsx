import React, { useState, useEffect } from 'react';
import { makeRequest } from "../../axios";


function Profile() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await makeRequest.get('/userLogin/getLoggedInUser');
        if (response.status === 200) {
          setLoggedInUser(response.data);
          console.log(loggedInUser)
        }
      } catch (error) {
        console.error('Error fetching the logged-in user:', error);
      }
    }

    fetchUser();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await makeRequest.get(`/userLogin/searchUser?username=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching for users:', error);
    }
  };

  return (
    <div className="rightBar">
    <div className="container">
      <h1>Welcome, {loggedInUser ? loggedInUser.username : 'Loading...'}</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
          {loggedInUser && searchResults.map((user) => (
            <li className="item" key={user.userID}>
              <UserItem user={user} loggedInUserID={loggedInUser.userID} />
            </li>
          ))}
      </ul>

    </div>
  </div>
  );
}


function UserItem({ user, loggedInUserID }) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    async function checkFollowingStatus() {
      try {
        const response = await makeRequest.get(`/following/checkFollowing/${loggedInUserID}/${user.userID}`);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    }

    checkFollowingStatus();
  }, [loggedInUserID, user]);

  const handleFollow = async () => {
    try {
      const response = await makeRequest.post('/following/follow', {
        userID: loggedInUserID,
        targetUser: user.userID
      });
      
      if (response.status === 201) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error following the user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await makeRequest.post('/following/unfollow', {
        userID: loggedInUserID,
        targetUser: user.userID
      });
      
      if (response.status === 200) {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error('Error unfollowing the user:', error);
    }
  };

  return (
    <div className="user">
    <div className="userInfo">
      <span>{user.username}</span>
    </div>
    <div className="buttons">
      {isFollowing ? (
        <button onClick={handleUnfollow} name="unfollowBtn">Unfollow</button>
      ) : (
        <button onClick={handleFollow} name="followBtn">Follow</button>
      )}
    </div>
  </div>
  );
}

export default Profile;
