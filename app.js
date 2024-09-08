require('dotenv').config();
const express = require('express');
const path = require('path');
const { getCityInfo, getJobs } = require('./util'); 

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/city/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const cityInfo = await getCityInfo(city);
    const jobs = await getJobs(city);


    if (!cityInfo || !jobs) {
      return res.status(404).json({ error: 'City information or job data not found' });
    }

    res.json({ cityInfo, jobs });
  } catch (error) {
 
    console.error(error); 
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
