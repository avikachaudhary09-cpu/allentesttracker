const tests = [
  {
    number: 1,
    originalDate: "2026-06-07",
    subjects: {
      Physics: ["Units and Measurements", "Vector", "Electrostatics & Gravitation"],
      Chemistry: ["Mole Concept", "Stoichiometry and Redox Reactions"],
      Mathematics: ["Quadratic Equation", "Set Theory and Number System", "Relations", "Functions"],
    },
  },
  {
    number: 2,
    originalDate: "2026-06-21",
    subjects: {
      Physics: ["Kinematics", "Current & Capacitor"],
      Chemistry: ["Atomic Structure", "Periodic Table", "Liquid Solutions", "Electrochemistry"],
      Mathematics: ["Logarithm", "Inverse Trigonometric Function"],
    },
  },
  {
    number: 3,
    originalDate: "2026-07-05",
    subjects: {
      Physics: ["Newton's Laws of Motion & Friction", "Magnetic Effect of Current and Magnetism"],
      Chemistry: ["Chemical Bonding and Molecular Structure", "IUPAC Nomenclature and Common Names", "Chemical Kinetics"],
      Mathematics: ["Sequence and Progression", "Binomial Theorem", "Limits", "Continuity", "Differentiability"],
    },
  },
  {
    number: 4,
    originalDate: "2026-07-26",
    subjects: {
      Physics: ["Circular Motion", "Electromagnetic Induction & Alternating Current"],
      Chemistry: [
        "Electronic Displacement Effects (GOC)",
        "Structural Isomerism",
        "Geometrical Isomerism and Conformations",
        "Optical Isomerism",
        "Coordination Compounds",
        "The d- and f- Block Elements",
      ],
      Mathematics: [
        "Trigonometric Ratios and Identities",
        "Trigonometric Equation",
        "Method of Differentiation",
        "Tangent and Normal",
        "Monotonicity",
        "Maxima and Minima",
      ],
    },
  },
  {
    number: 5,
    originalDate: "2026-08-09",
    subjects: {
      Physics: ["Work, Energy & Power", "Geometrical Optics"],
      Chemistry: ["Hydrocarbons"],
      Mathematics: ["Permutation and Combination", "Determinants", "Matrices"],
    },
  },
  {
    number: 6,
    originalDate: "2026-09-06",
    subjects: {
      Physics: ["Centre of Mass", "Wave on String & Sound Waves"],
      Chemistry: ["Haloalkanes and Haloarenes"],
      Mathematics: ["Solution of Triangle", "Indefinite Integration", "Definite Integration"],
    },
  },
  {
    number: 7,
    originalDate: "2026-09-20",
    subjects: {
      Physics: ["Rotational Motion", "Electromagnetic Waves and Wave Optics"],
      Chemistry: [
        "Thermodynamics-I (First Law)",
        "Thermochemistry",
        "Thermodynamics-II (Second & Third Law)",
        "Alcohols, Phenols and Ethers",
        "Carbonyl Compounds",
      ],
      Mathematics: ["Straight Line and Linear Inequality", "Differential Equation", "Area Under the Curve"],
    },
  },
  {
    number: 8,
    originalDate: "2026-10-04",
    subjects: {
      Physics: ["Simple Harmonic Motion", "Modern Physics"],
      Chemistry: [
        "Chemical Equilibrium",
        "Ionic Equilibrium",
        "Carboxylic Acids and their Derivatives",
        "Organic Compounds Containing Nitrogen",
        "Biomolecules",
        "Polymers and POC",
        "Chemistry in Everyday Life",
      ],
      Mathematics: ["Circle", "Vector", "Three Dimensional Coordinate Geometry"],
    },
  },
  {
    number: 9,
    originalDate: "2026-11-01",
    subjects: {
      Physics: ["Fluid Mechanics", "Errors in Measurements and Instruments"],
      Chemistry: [
        "Hydrogen and its Compounds",
        "s-Block Elements",
        "Environmental Chemistry",
        "Solid State",
        "States of Matter and Eudiometry",
      ],
      Mathematics: ["Parabola", "Ellipse", "Probability"],
    },
  },
  {
    number: 10,
    originalDate: "2026-11-15",
    subjects: {
      Physics: ["Heat & Thermodynamics", "Semiconductor Electronics"],
      Chemistry: [
        "p-Block Elements (Groups 13-18)",
        "Qualitative Analysis",
        "Surface Chemistry",
        "General Principles and Processes of Isolation of Elements (Metallurgy)",
      ],
      Mathematics: ["Hyperbola", "Statistics", "Complex Numbers"],
    },
  },
];

const scheduleWindows = tests.map((test, index) => {
  const monthOffset = Math.floor(index / 2);
  const isFirstHalf = index % 2 === 0;
  const month = 6 + monthOffset;
  const start = new Date(2026, month, isFirstHalf ? 1 : 16);
  const end = new Date(2026, month + (isFirstHalf ? 0 : 1), isFirstHalf ? 15 : 0);

  return { ...test, start, end };
});

const datePicker = document.querySelector("#date-picker");
const activeTitle = document.querySelector("#active-title");
const windowRange = document.querySelector("#window-range");
const prepMessage = document.querySelector("#prep-message");
const progressLabel = document.querySelector("#progress-label");
const daysLeft = document.querySelector("#days-left");
const progressBar = document.querySelector("#progress-bar");
const activeOriginalDate = document.querySelector("#active-original-date");
const activeTestName = document.querySelector("#active-test-name");
const activeBadge = document.querySelector("#active-badge");
const activeResult = document.querySelector("#active-result");
const activeSubjects = document.querySelector("#active-subjects");
const testMenu = document.querySelector("#test-menu");
const toggleProgress = document.querySelector("#toggle-progress");
const progressContent = document.querySelector("#progress-content");
const progressStoreKey = "minor-test-chapter-progress-v1";
const resultStoreKey = "minor-test-results-v1";

let savedProgress = loadProgress();
let savedResults = loadResults();

function toLocalDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateInput(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function dayDiff(start, end) {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.round((end - start) / dayMs);
}

function getActiveWindow(date) {
  const current = scheduleWindows.find((test) => date >= test.start && date <= test.end);
  if (current) return current;

  if (date < scheduleWindows[0].start) return scheduleWindows[0];
  return scheduleWindows[scheduleWindows.length - 1];
}

function getWindowStatus(test, date) {
  if (date > test.end) {
    return { label: "Window closed", className: "closed" };
  }

  if (date >= test.start && date <= test.end) {
    return { label: "Preparing now", className: "current" };
  }

  return { label: "Upcoming", className: "upcoming" };
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(progressStoreKey)) || {};
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(progressStoreKey, JSON.stringify(savedProgress));
}

function loadResults() {
  try {
    return JSON.parse(localStorage.getItem(resultStoreKey)) || {};
  } catch {
    return {};
  }
}

function saveResults() {
  localStorage.setItem(resultStoreKey, JSON.stringify(savedResults));
}

function chapterKey(testNumber, subject, chapter) {
  return `${testNumber}|${subject}|${chapter}`;
}

function inputId(prefix, key, type) {
  return `${prefix}-${type}-${key}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function renderChapterList(testNumber, subject, chapters, prefix) {
  return chapters
    .map((chapter, index) => {
      const key = chapterKey(testNumber, subject, chapter);
      const progress = savedProgress[key] || {};
      const theoryId = inputId(prefix, `${key}-${index}`, "theory");
      const moduleId = inputId(prefix, `${key}-${index}`, "module");

      return `
        <li class="chapter-row">
          <span class="chapter-name">${chapter}</span>
          <span class="chapter-checks">
            <label for="${theoryId}">
              <input
                id="${theoryId}"
                type="checkbox"
                data-progress-key="${key}"
                data-progress-type="theory"
                ${progress.theory ? "checked" : ""}
              />
              <span>Theory</span>
            </label>
            <label for="${moduleId}">
              <input
                id="${moduleId}"
                type="checkbox"
                data-progress-key="${key}"
                data-progress-type="module"
                ${progress.module ? "checked" : ""}
              />
              <span>Module</span>
            </label>
          </span>
        </li>
      `;
    })
    .join("");
}

function getChapterStats(test) {
  const chapters = Object.entries(test.subjects).flatMap(([subject, chapterList]) =>
    chapterList.map((chapter) => {
      const progress = savedProgress[chapterKey(test.number, subject, chapter)] || {};
      return {
        theory: Boolean(progress.theory),
        module: Boolean(progress.module),
        complete: Boolean(progress.theory && progress.module),
      };
    }),
  );

  const total = chapters.length;
  const theory = chapters.filter((chapter) => chapter.theory).length;
  const module = chapters.filter((chapter) => chapter.module).length;
  const complete = chapters.filter((chapter) => chapter.complete).length;

  return { total, theory, module, complete };
}

function percent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function renderResultInputs(testNumber, prefix) {
  const result = savedResults[testNumber] || {};
  return `
    <div class="result-inputs" data-test-number="${testNumber}">
      <label>
        <span>Score</span>
        <input
          type="number"
          inputmode="decimal"
          min="0"
          step="0.5"
          placeholder="Enter score"
          data-result-test="${testNumber}"
          data-result-type="score"
          id="${prefix}-score-${testNumber}"
          value="${result.score ?? ""}"
        />
      </label>
      <label>
        <span>Rank</span>
        <input
          type="number"
          inputmode="numeric"
          min="1"
          step="1"
          placeholder="Enter rank"
          data-result-test="${testNumber}"
          data-result-type="rank"
          id="${prefix}-rank-${testNumber}"
          value="${result.rank ?? ""}"
        />
      </label>
    </div>
  `;
}

function renderProgressDashboard() {
  const allStats = scheduleWindows.map(getChapterStats);
  const totalChapters = allStats.reduce((sum, stats) => sum + stats.total, 0);
  const totalTheory = allStats.reduce((sum, stats) => sum + stats.theory, 0);
  const totalModule = allStats.reduce((sum, stats) => sum + stats.module, 0);
  const totalComplete = allStats.reduce((sum, stats) => sum + stats.complete, 0);
  const scoresAdded = scheduleWindows.filter((test) => {
    const score = savedResults[test.number]?.score;
    return score !== undefined && score !== "";
  }).length;

  document.querySelector("#chapter-total").textContent = `${percent(totalComplete, totalChapters)}%`;
  document.querySelector("#theory-total").textContent = `${percent(totalTheory, totalChapters)}%`;
  document.querySelector("#module-total").textContent = `${percent(totalModule, totalChapters)}%`;
  document.querySelector("#scores-total").textContent = `${scoresAdded}/${scheduleWindows.length}`;

  document.querySelector("#progress-chart").innerHTML = scheduleWindows
    .map((test) => {
      const stats = getChapterStats(test);
      const result = savedResults[test.number] || {};
      const theoryPercent = percent(stats.theory, stats.total);
      const modulePercent = percent(stats.module, stats.total);
      const completePercent = percent(stats.complete, stats.total);

      return `
        <article class="chart-row">
          <div class="chart-title">
            <strong>Test ${test.number}</strong>
            <span>${stats.complete}/${stats.total} chapters complete</span>
          </div>
          <div class="bar-stack">
            <div class="bar-line">
              <span>Theory</span>
              <div class="mini-track"><div class="mini-bar theory-bar" style="width: ${theoryPercent}%"></div></div>
              <b>${theoryPercent}%</b>
            </div>
            <div class="bar-line">
              <span>Module</span>
              <div class="mini-track"><div class="mini-bar module-bar" style="width: ${modulePercent}%"></div></div>
              <b>${modulePercent}%</b>
            </div>
          </div>
          <div class="result-summary">
            <span>${completePercent}% finished</span>
            <span>Score: ${result.score || "-"}</span>
            <span>Rank: ${result.rank || "-"}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSubjects(container, testNumber, subjects, prefix) {
  container.innerHTML = Object.entries(subjects)
    .map(
      ([subject, chapters]) => `
        <article class="subject">
          <h3>${subject}</h3>
          <ul class="chapter-list">
            ${renderChapterList(testNumber, subject, chapters, prefix)}
          </ul>
        </article>
      `,
    )
    .join("");
}

function renderActive(date) {
  const active = getActiveWindow(date);
  const totalDays = Math.max(dayDiff(active.start, active.end), 1);
  const elapsedDays = Math.min(Math.max(dayDiff(active.start, date), 0), totalDays);
  const remainingDays = Math.max(dayDiff(date, active.end), 0);
  const isInWindow = date >= active.start && date <= active.end;
  const percentage = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);

  activeTitle.textContent = `Minor Test ${active.number}`;
  activeOriginalDate.textContent = `Original date: ${formatDate(fromDateInput(active.originalDate))}`;
  activeTestName.textContent = `Minor Test ${active.number}`;
  windowRange.textContent = `${formatShortDate(active.start)} - ${formatShortDate(active.end)}`;
  activeBadge.textContent = isInWindow ? "Preparing now" : "Upcoming";
  progressLabel.textContent = isInWindow ? "Window progress" : "Starts soon";
  daysLeft.textContent = isInWindow
    ? `${remainingDays + 1} day${remainingDays === 0 ? "" : "s"} including today`
    : `Starts ${formatDate(active.start)}`;
  progressBar.style.width = `${isInWindow ? percentage : 0}%`;
  prepMessage.textContent = isInWindow
    ? `Prepare these chapters till ${formatDate(active.end)}. On the next day, the planner automatically moves to the next Minor Test.`
    : `The July plan starts on ${formatDate(active.start)} with Minor Test ${active.number}.`;

  activeResult.innerHTML = renderResultInputs(active.number, "active");
  renderSubjects(activeSubjects, active.number, active.subjects, "active");
  renderProgressDashboard();

  document.querySelectorAll(".test-card").forEach((card) => {
    const isActive = Number(card.dataset.testNumber) === active.number;
    card.classList.toggle("active", isActive);
    if (isActive) card.classList.add("open");
  });
}

function renderMenu(date) {
  testMenu.innerHTML = scheduleWindows
    .map((test) => {
      const status = getWindowStatus(test, date);

      return `
        <article class="test-card" data-test-number="${test.number}">
          <button class="test-summary" type="button" aria-expanded="false">
            <span class="summary-title">
              <strong>Minor Test ${test.number}</strong>
              <span class="summary-date">Original date: ${formatDate(fromDateInput(test.originalDate))}</span>
            </span>
            <span class="summary-meta">
              <span class="summary-status ${status.className}">${status.label}</span>
              <span class="summary-window">${formatShortDate(test.start)} - ${formatShortDate(test.end)}</span>
            </span>
          </button>
          <div class="test-details">
            ${renderResultInputs(test.number, `menu-${test.number}`)}
            <div class="subject-grid">
              ${Object.entries(test.subjects)
                .map(
                  ([subject, chapters]) => `
                    <article class="subject">
                      <h3>${subject}</h3>
                      <ul class="chapter-list">
                        ${renderChapterList(test.number, subject, chapters, `menu-${test.number}`)}
                      </ul>
                    </article>
                  `,
                )
                .join("")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  testMenu.querySelectorAll(".test-summary").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".test-card");
      const isOpen = card.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

function syncProgressInputs(key, type, checked) {
  document.querySelectorAll("input[data-progress-key]").forEach((input) => {
    if (input.dataset.progressKey === key && input.dataset.progressType === type) {
      input.checked = checked;
    }
  });
}

function syncResultInputs(testNumber, type, value) {
  document
    .querySelectorAll(`input[data-result-test="${testNumber}"][data-result-type="${type}"]`)
    .forEach((input) => {
      input.value = value;
    });
}

document.addEventListener("change", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.dataset.progressKey) return;

  const key = input.dataset.progressKey;
  const type = input.dataset.progressType;
  savedProgress[key] = { ...(savedProgress[key] || {}), [type]: input.checked };
  saveProgress();
  syncProgressInputs(key, type, input.checked);
  renderProgressDashboard();
});

document.addEventListener("input", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.dataset.resultTest) return;

  const testNumber = input.dataset.resultTest;
  const type = input.dataset.resultType;
  savedResults[testNumber] = { ...(savedResults[testNumber] || {}), [type]: input.value };
  saveResults();
  syncResultInputs(testNumber, type, input.value);
  renderProgressDashboard();
});

renderProgressDashboard();

datePicker.value = toLocalDateInputValue(new Date());
renderMenu(fromDateInput(datePicker.value));
renderActive(fromDateInput(datePicker.value));

datePicker.addEventListener("change", () => {
  const selectedDate = fromDateInput(datePicker.value);
  renderMenu(selectedDate);
  renderActive(selectedDate);
});

toggleProgress.addEventListener("click", () => {
  const isHidden = progressContent.classList.toggle("hidden");
  toggleProgress.textContent = isHidden ? "Show chart" : "Hide chart";
  toggleProgress.setAttribute("aria-expanded", String(!isHidden));
});

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
