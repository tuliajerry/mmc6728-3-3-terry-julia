require('dotenv').config();
const express = require('express');
const { getCityInfo, getJobs } = require('./util');

const app = express();

app.use(express.static('public'));

app.get('/api/city/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const cityInfo = await getCityInfo(city);
    const jobs = await getJobs(city);

    if (cityInfo || jobs) {
      res.json({ cityInfo, jobs });
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

