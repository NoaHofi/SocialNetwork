const Router = require("express").Router();
const persist = require('./persist');


// Admin Page Get Activity Log
Router.get('/activity-log',async (req, res) => {
    try {
        const allActivities = await persist.getAllActivityLog();
    
        res.status(200).json({ activities: allActivities });
      } catch (error) {
        console.error('Error getting activities:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
});
  


// Admin Page: Enable/Disable Additional Pages
Router.put('/enable-disable/pages', async (req, res) => {
    const { pageID, enabled } = req.body;

  try {
    await persist.updatePageStatus(pageID, enabled);
    return res.status(200).json({ message: 'Page status updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating the page status.' });
  }
});

// Admin Page: Enable/Disable Additional Features
Router.put('/enable-disable/features', async (req, res) => {
    const { featureID, enabled } = req.body;

    try {
      await persist.updateFeatureStatus(featureID, enabled);
      res.status(200).json({ message: 'Feature status updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the feature status.' });
    }
});


// Get pages
Router.get('/pages', async (req, res) => {
    try {
      const additionalPages = await persist.getAdditionalPages();
      console.log("routes"+additionalPages);
      res.status(200).json({ pages: additionalPages });
    } catch (error) {
      console.error('Error getting additional pages:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get features
Router.get('/features', async (req, res) => {
    try {
      const additionalFeatures = await persist.getAdditionalFeatures();
  
      res.status(200).json({ features: additionalFeatures });
    } catch (error) {
      console.error('Error getting additional features:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
});

// Admin Page: Remove User from the Social Network
Router.delete('/remove-user', async (req, res) => {
    const { username } = req.query;
  
    try {
      // Check if the user exists before attempting to delete
      const isexist = await persist.isUserExist(username);
      console.log(`in adminRoutes is exist: ${isexist}`);
      if (!isexist) {
        res.status(404).json({ message: 'User not found.' });
      }
      else{
        await persist.removeUserFromDB(username);
  
        res.status(200).json({ message: `User ${username} has been removed.` });
      }

    } catch (error) {
      console.error('Error removing user:', error);
      res.status(500).json({ error: 'An error occurred while removing the user.' });
    }
  });

module.exports = Router;