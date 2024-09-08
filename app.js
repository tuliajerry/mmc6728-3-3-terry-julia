const express = require('express');
const dotenv = require('dotenv');
const { getCityInfo, getJobs } = require('./util');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/city/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const cityInfo = await getCityInfo(city);
    const jobs = await getJobs(city);
    if (cityInfo && jobs) {
      res.json({ cityInfo, jobs });
    } else {
      res.status(404).json({ error: 'City not found or no jobs available.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
