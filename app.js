const express = require('express');
const { getCityInfo, getJobs } = require('./util');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/city/:city', async (req, res) => {
  try {
    const city = req.params.city;
    let cityInfo = false;
    let jobs = false;
    let cityInfoStatus = 200;
    let jobsStatus = 200;

    try {
      cityInfo = await getCityInfo(city);
    } catch (err) {
      if (err.status === 401 || err.status === 403 || err.status === 404 || err.status === 500) {
        cityInfoStatus = err.status;
        cityInfo = false;
      }
    }

    try {
      jobs = await getJobs(city);
    } catch (err) {
      if (err.status === 401 || err.status === 403 || err.status === 404 || err.status === 500) {
        jobsStatus = err.status;
        jobs = false;
      }
    }

    if (cityInfoStatus === 200 && jobsStatus === 200) {
      res.json({ cityInfo, jobs });
    } else if (cityInfoStatus === 404 && jobsStatus === 404) {
      res.status(404).json({ error: 'No data found' });
    } else if (cityInfoStatus === 404) {
      res.status(200).json({ cityInfo: false, jobs });
    } else if (jobsStatus === 404) {
      res.status(200).json({ cityInfo, jobs: false });
    } else if (cityInfoStatus === 401 || cityInfoStatus === 403 || jobsStatus === 401 || jobsStatus === 403) {
      res.status(200).json({ cityInfo, jobs });
    } else if (cityInfoStatus === 500 || jobsStatus === 500) {
      res.status(200).json({ cityInfo, jobs });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

