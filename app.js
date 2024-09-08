require('dotenv').config();
const express = require('express');
const path = require('path');
const { getCityInfo, getJobs } = require('./util');

const app = express();


app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/city/:city', async (req, res) => {
  try {
    const cityInfo = await getCityInfo(req.params.city);
    const jobs = await getJobs(req.params.city);

    if (cityInfo || jobs) {
      res.json({ cityInfo, jobs });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;
