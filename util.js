const axios = require("axios");

const JOBS_URL = "https://findwork.dev/api/jobs/";
const JOBS_KEY = process.env.JOBS_KEY;

const STATS_URL =
  "https://gist.githubusercontent.com/mynar7/089f0832b9a6c42d64bf5bc7bd690952/raw/8ccdf19e5c243afad023503a1f73f2bc1f245da1/teleport.json";

async function getJobs(location) {
  try {
    const { data } = await axios.get(
      `${JOBS_URL}?location=${location}`,
      {
        headers: {
          Authorization: `Token ${JOBS_KEY}`,
        },
      },
    );
    if (data.results.length > 0) return data.results;
    else throw new Error("Jobs not found");
  } catch (err) {
    //console.log(err.data || err.message)
    return false;
  }
}

async function getCityInfo(location) {
  try {
    const { data } = await axios.get(STATS_URL);
    // const data = require("./teleport.json");
    // grabs any cities that contain the location info
    const normalize = (str) =>
      (str && str.trim())
        ? str.toLowerCase().trim()
          // remove everything except letters and spaces
          .replaceAll(/[^a-zA-Z\s]+/g, "")
          // convert inner spaces to a single space
          .replaceAll(/\s+/g, " ")
        : null;

    const searchTerms = location.split(",");
    const [term1, term2, term3] = searchTerms.map(normalize);

    const filterByCity = (term, citiesToSearch) =>
      citiesToSearch.filter((city) => city.UA_Name.toLowerCase() === term);

    const filterByStateOrCountry = (term, citiesToSearch) => {
      const cities = citiesToSearch.filter((city) =>
        city.UA_Country.toLowerCase() === term
      );
      if (cities.length > 0) return cities;
      return citiesToSearch.filter((city) =>
        city.UA_Country.toLowerCase().includes(term)
      );
    };

    const filterByContinent = (term, citiesToSearch) => {
      const cities = citiesToSearch.filter((city) =>
        city.UA_Continent.toLowerCase() === term
      );
      if (cities.length > 0) return cities;
      return citiesToSearch.filter((city) =>
        city.UA_Continent.toLowerCase().includes(term)
      );
    };

    let name = null
    let cities = [];
    if (term1) {
      cities = filterByCity(term1, data);
      if (cities.length === 1) {
        name = `${cities[0].UA_Name}, ${cities[0].UA_Country}, ${cities[0].UA_Continent}`
      }
      if (cities.length === 0) {
        cities = filterByStateOrCountry(term1, data)
        name = cities.length > 0 && `${cities[0].UA_Country}, ${cities[0].UA_Continent}`
      }
      if (cities.length === 0) {
        cities = filterByContinent(term1, data)
        name = cities.length > 0 && cities[0].UA_Continent
      }
    }
    if (term2 && cities.length > 1) {
      cities = filterByStateOrCountry(stateOrCountry, cities);
      if (cities.length === 1)
        name = `${cities[0].UA_Name}, ${cities[0].UA_Country}, ${cities[0].UA_Continent}`
    }
    if (term3 && cities.length > 1) {
      cities = filterByContinent(continent, cities);
      if (cities.length === 1)
        name = `${cities[0].UA_Name}, ${cities[0].UA_Country}, ${cities[0].UA_Continent}`
    }

    // no cities found
    if (cities.length === 0) return false

    const scoreMap = {
      "Housing": {
        name: "Housing",
        score_out_of_10: 0,
        color: "#f3c32c",
      },
      "Cost of Living": {
        color: "#f3d630",
        name: "Cost of Living",
        score_out_of_10: 0,
      },
      "Startups": {
        color: "#f4eb33",
        name: "Startups",
        score_out_of_10: 0,
      },
      "Venture Capital": {
        color: "#d2ed31",
        name: "Venture Capital",
        score_out_of_10: 0,
      },
      "Travel Connectivity": {
        color: "#7adc29",
        name: "Travel Connectivity",
        score_out_of_10: 0,
      },
      "Commute": {
        color: "#36cc24",
        name: "Commute",
        score_out_of_10: 0,
      },
      "Business Freedom": {
        color: "#19ad51",
        name: "Business Freedom",
        score_out_of_10: 0,
      },
      "Safety": {
        color: "#0d6999",
        name: "Safety",
        score_out_of_10: 0,
      },
      "Healthcare": {
        color: "#051fa5",
        name: "Healthcare",
        score_out_of_10: 0,
      },
      "Education": {
        color: "#150e78",
        name: "Education",
        score_out_of_10: 0,
      },
      "Environmental Quality": {
        color: "#3d14a4",
        name: "Environmental Quality",
        score_out_of_10: 0,
      },
      "Economy": {
        color: "#5c14a1",
        name: "Economy",
        score_out_of_10: 0,
      },
      "Taxation": {
        color: "#88149f",
        name: "Taxation",
        score_out_of_10: 0,
      },
      "Internet Access": {
        color: "#b9117d",
        name: "Internet Access",
        score_out_of_10: 0,
      },
      "Leisure & Culture": {
        color: "#d10d54",
        name: "Leisure & Culture",
        score_out_of_10: 0,
      },
      "Tolerance": {
        color: "#e70c26",
        name: "Tolerance",
        score_out_of_10: 0,
      },
      "Outdoors": {
        color: "#f1351b",
        name: "Outdoors",
        score_out_of_10: 0,
      },
    };
    // add up multiple scores
    for (const city of cities) {
      for (const [category, value] of Object.entries(scoreMap)) {
        scoreMap[category].score_out_of_10 = value.score_out_of_10 +
          city[category];
      }
    }
    // get average of scores
    for (const [category, value] of Object.entries(scoreMap)) {
      scoreMap[category].score_out_of_10 = value.score_out_of_10 /
        cities.length;
    }
    const response = {
      name,
      scores: Object.values(scoreMap),
      // average all values
      overall_score: Object.values(scoreMap)
        .map(({ score_out_of_10 }) => score_out_of_10)
        .reduce((total, score) => total + score) /
        Object.keys(scoreMap).length * 10,
    };
    return response;
  } catch (err) {
    // console.log(err.data || err.message)
    return false;
  }
}

module.exports = { getJobs, getCityInfo };
