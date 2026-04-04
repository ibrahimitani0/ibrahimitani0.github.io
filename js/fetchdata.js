fetch("projects.json")
  .then((res) => res.json())
  .then((projects) => {
    const container = document.getElementById("projects-container");

    projects.forEach((project) => {
      const techTags = project.technologies
        .map((tech) => `<span class="${tech.class}">${tech.name}</span>`)
        .join("");

      // Check if link is "#" and disable the button if so
      const isDisabled = project.link === "#";
      const buttonClass = isDisabled ? "view-btn disabled" : "view-btn";
      const buttonAttrs = isDisabled
        ? "onclick='return false;' aria-disabled='true'"
        : `href="${project.link}" target="_blank" rel="noopener noreferrer"`;

      const projectHTML = `
        <div class="project-window">
    
          <div class="project-image">
            <img src="${project.image}" alt="${project.alt}" />
          </div>

          <div class="project-overlay">
            <h3>${project.title} </h3>
            <span class="year">${project.date}</span>
            <p>${project.description}</p>

            <div class="tech-tags">
              ${techTags}
            </div>

            <a class="${buttonClass}" ${buttonAttrs}>
              View Project
            </a>
          </div>
        </div>
      `;

      container.insertAdjacentHTML("beforeend", projectHTML);
    });
  })
  .catch((err) => console.error(err));
