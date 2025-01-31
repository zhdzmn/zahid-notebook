const axios = require('axios');
const BASE_URL = 'https://api.cmp.optimizely.com';
const AUTH_BASE_URL = 'https://accounts.cmp.optimizely.com';
async function getToken(clientId, clientSecret) {
  try {
    const tokenData = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    };
    const tokenRequest = await axios.post(
      `${AUTH_BASE_URL}/o/oauth2/v1/token`,
      tokenData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return tokenRequest.data.access_token;
  } catch (error) {
    console.error('Error during token generation:', error.response ? JSON.stringify(error.response.data) : error.message);
  }
}

async function transferSettings(sourceOrgCreds, destinationOrgCreds) {
  try {
    // Fetch settings from the source organization
    const sourceApiKey = await getToken(sourceOrgCreds.clientId, sourceOrgCreds.clientSecret);
    const destApiKey = await getToken(destinationOrgCreds.clientId, destinationOrgCreds.clientSecret);

    const getSettingsResponse = await axios.get(
      `${BASE_URL}/v3/settings`,
      {
        headers: {
          'Authorization': `Bearer ${sourceApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const sourceSettings = getSettingsResponse.data.resources;

    console.log('Settings fetched from source organization successfully.', sourceSettings.labels);

    // Post settings to the destination organization
    const postSettingsResponse = await axios.post(
      `${BASE_URL}/v3/settings?execute=true`,
      {
        resources: {
          labels: sourceSettings.labels,
          custom_fields: sourceSettings.custom_fields,
          workflows: [...sourceSettings.workflows.slice(0, 4), ...sourceSettings.workflows.slice(5, 17)],
          // workflows: [sourceSettings.workflows[17]],
          templates: sourceSettings.templates,
          apps: [],
          webhooks: [],
          routing_rules: [],
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${destApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Settings posted to destination organization successfully.');
    console.log('Response from POST settings:', postSettingsResponse.data);

    // const destinationOrgSettings = await axios.get(
    //   `${BASE_URL}/v3/settings`,
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${destApiKey}`,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    // console.log('Response from POST settings:', JSON.stringify(destinationOrgSettings.data));

  } catch (error) {
    console.error('Error during settings transfer:', error.response ? JSON.stringify(error.response.data) : error.message);
  }
}

// **IMPORTANT:** Replace with your actual Organization IDs and API Keys
const sourceOrgId = '64ee419d237f665d1a4de3ec'; // Mosey Opticon - Golden
const destOrgId = '67b4edf2d11bffc4ce17071d'; // GSK Demo

const sourceOrgCreds = {
  clientId: 'c21158c1-106f-47cf-8aa0-10ba05a0fbd1',
  clientSecret: '6f35749cd39f56f3a0c389c69b4d761210f09e990b2eb042628848a87185a68a'
};

const destinationOrgCreds  = {
  clientId: 'e28561c2-cbfa-4d47-9fcd-dcc269c2998f',
  clientSecret: 'dcee90f64b65b9b7a6033ab4c1c37276f655e06ad9e1c4aa0883c7cb11a3b36d'
};

transferSettings(sourceOrgCreds, destinationOrgCreds);
