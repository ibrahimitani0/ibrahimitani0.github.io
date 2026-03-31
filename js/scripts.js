document.addEventListener("DOMContentLoaded", () => {
  // ---------------- Scroll Progress ----------------
  const sections = document.querySelectorAll("section");
  const dots = document.querySelectorAll(".progress-dot");

  // Initially activate the first dot (hero)
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

  // Create the line inside hero
  const heroLine = document.createElement("div");
  heroLine.className = "hero-line";
  hero.appendChild(heroLine);

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const heroHeight = hero.offsetHeight;

    // 0 → 1 ratio for scroll progress
    let progress = Math.min(scrollTop / heroHeight, 1);

    // Apply scaleX
    heroLine.style.transform = `scaleX(${progress})`;
  });

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

  // ---------------- Mini Window ----------------
  const miniWindows = document.querySelectorAll(".mini-windows .mini-window"); // updated selector

  function animateMiniWindows() {
    const aboutSection = document.getElementById("about");
    const sectionTop = aboutSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100) {
      // trigger slightly before fully visible
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
  let i = 0;
  function typeNextChar() {
    if (i < name.length) {
      nameElement.textContent += name.charAt(i++);
      setTimeout(typeNextChar, 100);
    }
  }
  typeNextChar();

  // ---------------- Project Bounce Animation ----------------
  function handleScrollAnimation() {
    const projects = document.querySelectorAll(".project");
    projects.forEach((el) => {
      const inView = el.getBoundingClientRect().top < window.innerHeight - 100;
      el.classList.toggle("visible", inView);
      el.classList.toggle("not-visible", !inView);
    });
  }
  window.addEventListener("scroll", handleScrollAnimation);
  handleScrollAnimation();

  // ---------------- Hero Canvas Particles ----------------
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");
  let particlesArray = [];

  function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  initCanvas();
  window.addEventListener("resize", () => {
    initCanvas();
    initParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseSize = Math.random() * 20 + 10; // font size instead of circle size
      this.size = this.baseSize;
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = Math.random() * 0.3 - 0.15;
      this.alpha = Math.random() * 0.5 + 0.2;

      // Umbreon colors
      const colorOptions = [
        "rgba(255, 221, 0,", // yellow
        "rgba(255, 0, 0,", // red
        "rgba(50,50,50,", // dark grey subtle
        "rgb(253, 231, 231,",
      ];
      this.color =
        colorOptions[Math.floor(Math.random() * colorOptions.length)] +
        this.alpha +
        ")";

      // Coding characters
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
        "||",
        "&&",
        "#",
        "0",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "9",
      ];
      this.char = this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -this.size) this.x = canvas.width + this.size;
      if (this.x > canvas.width + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = canvas.height + this.size;
      if (this.y > canvas.height + this.size) this.y = -this.size;
      this.size = this.baseSize + Math.sin(Date.now() / 1000 + this.x) * 3;
    }

    draw() {
      ctx.font = `${this.size}px "Courier New", monospace`;
      ctx.fillStyle = this.color;
      ctx.fillText(this.char, this.x, this.y);
    }
  }

  function initParticles() {
    particlesArray = [];
    const count = Math.floor(canvas.width / 50);
    for (let i = 0; i < count; i++) particlesArray.push(new Particle());
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ---------------- Footer Particles ----------------
  const footerCanvas = document.getElementById("footer-canvas");
  const fCtx = footerCanvas.getContext("2d");
  let footerParticles = [];

  function initFooterCanvas() {
    footerCanvas.width = footerCanvas.offsetWidth;
    footerCanvas.height = footerCanvas.offsetHeight;
  }
  initFooterCanvas();
  window.addEventListener("resize", () => {
    initFooterCanvas();
    initFooterParticles();
  });

  // Reuse your Particle class or create FooterParticle for customization
  class FooterParticle {
    constructor() {
      this.x = Math.random() * footerCanvas.width;
      this.y = Math.random() * footerCanvas.height;
      this.baseSize = Math.random() * 20 + 10;
      this.size = this.baseSize;
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = Math.random() * 0.3 - 0.15;
      this.alpha = Math.random() * 0.5 + 0.2;

      const colorOptions = [
        "rgba(255, 221, 0,",
        "rgba(255, 0, 0,",
        "rgba(50,50,50,",
        "rgb(253, 231, 231,",
      ];
      this.color =
        colorOptions[Math.floor(Math.random() * colorOptions.length)] +
        this.alpha +
        ")";
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
        "||",
        "&&",
        "#",
        "0",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "9",
      ];
      this.char = this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -this.size) this.x = footerCanvas.width + this.size;
      if (this.x > footerCanvas.width + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = footerCanvas.height + this.size;
      if (this.y > footerCanvas.height + this.size) this.y = -this.size;
      this.size = this.baseSize + Math.sin(Date.now() / 1000 + this.x) * 3;
    }

    draw() {
      fCtx.font = `${this.size}px "Courier New", monospace`;
      fCtx.fillStyle = this.color;
      fCtx.fillText(this.char, this.x, this.y);
    }
  }

  function initFooterParticles() {
    footerParticles = [];
    const count = Math.floor(footerCanvas.width / 50);
    for (let i = 0; i < count; i++) footerParticles.push(new FooterParticle());
  }
  initFooterParticles();

  function animateFooterParticles() {
    fCtx.clearRect(0, 0, footerCanvas.width, footerCanvas.height);
    footerParticles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateFooterParticles);
  }
  animateFooterParticles();

  // ---------------- Sparks for Cards ----------------
  const cards = document.querySelectorAll(".card-3d");
  cards.forEach((card) => {
    const canvas = card.querySelector(".card-sparks");
    const ctx = canvas.getContext("2d");
    function resizeCanvas() {
      canvas.width = card.offsetWidth;
      canvas.height = card.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const sparks = [];
    const sparkCount = 50;
    const colors = [
      "#1a1a1a",
      "#ffdd00",
      "#a55656",
      "#4b0082",
      "#b69999",
      "#fde7e7",
    ];
    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        x: Math.random() * canvas.width,
        y: canvas.height - Math.random() * 80,
        radius: Math.random() * 3 + 1,
        speedY: Math.random() * 0.6 + 0.3,
        speedX: Math.random() * 0.4 - 0.2,
        alpha: Math.random() * 0.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(s.color)},${s.alpha})`;
        ctx.fill();
        s.y -= s.speedY;
        s.x += s.speedX;
        s.alpha -= 0.005;
        if (s.alpha <= 0) {
          s.x = Math.random() * canvas.width;
          s.y = canvas.height - Math.random() * 40;
          s.radius = Math.random() * 3 + 1;
          s.speedY = Math.random() * 0.6 + 0.3;
          s.speedX = Math.random() * 0.4 - 0.2;
          s.alpha = Math.random() * 0.5 + 0.3;
          s.color = colors[Math.floor(Math.random() * colors.length)];
        }
      });
      requestAnimationFrame(animate);
    }
    animate();
  });

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  }

  // ------------------- Hexagon background ---------------------------

  const hexCanvas = document.getElementById("hex-canvas");
  const hexCtx = hexCanvas.getContext("2d");
  let hexagons = [];

  function resizeHexCanvas() {
    hexCanvas.width = window.innerWidth;
    hexCanvas.height = window.innerHeight;
  }
  resizeHexCanvas();
  window.addEventListener("resize", () => {
    resizeHexCanvas();
    initHexagons();
  });

  // Define the colors you want
  const colors = [
    "rgba(165, 86, 86,", // red
    "rgba(255, 221, 0,", // yellow
  ];

  class Hexagon {
    constructor() {
      this.size = 20 + Math.random() * 30;
      this.x = Math.random() * hexCanvas.width;
      this.y = Math.random() * hexCanvas.height;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;

      const colorChoice = colors[Math.floor(Math.random() * colors.length)];
      this.colorBase = colorChoice;
    }

    draw() {
      const s = this.size;
      hexCtx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = this.x + s * Math.cos(angle);
        const py = this.y + s * Math.sin(angle);
        i === 0 ? hexCtx.moveTo(px, py) : hexCtx.lineTo(px, py);
      }
      hexCtx.closePath();

      // Compute alpha based on closest section above the hex
      let alpha = 0.15; // max alpha
      const fadeDistance = 200; // distance over which it fades

      if (sections.length) {
        // Find the closest section below the hexagon
        let minDistance = Infinity;
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const distance = sectionTop - this.y;
          if (distance >= 0 && distance < minDistance) minDistance = distance;
        });

        if (minDistance < Infinity) {
          alpha = Math.min(minDistance / fadeDistance, 1) * 0.15;
        }
      }

      hexCtx.fillStyle = `${this.colorBase}${alpha})`;
      hexCtx.fill();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < -this.size) this.x = hexCanvas.width + this.size;
      if (this.x > hexCanvas.width + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = hexCanvas.height + this.size;
      if (this.y > hexCanvas.height + this.size) this.y = -this.size;

      this.draw();
    }
  }

  function initHexagons() {
    hexagons = [];
    const count = Math.floor(hexCanvas.width / 50); // adjust density
    for (let i = 0; i < count; i++) hexagons.push(new Hexagon());
  }
  initHexagons();

  function animateHexagons() {
    hexCtx.clearRect(0, 0, hexCanvas.width, hexCanvas.height);
    hexagons.forEach((hex) => hex.update());
    requestAnimationFrame(animateHexagons);
  }
  animateHexagons();

  // ---------------- Footer Year ----------------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
