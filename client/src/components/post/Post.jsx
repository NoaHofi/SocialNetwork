import React, { useEffect, useState, useRef } from 'react';
import "./post.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { makeRequest } from "../../axios";  

const Post = ({ post }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPostText, setEditedPostText] = useState(post.postData);
  const editInputRef = useRef(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [isEnabled, setIsEnabled] = useState(false);
  const [isPostEditEnabled, setIsPostEditEnabled] = useState(false);
  const [fetchUserErr, setFetchUserErr] = useState(null);
  const [fetchFeaturesErr, setFetchFeaturesErr] = useState(null);
  const [fetchEditPostFeatureErr, setFetchEditPostFeature] = useState(null);


  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await makeRequest.get('/userLogin/getLoggedInUser');
        if (response.status === 200) {
          setLoggedInUser(response.data);
        }
        else{
          setFetchUserErr("Failed to fetch user.");
        }
        
      } catch (error) {
        console.error('Error fetching the logged-in user:', error);
      } 
    }

      const fetchFeatureStatus = async () => {
        try {
          const response = await makeRequest.get('/admin/features');
          if (response.status === 200) {
            const unlikeFeature = response.data.features.find(f => f.featureName === "unlike post");
            if (unlikeFeature) {
              setIsEnabled(unlikeFeature.enabled); 
            }
          }
          else{
            setFetchFeaturesErr("Failed to fetch features.");
          }

        } catch (error) {
          console.error('Error fetching the feature status:', error);
        }
     };
     
     fetchFeatureStatus();

     const fetchEditPostFeatureStatus = async () => {
      try {
        const response = await makeRequest.get('/admin/features');
        if (response.status === 200) {
          const editFeature = response.data.features.find(f => f.featureName === "edit post"); 
          if (editFeature) {
            setIsPostEditEnabled(editFeature.enabled); 
          }
        }
        else{
          setFetchEditPostFeature("Failed to fetch edit post feature.");
        }

      } catch (error) {
        console.error('Error fetching the feature status:', error);
      }
   };
   
   
   const fetchLikeStatus = async () => {
     
     const response = await makeRequest.get(`/post/isLiked/${post.postID}`);
     setIsLiked(response.data.isLiked);
    };
    
    // Fetch like count
    const fetchLikeCount = async () => {
      
      const response = await makeRequest.get(`/post/likeCount/${post.postID}`);
      setLikeCount(response.data.likeCount);
    };  
    
    fetchEditPostFeatureStatus();
    fetchUser();
    fetchLikeStatus();
    fetchLikeCount();


  }, [post.postID]);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);
  

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
          {fetchUserErr && <p className="error-message">{fetchUserErr}</p>}
          {fetchFeaturesErr && <p className="error-message">{fetchFeaturesErr}</p>}
          {fetchEditPostFeatureErr && <p className="error-message">{fetchEditPostFeatureErr}</p>}
          
            <div className="details">
              <span className="date">{post.createAt}</span>
            </div>
          </div>
          {
            loggedInUser && isPostEditEnabled ? (
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
          <h4>{post.username}</h4>
          {!isEditing && <p>{post.postData}</p>}
        </div>
        <div className="info">
          <div className="item">
          {isLiked 
                ? (isEnabled && <button onClick={handleUnlike}>Unlike</button>) 
                : <button onClick={handleLike}>Like</button>}
              {likeCount} Likes
          </div>
        </div>
      </div>
    </div>
);
};

export default Post;
