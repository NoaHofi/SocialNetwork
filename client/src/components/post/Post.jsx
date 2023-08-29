import React, { useEffect, useState, useRef } from 'react';
import "./post.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { makeRequest } from "../../axios";  // Assuming you have this axios config

const Post = ({ post }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPostText, setEditedPostText] = useState(post.postData);
  const editInputRef = useRef(null);
  const [isUserFetched, setIsUserFetched] = useState(false);


  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await makeRequest.get('/userLogin/getLoggedInUser');
        setLoggedInUser(response.data);
      } catch (error) {
        console.error('Error fetching the logged-in user:', error);
      } finally {
        // This will be called after trying to fetch the user,
        // regardless of success or failure
        setIsUserFetched(true);
      }
    }
    fetchUser();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    editInputRef.current.focus();
  };

  const handleSaveEdit = async () => {
    try {
      console.log(editedPostText)
      const response = await makeRequest.put(`/post/editPost/${post.postID}`, {
        newPostData: editedPostText
      });
      if (response.status === 200) {
        console.log(response.data.message);
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error editing the post:', error);
    }
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <div className="details">
              <span className="date">{post.createAt}</span>
            </div>
          </div>
          {
            loggedInUser ? (
              loggedInUser.userID === post.userID && (
                isEditing ? (
                  <div className="editContainer">
                    <input
                      ref={editInputRef}
                      value={editedPostText}
                      onChange={(e) => setEditedPostText(e.target.value)}
                      className="editInput"
                    />
                    <button onClick={handleSaveEdit} className="saveButton">Save</button>
                  </div>
                ) : (
                  <MoreHorizIcon onClick={handleEditClick} />
                )
              )
            ) : "loading"
          }
        </div>
        <div className="content">
          <h4>{post.username}</h4> {/* Display the username */}
          {!isEditing && <p>{post.postData}</p>}
        </div>
        <div className="info">
          <div className="item">
            {/* Your like icons and other features can be placed here */}
            12 Likes
          </div>
        </div>
      </div>
    </div>
);
};

export default Post;
