async function loadSkills() {
  try {
    const res = await fetch("skills.json");
    const data = await res.json();

    render("languages", data.languages);
    render("frameworks", data.frameworks);
    render("databases", data.databases);
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

// init
loadSkills();
