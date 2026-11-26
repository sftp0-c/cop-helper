(function () {
  "use strict";

  var STORAGE_KEY = "cop_current_step";
  var STEP_PANEL_ID = "cop-helper-step-panel";
  var LAUNCHER_ID = "cop-helper-launcher";
  var SEARCH_PANEL_ID = "cop-helper-search";
  var STATUS_ID = "cop-helper-status";
  var STYLE_ID = "cop-helper-style";

  var panel = null;
  var searchPanel = null;
  var highlighted = [];
  var marks = [];
  var currentStepValue = null;
  var ignoreMutations = false;
  var ignoreTimer = null;

  function getStorageArea() {
    try {
      if (typeof browser !== "undefined" && browser.storage && browser.storage.local) return browser.storage.local;
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) return chrome.storage.local;
    } catch (e) {}
    return null;
  }

  function getRuntime() {
    try {
      if (typeof browser !== "undefined" && browser.runtime) return browser.runtime;
      if (typeof chrome !== "undefined" && chrome.runtime) return chrome.runtime;
    } catch (e) {}
    return null;
  }

  function ce(tag, text, cls) {
    var node = document.createElement(tag);
    if (text !== null && text !== undefined) node.textContent = String(text);
    if (cls) node.className = cls;
    return node;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      ".cop-hl-word{background:#ffe11a!important;color:#000!important;font-weight:900!important;" +
      "padding:0 2px;border-radius:3px;box-shadow:0 0 0 2px #ff1e00;}" +
      ".cop-hl{outline:5px solid #ff1e00!important;outline-offset:3px!important;" +
      "background:rgba(255,225,26,.35)!important;border-radius:4px!important;}";
    (document.head || document.documentElement).appendChild(style);
  }

  function clearHighlights() {
    // Возвращаем исходный текст на место — после подсветки страница не ломается.
    marks.forEach(function (m) {
      if (m.node.parentNode) {
        m.node.parentNode.replaceChild(document.createTextNode(m.text), m.node);
      }
    });
    marks = [];
    highlighted.forEach(function (el) { el.classList.remove("cop-hl"); });
    highlighted = [];
    removeStepPanel();
  }

  function removeStepPanel() {
    if (panel) { panel.remove(); panel = null; }
  }

  function showStepPanel(step) {
    removeStepPanel();
    if (!step || step.noPanel) return;
    var box = ce("div");
    box.id = STEP_PANEL_ID;
    box.style.cssText =
      "position:fixed;top:16px;right:16px;width:360px;z-index:2147483645;" +
      "background:#1e1e2e;color:#ececf1;border:2px solid #ff1e00;border-radius:10px;" +
      "padding:14px 16px;box-shadow:0 8px 28px rgba(0,0,0,.55);" +
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.4;";
    var title = ce("div", step.title ? "Шаг: " + step.title : "Подсветка на странице");
    title.style.cssText = "font-weight:bold;font-size:16px;margin-bottom:6px;color:#ffc400;";
    box.appendChild(title);
    if (step.instruction) box.appendChild(ce("div", step.instruction));
    var close = ce("button", "Закрыть");
    close.style.cssText =
      "margin-top:8px;padding:6px 10px;border:none;border-radius:6px;background:#3a3a4e;" +
      "color:#ececf1;font-size:13px;cursor:pointer;";
    close.addEventListener("click", removeStepPanel);
    box.appendChild(close);
    (document.body || document.documentElement).appendChild(box);
    panel = box;
  }

  function setStatus(text) {
    var status = document.getElementById(STATUS_ID);
    if (!status) return;
    status.textContent = text;
    var ok = text.indexOf("Найдено совпадений: ") === 0 && text.indexOf(": 0") === -1;
    status.style.color = ok ? "#6ee7a5" : (text.indexOf("0.") !== -1 ? "#ff8b7a" : "#ffc400");
  }

  function collectTextNodes() {
    var nodes = [];
    var walk = document.createTreeWalker(
      document.body || document.documentElement,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          var parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest && parent.closest("script, style, noscript, [id^='cop-helper']")) {
            return NodeFilter.FILTER_REJECT;
          }
          var rect = parent.getBoundingClientRect ? parent.getBoundingClientRect() : null;
          if (rect && (!rect.width || !rect.height)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );
    var node;
    while ((node = walk.nextNode())) nodes.push(node);
    return nodes;
  }

  function wrapNode(node, term) {
    var text = node.nodeValue;
    var lower = text.toLowerCase();
    var from = 0, idx, frag = null, last = 0, count = 0;
    while ((idx = lower.indexOf(term, from)) !== -1) {
      if (!frag) frag = document.createDocumentFragment();
      if (idx > last) frag.appendChild(document.createTextNode(text.slice(last, idx)));
      var mark = ce("mark", text.slice(idx, idx + term.length), "cop-hl-word");
      frag.appendChild(mark);
      marks.push({ node: mark, text: mark.textContent });
      count++;
      last = idx + term.length;
      from = last;
    }
    if (frag) {
      frag.appendChild(document.createTextNode(text.slice(last)));
      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    }
    return count;
  }

  function outlineHost(mark) {
    var host = mark.parentElement;
    if (!host) return;
    var rect = host.getBoundingClientRect ? host.getBoundingClientRect() : null;
    if (rect && rect.width <= 500 && rect.height <= 180 && highlighted.indexOf(host) === -1) {
      host.classList.add("cop-hl");
      highlighted.push(host);
    }
  }

  function applyStep(step) {
    clearHighlights();
    currentStepValue = step || null;
    ignoreMutations = true;
    clearTimeout(ignoreTimer);
    ignoreTimer = setTimeout(function () { ignoreMutations = false; }, 300);

    var term = String((step && step.selectorText) || "").trim().toLowerCase();
    if (!term) {
      setStatus("Введите слово для подсветки.");
      if (step) showStepPanel(step);
      return;
    }

    ensureStyles();
    showStepPanel(step);
    var nodes = collectTextNodes();
    var count = 0;
    nodes.forEach(function (node) {
      if (node.nodeValue.toLowerCase().indexOf(term) !== -1) count += wrapNode(node, term);
    });
    // Marks уже вставлены — теперь обводим их ближайшие контейнеры.
    marks.forEach(outlineHost);

    setStatus("Найдено совпадений: " + count + (count ? ". Слово подсвечено жёлтым." : ". Попробуйте другое слово."));
    if (marks.length) {
      try { marks[0].node.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
    }
  }

  function openLink(href) {
    var url = window.COP_absUrl ? window.COP_absUrl(href) : href;
    try { window.open(url, "_blank", "noopener"); } catch (e) {}
  }

  function runSearch(query, box, input) {
    box.innerHTML = "";
    var text = String(query || "").trim();
    if (!text) return;
    var state = window.COP_find ? window.COP_find(text) : { type: "none" };
    if (state.type === "clarify") {
      box.appendChild(ce("div", "Уточните вопрос:"));
      state.variants.forEach(function (s) {
        var btn = ce("button", s.title);
        btn.style.cssText = "display:block;width:100%;text-align:left;margin:4px 0;";
        btn.addEventListener("click", function () { input.value = s.sample; runSearch(s.sample, box, input); });
        box.appendChild(btn);
      });
      return;
    }
    if (state.type === "none") {
      box.appendChild(ce("div", "Раздел недоступен или запрос не распознан."));
      box.appendChild(ce("div", "Специалист: cophelp@admhmao.ru, 8 800 100-58-67"));
      var sup = ce("button", "Открыть службу поддержки");
      sup.style.marginTop = "8px";
      sup.addEventListener("click", function () { openLink("/journal-help-action"); });
      box.appendChild(sup);
      return;
    }
    var s = state.scenario;
    box.appendChild(ce("h3", s.title));
    box.appendChild(ce("div", "Роль: " + s.role + " | Старт: " + s.startScreen));
    box.appendChild(ce("div", "Ожидаемый результат: " + s.expectedResult));
    (s.links || []).forEach(function (link) {
      var btn = ce("button", "Открыть: " + link.title);
      btn.style.margin = "6px 6px 6px 0";
      btn.addEventListener("click", function () { openLink(link.href); });
      box.appendChild(btn);
    });
    s.steps.forEach(function (step, i) {
      var item = ce("div");
      item.style.cssText = "margin:8px 0;padding:6px 8px;border-left:3px solid #ffc400;background:#26263a;";
      var head = ce("div", (i + 1) + ". " + step.title);
      head.style.fontWeight = "bold";
      item.appendChild(head);
      item.appendChild(ce("div", step.instruction));
      var show = ce("button", "Подсветить слово «" + (step.selectorText || step.title) + "»");
      show.style.marginTop = "6px";
      show.addEventListener("click", function () {
        applyStep({ id: s.id + "-" + i, title: step.title, instruction: step.instruction, selectorText: step.selectorText });
      });
      item.appendChild(show);
      box.appendChild(item);
    });
  }

  function button(text, css) {
    var b = ce("button", text);
    b.style.cssText = css ||
      "padding:8px 12px;border:none;border-radius:6px;background:#3a3a4e;color:#ececf1;cursor:pointer;font-size:13px;";
    return b;
  }

  function ensureSearchPanel() {
    if (searchPanel) return searchPanel;
    var box = ce("div");
    box.id = SEARCH_PANEL_ID;
    box.style.cssText =
      "position:fixed;bottom:88px;right:24px;width:520px;max-height:76vh;overflow-y:auto;" +
      "z-index:2147483646;background:#1e1e2e;color:#ececf1;border:2px solid #ffc400;" +
      "border-radius:12px;padding:16px;box-shadow:0 10px 38px rgba(0,0,0,.6);" +
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;";

    var head = ce("div");
    head.style.cssText = "display:flex;justify-content:space-between;align-items:flex-start;";
    var titleBox = ce("div");
    var h = ce("h2", "ЦОП Помощник");
    h.style.cssText = "font-size:19px;margin:0;";
    var sub = ce("div", "Маршруты и подсветка слов на странице");
    sub.style.cssText = "font-size:12px;color:#a9a9bd;margin-top:2px;";
    titleBox.appendChild(h);
    titleBox.appendChild(sub);
    head.appendChild(titleBox);
    var close = button("✕", "background:transparent;font-size:18px;padding:2px 8px;");
    close.addEventListener("click", function () { box.style.display = "none"; });
    head.appendChild(close);
    box.appendChild(head);

    var qRow = ce("div");
    qRow.style.cssText = "display:flex;gap:6px;margin-top:10px;";
    var input = ce("input");
    input.type = "text";
    input.placeholder = "Вопрос: как уйти в ПФДО?";
    input.style.cssText =
      "flex:1;min-width:0;padding:8px;border:none;border-radius:6px;background:#2c2c3e;color:#ececf1;font-size:14px;";
    var go = button("Найти", "padding:8px 12px;border:none;border-radius:6px;background:#ffc400;color:#1e1e2e;font-weight:bold;cursor:pointer;");
    var result = ce("div");
    result.style.marginTop = "12px";
    go.addEventListener("click", function () { runSearch(input.value, result, input); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") runSearch(input.value, result, input);
    });
    qRow.appendChild(input);
    qRow.appendChild(go);
    box.appendChild(qRow);
    box.appendChild(result);

    var wordRow = ce("div");
    wordRow.style.cssText = "display:flex;gap:6px;margin-top:14px;padding-top:12px;border-top:1px solid #3a3a4e;";
    var wordInput = ce("input");
    wordInput.type = "text";
    wordInput.placeholder = "Слово на странице: ПФДО";
    wordInput.style.cssText =
      "flex:1;min-width:0;padding:8px;border:none;border-radius:6px;background:#2c2c3e;color:#ececf1;font-size:14px;";
    var wordGo = button("Подсветить слово", "padding:8px 10px;border:none;border-radius:6px;background:#ff1e00;color:#fff;font-weight:bold;cursor:pointer;");
    function doHighlight() {
      var word = String(wordInput.value || "").trim();
      if (!word) { setStatus("Введите слово."); return; }
      applyStep({ noPanel: true, title: "Поиск: " + word, instruction: "", selectorText: word });
    }
    wordGo.addEventListener("click", doHighlight);
    wordInput.addEventListener("keydown", function (e) { if (e.key === "Enter") doHighlight(); });
    wordRow.appendChild(wordInput);
    wordRow.appendChild(wordGo);
    box.appendChild(wordRow);

    var status = ce("div", "Введите слово и нажмите «Подсветить слово».");
    status.id = STATUS_ID;
    status.style.cssText = "margin-top:8px;font-size:13px;color:#ffc400;";
    box.appendChild(status);

    var actions = ce("div");
    actions.style.marginTop = "8px";
    var refresh = button("Обновить подсветку");
    refresh.addEventListener("click", function () { if (currentStepValue) applyStep(currentStepValue); });
    var clear = button("Снять подсветку");
    clear.addEventListener("click", function () {
      clearHighlights();
      currentStepValue = null;
      setStatus("Подсветка снята.");
    });
    actions.appendChild(refresh);
    actions.appendChild(clear);
    var openCop = button("Открыть ЦОП", "padding:8px 10px;border:none;border-radius:6px;background:#3a3a4e;color:#ececf1;cursor:pointer;font-size:13px;");
    openCop.addEventListener("click", function () { openLink("https://cop.admhmao.ru/elk"); });
    actions.appendChild(openCop);
    box.appendChild(actions);

    var routes = ce("details");
    var summary = ce("summary", "Контрольные маршруты");
    summary.style.cssText = "cursor:pointer;opacity:.85;margin-top:12px;";
    routes.appendChild(summary);
    var list = ce("div");
    list.style.marginTop = "6px";
    (window.COP_KB || []).forEach(function (s) {
      var b = button(s.title, "display:block;width:100%;text-align:left;margin:3px 0;padding:6px 8px;border:none;border-radius:6px;background:#3a3a4e;color:#ececf1;cursor:pointer;");
      b.addEventListener("click", function () { input.value = s.sample; runSearch(s.sample, result, input); });
      list.appendChild(b);
    });
    routes.appendChild(list);
    box.appendChild(routes);

    (document.body || document.documentElement).appendChild(box);
    searchPanel = box;
    return box;
  }

  function ensureLauncher() {
    if (document.getElementById(LAUNCHER_ID)) return;
    var btn = button("🔍 Помощник",
      "position:fixed;bottom:24px;right:24px;z-index:2147483647;padding:12px 20px;border:none;" +
      "border-radius:28px;background:#ffc400;color:#1e1e2e;font-size:16px;font-weight:bold;" +
      "box-shadow:0 5px 20px rgba(0,0,0,.5);cursor:pointer;");
    btn.id = LAUNCHER_ID;
    btn.title = "Открыть помощника ЦОП";
    btn.addEventListener("click", function () {
      var box = ensureSearchPanel();
      box.style.display = box.style.display === "none" ? "block" : "none";
      if (box.style.display === "block") box.querySelector("input").focus();
    });
    (document.body || document.documentElement).appendChild(btn);
  }

  function init() {
    ensureStyles();
    ensureLauncher();

    var storageArea = getStorageArea();
    if (storageArea) {
      storageArea.get(STORAGE_KEY).then(function (data) {
        var step = data ? data[STORAGE_KEY] : null;
        if (step) applyStep(step);
      }).catch(function () {});
      try {
        storageArea.onChanged.addListener(function (changes, area) {
          if (area === "local" && changes[STORAGE_KEY] && changes[STORAGE_KEY].newValue) {
            applyStep(changes[STORAGE_KEY].newValue);
          }
        });
      } catch (e) {}
    }
    var runtime = getRuntime();
    if (runtime && runtime.onMessage) {
      try {
        runtime.onMessage.addListener(function (msg, sender, sendResponse) {
          if (msg && msg.type === "COP_STEP" && msg.step) applyStep(msg.step);
          return true;
        });
      } catch (e) {}
    }

    // Без авто-переподсветки: страница не дёргается. Кнопка «Обновить подсветку»
    // позволяет пересканировать DOM вручную после того, как Vue всё отрисовал.
    try {
      var observer = new MutationObserver(function () {
        if (ignoreMutations) return;
        var status = document.getElementById(STATUS_ID);
        if (status && currentStepValue && status.textContent.indexOf("Найдено совпадений: 0") === 0) {
          clearTimeout(observerTimer);
          observerTimer = setTimeout(function () {
            if (currentStepValue) applyStep(currentStepValue);
          }, 400);
        }
      });
      var observerTimer = null;
      observer.observe(document.documentElement, { childList: true, subtree: true });
    } catch (e) {}
  }

  init();
})();
