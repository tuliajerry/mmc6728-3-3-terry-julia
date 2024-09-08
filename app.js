require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const { getCityInfo, getJobs } = require('./util');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/city/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const cityInfo = await getCityInfo(city);
    const jobs = await getJobs(city);

    if (!cityInfo || !jobs) {
      return res.status(404).json({ error: 'City info or jobs not found' });
    }

    res.json({ cityInfo, jobs });
  } catch (error) {
    console.error('Error fetching city data:', error);
    res.status(500).json({ error: 'Failed to fetch city data' });
  }
});

module.exports = app;
