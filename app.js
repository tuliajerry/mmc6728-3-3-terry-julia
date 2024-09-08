require('dotenv').config();
const express = require('express');
const path = require('path');
const { getCityInfo, getJobs } = require('./util');

const app = express();
const port = process.env.PORT || 3000;

console.log('Starting app.js...');


app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/city/:city', async (req, res) => {
  const city = req.params.city;
  console.log(`Received request for city: ${city}`);

  try {
    const [cityInfo, jobs] = await Promise.all([getCityInfo(city), getJobs(city)]);

    console.log('City Info:', cityInfo);
    console.log('Jobs:', jobs);

    if (!cityInfo && !jobs) {
      return res.status(404).json({ error: 'City information and job data not found' });
    }

    if (!cityInfo) {
      return res.status(200).json({ cityInfo: false, jobs });
    }

    if (!jobs) {
      return res.status(200).json({ cityInfo, jobs: false });
    }

    res.status(200).json({ cityInfo, jobs });
  } catch (error) {
    console.error('Error fetching city or job data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

});
