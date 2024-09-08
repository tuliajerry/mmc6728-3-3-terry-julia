require('dotenv').config();
const express = require('express');
const path = require('path');
const { getCityInfo, getJobs } = require('./util');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/city/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const cityInfo = await getCityInfo(city);
    const jobs = await getJobs(city);
    if (!cityInfo || !jobs) {
      return res.status(404).json({ message: 'City or job information not found.' });
    }
    res.json({ cityInfo, jobs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching city or job data.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
