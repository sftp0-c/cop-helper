const LOG_KEY = "cop_response_log";
const STEP_KEY = "cop_current_step";

function el(tag, text, cls) {
  const node = document.createElement(tag);
  if (text !== null && text !== undefined) node.textContent = String(text);
  if (cls) node.className = cls;
  return node;
}

function safeStorage() {
  try {
    if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
      return browser.storage.local;
    }
  } catch (e) {}
  return null;
}

function activateStep(step) {
  const storage = safeStorage();
  if (storage) {
    try {
      const saved = storage.set({ [STEP_KEY]: step });
      if (saved && typeof saved.catch === "function") saved.catch(() => {});
    } catch (e) {}
  }
  try {
    if (typeof browser !== "undefined" && browser.runtime && browser.runtime.sendMessage) {
      const sent = browser.runtime.sendMessage({ type: "COP_STEP", step: step });
      if (sent && typeof sent.catch === "function") sent.catch(() => {});
    }
  } catch (e) {}
}

function openLink(href) {
  try {
    if (typeof browser !== "undefined" && browser.tabs && browser.tabs.create) {
      browser.tabs.create({ url: window.COP_absUrl(href) });
    }
  } catch (e) {}
}

function addLog(query, result) {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.get(LOG_KEY).then((data) => {
      const log = data && Array.isArray(data[LOG_KEY]) ? data[LOG_KEY] : [];
      log.unshift({ time: new Date().toLocaleString("ru-RU"), query: query, result: result });
      storage.set({ [LOG_KEY]: log.slice(0, 20) });
      renderLog();
    }).catch(() => {});
  } catch (e) {}
}

function renderLog() {
  const root = document.getElementById("log");
  if (!root) return;
  root.innerHTML = "";
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.get(LOG_KEY).then((data) => {
      const log = data && Array.isArray(data[LOG_KEY]) ? data[LOG_KEY] : [];
      if (!log.length) { root.appendChild(el("div", "Запросов пока нет", "meta")); return; }
      log.forEach((item) => {
        root.appendChild(el("div", item.time + " — " + item.query + " → " + item.result, "log-entry"));
      });
    }).catch(() => {});
  } catch (e) {}
}

function renderScenario(root, s) {
  root.appendChild(el("h3", s.title));
  root.appendChild(el("div", "Роль: " + s.role + " | Старт: " + s.startScreen, "meta"));
  root.appendChild(el("div", "Ожидаемый результат: " + s.expectedResult, "meta"));

  const links = el("div", "", "row");
  (s.links || []).forEach((link) => {
    const btn = el("button", "Открыть: " + link.title);
    btn.addEventListener("click", () => openLink(link.href));
    links.appendChild(btn);
  });
  root.appendChild(links);

  s.steps.forEach((step, i) => {
    const box = el("div", "", "step");
    box.appendChild(el("div", (i + 1) + ". " + step.title, "step-title"));
    box.appendChild(el("div", step.instruction, "step-instr"));
    const row = el("div", "", "row");
    const show = el("button", step.selectorText ? "Подсветить «" + step.selectorText + "»" : "Подсветить", "danger");
    show.addEventListener("click", () => activateStep({ ...step, id: s.id + "-" + i }));
    row.appendChild(show);
    root.appendChild(box);
  });
}

function showResult(query, state) {
  const root = document.getElementById("result");
  root.innerHTML = "";
  if (!query) return;
  root.appendChild(el("div", "Запрос: " + query, "meta"));

  if (state.type === "clarify") {
    root.appendChild(el("div", "Уточните, пожалуйста, вопрос:", "meta"));
    state.variants.forEach((s) => {
      const btn = el("button", s.title, "route");
      btn.addEventListener("click", () => {
        document.getElementById("query").value = s.sample;
        search(s.sample);
      });
      root.appendChild(btn);
    });
    addLog(query, "уточнение запроса");
    return;
  }

  if (state.type === "none") {
    root.appendChild(el("div", "Раздел недоступен или запрос не распознан."));
    root.appendChild(el("div", "Передайте вопрос специалисту: cophelp@admhmao.ru, 8 800 100-58-67", "meta"));
    const btn = el("button", "Открыть службу поддержки");
    btn.addEventListener("click", () => openLink("/journal-help-action"));
    root.appendChild(btn);
    addLog(query, "раздел недоступен");
    return;
  }

  renderScenario(root, state.scenario);
  addLog(query, state.scenario.title);
}

function search(query) {
  const text = String(query || "").trim();
  if (!text) return;
  showResult(text, window.COP_find(text));
}

function renderRoutes() {
  const root = document.getElementById("routes");
  if (!root) return;
  root.innerHTML = "";
  (window.COP_KB || []).forEach((s) => {
    const btn = el("button", s.title, "route");
    btn.addEventListener("click", () => {
      document.getElementById("query").value = s.sample;
      search(s.sample);
    });
    root.appendChild(btn);
  });
}

document.getElementById("searchBtn").addEventListener("click", () => {
  search(document.getElementById("query").value);
});
document.getElementById("query").addEventListener("keydown", (e) => {
  if (e.key === "Enter") search(document.getElementById("query").value);
});
document.getElementById("clearLog").addEventListener("click", () => {
  const storage = safeStorage();
  if (!storage) return;
  try { storage.set({ [LOG_KEY]: [] }).then(() => renderLog()); } catch (e) {}
});

function highlightWord() {
  const input = document.getElementById("word");
  const status = document.getElementById("status");
  const word = String(input.value || "").trim();
  if (!word) {
    if (status) status.textContent = "Введите слово.";
    return;
  }
  activateStep({ noPanel: true, title: "Поиск: " + word, instruction: "", selectorText: word });
  if (status) status.textContent = "Слово «" + word + "» отправлено на страницу. Результат видно в панели помощника.";
}
document.getElementById("wordBtn").addEventListener("click", highlightWord);
document.getElementById("word").addEventListener("keydown", (e) => {
  if (e.key === "Enter") highlightWord();
});
document.getElementById("openCop").addEventListener("click", (e) => {
  e.preventDefault();
  openLink("https://cop.admhmao.ru/elk");
});

renderRoutes();
renderLog();
