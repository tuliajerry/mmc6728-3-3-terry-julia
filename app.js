require('dotenv').config()
const express = require('express')
const app = express()
// TODO: import the getCityInfo and getJobs functions from util.js

// TODO: Statically serve the public folder

// TODO: declare the GET route /api/city/:city
// This endpoint should call getCityInfo and getJobs and return
// the result as JSON.
// The returned JSON object should have two keys:
// cityInfo (with value of the getCityInfo function)
// jobs (with value of the getJobs function)
// If no city info or jobs are found,
// the endpoint should return a 404 status

module.exports = app
