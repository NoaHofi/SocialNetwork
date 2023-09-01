const knex = require('./knex'); // Import the knex connection from the knex.js file

(async () => {
  const tableExists = await knex.schema.hasTable('pages');

  if (!tableExists) {
    // Create a new 'pages' table
    await knex.schema.createTable('pages', (table) => {
      table.increments('pageID').primary();
      table.string('pageName').notNullable().unique();
      table.boolean('enabled').notNullable();
    });
    console.log('Pages table created.');
  }

  await knex('pages').insert([
    { pageName: 'HealthTips', enabled: true },
    { pageName: 'Scheduler', enabled: true }
  ]);
  console.log('HealthTips and Scheduler pages added.');

  const fetatureTableExists = await knex.schema.hasTable('features');

  if (!fetatureTableExists) {
    // Create a new 'features' table
    await knex.schema.createTable('features', (table) => {
      table.increments('featureID').primary();
      table.string('featureName').notNullable().unique();
      table.boolean('enabled').notNullable();
    });
    console.log('features table created.');
  }

  activityTableExists = await knex.schema.hasTable('activityLog');

  if (!activityTableExists) {
    // Create a new 'activityLog' table
    await knex.schema.createTable('activityLog', (table) => {
      table.increments('activityID').primary();
      table.string('activityAction').notNullable();
      table.timestamp('timeStamp').defaultTo(knex.fn.now()); // Use timestamp type and default value
    });
    console.log('activityLog table created.');
  }

})();


async function updatePageStatus(pageID, isEnabled) {
  try {
    await knex('pages')
      .where('pageID', pageID)
      .update({ enabled: isEnabled });
      console.log(`page updated with ID: ${pageID} to status ${isEnabled}`);
  } catch (error) {
    throw new Error('Failed to update page status in the database.');
  }
}

async function getAdditionalPages() {
  try {
    const pages = await knex('pages').select('pagaID','pageName','enabled');
    return pages;
  } catch (error) {
    throw new Error('Failed to get additional pages status from the database.');
  }
}


async function updateFeatureStatus(featureID, isEnabled) {
  try {
    await knex('features')
      .where('featureID', featureID)
      .update({ enabled: isEnabled });
  } catch (error) {
    throw new Error('Failed to update feature status in the database.');
  }
}

async function getAdditionalFeatures() {
  try {
    const features = await knex('features').select('featureID','featureName','enabled');
    return features;
  } catch (error) {
    throw new Error('Failed to get additional features status from the database.');
  }
}

async function getAllActivityLog() {
  try {
    activities = await knex('activityLog').select('activityID','activityAction','timeStamp');
    return activities;
  } catch (error) {
    throw new Error('Failed to get all activities from the database.');
  }
}

async function insertActivity(activityAction) {
  try {
    await knex('activityLog').insert({
      activityAction: activityAction,
    });
    console.log(`activity added to DB: ${activityAction} `)
  } catch (error) {
    console.error('Error inserting activity:', error);
    throw new Error('Failed to insert activity into the database.');
  }
}


module.exports = {
  updatePageStatus,
  updateFeatureStatus,
  getAdditionalPages,
  getAdditionalFeatures,
  getAllActivityLog,
  insertActivity
};