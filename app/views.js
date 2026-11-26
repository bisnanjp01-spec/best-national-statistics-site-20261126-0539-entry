// One render function per section of the Valdoria statistics site. Each
// returns an HTML string; the matching mount function draws its charts.
// `state` carries { year, region, chartType } from the router in app.js.

import {
  AGE_PYRAMID, CAUSES_OF_DEATH, EDUCATION_2025, GDP, GDP_PER_CAPITA,
  HEALTH_2025, INDICATORS_2025, INFLATION, LIFE_EXPECTANCY, LITERACY,
  POPULATION, POP_GROWTH, REGIONS, RELEASES, SECTORS, SOURCE_CENSUS,
  SOURCE_EDU, SOURCE_HEALTH, SOURCE_OFFICE, TRADE_2025, UNEMPLOYMENT,
  URBAN_MILLIONS, RURAL_MILLIONS,
  fmt, valueFor,
} from "./data.js";
import { barChart, donutChart, lineChart, pyramidChart } from "./charts.js";

function cite(source) {
  return `<p class="source">Source: ${source}</p>`;
}

function card(label, value, unit, note) {
  return `<div class="stat"><span class="stat-label">${label}</span><span class="stat-value">${value}</span><span class="stat-unit">${unit}</span><span class="stat-note">${note}</span></div>`;
}

function yearOptions(selected) {
  return [2020, 2021, 2022, 2023, 2024, 2025]
    .map((y) => `<option value="${y}"${y === selected ? " selected" : ""}>${y}</option>`)
    .join("");
}

function toolbar(state, note) {
  return `<div class="toolbar"><label>Reference year
    <select id="year-select" data-control="year">${yearOptions(state.year)}</select></label>
    <span class="toolbar-note">${note}</span></div>`;
}

export function renderOverview(state) {
  const y = state.year;
  const pop = valueFor(POPULATION, y);
  const gdp = valueFor(GDP, y);
  const pc = valueFor(GDP_PER_CAPITA, y);
  const un = valueFor(UNEMPLOYMENT, y);
  const le = valueFor(LIFE_EXPECTANCY, y);
  const inf = valueFor(INFLATION, y);
  return `
  <section class="hero">
    <p class="eyebrow">Republic of Valdoria · Official statistics</p>
    <h1>Valdoria in numbers</h1>
    <p class="lede">Population, economy, health and education for the Republic of Valdoria — published by the Valdoria National Statistics Office. All figures are for the reference year <strong>${y}</strong>; change the year above to explore 2020–2025.</p>
  </section>
  ${toolbar(state, "Figures below follow the selected reference year.")}
  <div class="stat-grid">
    ${card("Population", fmt(pop, 2), "million", "Valdoria Census 2025")}
    ${card("GDP", "$" + fmt(gdp, 1), "billion", "National Accounts " + y)}
    ${card("GDP per capita", "$" + pc.toLocaleString("en-US"), "", "GDP ÷ population, " + y)}
    ${card("Life expectancy", fmt(le, 1), "years", "Ministry of Health " + y)}
    ${card("Unemployment", fmt(un, 1) + "%", "of labour force", "Labour Force Survey " + y)}
    ${card("Literacy", fmt(INDICATORS_2025.literacy, 1) + "%", "age 15+", "Education Statistics 2025")}
  </div>
  <div class="panel-grid">
    <div class="panel">
      <h2>GDP, 2020–${y}</h2>
      <p class="panel-sub">Billion US dollars, current prices. The amber dot marks ${y}.</p>
      <canvas id="chart-overview-gdp" aria-label="GDP by year chart"></canvas>
      <div class="toggle" role="group" aria-label="Chart type">
        <button type="button" data-control="chart-type" data-type="line"${state.chartType === "line" ? " class=\"active\"" : ""}>Line</button>
        <button type="button" data-control="chart-type" data-type="bar"${state.chartType === "bar" ? " class=\"active\"" : ""}>Bar</button>
      </div>
      ${cite(SOURCE_OFFICE)}
    </div>
    <div class="panel">
      <h2>Latest releases</h2>
      <ul class="releases">
        ${RELEASES.map((r) => `<li><span class="release-date">${r.date}</span><span>${r.title}</span></li>`).join("")}
      </ul>
      <p class="panel-sub">Next release: National Accounts Q4 2026, 14 January 2027.</p>
    </div>
  </div>
  <div class="panel">
    <h2>At a glance — ${y}</h2>
    <p>Valdoria's economy grew every year from 2020 to 2025, from $48.9bn to $61.8bn, while unemployment fell from 6.8% to 4.1% and life expectancy rose from 74.9 to 76.4 years. Inflation peaked at 5.4% in 2022 and has eased to ${fmt(inf, 1)}% in ${y}. The population reached ${fmt(pop, 2)} million in ${y}, with 68.4% living in urban areas.</p>
    ${cite(SOURCE_OFFICE + " · " + SOURCE_CENSUS)}
  </div>`;
}

export function mountOverview(state) {
  const c = document.getElementById("chart-overview-gdp");
  if (!c) return;
  const series = GDP.filter((d) => d.year <= state.year);
  if (state.chartType === "bar") {
    barChart(c, series, { format: (v) => "$" + v.toFixed(0) + "bn", highlight: (d) => d.year === state.year });
  } else {
    lineChart(c, series, { format: (v) => "$" + v.toFixed(1) + "bn", highlightYear: state.year });
  }
}

export function renderPopulation(state) {
  const y = state.year;
  const pop = valueFor(POPULATION, y);
  const growth = POP_GROWTH.find((d) => d.year === y);
  return `
  <h1>Population</h1>
  <p class="lede">Valdoria's population and how it is changing — size, growth, age structure and where people live.</p>
  ${toolbar(state, "The headline figure follows the selected year; the pyramid is for 2025.")}
  <div class="stat-grid">
    ${card("Population " + y, fmt(pop, 2), "million", "Census 2025, revised series")}
    ${card("Growth " + y, "+" + fmt(growth ? growth.value : 0.9, 2) + "%", "per year", "Year-on-year change")}
    ${card("Urban share", fmt(INDICATORS_2025.urbanShare, 1) + "%", "of population", "Census 2025")}
    ${card("Rural share", fmt(100 - INDICATORS_2025.urbanShare, 1) + "%", "of population", "Census 2025")}
  </div>
  <div class="panel-grid">
    <div class="panel">
      <h2>Population by year, 2020–2025</h2>
      <canvas id="chart-pop-line" aria-label="Population by year chart"></canvas>
      ${cite(SOURCE_CENSUS)}
    </div>
    <div class="panel">
      <h2>Age pyramid, 2025</h2>
      <canvas id="chart-pyramid" aria-label="Age pyramid chart"></canvas>
      ${cite(SOURCE_CENSUS)}
    </div>
  </div>
  <div class="panel">
    <h2>Urban and rural</h2>
    <p>In 2025, ${fmt(URBAN_MILLIONS, 2)} million Valdorians (68.4%) lived in towns and cities and ${fmt(RURAL_MILLIONS, 2)} million (31.6%) in rural areas. The urban share has risen steadily as younger people move to the six regional capitals for work and study; the rural population is older on average, with a median age of 44 against 36 in urban areas.</p>
    ${cite(SOURCE_CENSUS)}
  </div>`;
}

export function mountPopulation(state) {
  const line = document.getElementById("chart-pop-line");
  if (line) lineChart(line, POPULATION, { format: (v) => v.toFixed(2) + "m", highlightYear: state.year });
  const pyr = document.getElementById("chart-pyramid");
  if (pyr) pyramidChart(pyr, AGE_PYRAMID, { source: SOURCE_CENSUS });
}

export function renderEconomy(state) {
  const y = state.year;
  const gdp = valueFor(GDP, y);
  const un = valueFor(UNEMPLOYMENT, y);
  const inf = valueFor(INFLATION, y);
  return `
  <h1>Economy</h1>
  <p class="lede">Output, sectors, trade, prices and jobs — the Valdorian economy from 2020 to ${y}.</p>
  ${toolbar(state, "Headline figures follow the selected year; sector shares are for 2025.")}
  <div class="stat-grid">
    ${card("GDP " + y, "$" + fmt(gdp, 1), "billion", "National Accounts " + y)}
    ${card("GDP per capita " + y, "$" + valueFor(GDP_PER_CAPITA, y).toLocaleString("en-US"), "", "GDP ÷ population")}
    ${card("Exports 2025", "$" + fmt(TRADE_2025.exports, 1) + "bn", "", "Trade surplus $" + fmt(TRADE_2025.balance, 1) + "bn")}
    ${card("Inflation " + y, fmt(inf, 1) + "%", "per year", "Consumer Price Index")}
    ${card("Unemployment " + y, fmt(un, 1) + "%", "of labour force", "Labour Force Survey")}
    ${card("Trade balance", "+$" + fmt(TRADE_2025.balance, 1) + "bn", "2025", "Exports minus imports")}
  </div>
  <div class="panel-grid">
    <div class="panel">
      <h2>GDP by year</h2>
      <canvas id="chart-gdp" aria-label="GDP by year chart"></canvas>
      <div class="toggle" role="group" aria-label="Chart type">
        <button type="button" data-control="chart-type" data-type="line"${state.chartType === "line" ? " class=\"active\"" : ""}>Line</button>
        <button type="button" data-control="chart-type" data-type="bar"${state.chartType === "bar" ? " class=\"active\"" : ""}>Bar</button>
      </div>
      ${cite(SOURCE_OFFICE)}
    </div>
    <div class="panel">
      <h2>GDP by sector, 2025</h2>
      <canvas id="chart-sectors" aria-label="GDP by sector donut chart"></canvas>
      ${cite(SOURCE_OFFICE)}
    </div>
  </div>
  <div class="panel-grid">
    <div class="panel">
      <h2>Unemployment by year</h2>
      <canvas id="chart-unemp" aria-label="Unemployment by year chart"></canvas>
      ${cite(SOURCE_OFFICE)}
    </div>
    <div class="panel">
      <h2>Inflation by year</h2>
      <canvas id="chart-infl" aria-label="Inflation by year chart"></canvas>
      ${cite(SOURCE_OFFICE)}
    </div>
  </div>`;
}

export function mountEconomy(state) {
  const gdp = document.getElementById("chart-gdp");
  if (gdp) {
    const series = GDP.filter((d) => d.year <= state.year);
    if (state.chartType === "bar") barChart(gdp, series, { format: (v) => "$" + v.toFixed(0), highlight: (d) => d.year === state.year });
    else lineChart(gdp, series, { format: (v) => "$" + v.toFixed(1) + "bn", highlightYear: state.year });
  }
  const sec = document.getElementById("chart-sectors");
  if (sec) donutChart(sec, SECTORS, { centerLabel: "100%", centerSub: "of GDP" });
  const un = document.getElementById("chart-unemp");
  if (un) lineChart(un, UNEMPLOYMENT, { format: (v) => v.toFixed(1) + "%", highlightYear: state.year, color: "#c47f1a" });
  const inf = document.getElementById("chart-infl");
  if (inf) lineChart(inf, INFLATION, { format: (v) => v.toFixed(1) + "%", highlightYear: state.year, color: "#4a7fa5" });
}

export function renderHealth(state) {
  const le = valueFor(LIFE_EXPECTANCY, state.year);
  return `
  <h1>Health</h1>
  <p class="lede">How long Valdorians live, the care available to them, and what people die of.</p>
  ${toolbar(state, "Life expectancy follows the selected year; other indicators are for 2025.")}
  <div class="stat-grid">
    ${card("Life expectancy " + state.year, fmt(le, 1), "years", "Ministry of Health")}
    ${card("Hospital beds", fmt(HEALTH_2025.bedsPer1000, 1), "per 1,000 people", "Health Report 2025")}
    ${card("Doctors", fmt(HEALTH_2025.doctorsPer1000, 1), "per 1,000 people", "Health Report 2025")}
    ${card("Nurses", fmt(HEALTH_2025.nursesPer1000, 1), "per 1,000 people", "Health Report 2025")}
    ${card("Infant mortality", fmt(HEALTH_2025.infantMortality, 1), "per 1,000 births", "Health Report 2025")}
    ${card("Health spending", fmt(HEALTH_2025.healthSpendingGdp, 1) + "%", "of GDP", "Health Report 2025")}
  </div>
  <div class="panel-grid">
    <div class="panel">
      <h2>Life expectancy, 2020–2025</h2>
      <canvas id="chart-life" aria-label="Life expectancy chart"></canvas>
      ${cite(SOURCE_HEALTH)}
    </div>
    <div class="panel">
      <h2>Causes of death, 2025</h2>
      <canvas id="chart-causes" aria-label="Causes of death donut chart"></canvas>
      ${cite(SOURCE_HEALTH)}
    </div>
  </div>
  <div class="panel">
    <h2>Care capacity</h2>
    <p>Valdoria has 4.2 hospital beds and 3.1 doctors per 1,000 people. Capacity is concentrated in the two largest regions — Northmere and Aldergate hold 44% of beds for 43% of the population — while Dunfell, the most rural region, has the lowest doctor density at 2.2 per 1,000. Infant mortality has fallen from 7.1 per 1,000 live births in 2020 to 5.4 in 2025.</p>
    ${cite(SOURCE_HEALTH)}
  </div>`;
}

export function mountHealth(state) {
  const life = document.getElementById("chart-life");
  if (life) lineChart(life, LIFE_EXPECTANCY, { format: (v) => v.toFixed(1) + " yrs", highlightYear: state.year });
  const causes = document.getElementById("chart-causes");
  if (causes) donutChart(causes, CAUSES_OF_DEATH, { centerLabel: "100%", centerSub: "of deaths" });
}

export function renderEducation(state) {
  const e = EDUCATION_2025;
  return `
  <h1>Education</h1>
  <p class="lede">Enrolment, literacy and schooling in Valdoria — from primary classrooms to university.</p>
  ${toolbar(state, "Literacy follows the selected year; other indicators are for 2025.")}
  <div class="stat-grid">
    ${card("Literacy " + state.year, fmt(valueFor(LITERACY, state.year), 1) + "%", "age 15+", "Education Statistics")}
    ${card("Primary enrolment", fmt(e.primaryEnrolment, 1) + "%", "net", "Education Statistics 2025")}
    ${card("Secondary enrolment", fmt(e.secondaryEnrolment, 1) + "%", "net", "Education Statistics 2025")}
    ${card("Tertiary enrolment", fmt(e.tertiaryEnrolment, 1) + "%", "gross", "Education Statistics 2025")}
    ${card("Mean schooling", fmt(e.meanYearsSchooling, 1), "years", "Adults aged 25+")}
    ${card("Education spending", fmt(e.spendingGdp, 1) + "%", "of GDP", "Education Statistics 2025")}
  </div>
  <div class="panel-grid">
    <div class="panel">
      <h2>Literacy, 2020–2025</h2>
      <canvas id="chart-literacy" aria-label="Literacy chart"></canvas>
      ${cite(SOURCE_EDU)}
    </div>
    <div class="panel">
      <h2>Enrolment by level, 2025</h2>
      <canvas id="chart-enrol" aria-label="Enrolment bar chart"></canvas>
      ${cite(SOURCE_EDU)}
    </div>
  </div>
  <div class="panel">
    <h2>Schooling in Valdoria</h2>
    <p>Primary schooling is near-universal at 99.1% net enrolment, and secondary enrolment reached 96.4% in 2025. Tertiary enrolment has grown fastest, from 51.2% in 2020 to 58.7% in 2025, driven by the expansion of the universities in Kestrel City and Aldergate. Valdoria spends 4.6% of GDP on education, with an average of 14.2 pupils per teacher in state schools. Adult literacy rose from 97.1% in 2020 to 98.2% in 2025, and mean years of schooling for adults aged 25 and over now stand at 12.8 years.</p>
    ${cite(SOURCE_EDU)}
  </div>`;
}

export function mountEducation(state) {
  const lit = document.getElementById("chart-literacy");
  if (lit) lineChart(lit, LITERACY, { format: (v) => v.toFixed(1) + "%", highlightYear: state.year });
  const enr = document.getElementById("chart-enrol");
  if (enr) barChart(enr, [
    { label: "Primary", value: EDUCATION_2025.primaryEnrolment },
    { label: "Secondary", value: EDUCATION_2025.secondaryEnrolment },
    { label: "Tertiary", value: EDUCATION_2025.tertiaryEnrolment },
  ], { format: (v) => v.toFixed(1) + "%" });
}

function regionRow(r) {
  const pc = Math.round((r.gdp * 1000) / r.population);
  return `<tr data-region="${r.name}">
    <td>${r.name}</td><td>${r.capital}</td>
    <td data-sort="${r.population}">${fmt(r.population, 2)}</td>
    <td data-sort="${r.gdp}">$${fmt(r.gdp, 1)}bn</td>
    <td data-sort="${pc}">$${pc.toLocaleString("en-US")}</td>
    <td data-sort="${r.urban}">${fmt(r.urban, 1)}%</td>
    <td data-sort="${r.unemployment}">${fmt(r.unemployment, 1)}%</td>
  </tr>`;
}

export function renderRegions(state) {
  const sel = state.region === "All" ? null : REGIONS.find((r) => r.name === state.region);
  const rows = REGIONS.map(regionRow).join("");
  const focus = sel
    ? `<div class="region-focus"><h2>${sel.name} — ${sel.capital}</h2>
       <p>Population <strong>${fmt(sel.population, 2)} million</strong> (${fmt((sel.population / 8.42) * 100, 1)}% of Valdoria) ·
       GDP <strong>$${fmt(sel.gdp, 1)} billion</strong> · GDP per capita <strong>$${Math.round((sel.gdp * 1000) / sel.population).toLocaleString("en-US")}</strong> ·
       urban <strong>${fmt(sel.urban, 1)}%</strong> · unemployment <strong>${fmt(sel.unemployment, 1)}%</strong>.</p></div>`
    : `<div class="region-focus"><h2>All six regions</h2>
       <p>Regional populations sum to the national total of 8.42 million and regional GDP sums to $61.8 billion. Pick a region above to focus the figures, or click a column heading to sort the table.</p></div>`;
  return `
  <h1>Regions</h1>
  <p class="lede">Valdoria's six regions — population, output and living standards, side by side.</p>
  <div class="toolbar"><label>Region
    <select id="region-select" data-control="region">
      <option value="All"${state.region === "All" ? " selected" : ""}>All regions</option>
      ${REGIONS.map((r) => `<option value="${r.name}"${state.region === r.name ? " selected" : ""}>${r.name}</option>`).join("")}
    </select></label>
    <span class="toolbar-note">The chart highlights the selected region; the table can be sorted by any column.</span></div>
  ${focus}
  <div class="panel">
    <h2>Population by region, 2025</h2>
    <canvas id="chart-regions" aria-label="Population by region chart"></canvas>
    ${cite(SOURCE_CENSUS)}
  </div>
  <div class="panel">
    <h2>Regional table, 2025</h2>
    <div class="table-wrap"><table id="regions-table">
      <thead><tr>
        <th data-sort-key="0">Region ▲▼</th><th data-sort-key="1">Capital ▲▼</th>
        <th data-sort-key="2">Population (m) ▲▼</th><th data-sort-key="3">GDP ▲▼</th>
        <th data-sort-key="4">GDP per capita ▲▼</th><th data-sort-key="5">Urban ▲▼</th>
        <th data-sort-key="6">Unemployment ▲▼</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${cite(SOURCE_OFFICE + " · " + SOURCE_CENSUS)}
  </div>`;
}

export function mountRegions(state) {
  const c = document.getElementById("chart-regions");
  if (c) {
    barChart(c, REGIONS.map((r) => ({ label: r.name, value: r.population })), {
      format: (v) => v.toFixed(2) + "m",
      highlight: (d) => d.label === state.region,
    });
  }
}
