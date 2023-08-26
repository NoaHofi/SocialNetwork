const Router = require("express").Router();
const admin = require('./admin');
const users = require('./users');


// Admin Screen: Get Activity Log
Router.get('/activity-log',async (req, res) => {
    try {
        const allActivities = await admin.getAllActivityLog();
    
        res.status(200).json({ activities: allActivities });
      } catch (error) {
        console.error('Error getting activities:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
});
  


// Admin Screen: Enable/Disable Additional Pages
Router.put('/enable-disable/pages', async (req, res) => {
    const { pageID, isEnabled } = req.body;

  try {
    await admin.updatePageStatus(pageID, isEnabled);
    res.status(200).json({ message: 'Page status updated successfully.' });
    conosole.log("update succeed");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the page status.' });
  }
});

// Admin Screen: Enable/Disable Additional Features
Router.put('/enable-disable/features', async (req, res) => {
    const { featureID, isEnabled } = req.body;

    try {
      await admin.updateFeatureStatus(featureID, isEnabled);
      res.status(200).json({ message: 'Feature status updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the feature status.' });
    }
});


// Get pages
Router.get('/pages', async (req, res) => {
    try {
      const additionalPages = await admin.getAdditionalPages();
  
      res.status(200).json({ pages: additionalPages });
    } catch (error) {
      console.error('Error getting additional pages:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get features
Router.get('/features', async (req, res) => {
    try {
      const additionalFeatures = await admin.getAdditionalFeatures();
  
      res.status(200).json({ pages: additionalFeatures });
    } catch (error) {
      console.error('Error getting additional features:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
});

// Admin Screen: Remove User from the Social Network
Router.delete('/admin/remove-user', async (req, res) => {
    const { username } = req.query;
  
    try {
      // Check if the user exists before attempting to delete
      const isexist = await users.isUserExist(username);
      console.log(`in adminRoutes is exist: ${isexist}`);
      if (!isexist) {
        res.status(404).json({ message: 'User not found.' });
      }
      else{
        await users.removeUserFromDB(username);
  
        res.status(200).json({ message: `User ${username} has been removed.` });
      }

    } catch (error) {
      console.error('Error removing user:', error);
      res.status(500).json({ error: 'An error occurred while removing the user.' });
    }
  });

module.exports = Router;