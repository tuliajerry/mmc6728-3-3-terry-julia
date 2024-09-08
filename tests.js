const { expect } = require("chai");
const request = require("supertest");
const nock = require("nock");
const fs = require("fs").promises;
const app = require("./app");

const CITY_INFO_UTIL_RESPONSE = {
  "name": "Orlando, Florida, North America",
  "scores": [
    {
      "name": "Housing",
      "score_out_of_10": 5.778499999999999,
      "color": "#f3c32c",
    },
    {
      "color": "#f3d630",
      "name": "Cost of Living",
      "score_out_of_10": 5.284,
    },
    {
      "color": "#f4eb33",
      "name": "Startups",
      "score_out_of_10": 6.5975,
    },
    {
      "color": "#d2ed31",
      "name": "Venture Capital",
      "score_out_of_10": 2.464,
    },
    {
      "color": "#7adc29",
      "name": "Travel Connectivity",
      "score_out_of_10": 3.7734999999999994,
    },
    {
      "color": "#36cc24",
      "name": "Commute",
      "score_out_of_10": 4.33875,
    },
    {
      "color": "#19ad51",
      "name": "Business Freedom",
      "score_out_of_10": 8.671,
    },
    {
      "color": "#0d6999",
      "name": "Safety",
      "score_out_of_10": 4.134,
    },
    {
      "color": "#051fa5",
      "name": "Healthcare",
      "score_out_of_10": 5.9673333333333325,
    },
    {
      "color": "#150e78",
      "name": "Education",
      "score_out_of_10": 3.6245,
    },
    {
      "color": "#3d14a4",
      "name": "Environmental Quality",
      "score_out_of_10": 6.676,
    },
    {
      "color": "#5c14a1",
      "name": "Economy",
      "score_out_of_10": 6.5145,
    },
    {
      "color": "#88149f",
      "name": "Taxation",
      "score_out_of_10": 4.772,
    },
    {
      "color": "#b9117d",
      "name": "Internet Access",
      "score_out_of_10": 4.886,
    },
    {
      "color": "#d10d54",
      "name": "Leisure & Culture",
      "score_out_of_10": 5.9295,
    },
    {
      "color": "#e70c26",
      "name": "Tolerance",
      "score_out_of_10": 5.784000000000002,
    },
    {
      "color": "#f1351b",
      "name": "Outdoors",
      "score_out_of_10": 4.492999999999999,
    },
  ],
  "overall_score": 52.75769607843138,
};
const CITY_INFO = [
  {
    "id": 176,
    "UA_Name": "Orlando",
    "UA_Country": "Florida",
    "UA_Continent": "North America",
    "Housing": 5.778499999999999,
    "Cost of Living": 5.284,
    "Startups": 6.5975,
    "Venture Capital": 2.464,
    "Travel Connectivity": 3.7734999999999994,
    "Commute": 4.33875,
    "Business Freedom": 8.671,
    "Safety": 4.134,
    "Healthcare": 5.9673333333333325,
    "Education": 3.6245,
    "Environmental Quality": 6.676,
    "Economy": 6.5145,
    "Taxation": 4.772,
    "Internet Access": 4.886,
    "Leisure & Culture": 5.9295,
    "Tolerance": 5.784000000000002,
    "Outdoors": 4.492999999999999,
  },
];
const CITY_NO_INFO = [];

// https://findwork.dev/api/jobs/?location=miami
const JOB_RESULTS = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      id: 113485,
      role: "Multiple Engineering Roles",
      company_name: "Defy Trends",
      company_num_employees: null,
      employment_type: null,
      location: "Miami",
      remote: true,
      logo: null,
      url:
        "https://findwork.dev/113485/multiple-engineering-roles-at-defy-trends",
      text:
        "Defy Trends is an AI and data-driven crypto intelligence for investors, traders, researchers, crypto newbies and crypto vets to obtain quality information and actionable insights to make confident crypto investment decisions.<br>We are looking for talented people throughout the entire stack: JavaScript, React, Node, Python, Go, Elixir, Solar, Flink, k8s, and much more. Our hiring efforts focus on Europe and Eastern US.<br>- Senior DevOps&#x2F;Platform Engineer<br>- Senior Data Engineer<br>- Senior Distributed System Engineer<br>- Senior Software Engineer (Python, Go, Elixir)<br>- Senior FullStack Engineer (Python, Django)<br>- Senior FrontEnd Engineer (React)<br>- Blockchain Developer<br>- Data Scientist &#x2F; Blockchain Analyst<br>Feel free to drop me a mail: sebastian at defytrends.tech",
      date_posted: "2022-04-01T20:36:00Z",
      keywords: [
        "node",
        "elixir",
        "python",
        "flink",
        "django",
        "blockchain",
        "k8s",
        "react",
        "javascript",
      ],
      source: "Hn",
    },
  ],
};
// https://findwork.dev/api/jobs/?location=orlando
const JOBS_NOT_FOUND = { count: 0, next: null, previous: null, results: [] };

describe("Job Location API", () => {
  before(() => {
    nock.disableNetConnect();
    nock.enableNetConnect("127.0.0.1");
  });
  after(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("Statically serves front-end files", () => {
    it('should statically serve index.html on "/"', async () => {
      const html = await fs.readFile("./public/index.html", "UTF-8");
      const response = await request(app)
        .get("/")
        .expect("content-type", /html/g)
        .expect(200);
      expect(response.text).to.eq(html);
    });
    it('should statically serve index.js on "/index.js"', async () => {
      const script = await fs.readFile("./public/index.js", "UTF-8");
      const response = await request(app)
        .get("/index.js")
        .expect("content-type", /javascript/g)
        .expect(200);
      expect(response.text).to.eq(script);
    });
    it('should statically serve style.css on "/style.css"', async () => {
      const styles = await fs.readFile("./public/style.css", "UTF-8");
      const response = await request(app)
        .get("/style.css")
        .expect("content-type", /css/g)
        .expect(200);
      expect(response.text).to.eq(styles);
    });
  });
  describe("GET /api/city/:city", () => {
    describe("Jobs and City found", () => {
      beforeEach(() => {
        nock("https://gist.githubusercontent.com")
          .get(
            "/mynar7/089f0832b9a6c42d64bf5bc7bd690952/raw/8ccdf19e5c243afad023503a1f73f2bc1f245da1/teleport.json",
          )
          .reply(200, CITY_INFO);
        nock("https://findwork.dev")
          .get("/api/jobs/")
          .query({ location: "orlando" })
          .reply(200, JOB_RESULTS);
      });
      it('should return 200 status and "jobs" and "cityInfo" properties in JSON response object', async () => {
        const response = await request(app)
          .get("/api/city/orlando")
          .expect(200)
          .expect("Content-Type", /json/);
        const { jobs, cityInfo } = response.body;
        expect(jobs).to.exist;
        expect(cityInfo).to.exist;
      });

      it('should return 200 status and job results as under "jobs" property in JSON response object', async () => {
        const response = await request(app)
          .get("/api/city/orlando")
          .expect(200)
          .expect("Content-Type", /json/);
        const { jobs } = response.body;
        expect(jobs).to.exist;
        expect(jobs).to.deep.eq(JOB_RESULTS.results);
      });
      it('should return 200 status and city info as under "cityInfo" property in JSON response object', async () => {
        const response = await request(app)
          .get("/api/city/orlando")
          .expect(200)
          .expect("Content-Type", /json/);
        const { cityInfo } = response.body;
        expect(cityInfo).to.exist;
        expect(cityInfo).to.deep.eq(
          CITY_INFO_UTIL_RESPONSE,
        );
      });
    });
    describe("Jobs found but no city info found", () => {
      beforeEach(() => {
        nock("https://gist.githubusercontent.com")
          .get(
            "/mynar7/089f0832b9a6c42d64bf5bc7bd690952/raw/8ccdf19e5c243afad023503a1f73f2bc1f245da1/teleport.json",
          )
          .reply(200, CITY_NO_INFO);
        nock("https://findwork.dev")
          .get("/api/jobs/")
          .query({ location: "orlando" })
          .reply(200, JOB_RESULTS);
      });
      it('should return 200 status and "jobs" and "cityInfo" properties in JSON response object', async () => {
        const response = await request(app)
          .get("/api/city/orlando")
          .expect(200)
          .expect("Content-Type", /json/);
        const { jobs, cityInfo } = response.body;
        expect(jobs).to.exist;
        expect(cityInfo).to.exist;
      });

      it('should return 200 status and job results as under "jobs" property in JSON response object', async () => {
        const response = await request(app)
          .get("/api/city/orlando")
          .expect(200)
          .expect("Content-Type", /json/);
        const { jobs } = response.body;
        expect(jobs).to.exist;
        expect(jobs).to.deep.eq(JOB_RESULTS.results);
      });
      it('should return 200 status and false for "cityInfo" property in JSON response object', async () => {
        const response = await request(app)
          .get("/api/city/orlando")
          .expect(200)
          .expect("Content-Type", /json/);
        const { cityInfo } = response.body;
        expect(cityInfo).to.exist;
        expect(cityInfo).to.eq(false);
      });
    });
    describe("City info found but no jobs found", () => {
      beforeEach(() => {
        nock("https://gist.githubusercontent.com")
          .get(
            "/mynar7/089f0832b9a6c42d64bf5bc7bd690952/raw/8ccdf19e5c243afad023503a1f73f2bc1f245da1/teleport.json",
          )
          .reply(200, CITY_INFO);
        nock("https://findwork.dev")
          .get("/api/jobs/")
          .query({ location: "orlando" })
          .reply(200, JOBS_NOT_FOUND);
      });
      it('should return 200 status and "jobs" and "cityInfo" properties in JSON response object', async () => {
        const response = await request(app)
          .get("/api/city/orlando")
          .expect(200)
          .expect("Content-Type", /json/);
        const { jobs, cityInfo } = response.body;
        expect(jobs).to.exist;
        expect(cityInfo).to.exist;
      });

      it('should return 200 status and false for "jobs" property in JSON response object', async () => {
        const response = await request(app)
          .get("/api/city/orlando")
          .expect(200)
          .expect("Content-Type", /json/);
        const { jobs } = response.body;
        expect(jobs).to.exist;
        expect(jobs).to.eq(false);
      });
      it('should return 200 status and city info in "cityInfo" property in JSON response object', async () => {
        const response = await request(app)
          .get("/api/city/orlando")
          .expect(200)
          .expect("Content-Type", /json/);
        const { cityInfo } = response.body;
        expect(cityInfo).to.exist;
        expect(cityInfo).to.deep.eq(
          CITY_INFO_UTIL_RESPONSE
        );
      });
    });
    describe("No Jobs or City info found", () => {
      beforeEach(() => {
        nock("https://gist.githubusercontent.com")
          .get(
            "/mynar7/089f0832b9a6c42d64bf5bc7bd690952/raw/8ccdf19e5c243afad023503a1f73f2bc1f245da1/teleport.json",
          )
          .reply(200, CITY_NO_INFO);
        nock("https://findwork.dev")
          .get("/api/jobs/")
          .query({ location: "orlando" })
          .reply(200, JOBS_NOT_FOUND);
      });
      it("should return a 404 status code and JSON response", async () => {
        await request(app)
          .get("/api/city/orlando")
          .expect(404)
          .expect("Content-Type", /json/);
      });

      it('should return "error" property in JSON response object', async () => {
        const response = await request(app)
          .get("/api/city/orlando")
          .expect(404)
          .expect("Content-Type", /json/);
        const { jobs, cityInfo, error } = response.body;
        expect(jobs).to.not.exist;
        expect(cityInfo).to.not.exist;
        expect(error).to.exist;
      });
    });
    describe("External API non-200 responses", () => {
      for (const code of [401, 403, 404, 500]) {
        it(`should return a 404 status and JSON response of {error: "some message"} if both APIs return ${code}`, async () => {
          nock("https://gist.githubusercontent.com")
            .get(
              "/mynar7/089f0832b9a6c42d64bf5bc7bd690952/raw/8ccdf19e5c243afad023503a1f73f2bc1f245da1/teleport.json",
            )
            .reply(code, CITY_INFO);
          nock("https://findwork.dev")
            .get("/api/jobs/")
            .query(true)
            .reply(code, JOB_RESULTS);
          const response = await request(app)
            .get("/api/city/orlando")
            .expect(404)
            .expect("Content-Type", /json/);
          const { jobs, cityInfo, error } = response.body;
          expect(jobs).to.not.exist;
          expect(cityInfo).to.not.exist;
          expect(error).to.exist;
        });
        it(`should return a 200 status and JSON response of {cityInfo: <city info>, jobs: false} if jobs API returns ${code}`, async () => {
          nock("https://gist.githubusercontent.com")
            .get(
              "/mynar7/089f0832b9a6c42d64bf5bc7bd690952/raw/8ccdf19e5c243afad023503a1f73f2bc1f245da1/teleport.json",
            )
            .reply(200, CITY_INFO);
          nock("https://findwork.dev")
            .get("/api/jobs/")
            .query(true)
            .reply(code, JOB_RESULTS);
          const response = await request(app)
            .get("/api/city/orlando")
            .expect(200)
            .expect("Content-Type", /json/);
          const { jobs, cityInfo, error } = response.body;
          expect(jobs).to.exist;
          expect(jobs).to.eq(false);
          expect(cityInfo).to.exist;
          expect(cityInfo).to.not.eq(false);
          expect(error).to.not.exist;
        });
        it(`should return a 200 status and JSON response of {cityInfo: false, jobs: <job info>} if city info API returns ${code}`, async () => {
          nock("https://gist.githubusercontent.com")
            .get(
              "/mynar7/089f0832b9a6c42d64bf5bc7bd690952/raw/8ccdf19e5c243afad023503a1f73f2bc1f245da1/teleport.json",
            )
            .reply(code, CITY_INFO);
          nock("https://findwork.dev")
            .get("/api/jobs/")
            .query(true)
            .reply(200, JOB_RESULTS);
          const response = await request(app)
            .get("/api/city/orlando")
            .expect(200)
            .expect("Content-Type", /json/);
          const { jobs, cityInfo, error } = response.body;
          expect(jobs).to.exist;
          expect(jobs).to.not.eq(false);
          expect(cityInfo).to.exist;
          expect(cityInfo).to.eq(false);
          expect(error).to.not.exist;
        });
      }
    });
  });
});
