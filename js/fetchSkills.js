async function loadSkills() {
  try {
    const res = await fetch("skills.json");
    const data = await res.json();

    render("languages", data.languages);
    render("databases", data.databases);
    render("frameworks", data.frameworks);
    render("tools", data.tools);

    renderTicker(data);
  } catch (err) {
    console.error("Error loading skills:", err);
  }
}

// Render skills grid
function render(id, items) {
  const container = document.getElementById(id);
  if (!container) return;

  container.innerHTML = ""; // prevent duplicates

  items.forEach((skill) => {
    const el = document.createElement("div");
    el.className = "skill";

    el.innerHTML = `
      <img src="${skill.icon}" alt="${skill.name}">
      <span>${skill.name}</span>
    `;

    container.appendChild(el);
  });
}

// Render ticker
function renderTicker(data) {
  const track = document.getElementById("tickerTrack");
  if (!track) return;

  track.innerHTML = ""; // prevent duplicates

  const allSkills = [
    ...data.languages,
    ...data.databases,
    ...data.frameworks,
    ...data.tools,
  ];

  allSkills.forEach((skill) => {
    const item = document.createElement("span");
    item.className = "ticker-item";

    item.innerHTML = `
      <img src="${skill.icon}" alt="${skill.name}">
      <span class="label">${skill.name}</span>
    `;

    track.appendChild(item);
  });

  // duplicate for smooth infinite scroll
  track.innerHTML += track.innerHTML;
}

// init
loadSkills();
