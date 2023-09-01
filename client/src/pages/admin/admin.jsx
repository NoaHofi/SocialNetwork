import React, { useEffect, useState } from 'react';
import { makeRequest } from "../../axios";  // assuming you have this setup

function Admin() {
  const [activities, setActivities] = useState([]);
  const [pages, setPages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [usernameToRemove, setUsernameToRemove] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const activityResponse = await makeRequest.get('/admin/activity-log');
        setActivities(activityResponse.data.activities);

        const pagesResponse = await makeRequest.get('/admin/pages');
        setPages(pagesResponse.data.pages);

        const featuresResponse = await makeRequest.get('/admin/features');
        setFeatures(featuresResponse.data.pages);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    }

    fetchData();
  }, []);

  const handleTogglePage = async (pageID, currentStatus) => {
    try {
      await makeRequest.put('/enable-disable/pages', {
        pageID: pageID,
        isEnabled: !currentStatus
      });
    } catch (error) {
      console.error("Error toggling page:", error);
    }
  }

  const handleToggleFeature = async (featureID, currentStatus) => {
    try {
      await makeRequest.put('/enable-disable/features', {
        featureID: featureID,
        isEnabled: !currentStatus
      });
    } catch (error) {
      console.error("Error toggling feature:", error);
    }
  }

  const handleRemoveUser = async () => {
    try {
      await makeRequest.delete(`/admin/remove-user?username=${usernameToRemove}`);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  }

  return (
    <div className="admin-container">
        <div className="rightBar">
            <div className="container">

                {/* Latest Activities */}
                <div className="item">
                    <span>Latest Activities</span>
                    {activities.map(activity => (
                        <div key={activity.userId} className="user">
                            <div className="userInfo">
                                <img src={activity.imageUrl} alt="" />
                                <p>
                                    <span>{activity.name}</span> {activity.activity}
                                </p>
                            </div>
                            <span>{activity.time}</span>
                        </div>
                    ))}
                </div>

                {/* Pages */}
                <div className="item">
                    <span>Pages</span>
                    {pages.map(page => (
                        <div key={page.pageID}>
                            <p>{page.name}</p>
                            <button onClick={() => handleTogglePage(page.pageID, page.isEnabled)}>
                                {page.isEnabled ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="item">
                    <span>Features</span>
                    {features.map(feature => (
                        <div key={feature.featureID}>
                            <p>{feature.name}</p>
                            <button onClick={() => handleToggleFeature(feature.featureID, feature.isEnabled)}>
                                {feature.isEnabled ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Remove User */}
                <div className="item">
                    <span>Remove User</span>
                    <input 
                        type="text" 
                        placeholder="Enter username to remove" 
                        value={usernameToRemove} 
                        onChange={e => setUsernameToRemove(e.target.value)} 
                    />
                    <button onClick={handleRemoveUser}>Remove User</button>
                </div>

            </div>
        </div>
    </div>
    );
}

export default Admin;
