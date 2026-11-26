// Hash router and control wiring for the Valdoria statistics site.
// Routes: #/overview, #/population, #/economy, #/health, #/education, #/regions.

import {
  renderOverview, mountOverview,
  renderPopulation, mountPopulation,
  renderEconomy, mountEconomy,
  renderHealth, mountHealth,
  renderEducation, mountEducation,
  renderRegions, mountRegions,
} from "./views.js";

const ROUTES = {
  "/overview": { render: renderOverview, mount: mountOverview, title: "Overview" },
  "/population": { render: renderPopulation, mount: mountPopulation, title: "Population" },
  "/economy": { render: renderEconomy, mount: mountEconomy, title: "Economy" },
  "/health": { render: renderHealth, mount: mountHealth, title: "Health" },
  "/education": { render: renderEducation, mount: mountEducation, title: "Education" },
  "/regions": { render: renderRegions, mount: mountRegions, title: "Regions" },
};

const state = { year: 2025, region: "All", chartType: "line" };
let sortState = { key: null, dir: 1 };

function currentRoute() {
  const hash = window.location.hash || "#/overview";
  const path = hash.slice(1);
  return ROUTES[path] ? path : "/overview";
}

function render() {
  const path = currentRoute();
  const route = ROUTES[path];
  const view = document.getElementById("view");
  view.innerHTML = route.render(state);
  window.scrollTo(0, 0);
  document.querySelectorAll(".nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + path);
    if (a.getAttribute("href") === "#" + path) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = "Valdoria Statistics — " + route.title;
  route.mount(state);
  wireControls();
}

function wireControls() {
  const yearSel = document.getElementById("year-select");
  if (yearSel) {
    yearSel.addEventListener("change", () => {
      state.year = parseInt(yearSel.value, 10);
      render();
    });
  }
  const regionSel = document.getElementById("region-select");
  if (regionSel) {
    regionSel.addEventListener("change", () => {
      state.region = regionSel.value;
      render();
    });
  }
  document.querySelectorAll("[data-control=\"chart-type\"]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.chartType = btn.dataset.type;
      render();
    });
  });
  document.querySelectorAll("#regions-table th").forEach((th) => {
    th.addEventListener("click", () => sortTable(parseInt(th.dataset.sortKey, 10)));
  });
}

function sortTable(key) {
  const table = document.getElementById("regions-table");
  if (!table) return;
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  if (sortState.key === key) sortState.dir *= -1;
  else sortState = { key, dir: 1 };
  const dir = sortState.dir;
  rows.sort((a, b) => {
    const ca = a.children[key];
    const cb = b.children[key];
    const na = parseFloat(ca.dataset.sort);
    const nb = parseFloat(cb.dataset.sort);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return (na - nb) * dir;
    return ca.textContent.localeCompare(cb.textContent) * dir;
  });
  rows.forEach((r) => tbody.appendChild(r));
}

window.addEventListener("hashchange", render);
render();
