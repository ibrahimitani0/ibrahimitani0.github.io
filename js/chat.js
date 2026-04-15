/* -----------------------------
   CORE UI & SAFETY
------------------------------*/
const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");
const chatClose = document.getElementById("chat-close");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

if (!chatToggle || !chatBox || !chatMessages || !chatInput || !chatSend) {
  console.error("Chat UI elements missing");
}

/* -----------------------------
   DATA STATE
------------------------------*/
const mySkills = [
  "java",
  "spring",
  "spring boot",
  "angular",
  "javascript",
  "typescript",
  "html",
  "css",
  "sql",
  "oracle",
  "mysql",
  "postgresql",
  "mongodb",
  "aws",
  "gcp",
  "git",
  "github",
  "node",
  "python",
  "docker",
  "rest",
  "api",
];
let projectsData = [];

async function loadProjects() {
  try {
    const res = await fetch("projects.json");
    projectsData = await res.json();
  } catch (err) {
    console.warn("Projects not loaded yet or missing projects.json");
  }
}
loadProjects();

/* -----------------------------
   HELPER FUNCTIONS
------------------------------*/
function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.classList.add("msg", type);
  // Use innerHTML if you want to support line breaks (\n -> <br>)
  msg.innerText = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* -----------------------------
   LOGIC ENGINES
------------------------------*/

function getIntent(msg) {
  const text = msg.toLowerCase();
  const jobKeywords = [
    "job description",
    "requirements",
    "looking for",
    "responsibilities",
  ];

  if (jobKeywords.some((k) => text.includes(k)) || text.length > 200)
    return "job_match";
  if (/hi|hello|hey/.test(text)) return "greeting";
  if (/project|work|built|portfolio/.test(text)) return "projects";
  if (/skill|stack|tech|know/.test(text)) return "skills";
  if (/experience|career|history/.test(text)) return "experience";
  if (/contact|email|reach|linkedin/.test(text)) return "contact";
  if (/fit|hire|role|recruit/.test(text)) return "role";
  return "unknown";
}

function findProjects(input) {
  const text = input.toLowerCase().trim();

  if (text.length < 3) return null;

  const matches = projectsData.filter(
    (p) =>
      p.title.toLowerCase().includes(text) ||
      p.technologies?.some((t) => text.includes((t.name || "").toLowerCase())),
  );

  if (!matches.length) return null;

  return (
    "Relevant Projects:\n\n" +
    matches.map((p) => `• ${p.title}: ${p.description}`).join("\n\n")
  );
}

/* -----------------------------
   RELEVANT TECH (NOT CURRENTLY KNOWN)
------------------------------*/
const otherPopularTech = [
  "react",
  "vue",
  "ruby",
  "rails",
  "php",
  "c++",
  "c#",
  "flutter",
  "react native",
  "kubernetes",
  "go",
  "rust",
];

/* -----------------------------
   BOT BRAIN (UPDATED)
------------------------------*/
async function botReply(input) {
  const normalize = (t) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9+#. ]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const text = normalize(input);
  const intent = getIntent(text);

  /* -----------------------------
     1. JOB MATCH (HIGHEST PRIORITY)
  ------------------------------*/
  if (intent === "job_match") {
    const matched = mySkills.filter((skill) => text.includes(normalize(skill)));

    const missing = otherPopularTech.filter((tech) => text.includes(tech));

    const score = Math.min(matched.length * 12, 100);

    return `📊 Job Match Analysis

Match Score: ${score}%

Matched Skills:
${matched.length ? matched.map((s) => "• " + s).join("\n") : "• None"}

Potential Gaps:
${missing.length ? missing.map((m) => "• " + m).join("\n") : "• None"}

Verdict:
${
  score >= 70
    ? "🟢 Strong match"
    : score >= 40
      ? "🟡 Decent match"
      : "🔴 Weak match"
}`;
  }

  /* -----------------------------
     2. DIRECT SKILL DETECTION
  ------------------------------*/
  const detectedSkills = mySkills.filter((skill) =>
    text.includes(normalize(skill)),
  );

  if (detectedSkills.length) {
    // Try linking to projects
    const relatedProjects = projectsData.filter((p) =>
      p.technologies?.some((t) => detectedSkills.includes(normalize(t.name))),
    );

    if (relatedProjects.length) {
      return `🧠 Skills Detected:
${detectedSkills.map((s) => "• " + s).join("\n")}

📁 Related Projects:
${relatedProjects
  .slice(0, 3)
  .map((p) => `• ${p.title}`)
  .join("\n")}`;
    }

    return `🧠 Skills Detected:
${detectedSkills.map((s) => "• " + s).join("\n")}

✅ Ibrahim has experience with these technologies.`;
  }

  /* -----------------------------
     3. UNKNOWN TECH (SMART RESPONSE)
  ------------------------------*/
  const unknownTech = otherPopularTech.find((tech) => text.includes(tech));

  if (unknownTech) {
    return `Ibrahim doesn't currently list ${unknownTech.toUpperCase()} as a core skill, but he is highly adaptable and capable of learning it quickly if needed.`;
  }

  /* -----------------------------
     4. PROJECT HANDLING
  ------------------------------*/
  if (intent === "projects") {
    if (!projectsData.length) {
      return "Projects are still loading... try again.";
    }

    return (
      "📁 Ibrahim's Projects:\n\n" +
      projectsData.map((p) => `• ${p.title} — ${p.description}`).join("\n")
    );
  }

  const projectResult = findProjects(text);
  if (projectResult) return projectResult;

  /* -----------------------------
     5. STANDARD INTENTS
  ------------------------------*/
  switch (intent) {
    case "greeting":
      return "Hey! I'm Ibrahim's AI assistant. Ask me about his skills, projects, or paste a job description.";

    case "skills":
      return `Ibrahim works with:

• ${mySkills.slice(0, 6).join(", ")}  
• Backend + Frontend + Cloud systems`;

    case "experience":
      return "Ibrahim has 4+ years of experience including TCS and freelance full-stack development.";

    case "contact":
      return "Reach him at ibrahimitani0@gmail.com or LinkedIn (footer).";

    case "role":
      return `Strong fit for:

• Full-stack roles  
• Java / Spring Boot backend  
• Angular frontend  
• Cloud engineering`;

    default:
      return `Sorry can't quite get that! Try asking:
• Experience
• Projects
• Skills
• Role fit
• Or paste a job descriptio`;
  }
}

/* -----------------------------
   UX & EVENTS
------------------------------*/
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  chatInput.value = "";

  // Show Typing
  const typing = document.createElement("div");
  typing.classList.add("msg", "bot");
  typing.innerText = "Typing...";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Get response and replace typing
  const reply = await botReply(text);

  setTimeout(() => {
    typing.remove();
    addMessage(reply, "bot");
  }, 600);
}

chatToggle?.addEventListener("click", () => {
  chatBox.classList.toggle("hidden");
  if (!chatBox.dataset.opened) {
    setTimeout(
      () =>
        addMessage(
          `👋 Hi! I'm Ibrahim's assistant.

Try asking:
• Experience
• Projects
• Skills
• Role fit
• Or paste a job description`,
          "bot",
        ),
      500,
    );
    chatBox.dataset.opened = "true";
  }
});

chatClose?.addEventListener("click", () => chatBox.classList.add("hidden"));
chatSend?.addEventListener("click", sendMessage);
chatInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
