const axios = require('axios');

// Allowed origins
const allowedOrigins = [
  'https://fawn-meets-v1a.webflow.io',
  'https://www.fawnmeets.com'
];

// Serverless function handler
exports.handler = async (event, context) => {
  // Get the request origin
  const origin = event.headers.origin;
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-KEY',
      },
      body: '',
    };
  }

  const { id, email } = event.queryStringParameters || {};

  if (!id && !email) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
      },
      body: JSON.stringify({ error: 'Please provide either id or email as a query parameter.' }),
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
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error retrieving member:', error.message);
    return {
      statusCode: error.response ? error.response.status : 500,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
      },
      body: JSON.stringify(error.response ? error.response.data : { error: 'An unexpected error occurred.' }),
    };
  }
};
