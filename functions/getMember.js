const axios = require('axios');

// Serverless function handler
exports.handler = async (event, context) => {
  const { id, email } = event.queryStringParameters || {};

  if (!id && !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Please provide either id or email as a query parameter.' }),
      headers: {
        'Access-Control-Allow-Origin': 'https://fawn-meets-v1a.webflow.io, https://www.fawnmeets.com', // Allow these domains
        'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allowed methods
        'Access-Control-Allow-Headers': 'Content-Type, X-API-KEY', // Allowed headers
      },
    };
  }

  try {
    const API_KEY = process.env.MEMBERSTACK_SECRET_KEY;
    const BASE_URL = 'https://admin.memberstack.com/members';
    const headers = { 'X-API-KEY': API_KEY };

    const url = id
      ? `${BASE_URL}/${id}`
      : `${BASE_URL}/${encodeURIComponent(email)}`;

    const response = await axios.get(url, { headers });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Access-Control-Allow-Origin': 'https://fawn-meets-v1a.webflow.io, https://www.fawnmeets.com', // Allow these domains
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-KEY',
      },
    };
  } catch (error) {
    console.error('Error retrieving member:', error.message);
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify(error.response ? error.response.data : { error: 'An unexpected error occurred.' }),
      headers: {
        'Access-Control-Allow-Origin': 'https://fawn-meets-v1a.webflow.io, https://www.fawnmeets.com', // Allow these domains
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-KEY',
      },
    };
  }
};
