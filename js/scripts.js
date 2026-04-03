// ---------------- Loader Screen ----------------
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const loaderPercent = document.getElementById("loaderPercent");
  const progressBar = document.querySelector(".loader-progress-bar");

  if (!loader || !loaderPercent || !progressBar) return;

  // Lock scroll
  document.body.style.overflow = "hidden";

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 4 + 1; // random 1-5%
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      // Fade out loader
      loader.style.transition = "opacity 0.5s ease, visibility 0.5s ease";
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.classList.add("hidden");
        loader.style.display = "none";

        // Unlock scroll
        document.body.style.overflow = "";

        // Initialize page animations
        initPageAnimations();
      }, 500);
    }

    loaderPercent.textContent = Math.floor(progress) + "%";
    progressBar.style.width = Math.floor(progress) + "%";
  }, 100);
});

// ---------------- Page Animations (Everything else) ----------------
function initPageAnimations() {
  // -------------------------- DARK/LIGHT MODE ------------------------
  const toggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const sliderIcon = document.querySelector(".slider .icon");

  // Apply saved theme on load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "espeon") {
    root.setAttribute("data-theme", "espeon");
    toggleBtn.checked = true;
    sliderIcon.textContent = "🌞";
  } else {
    root.removeAttribute("data-theme"); // Umbreon default
    toggleBtn.checked = false;
    sliderIcon.textContent = "🌙";
  }

  // Listen for toggle
  toggleBtn.addEventListener("change", () => {
    const isChecked = toggleBtn.checked;

    if (isChecked) {
      root.setAttribute("data-theme", "espeon");
      localStorage.setItem("theme", "espeon");
      sliderIcon.textContent = "🌞";
    } else {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "umbreon");
      sliderIcon.textContent = "🌙";
    }

    // Update shapes and particles colors dynamically if needed
    const colors = updateColors();
    hexColors = colors.hexColors;
    particleColors = colors.particleColors;

    shapes.forEach((shape) => {
      shape.colorBase = hexColors[Math.floor(Math.random() * hexColors.length)];
    });
    heroParticles.forEach((p) => {
      p.color =
        particleColors[Math.floor(Math.random() * particleColors.length)] +
        p.alpha +
        ")";
    });
    footerParticles.forEach((p) => {
      p.color =
        particleColors[Math.floor(Math.random() * particleColors.length)] +
        p.alpha +
        ")";
    });
  });
  // ---------------- Colors Helper ----------------
  function updateColors() {
    const rootStyles = getComputedStyle(document.documentElement);
    function stripAlpha(rgba) {
      return rgba.replace(/rgba?\(([^)]+),\s*[^,]+?\)$/, "rgba($1,");
    }

    const hexColors = [
      "--headers",
      "--secondary",
      "--text-secondary",
      "--text-primary",
    ].map((v) => stripAlpha(rootStyles.getPropertyValue(v).trim()));

    const particleColors = [
      "--secondary",
      "--headers",
      "--text-secondary",
      "--text-primary",
    ].map((v) => stripAlpha(rootStyles.getPropertyValue(v).trim()));

    return { hexColors, particleColors };
  }

  ({ hexColors, particleColors } = updateColors());

  // ---------------- Hamburger ----------------
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // ---------------- Scroll Progress ----------------
  const sections = document.querySelectorAll("section");
  const dots = document.querySelectorAll(".progress-dot");
  dots.forEach((dot) => dot.classList.remove("active"));
  if (dots[0]) dots[0].classList.add("active");

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    sections.forEach((section, idx) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        dots.forEach((dot) => dot.classList.remove("active"));
        if (dots[idx]) dots[idx].classList.add("active");
      }
    });
  });

  // ---------------- Hero Section line ----------------
  const hero = document.getElementById("hero");
  if (hero) {
    const heroLine = document.createElement("div");
    heroLine.className = "hero-line";
    hero.appendChild(heroLine);

    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const heroHeight = hero.offsetHeight;
      let progress = Math.min(scrollTop / heroHeight, 1);
      heroLine.style.transform = `scaleX(${progress})`;
    });
  }

  // ---------------- Fade Sections ----------------
  const fadeSections = document.querySelectorAll(".fade-section");
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
        entry.target.classList.toggle("hidden", !entry.isIntersecting);
      });
    },
    { threshold: 0.15 },
  );
  fadeSections.forEach((section) => {
    section.classList.add("hidden");
    fadeObserver.observe(section);
  });

  // ---------------- Mini Windows ----------------
  const miniWindows = document.querySelectorAll(".mini-windows .mini-window");
  function animateMiniWindows() {
    const aboutSection = document.getElementById("about");
    if (!aboutSection) return;
    const sectionTop = aboutSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100) {
      miniWindows.forEach((win, index) => {
        setTimeout(() => win.classList.add("visible"), index * 150);
      });
    }
  }
  window.addEventListener("scroll", animateMiniWindows);
  window.addEventListener("load", animateMiniWindows);

  // ---------------- Name Typing Animation ----------------
  const name = "Ibrahim Itani";
  const nameElement = document.getElementById("typed-name");
  if (nameElement) {
    let i = 0;
    function typeNextChar() {
      if (i < name.length) {
        nameElement.textContent += name.charAt(i++);
        setTimeout(typeNextChar, 100);
      }
    }
    typeNextChar();
  }

  // ---------------- Canvas Background ----------------
  const canvas = document.getElementById("hex-canvas");
  const ctx = canvas?.getContext("2d");
  let shapes = [];
  const shapeTypes = [
    "hexagon",
    "triangle",
    "square",
    "circle",
    "star",
    "cross",
  ];
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  class Shape {
    constructor() {
      this.type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      this.size = 6 + Math.random() * 12;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.rotation = Math.random() * 2 * Math.PI;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.colorBase = hexColors[Math.floor(Math.random() * hexColors.length)];
      this.baseAlpha = 0.2 + Math.random() * 0.3;
      this.alpha = this.baseAlpha;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      const s = this.size;
      ctx.beginPath();

      switch (this.type) {
        case "hexagon":
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = s * Math.cos(angle);
            const py = s * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          break;
        case "triangle":
          for (let i = 0; i < 3; i++) {
            const angle = ((2 * Math.PI) / 3) * i - Math.PI / 2;
            const px = s * Math.cos(angle);
            const py = s * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          break;
        case "square":
          ctx.rect(-s / 2, -s / 2, s, s);
          break;
        case "circle":
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          break;
        case "star":
          for (let i = 0; i < 5; i++) {
            let angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            let x = s * Math.cos(angle);
            let y = s * Math.sin(angle);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            angle += Math.PI / 5;
            x = (s / 2) * Math.cos(angle);
            y = (s / 2) * Math.sin(angle);
            ctx.lineTo(x, y);
          }
          break;
        case "cross":
          const w = s / 3;
          ctx.rect(-w, -s, w * 2, s * 2);
          ctx.rect(-s, -w, s * 2, w * 2);
          break;
      }

      ctx.closePath();
      ctx.fillStyle = `${this.colorBase}${this.alpha})`;
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.x < -this.size) this.x = canvas.width + this.size;
      if (this.x > canvas.width + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = canvas.height + this.size;
      if (this.y > canvas.height + this.size) this.y = -this.size;

      if (sections.length) {
        let closestDistance = Infinity;
        sections.forEach((section) => {
          const distance = section.offsetTop - this.y;
          const absDistance = Math.abs(distance);
          if (absDistance < closestDistance) closestDistance = absDistance;
        });
        const fadeDistance = 150;
        this.alpha =
          closestDistance < fadeDistance
            ? (closestDistance / fadeDistance) * this.baseAlpha
            : this.baseAlpha;
      }

      this.draw();
    }
  }

  function initShapes() {
    shapes = [];
    const count = Math.floor(canvas.width / 50);
    for (let i = 0; i < count; i++) shapes.push(new Shape());
  }
  initShapes();

  function animateShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => shape.update());
    requestAnimationFrame(animateShapes);
  }
  animateShapes();

  // ---------------- Hero & Footer Particles ----------------
  const heroCanvas = document.getElementById("hero-canvas");
  const heroCtx = heroCanvas.getContext("2d");
  heroCanvas.width = window.innerWidth;
  heroCanvas.height = window.innerHeight;
  let heroParticles = [];

  const footerCanvas = document.getElementById("footer-canvas");
  const footerCtx = footerCanvas.getContext("2d");
  footerCanvas.width = footerCanvas.offsetWidth;
  footerCanvas.height = footerCanvas.offsetHeight;
  let footerParticles = [];

  function Particle(canvas, ctx, colors) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.baseSize = Math.random() * 20 + 10;
    this.size = this.baseSize;
    this.speedX = Math.random() * 0.3 - 0.15;
    this.speedY = Math.random() * 0.3 - 0.15;
    this.alpha = Math.random() * 0.5 + 0.2;
    this.color =
      colors[Math.floor(Math.random() * colors.length)] + this.alpha + ")";
    this.chars = [
      "{",
      "}",
      ";",
      "()",
      "[]",
      "<>",
      "=>",
      "const",
      "let",
      "var",
      "+",
      "-",
      "*",
      "/",
      "%",
      "!",
      "i",
      "j",
      "k",
      "||",
      "&&",
      "#",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ":)",
      ":D",
    ];
    this.char = this.chars[Math.floor(Math.random() * this.chars.length)];

    this.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -this.size) this.x = canvas.width + this.size;
      if (this.x > canvas.width + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = canvas.height + this.size;
      if (this.y > canvas.height + this.size) this.y = -this.size;
      this.size = this.baseSize + Math.sin(Date.now() / 1000 + this.x) * 3;
    };

    this.draw = function () {
      this.ctx.font = `${this.size}px "Courier New", monospace`;
      this.ctx.fillStyle = this.color;
      this.ctx.fillText(this.char, this.x, this.y);
    };
  }

  function initParticles(canvas, ctx, colors) {
    const particles = [];
    const count = Math.floor(canvas.width / 50);
    for (let i = 0; i < count; i++)
      particles.push(new Particle(canvas, ctx, colors));
    return particles;
  }

  function animateParticles(particles, canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(() => animateParticles(particles, canvas, ctx));
  }

  heroParticles = initParticles(heroCanvas, heroCtx, particleColors);
  footerParticles = initParticles(footerCanvas, footerCtx, particleColors);
  animateParticles(heroParticles, heroCanvas, heroCtx);
  animateParticles(footerParticles, footerCanvas, footerCtx);

  // ---------------- Handle Resize ----------------
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      initShapes();
      heroCanvas.width = window.innerWidth;
      heroCanvas.height = window.innerHeight;
      heroParticles = initParticles(heroCanvas, heroCtx, particleColors);
      footerCanvas.width = footerCanvas.offsetWidth;
      footerCanvas.height = footerCanvas.offsetHeight;
      footerParticles = initParticles(footerCanvas, footerCtx, particleColors);
    }, 100);
  });

  // ---------------- Medium Articles ----------------
  fetch(
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@ibrahimitani0",
  )
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("articles-container");
      data.items.forEach((post) => {
        const article = document.createElement("div");
        article.classList.add("article-window");
        article.innerHTML = `
          <div class="window-header"> 
            <h3>${post.title}</h3>
          </div>
          <p>${stripHTML(post.description).slice(0, 120)}...</p>
          <div class="meta">
            <span>${formatDate(post.pubDate)}</span>
            <span>${post.categories.join(", ")}</span>
          </div>
          <a href="${post.link}" target="_blank">Read on Medium →</a>
        `;
        container.appendChild(article);
      });
    });

  function stripHTML(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // ---------------- Footer Year ----------------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
