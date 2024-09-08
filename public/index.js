const form = document.querySelector('form')
const main = document.querySelector('main')
form.onsubmit = async e => {
  e.preventDefault()
  const location = e.target.location.value.trim()
  e.target.location.value = ""
  const {jobs, cityInfo} = await getJobsAndCityInfo(location)
  console.log(cityInfo)
  if (jobs || cityInfo) {
    main.innerHTML = `<h2>${location.toLowerCase()}</h2>
    <div class="results">
      ${cityInfo ? renderCityInfo(cityInfo) : ""}
      ${jobs ? renderJobs(jobs) : ""}
    </div>`
  } else {
    main.innerHTML = `<h2>Location not found</h2>
    <p style="text-align: center">Try searching again.</p>`
  }
}

async function getJobsAndCityInfo(location) {
  try {
    const response = await fetch('/api/city/' + location)
    if (response.status !== 200) return false
    const data = await response.json()
    return data
  } catch(err) {
    return false
  }
}

function renderCityInfo({
  scores,
  overall_score: overallScore
}) {
  const getBgColor = color =>
    parseInt(color.slice(1,3), 16) * 0.299 +
    parseInt(color.slice(3,5), 16) * 0.587 +
    parseInt(color.slice(5,7), 16) * 0.114
    > 110 ? '#00000000' : '#fff'
  return `<section>
    <h3>Individual Scores</h3>
    <div class="scores">
      ${scores.map(({
        name,
        color,
        score_out_of_10: score
      }) => `<div class="score-group">
      <p class="score" style="color: ${color}; background-color: ${getBgColor(color)}">
        <strong>
          ${score.toFixed(1)}/10
        </strong>
      </p>
      <p><strong>${name}</strong></p>
      </div>`).join("")}
    </div>
    <p class="overall-score">Overall Score: ${overallScore.toFixed(0)}/100</p>
  </section>`
}

function renderJobs(jobsArr) {
  return `<section>
  <h3>Job Listings</h3>
    ${jobsArr.map(({
      company_name: name,
      role,
      company_num_employees: numEmployees,
      location,
      url,
      text: description,
      date_posted: posted,
    }) => `
      <div class="listing">
        <h4>Company: ${name}</h4>
        <p>Role: ${role}</p>
        <p>Location: ${location}</p>
        ${
          numEmployees
          ? `<p>Number of Employees: ${numEmployees}</p>`
          : ""
        }
        <p>Description: ${description}</p>
        <a href="${url}" target="__BLANK">Findwork Listing</a>
        <p>Posted ${new Date(posted).toLocaleString()}</p>
      </div>
    `).join("<hr/>")}
  </section>`
}
