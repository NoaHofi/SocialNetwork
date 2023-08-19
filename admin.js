const fs = require('fs');
const path = require('path');

const adminSettingsPath = path.join(__dirname, 'data', 'adminSettings.json');
const activityLogPath = path.join(__dirname, 'data', 'activityLog.json');

// Function to Get Admin Settings
function getAdminSettings() {
  const adminSettings = fs.readFileSync(adminSettingsPath, 'utf-8');
  return JSON.parse(adminSettings);
}

// Function to Save Admin Settings
function saveAdminSettings(adminSettings) {
  fs.writeFileSync(adminSettingsPath, JSON.stringify(adminSettings, null, 2));
}

// Function to Get Activity Log
function getActivityLog() {
  const activityLog = fs.readFileSync(activityLogPath, 'utf-8');
  return JSON.parse(activityLog);
}

// Function to Save Activity Log
function saveActivityLog(activityLog) {
  fs.writeFileSync(activityLogPath, JSON.stringify(activityLog, null, 2));
}


module.exports = {
    getAdminSettings,
    saveAdminSettings,
    getActivityLog,
    saveActivityLog,
  };