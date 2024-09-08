const express = require('express');
const { getCityInfo, getJobs } = require('./util');

const app = express();
const port = 3000;

app.use(express.static('public'));


app.get('/api/city/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const cityInfo = await getCityInfo(city);
    const jobs = await getJobs(city);

    if (cityInfo || jobs) {
      res.json({ cityInfo, jobs });
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
