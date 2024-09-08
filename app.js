const express = require('express');
const dotenv = require('dotenv');
const { getCityInfo, getJobs } = require('./util'); 

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('public'));


app.get('/api/city/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const cityInfo = await getCityInfo(city);
        const jobs = await getJobs(city);
        res.json({ cityInfo, jobs });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch city or job data' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
