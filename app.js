const express = require('express');
const { getCityInfo, getJobs } = require('./util');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/city/:city', async (req, res) => {
  try {
    const cityInfo = await getCityInfo(req.params.city);
    const jobs = await getJobs(req.params.city);
    
    if (cityInfo || jobs) {
      res.json({ cityInfo, jobs });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
