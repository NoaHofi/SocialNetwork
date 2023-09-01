import React, { useEffect, useState } from 'react';
import { makeRequest } from "../../axios";  // assuming you have this setup
import "./admin.css";

function Admin() {
  const [activities, setActivities] = useState([]);
  const [pages, setPages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [usernameToRemove, setUsernameToRemove] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const activityResponse = await makeRequest.get('/admin/activity-log');
        console.log("Activity Response: ", activityResponse);
        setActivities(activityResponse.data.activities);

        const pagesResponse = await makeRequest.get('/admin/pages');
        console.log("Pages Response: ", pagesResponse);
        setPages(pagesResponse.data.pages);

        const featuresResponse = await makeRequest.get('/admin/features');
        console.log("Features Response: ", featuresResponse);
        setFeatures(featuresResponse.data.features);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    }

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
      await makeRequest.delete(`/admin/remove-user?username=${usernameToRemove}`);
      window.location.reload();
    } catch (error) {
      console.error("Error removing user:", error);
    }
  }

  return (
    <div className="admin-container">
      <div className="leftBar">
        {/* Pages */}
        {pages && pages.length > 0 ? (
            <div className="item">
                <span>Disable & Enable Pages</span>
                {pages.map(page => (
                    <div key={page.pageID}>
                        <p>{page.pageName}</p>
                        <button onClick={() => handleTogglePage(page.pageID, page.enabled)}>
                            {page.enabled ? 'Disable' : 'Enable'}
                        </button>
                    </div>
                ))}
            </div>
        ) : null}

        {/* Features */}
        {features && features.length > 0 ? (
            <div className="item">
                <span>Features</span>
                {features.map(feature => (
                    <div key={feature.featureID}>
                        <p>{feature.featureName}</p>
                        <button onClick={() => handleToggleFeature(feature.featureID, feature.enabled)}>
                            {feature.enabled ? 'Disable' : 'Enable'}
                        </button>
                    </div>
                ))}
            </div>
        ) : null}

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
      
      <div className="rightBar">
        {/* Latest Activities */}
        <div className="container">
        {activities && activities.length > 0 ? (
            <div className="item">
                <span>Latest Activities</span>
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
