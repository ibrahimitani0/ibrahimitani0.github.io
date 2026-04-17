fetch("projects.json")
  .then((res) => res.json())
  .then((projects) => {
    const container = document.getElementById("projects-container");

    projects.forEach((project) => {
      const techTags = project.technologies
        .map((tech) => `<span class="${tech.class}">${tech.name}</span>`)
        .join("");

      const isDisabled = project.link === "#";
      const buttonClass = isDisabled ? "view-btn disabled" : "view-btn";
      const buttonAttrs = isDisabled
        ? "onclick='return false;' aria-disabled='true'"
        : `href="${project.link}" target="_blank" rel="noopener noreferrer"`;

      // CHECK: Only create video HTML if project.video exists in JSON
      const videoHTML = project.video
        ? `<video class="hover-video" muted loop playsinline preload="none">
             <source src="${project.video}" type="video/webm">
           </video>`
        : "";

      const projectHTML = `
        <div class="project-window">
          <div class="project-image">
            <img src="${project.image}" alt="${project.alt}" class="static-thumb" />
            ${videoHTML}
          </div>

          <div class="project-overlay">
            <h3>${project.title}</h3>
            <span class="year">${project.date}</span>
            <p>${project.description}</p>
            <div class="tech-tags">${techTags}</div>
            <a class="${buttonClass}" ${buttonAttrs}>
              View Project <span class="arrow">→</span>
            </a>
          </div>
        </div>
      `;

      container.insertAdjacentHTML("beforeend", projectHTML);
    });

    const cards = container.querySelectorAll(".project-window");
    cards.forEach((card) => {
      const video = card.querySelector(".hover-video");

      card.addEventListener("mouseenter", () => {
        if (video) {
          video.play().catch((err) => console.warn("Video play blocked", err));
        }
      });

      card.addEventListener("mouseleave", () => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    });
  })
  .catch((err) => console.error(err));
