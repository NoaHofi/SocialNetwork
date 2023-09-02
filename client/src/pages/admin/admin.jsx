import React, { useEffect, useState } from 'react';
import { makeRequest } from "../../axios";
import "./admin.css";

function Admin() {
  const [activities, setActivities] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [usernameToRemove, setUsernameToRemove] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [fetchUserErr, setFetchUserErr] = useState(null);
  const [fetchActivityLogErr, setFetchActivityLog] = useState(null);
  const [fetchPagesErr, setFetchPagesErr] = useState(null);
  const [fetchFeaturesErr, setFetchFeaturesErr] = useState(null);

  
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

    async function fetchData() {
      try {
        const activityResponse = await makeRequest.get('/admin/activity-log');
        if (activityResponse.status === 200) {
          console.log("Activity Response: ", activityResponse);
          setActivities(activityResponse.data.activities);
        }
        else{
          setFetchActivityLog("Failed to fetch activity log.");
        }


        const pagesResponse = await makeRequest.get('/admin/pages');
        if (pagesResponse.status === 200) {
          console.log("Pages Response: ", pagesResponse);
          setPages(pagesResponse.data.pages);
        }
        else{
          setFetchPagesErr("Failed to fetch pages.");
        }

        const featuresResponse = await makeRequest.get('/admin/features');
        if (featuresResponse.status === 200) {
          console.log("Features Response: ", featuresResponse);
          setFeatures(featuresResponse.data.features);
        }
        else{
          setFetchFeaturesErr("Failed to fetch features.");
        }

      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    }
    fetchUser();
    fetchData();
  }, []);

  const handleTogglePage = async (pageID, currentStatus) => {
    try {
      await makeRequest.put('/admin/enable-disable/pages', {
        pageID: pageID,
        enabled: !currentStatus
      });
      window.location.reload();
    } catch (error) {
      console.error("Error toggling page:", error);
    }
  }

  const handleToggleFeature = async (featureID, currentStatus) => {
    try {
      await makeRequest.put('/admin/enable-disable/features', {
        featureID: featureID,
        enabled: !currentStatus
      });
      window.location.reload();
    } catch (error) {
      console.error("Error toggling feature:", error);
    }
  }

  const handleRemoveUser = async () => {
    try {
      const res = await makeRequest.delete(`/admin/remove-user?username=${usernameToRemove}`);
      
      if (res.status === 200) {
        setFeedbackMessage("User removed successfully.");
      } else {
        setFeedbackMessage(res.data.message || "Error removing user.");
      }
      
      window.location.reload();
    } catch (error) {
      console.error("Error removing user:", error);
      setFeedbackMessage("Error removing user. Please try again later.");
    }
};

    if (loggedInUser === null) {
    return <div>Loading...</div>;
    }

    if (!(loggedInUser.username === "admin")) {
    return <div>You are not authorized to view this page.</div>;
    }

  return (
    <div className="admin-container">
      <div className="leftBar">
      {fetchUserErr && <p className="error-message">{fetchUserErr}</p>}


{/* Pages */}
{pages && pages.length > 0 ? (
    <div className="item">
        <span>Disable & Enable Pages</span>
        {fetchPagesErr && <p className="error-message">{fetchPagesErr}</p>}
        <ul>
            {pages.map(page => (
                <li key={page.pageID} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <p style={{ marginRight: '10px' }}>{page.pageName}</p>
                    <button onClick={() => handleTogglePage(page.pageID, page.enabled)}>
                        {page.enabled ? 'Disable' : 'Enable'}
                    </button>
                </li>
            ))}
        </ul>
    </div>
) : null}

{/* Features */}
{features && features.length > 0 ? (
    <div className="item">
        <span>Features</span>
        {fetchFeaturesErr && <p className="error-message">{fetchFeaturesErr}</p>}
        <ul>
            {features.map(feature => (
                <li key={feature.featureID} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <p style={{ marginRight: '10px' }}>{feature.featureName}</p>
                    <button onClick={() => handleToggleFeature(feature.featureID, feature.enabled)}>
                        {feature.enabled ? 'Disable' : 'Enable'}
                    </button>
                </li>
            ))}
        </ul>
    </div>
) : null}

        {/* Remove User */}
        <div className="item">
            <span>Remove User  </span>
            <input 
                type="text" 
                placeholder="Enter username to remove" 
                value={usernameToRemove} 
                onChange={e => setUsernameToRemove(e.target.value)} 
            />
            <button onClick={handleRemoveUser}>Remove User</button>
            {feedbackMessage && <div className="feedback">{feedbackMessage}</div>}

        </div>

      </div>
      
      <div className="rightBar">
        {/* Latest Activities */}
        <div className="container">
        {activities && activities.length > 0 ? (
            <div className="item">
                <span>Latest Activities</span>
                {fetchActivityLogErr && <p className="error-message">{fetchActivityLogErr}</p>}
                {activities.map(activity => (
                    <div key={activity.activityID} className="user">
                        <div className="userInfo">
                            <p>
                                <span>{activity.activityID}</span> {activity.activityAction}
                            </p>
                        </div>
                        <span>{activity.timeStamp}</span>
                    </div>
                ))}
            </div>
        ) : null}
      </div>
    </div>
    </div>
  );
}

export default Admin;
