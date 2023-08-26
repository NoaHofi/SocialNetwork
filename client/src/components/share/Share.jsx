import React, { useContext, useState, useRef,useEffect } from 'react';
import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [postText, setPostText] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await makeRequest.get('/userLogin/getLoggedInUser');
        setLoggedInUser(response.data);
        console.log(loggedInUser)
      } catch (error) {
        console.error('Error fetching the logged-in user:', error);
      }
    }

    fetchUser();
  }, []);
  const handleInputChange = (e) => {
    setPostText(e.target.value);
  };

  const handleSharePost = async () => {
    try {
      console.log(postText)
      const response = await makeRequest.post('/post/createPost', {
        userID: loggedInUser.userID,
        postData: postText
      });
      if (response.status === 201) {
        console.log(response.data.message);
        // Reset the post text after successfully sharing
        setPostText('');
      }
    } catch (error) {
      console.error('Error sharing the post:', error);
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <input
            type="text"
            value={postText}
            onChange={handleInputChange}
            placeholder={`What's on your mind ${loggedInUser ? loggedInUser.username : 'Loading...'}?`}
          />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">

            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleSharePost}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
