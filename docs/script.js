// ========================================
// Portal Script - Static + Dynamic 
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFooterYear();
  initSearch();
  loadAssessmentSchedule();
  initTabs();
  loadGuidanceStatic();
});

// ========================================
// Theme Toggle
// ========================================
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  let theme = localStorage.getItem("theme") || "light";
  root.dataset.theme = theme;
  if (!toggle) return;

  toggle.textContent = theme === "dark" ? "🌙" : "☀️";

  toggle.addEventListener("click", () => {
    theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = theme;
    toggle.textContent = theme === "dark" ? "🌙" : "☀️";
    localStorage.setItem("theme", theme);
  });
}

// ========================================
// Footer Year
// ========================================
function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ========================================
// Search
// ========================================
function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", (e) => {
    const query = (e.target.value || "").toLowerCase();
    document.querySelectorAll(".card").forEach((card) => {
      card.style.display = card.innerText.toLowerCase().includes(query) ? "" : "none";
    });
  });
}

// ========================================
// Load Markdown from GitHub
// ========================================
async function loadMarkdown(url, container) {
  if (!container) return;
  if (container.dataset.loaded === "true") return;

  container.innerHTML = "Loading...";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    container.innerHTML = marked.parse(markdown);
    container.dataset.loaded = "true";
  } catch (err) {
    console.error("Markdown load failed:", err);
    container.innerHTML = "<p style='color:red'>Failed to load document.</p>";
  }
}

// ========================================
// Assessment Schedule
// ========================================
function loadAssessmentSchedule() {
  const container = document.getElementById("scheduleContent");
  if (!container) return;

  const url =
    "https://www.oregon.gov/eis/cyber-security-services/Documents/eis-css-assessment-schedule.pdf";

  container.innerHTML = `
    <p>
      <a href="${url}" target="_blank" rel="noopener">
        Open Cybersecurity Assessment Schedule (PDF)
      </a>
    </p>
  `;
}

// ========================================
// Tabs + Markdown
// ========================================
const markdownFiles = {
  request: "Artifact-Request.md",
  collector: "Artifact-Collector-Powershell-Scripts.md",
  index: "CSS-Assessment-Index.md",
  relationships: "CSS-Assessment-Safeguard-Interrelationships.md",
  kql: "Defender-KQL.md",
  grouppolicy: "Group-Policy-Settings.md",
  recommend: "Implementation-Recommendations.md",
};

const repoBase =
  "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/";

function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      const tabName = tab.dataset.tab;
      activateTab(tab);
      activatePanel(tabName);

      if (!markdownFiles[tabName]) return;

      const panel = document.getElementById(`panel-${tabName}`);
      if (!panel) return;

      const container = panel.querySelector("div");
      const url = repoBase + markdownFiles[tabName];

      console.log("Loading markdown:", url);
      await loadMarkdown(url, container);
    });
  });
}

function activateTab(activeTab) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab === activeTab);
  });
}

function activatePanel(name) {
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle(panel.id === `panel-${name}`, true);
  });
}
