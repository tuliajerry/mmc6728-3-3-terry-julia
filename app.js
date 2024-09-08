const express = require('express');
const { getJobs, getCityInfo } = require('./utils');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/api/city/:city', async (req, res) => {
  const location = req.params.city;
  try {
    const [jobs, cityInfo] = await Promise.all([
      getJobs(location),
      getCityInfo(location),
    ]);

    if (jobs === false && cityInfo === false) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.status(200).json({ jobs, cityInfo });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


