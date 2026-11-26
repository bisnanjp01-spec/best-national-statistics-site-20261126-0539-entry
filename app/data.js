// Valdoria National Statistics Office — all figures are fictional, for the
// Republic of Valdoria. Every derived figure agrees with its inputs:
// GDP per capita = GDP / population, regional populations sum to the national
// total, regional GDP sums to national GDP, sector shares sum to 100% and
// causes-of-death shares sum to 100%.

export const SOURCE_OFFICE = "Valdoria National Statistics Office, 2026";
export const SOURCE_CENSUS = "Valdoria Census 2025";
export const SOURCE_HEALTH = "Valdoria Ministry of Health, Annual Health Report 2025";
export const SOURCE_EDU = "Valdoria Ministry of Education, Education Statistics 2025";

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

// Population in millions.
export const POPULATION = [
  { year: 2020, value: 8.06 },
  { year: 2021, value: 8.13 },
  { year: 2022, value: 8.21 },
  { year: 2023, value: 8.29 },
  { year: 2024, value: 8.36 },
  { year: 2025, value: 8.42 },
];

// GDP in billion US dollars (current prices).
export const GDP = [
  { year: 2020, value: 48.9 },
  { year: 2021, value: 52.4 },
  { year: 2022, value: 55.8 },
  { year: 2023, value: 58.2 },
  { year: 2024, value: 59.9 },
  { year: 2025, value: 61.8 },
];

// GDP per capita in US dollars, derived as GDP / population.
export const GDP_PER_CAPITA = GDP.map((g, i) => ({
  year: g.year,
  value: Math.round((g.value * 1000) / POPULATION[i].value),
}));

// Unemployment rate, percent of labour force.
export const UNEMPLOYMENT = [
  { year: 2020, value: 6.8 },
  { year: 2021, value: 5.9 },
  { year: 2022, value: 5.1 },
  { year: 2023, value: 4.7 },
  { year: 2024, value: 4.4 },
  { year: 2025, value: 4.1 },
];

// Consumer price inflation, percent per year.
export const INFLATION = [
  { year: 2020, value: 1.8 },
  { year: 2021, value: 2.6 },
  { year: 2022, value: 5.4 },
  { year: 2023, value: 4.1 },
  { year: 2024, value: 2.9 },
  { year: 2025, value: 2.3 },
];

// Life expectancy at birth, years.
export const LIFE_EXPECTANCY = [
  { year: 2020, value: 74.9 },
  { year: 2021, value: 75.2 },
  { year: 2022, value: 75.6 },
  { year: 2023, value: 75.9 },
  { year: 2024, value: 76.1 },
  { year: 2025, value: 76.4 },
];

// Latest headline indicators (2025, unless noted).
export const INDICATORS_2025 = {
  population: 8.42, // million
  gdp: 61.8, // USD billion
  gdpPerCapita: 7340, // USD
  lifeExpectancy: 76.4, // years
  unemployment: 4.1, // percent
  literacy: 98.2, // percent, age 15+
  inflation: 2.3, // percent
  urbanShare: 68.4, // percent
};

// Urban/rural split, 2025: 68.4% urban = 5.76m, 31.6% rural = 2.66m of 8.42m.
export const URBAN_MILLIONS = 5.76;
export const RURAL_MILLIONS = 2.66;
export const POP_GROWTH = POPULATION.slice(1).map((p, i) => ({
  year: p.year,
  value: +(((p.value - POPULATION[i].value) / POPULATION[i].value) * 100).toFixed(2),
}));

// Age structure, 2025, millions. Male + female = 8.42.
export const AGE_PYRAMID = [
  { group: "0–14", male: 0.72, female: 0.69 },
  { group: "15–24", male: 0.55, female: 0.53 },
  { group: "25–44", male: 1.24, female: 1.21 },
  { group: "45–64", male: 1.08, female: 1.10 },
  { group: "65+", male: 0.55, female: 0.75 },
];

// GDP by sector, percent of GDP, 2025. Sums to 100.
export const SECTORS = [
  { name: "Services", share: 58.4 },
  { name: "Industry", share: 24.6 },
  { name: "Agriculture", share: 9.8 },
  { name: "Construction", share: 7.2 },
];

// Trade, USD billion, 2025.
export const TRADE_2025 = { exports: 24.6, imports: 22.9, balance: 1.7 };

// Health indicators, 2025.
export const HEALTH_2025 = {
  bedsPer1000: 4.2,
  doctorsPer1000: 3.1,
  nursesPer1000: 7.8,
  infantMortality: 5.4, // per 1,000 live births
  healthSpendingGdp: 7.1, // percent of GDP
};

// Causes of death, percent of all deaths, 2025. Sums to 100.
export const CAUSES_OF_DEATH = [
  { name: "Cardiovascular diseases", share: 34.2 },
  { name: "Cancer", share: 24.8 },
  { name: "Respiratory diseases", share: 11.6 },
  { name: "Injuries", share: 6.9 },
  { name: "Diabetes", share: 4.8 },
  { name: "All other causes", share: 17.7 },
];

// Education indicators, 2025.
export const EDUCATION_2025 = {
  literacy: 98.2, // percent, age 15+
  primaryEnrolment: 99.1, // net, percent
  secondaryEnrolment: 96.4, // net, percent
  tertiaryEnrolment: 58.7, // gross, percent
  meanYearsSchooling: 12.8,
  spendingGdp: 4.6, // percent of GDP
  pupilsPerTeacher: 14.2,
};

// Literacy rate by year, percent, age 15+.
export const LITERACY = [
  { year: 2020, value: 97.1 },
  { year: 2021, value: 97.4 },
  { year: 2022, value: 97.6 },
  { year: 2023, value: 97.9 },
  { year: 2024, value: 98.0 },
  { year: 2025, value: 98.2 },
];

// Six regions. Populations sum to 8.42m; GDP sums to $61.8bn (2025).
export const REGIONS = [
  { name: "Northmere", capital: "Kestrel City", population: 1.86, gdp: 15.9, urban: 74.1, unemployment: 3.6 },
  { name: "Aldergate", capital: "Aldergate", population: 1.74, gdp: 14.2, urban: 81.3, unemployment: 3.9 },
  { name: "Caerlon", capital: "Port Caerlon", population: 1.52, gdp: 11.6, urban: 69.8, unemployment: 4.2 },
  { name: "Ostara", capital: "Ostara", population: 1.24, gdp: 8.1, urban: 62.5, unemployment: 4.4 },
  { name: "Veymar", capital: "Veymar", population: 1.18, gdp: 7.4, urban: 58.9, unemployment: 4.8 },
  { name: "Dunfell", capital: "Dunfell", population: 0.88, gdp: 4.6, urban: 51.2, unemployment: 5.3 },
];

// Latest releases (fictional publication schedule).
export const RELEASES = [
  { date: "26 Nov 2026", title: "Labour Force Survey, Q3 2026 — unemployment steady at 4.1%" },
  { date: "18 Nov 2026", title: "Consumer Price Index, October 2026 — inflation 2.3% year on year" },
  { date: "04 Nov 2026", title: "Regional GDP 2025 — Northmere remains the largest regional economy" },
  { date: "21 Oct 2026", title: "Valdoria Census 2025 — final population count 8.42 million" },
  { date: "07 Oct 2026", title: "Education Statistics 2025 — literacy reaches 98.2%" },
  { date: "23 Sep 2026", title: "National Accounts 2025 — GDP $61.8 billion, growth 3.2%" },
];

export function valueFor(series, year) {
  const row = series.find((d) => d.year === year);
  return row ? row.value : null;
}

export function fmt(n, decimals = 1) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
