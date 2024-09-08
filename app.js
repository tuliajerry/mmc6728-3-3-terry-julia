require('dotenv').config();
const express = require('express');
const { getCityInfo, getJobs } = require('./util');

const app = express();

app.use(express.static('public'));

app.get('/api/city/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const [cityInfo, jobs] = await Promise.all([
      getCityInfo(city),
      getJobs(city)
    ]);

    if (!cityInfo && !jobs) {
      return res.status(404).json({ error: 'City info or jobs not found' });
    }

    res.json({ cityInfo, jobs });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

module.exports = app;
