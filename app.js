const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Base URL and API key from environment variables
const BASE_URL = 'https://admin.memberstack.com/members';
const API_KEY = process.env.MEMBERSTACK_SECRET_KEY;

// Middleware to parse JSON
app.use(express.json());

// Route to retrieve a member by ID or email
app.get('/api/member', async (req, res) => {
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({ error: 'Please provide either id or email as a query parameter.' });
  }

  try {
    const headers = { 'X-API-KEY': API_KEY };
    const url = id
      ? `${BASE_URL}/${id}`
      : `${BASE_URL}/${encodeURIComponent(email)}`;

    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error retrieving member:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
