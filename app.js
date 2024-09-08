const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { getCityInfo, getJobs } = require('./util');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/city/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const cityInfo = await getCityInfo(city);
        const jobs = await getJobs(city);
        res.json({ cityInfo, jobs });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
