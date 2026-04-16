let githubData = [];
let selectedYear = new Date().getFullYear();

async function loadGitHubContributions() {
  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/ibrahimitani0?y=all",
    );
    const data = await res.json();
    githubData = data.contributions || [];

    const years = [
      ...new Set(githubData.map((d) => new Date(d.date).getFullYear())),
    ].sort((a, b) => b - a);
    selectedYear = years[0] || new Date().getFullYear();

    initYearToggle(years);
    initMonths(selectedYear);
    renderContributions(selectedYear);
  } catch (err) {
    console.error("Failed to load GitHub data:", err);
    document.getElementById("ghGrid").innerHTML = "Error loading data.";
  }
}

function getColor(level) {
  const colors = [
    "var(--bg-darker)", // Level 0: Empty
    "var(--gh-green-1)", // Level 1: Low
    "var(--gh-green-2)", // Level 2: Medium
    "var(--gh-green-3)", // Level 3: High
    "var(--accent)", // Level 4: Max (Your theme's green)
  ];
  return colors[level] || "var(--bg-darker)";
}

function getYearDays(year) {
  const days = [];
  const date = new Date(year, 0, 1);
  while (date.getFullYear() === year) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function renderContributions(year) {
  const container = document.getElementById("ghGrid");
  const yearLabel = document.getElementById("ghYears");
  if (!container) return;

  container.innerHTML = "";
  if (yearLabel) yearLabel.textContent = `${year} Contributions`;

  const map = new Map();
  githubData.forEach((d) => map.set(d.date.slice(0, 10), d));

  const days = getYearDays(year);
  const fragment = document.createDocumentFragment();

  // Add padding for the first week to align weekdays
  const firstDayShift = days[0].getDay();
  for (let i = 0; i < firstDayShift; i++) {
    const empty = document.createElement("div");
    empty.className = "gh-cell";
    empty.style.visibility = "hidden";
    fragment.appendChild(empty);
  }

  days.forEach((date) => {
    const key = date.toISOString().split("T")[0];
    const data = map.get(key);
    const cell = document.createElement("div");
    cell.className = "gh-cell";
    cell.style.backgroundColor = getColor(data?.level || 0);
    cell.title = `${key}: ${data?.count || 0} contributions`;
    fragment.appendChild(cell);
  });
  // Scroll to the end of the grid on mobile so user sees recent activity first
  if (window.innerWidth < 600) {
    const outer = document.querySelector(".gh-graph-outer");
    outer.scrollLeft = outer.scrollWidth;
  }

  container.appendChild(fragment);
}

function initMonths(year) {
  const container = document.getElementById("ghMonths");
  if (!container) return;
  container.innerHTML = "";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Find the first day of the year and the Sunday that starts the grid
  const firstDayOfYear = new Date(year, 0, 1);
  const startDay = new Date(firstDayOfYear);
  startDay.setDate(firstDayOfYear.getDate() - firstDayOfYear.getDay());

  let lastMonth = -1;

  // We loop through 53 potential columns
  for (let col = 1; col <= 53; col++) {
    const currentWeekDate = new Date(startDay);
    currentWeekDate.setDate(startDay.getDate() + (col - 1) * 7);

    const month = currentWeekDate.getMonth();

    // If this week starts a new month, create a label
    if (month !== lastMonth && currentWeekDate.getFullYear() === year) {
      const span = document.createElement("span");
      span.textContent = months[month];
      // Force the span to start at exactly this column index
      span.style.gridColumnStart = col;
      container.appendChild(span);
      lastMonth = month;
    }
  }
}

function initYearToggle(years) {
  const container = document.getElementById("ghYearToggle");
  if (!container) return;
  container.innerHTML = "";

  // Optional: only show the last 8 years to keep the UI clean
  const visibleYears = years.slice(0, 8);

  visibleYears.forEach((year) => {
    const btn = document.createElement("button");
    // Initial class setup
    btn.className = "gh-year-btn";
    if (year === selectedYear) btn.classList.add("active");

    btn.textContent = year;

    btn.onclick = () => {
      selectedYear = year;

      // Update UI classes
      document
        .querySelectorAll(".gh-year-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Refresh Chart
      initMonths(year);
      renderContributions(year);
    };

    container.appendChild(btn);
  });
}

loadGitHubContributions();
