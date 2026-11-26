// Общие данные и поиск: используются и в popup, и на странице сайта.
window.COP_KB = [
  {
    id: "pfdo",
    title: "Переход родителя в ПФДО",
    sample: "как родителю перейти в ПФДО",
    keywords: ["пфдо", "дополнительное образование", "перейти в пфдо", "портал пфдо"],
    role: "родитель",
    startScreen: "главная ЦОП — https://cop.admhmao.ru/elk",
    expectedResult: "открыт портал ПФДО https://hmao.pfdo.ru",
    links: [{ title: "Портал ПФДО", href: "https://hmao.pfdo.ru" }],
    steps: [
      {
        title: "Найти блок «ПФДО»",
        instruction: "На главной странице ЦОП найдите блок «ПФДО» в разделе special features.",
        selectorText: "ПФДО",
      },
      {
        title: "Нажать кнопку «Перейти»",
        instruction: "В блоке «ПФДО» нажмите кнопку «Перейти» — она ведёт на https://hmao.pfdo.ru.",
        selectorText: "Перейти",
      },
      {
        title: "Авторизоваться",
        instruction: "На портале ПФДО войдите через ЕСИА и проверьте данные ребёнка.",
        selectorText: null,
      },
    ],
  },
  {
    id: "parent-journal",
    title: "Вход в электронный журнал родителю",
    sample: "войти родителю в электронный журнал, посмотреть оценки",
    keywords: ["родител", "электронный журнал", "оценки", "журнал родителю", "дневник ребёнка"],
    role: "родитель",
    startScreen: "главная ЦОП — https://cop.admhmao.ru/elk",
    expectedResult: "открыт журнал роли родителя",
    links: [{ title: "Вход для родителя", href: "/journal-esia-action/mode.elk/role.parent" }],
    steps: [
      {
        title: "Выбрать вход для родителя",
        instruction: "На главной ЦОП выберите ссылку входа для роли «родитель» (/journal-esia-action/mode.elk/role.parent).",
        selectorText: "Система Электронного журнала",
      },
      {
        title: "Авторизация ЕСИА",
        instruction: "Пройдите авторизацию через ЕСИА.",
        selectorText: null,
      },
      {
        title: "Просмотр оценок ребёнка",
        instruction: "Выберите ребёнка и откройте журнал оценок.",
        selectorText: null,
      },
    ],
  },
  {
    id: "student-journal",
    title: "Вход в электронный журнал ученику",
    sample: "войти ученику в электронный журнал",
    keywords: ["учени", "студент", "журнал ученику", "оценки ученика", "дневник"],
    role: "ученик",
    startScreen: "главная ЦОП — https://cop.admhmao.ru/elk",
    expectedResult: "открыт журнал роли ученика",
    links: [{ title: "Вход для ученика", href: "/journal-esia-action/mode.elk/role.student" }],
    steps: [
      {
        title: "Выбрать вход для ученика",
        instruction: "На главной ЦОП выберите ссылку входа для роли «ученик» (/journal-esia-action/mode.elk/role.student).",
        selectorText: "Система Электронного журнала",
      },
      { title: "Авторизация ЕСИА", instruction: "Пройдите авторизацию через ЕСИА.", selectorText: null },
      { title: "Открыть дневник", instruction: "Откройте свой дневник и расписание.", selectorText: null },
    ],
  },
  {
    id: "teacher-journal",
    title: "Вход в электронный журнал учителю",
    sample: "войти учителю в электронный журнал",
    keywords: ["учител", "педагог", "журнал учителю", "эжд"],
    role: "учитель",
    startScreen: "главная ЦОП — https://cop.admhmao.ru/elk",
    expectedResult: "открыт журнал /journal-app под ролью учителя",
    links: [{ title: "Вход для учителя", href: "/journal-esia-action/mode.elk/role.teacher" }],
    steps: [
      {
        title: "Выбрать «Система Электронного журнала»",
        instruction: "В разделе входа выберите «Система Электронного журнала».",
        selectorText: "Система Электронного журнала",
      },
      {
        title: "Роль учителя",
        instruction: "Используйте ссылку /journal-esia-action/mode.elk/role.teacher.",
        selectorText: "Вход по логину и паролю",
      },
      { title: "Авторизация", instruction: "Пройдите авторизацию через ЕСИА — откроется /journal-app.", selectorText: null },
    ],
  },
  {
    id: "online-lesson",
    title: "Назначение онлайн-урока учителем",
    sample: "как назначить онлайн-урок учителю",
    keywords: ["онлайн-урок", "онлайн урок", "назначить урок", "дистанционный", "вебинар"],
    role: "учитель",
    startScreen: "электронный журнал /journal-app (роль учителя)",
    expectedResult: "онлайн-урок назначен и виден ученикам",
    links: [{ title: "Электронный журнал", href: "/journal-app" }],
    steps: [
      { title: "Открыть расписание", instruction: "В журнале откройте раздел расписания уроков.", selectorText: "Расписание" },
      { title: "Создать онлайн-урок", instruction: "Создайте новое занятие и укажите тип «онлайн-урок».", selectorText: "Создать" },
      { title: "Указать класс и дату", instruction: "Выберите класс, дату и время проведения.", selectorText: "Сохранить" },
      { title: "Назначить", instruction: "Подтвердите назначение — урок появится у учеников.", selectorText: "Назначить" },
    ],
  },
  {
    id: "meal",
    title: "Подтверждение назначения учителем питания",
    sample: "подтвердить питание учителю",
    keywords: ["питание", "обед", "подтвердить питание", "назначение питания"],
    role: "учитель",
    startScreen: "электронный журнал /journal-app (роль учителя)",
    expectedResult: "назначение питания подтверждено",
    links: [{ title: "Электронный журнал", href: "/journal-app" }],
    steps: [
      { title: "Открыть раздел «Питание»", instruction: "В журнале откройте раздел питания.", selectorText: "Питание" },
      { title: "Выбрать класс", instruction: "Выберите класс и период.", selectorText: "Выбрать" },
      { title: "Подтвердить", instruction: "Нажмите «Подтвердить» и проверьте результат.", selectorText: "Подтвердить" },
    ],
  },
  {
    id: "school-map",
    title: "Подобрать школу или детский сад",
    sample: "подобрать школу или детский сад",
    keywords: ["школу", "школа", "детский сад", "подобрать", "выбрать школу"],
    role: "неавторизованный / родитель",
    startScreen: "главная ЦОП — https://cop.admhmao.ru/elk",
    expectedResult: "открыта карта школ и детских садов",
    links: [{ title: "Карта школ и детских садов", href: "/elk?page=map-schools-preschools" }],
    steps: [
      { title: "Найти блок подбора", instruction: "На главной ЦОП найдите блок «Подобрать школу/детский сад».", selectorText: "Подобрать" },
      { title: "Нажать «Подобрать»", instruction: "Кнопка «Подобрать» открывает карту /elk?page=map-schools-preschools.", selectorText: "Подобрать" },
      { title: "Сравнить организации", instruction: "Используйте фильтры и выберите подходящую организацию.", selectorText: null },
    ],
  },
  {
    id: "support",
    title: "Обращение в службу поддержки",
    sample: "как обратиться в службу поддержки",
    keywords: ["поддержк", "помощь", "специалист", "вопрос специалисту", "не работает"],
    role: "любая",
    startScreen: "страница «Служба поддержки» /journal-help-action",
    expectedResult: " запрос передан специалисту",
    links: [{ title: "Служба поддержки", href: "/journal-help-action" }],
    steps: [
      { title: "Открыть службу поддержки", instruction: "Нажмите ссылку «Служба поддержки» внизу страницы.", selectorText: "Служба поддержки" },
      { title: "Подготовить данные", instruction: "Укажите регион, название организации, логин и ФИО, опишите ситуацию и приложите скриншоты.", selectorText: null },
      { title: "Передать вопрос", instruction: "Отправьте на cophelp@admhmao.ru или позвоните 8 800 100-58-67.", selectorText: null },
    ],
  },
];;

window.COP_BASE_URL = "https://cop.admhmao.ru";

window.COP_norm = function (value) {
  return String(value || "").toLowerCase().trim();
};

window.COP_absUrl = function (href) {
  if (!href) return "";
  if (/^https?:\/\//i.test(href)) return href;
  return window.COP_BASE_URL + (href.charAt(0) === "/" ? "" : "/") + href;
};

window.COP_score = function (query, scenario) {
  var q = window.COP_norm(query);
  var points = 0;
  if (!q) return 0;
  if (scenario.sample && q.indexOf(window.COP_norm(scenario.sample)) !== -1) {
    points += Math.max(4, window.COP_norm(scenario.sample).length);
  }
  (scenario.keywords || []).forEach(function (kw) {
    var k = window.COP_norm(kw);
    if (q.indexOf(k) !== -1) points += Math.max(2, k.length);
  });
  return points;
};

window.COP_find = function (query) {
  var ranked = (window.COP_KB || []).map(function (s) {
    return { scenario: s, score: window.COP_score(query, s) };
  }).filter(function (item) { return item.score > 0; })
    .sort(function (a, b) { return b.score - a.score; });
  if (!ranked.length) return { type: "none" };
  var best = ranked[0].score;
  var close = ranked.filter(function (item) { return item.score >= best * 0.75; });
  if (close.length > 1) return { type: "clarify", variants: close.map(function (item) { return item.scenario; }) };
  return { type: "found", scenario: ranked[0].scenario };
};
