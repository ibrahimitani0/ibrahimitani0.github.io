const savedTheme = localStorage.getItem("theme") || "light";
const root = document.documentElement;
root.setAttribute("data-theme", savedTheme);

// Update icon and profile image
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  const icon = themeToggle.querySelector("i");
  const profileImg = document.querySelector("#profileImage img");

  if (savedTheme === "light") {
    icon?.classList.replace("fa-moon", "fa-sun");
    profileImg.src = "images/pcLight.png";
  } else {
    icon?.classList.replace("fa-sun", "fa-moon");
    profileImg.src = "images/pc.png";
  }
}

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
    progress += Math.random() * 5 + 1; // random 1-5%
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

// ------------------------- Ticker skills --------------------
const track = document.getElementById("tickerTrack");

// clone content once for seamless loop
track.innerHTML += track.innerHTML;

let speed = 0.3;
let position = 0;

function animate() {
  position -= speed;

  // reset when half (because we doubled content)
  if (Math.abs(position) >= track.scrollWidth / 2) {
    position = 0;
  }
  if (window.innerWidth < 768) {
    speed = 1.5;
  }

  track.style.transform = `translateX(${position}px)`;

  requestAnimationFrame(animate);
}

animate();
// ------------------------- Time line button --------------------
function toggleDetails(button) {
  const content = button.closest(".window-content");
  const details = content.querySelector(".exp-details");
  const summary = content.querySelector(".exp-summary");

  const isOpen = details.classList.toggle("open");

  if (isOpen) {
    button.innerText = "Read Less";
  } else {
    button.innerText = "Read More";

    // scroll back to summary when closing
    summary.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}
// ---------------- Page Animations (Everything else) ----------------
function initPageAnimations() {
  // -------------------------- DARK/LIGHT MODE ------------------------
  const themeToggleBtn = document.getElementById("themeToggle");
  const icon = themeToggleBtn.querySelector("i");
  const profileImg = document.querySelector("#profileImage img");

  themeToggleBtn.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";

    if (isLight) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      icon.classList.replace("fa-sun", "fa-moon");
      profileImg.src = "images/pc.png"; // dark image
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      icon.classList.replace("fa-moon", "fa-sun");
      profileImg.src = "images/pcLight.png"; // light image
    }

    const colors = updateColors();
    canvasColors = colors.canvasColors;
    particleColors = colors.particleColors;

    shapes.forEach((shape) => {
      shape.colorBase =
        canvasColors[Math.floor(Math.random() * canvasColors.length)];
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

    const canvasColors = [
      "--canvas-primary",
      "--canvas-secondary",
      "--canvas-tertiary",
      "--canvas-red",
      "--canvas-muted",
    ].map((v) => stripAlpha(rootStyles.getPropertyValue(v).trim()));

    const particleColors = [
      "--canvas-primary",
      "--canvas-secondary",
      "--canvas-tertiary",
      "--canvas-red",
      "--canvas-muted",
    ].map((v) => stripAlpha(rootStyles.getPropertyValue(v).trim()));

    return { canvasColors, particleColors };
  }

  ({ canvasColors, particleColors } = updateColors());

  // ---------------- Hamburger ----------------
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const menuLinks = document.querySelectorAll(".nav-link");

  // open/close menu
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // close when clicking a link
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // ---------------- Smooth Scroll + Scroll Spy ----------------
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  let currentSection = "";

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      const headerHeight = document.querySelector(".main-header").offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight;

      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    });
  });

  function updateActiveNav() {
    const scrollPos = window.scrollY + 300;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        if (currentSection !== id) {
          currentSection = id;
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });
        }
      }
    });
  }

  // ---------------- Scroll Progress Dots ----------------
  const dots = document.querySelectorAll(".progress-dot");
  dots.forEach((dot) => dot.classList.remove("active"));
  if (dots[0]) dots[0].classList.add("active");

  function updateProgressDots() {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    sections.forEach((section, idx) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        dots.forEach((dot) => dot.classList.remove("active"));
        if (dots[idx]) dots[idx].classList.add("active");
      }
    });
  }

  // ---------------- Hero Section Line ----------------
  const hero = document.getElementById("hero");
  const heroLine = hero ? document.createElement("div") : null;
  if (hero && heroLine) {
    heroLine.className = "hero-line";
    hero.appendChild(heroLine);
  }
  function updateHeroLine() {
    if (!hero || !heroLine) return;
    const scrollTop = window.scrollY;
    const heroHeight = hero.offsetHeight;
    let progress = Math.min(scrollTop / heroHeight, 1);
    heroLine.style.transform = `scaleX(${progress})`;
  }

  // ---------------- Fade Sections ----------------
  const fadeSections = document.querySelectorAll(".fade-section");

  const fadeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  fadeSections.forEach((section) => {
    fadeObserver.observe(section);
  });
  // ---------------- Header Scroll ----------------
  const header = document.querySelector(".main-header");
  function updateHeaderOnScroll() {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }

  // ---------------- Typing Animation ----------------
  const name = "Ibrahim Itani";
  const nameElement = document.getElementById("typed-name");
  if (nameElement) {
    let i = 0;
    (function typeNextChar() {
      if (i < name.length) {
        nameElement.textContent += name.charAt(i++);
        setTimeout(typeNextChar, 100);
      }
    })();
  }

  // ---------------- Canvas Background Shapes ----------------
  const canvas = document.getElementById("main-canvas");
  const ctx = canvas?.getContext("2d");
  let shapes = [];
  const shapeTypes = [
    // Classic shapes
    "hexagon",
    "triangle",
    "square",
    "circle",
    "star",
    "cross",

    // Coding-inspired shapes
    "curly", // { }
    "angle", // < >
    "semicolon", // ;
    "arrow", // =>
    "bracket", // [ ]
    "plus", // +
    "minus", // -
    "hash", // #
    "parentheses", // ()
    "curly-small", // smaller { }
    "angle-small", // smaller < >
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
      this.colorBase =
        canvasColors[Math.floor(Math.random() * canvasColors.length)];
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
        // ----------------- Classic shapes -----------------
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

        // ----------------- Coding-inspired shapes -----------------
        case "curly": // { }
          ctx.moveTo(-s / 2, -s);
          ctx.bezierCurveTo(s / 2, -s, s / 2, s, -s / 2, s);
          break;

        case "angle": // < >
          ctx.moveTo(-s, -s);
          ctx.lineTo(0, 0);
          ctx.lineTo(-s, s);
          ctx.moveTo(s, -s);
          ctx.lineTo(0, 0);
          ctx.lineTo(s, s);
          break;

        case "semicolon": // ;
          ctx.arc(0, -s / 4, s / 6, 0, Math.PI * 2);
          ctx.rect(-s / 8, 0, s / 4, s / 2);
          break;

        case "arrow": // =>
          ctx.moveTo(-s, -s / 2);
          ctx.lineTo(0, 0);
          ctx.lineTo(-s, s / 2);
          ctx.moveTo(0, 0);
          ctx.lineTo(s, 0);
          break;

        case "bracket": // [ ]
          ctx.rect(-s / 2, -s, s / 4, s * 2);
          ctx.rect(s / 4, -s, s / 4, s * 2);
          break;

        case "plus": // +
          ctx.moveTo(-s / 2, 0);
          ctx.lineTo(s / 2, 0);
          ctx.moveTo(0, -s / 2);
          ctx.lineTo(0, s / 2);
          break;

        case "minus": // -
          ctx.moveTo(-s / 2, 0);
          ctx.lineTo(s / 2, 0);
          break;

        case "hash": // #
          ctx.moveTo(-s / 2, -s / 4);
          ctx.lineTo(s / 2, -s / 4);
          ctx.moveTo(-s / 2, s / 4);
          ctx.lineTo(s / 2, s / 4);
          ctx.moveTo(-s / 4, -s / 2);
          ctx.lineTo(-s / 4, s / 2);
          ctx.moveTo(s / 4, -s / 2);
          ctx.lineTo(s / 4, s / 2);
          break;

        case "parentheses": // ()
          ctx.arc(-s / 3, 0, s / 3, Math.PI * 0.5, Math.PI * 1.5);
          ctx.arc(s / 3, 0, s / 3, -Math.PI * 0.5, Math.PI * 0.5);
          break;

        case "curly-small": // tiny { }
          ctx.moveTo(-s / 3, -s / 2);
          ctx.bezierCurveTo(s / 3, -s / 2, s / 3, s / 2, -s / 3, s / 2);
          break;

        case "angle-small": // tiny <>
          ctx.moveTo(-s / 2, -s / 2);
          ctx.lineTo(0, 0);
          ctx.lineTo(-s / 2, s / 2);
          ctx.moveTo(s / 2, -s / 2);
          ctx.lineTo(0, 0);
          ctx.lineTo(s / 2, s / 2);
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
          <a class="readArticle" href="${post.link}" target="_blank">Read on Medium →</a>
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
  //----------------------- back ground blob on hover -------------------

  const glow = document.getElementById("mouse-glow");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    // smooth interpolation (the "liquid" feel)
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateGlow);
  }

  animateGlow();

  //------------------------------Experience list slide in ---------------------
  const timelineItems = document.querySelectorAll(".timeline .ex-li");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.2,
    },
  );

  timelineItems.forEach((item) => observer.observe(item));

  // ---------------- Footer Year ----------------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------------- Cursor ----------------
  const cursor = document.getElementById("cursor");
  const dot = document.getElementById("cursor-dot");

  let mCurX = 0;
  let mCurY = 0;

  let cursorX = 0;
  let cursorY = 0;

  let currentW = 32;
  let currentH = 32;
  let currentR = 50;

  let clickScale = 1;
  let isMouseDown = false;

  let activeElement = null;
  let dotHover = false;

  const interactiveSelector =
    "a, button, .view-btn, .read-more-btn, .social-icon, .gh-cell";

  // ---------------- mouse tracking ----------------
  document.addEventListener("mousemove", (e) => {
    mCurX = e.clientX;
    mCurY = e.clientY;

    dot.style.left = mCurX + "px";
    dot.style.top = mCurY + "px";
  });

  // ---------------- hover tracking ----------------

  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest(interactiveSelector);
    if (!el) return;

    activeElement = el;
    dotHover = true;
  });

  document.addEventListener("pointerout", (e) => {
    const el = e.target.closest(interactiveSelector);
    if (!el) return;

    activeElement = null;
    dotHover = false;
  });

  // ---------------- click ----------------
  document.addEventListener("mousedown", () => {
    isMouseDown = true;
  });

  document.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  // ---------------- animation loop ----------------
  function animate() {
    let targetX = mCurX;
    let targetY = mCurY;

    let targetW = 32;
    let targetH = 32;
    let targetR = 50;

    // morph into element
    if (activeElement) {
      const rect = activeElement.getBoundingClientRect();

      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;

      targetW = rect.width;
      targetH = rect.height;

      targetR =
        parseFloat(window.getComputedStyle(activeElement).borderRadius) || 0;
    }

    // smooth position
    cursorX += (targetX - cursorX) * 0.15;
    cursorY += (targetY - cursorY) * 0.15;

    // smooth morph size
    currentW += (targetW - currentW) * 0.15;
    currentH += (targetH - currentH) * 0.15;
    currentR += (targetR - currentR) * 0.15;

    // click squash
    let targetScale = isMouseDown ? 0.85 : 1;
    clickScale += (targetScale - clickScale) * 0.2;

    // apply cursor
    cursor.style.width = currentW + "px";
    cursor.style.height = currentH + "px";
    cursor.style.borderRadius = currentR + "px";

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%) scale(${clickScale})`;

    // dot hover color
    if (dotHover) {
      dot.classList.add("hover");
    } else {
      dot.classList.remove("hover");
    }

    requestAnimationFrame(animate);
  }

  animate();

  // ---------------- Unified Scroll Handler ----------------
  window.addEventListener("scroll", () => {
    updateHeaderOnScroll();
    updateProgressDots();
    updateHeroLine();
    updateActiveNav();
  });
}
