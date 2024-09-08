require('dotenv').config();
const express = require('express');
const app = express();
const { getCityInfo, getJobs } = require('./util');

app.use(express.static('public'));

app.get('/api/city/:city', async (req, res) => {
    const cityName = req.params.city;

    try {
        const cityInfo = await getCityInfo(cityName);
        const jobs = await getJobs(cityName);

        if (!cityInfo || !jobs) {
            return res.status(404).json({ error: 'City information or jobs not found' });
        }

        res.json({
            cityInfo,
            jobs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = app;
