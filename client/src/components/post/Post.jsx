import React, { useEffect, useState, useRef } from 'react';
import "./post.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { makeRequest } from "../../axios";  

const Post = ({ post }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPostText, setEditedPostText] = useState(post.postData);
  const editInputRef = useRef(null);
  const [isUserFetched, setIsUserFetched] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);



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


    const fetchLikeStatus = async () => {
      // Placeholder
      const response = await makeRequest.get(`/post/isLiked/${post.postID}`);
      setIsLiked(response.data.isLiked);
    };

    // Fetch like count
    const fetchLikeCount = async () => {
      // Placeholder
      const response = await makeRequest.get(`/post/likeCount/${post.postID}`);
      setLikeCount(response.data.count);
    };  

    fetchUser();
    fetchLikeStatus();
    fetchLikeCount();


  }, [post.postID]);

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

  const handleLike = async () => {
    try {
      const response = await makeRequest.put('/post/likePost', {
        userID: loggedInUser.userID,
        postID: post.postID
      });
  
      if (response.status === 200) {
        setIsLiked(true);
        setLikeCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };
  
  const handleUnlike = async () => {
    try {
      const response = await makeRequest.put('/post/unlikePost', {
        userID: loggedInUser.userID,
        postID: post.postID
      });
  
      if (response.status === 200) {
        setIsLiked(false);
        setLikeCount(prevCount => prevCount - 1);
      }
    } catch (error) {
      console.error('Error unliking the post:', error);
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
          {isLiked 
                ? <button onClick={handleUnlike}>Unlike</button> 
                : <button onClick={handleLike}>Like</button>}
              {likeCount} Likes
          </div>
        </div>
      </div>
    </div>
);
};

export default Post;
