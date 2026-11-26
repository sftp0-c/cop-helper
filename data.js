/* База маршрутов ЦОП. Непроверенные шаги явно помечаются и не выдаются за официальную инструкцию. */
(function () {
  "use strict";
  const BASE = "https://cop.admhmao.ru";
  const routes = [
    {
      id:"parent-journal", title:"Электронный журнал — родителю", category:"ЭЖД",
      sample:"как родителю посмотреть оценки ребенка в электронном дневнике",
      keywords:["родител","мам","пап","законный представитель","оценки","домашнее задание","дневник","электронный журнал","эжд"],
      role:"Родитель", startScreen:"ЦОП → вход в электронный журнал",
      expectedResult:"Открыт электронный журнал родителя",
      confidence:"Переход подтверждён конфигурацией расширения; дальнейшие действия зависят от учётной записи.",
      links:[{title:"Вход для родителя",href:"/journal-esia-action/mode.elk/role.parent"}],
      steps:[
        {title:"Откройте вход для родителя",instruction:"Перейдите по ссылке «Вход для родителя». Если портал запросит авторизацию, используйте ЕСИА.",selectorText:"Система Электронного журнала"},
        {title:"Завершите авторизацию",instruction:"Пройдите вход на стороне ЕСИА. Не вводите пароль Госуслуг в сторонние формы.",selectorText:null},
        {title:"Откройте дневник ребёнка",instruction:"После входа выберите нужного ребёнка, если система предлагает выбор, затем откройте оценки, расписание или домашние задания.",selectorText:null}
      ]
    },
    {
      id:"student-journal", title:"Электронный журнал — ученику", category:"ЭЖД",
      sample:"как ученику открыть свой электронный дневник и оценки",
      keywords:["ученик","школьник","ребенок","ребёнок","мои оценки","расписание","домашнее задание","дневник","электронный журнал","эжд"],
      role:"Ученик", startScreen:"ЦОП → вход в электронный журнал",
      expectedResult:"Открыт электронный журнал ученика",
      confidence:"Переход подтверждён конфигурацией расширения; дальнейшие действия зависят от учётной записи.",
      links:[{title:"Вход для ученика",href:"/journal-esia-action/mode.elk/role.student"}],
      steps:[
        {title:"Откройте вход для ученика",instruction:"Перейдите по ссылке для роли ученика.",selectorText:"Система Электронного журнала"},
        {title:"Авторизуйтесь",instruction:"Завершите авторизацию предложенным порталом способом.",selectorText:null},
        {title:"Проверьте дневник",instruction:"Откройте оценки, расписание и домашние задания в своём профиле.",selectorText:null}
      ]
    },
    {
      id:"teacher-journal", title:"Электронный журнал — учителю", category:"ЭЖД",
      sample:"как учителю войти в электронный журнал",
      keywords:["учител","педагог","классный руководитель","журнал учителю","выставить оценку","эжд"],
      role:"Учитель", startScreen:"ЦОП → вход в электронный журнал",
      expectedResult:"Открыт интерфейс электронного журнала с правами учителя",
      confidence:"Ссылка на вход задана в исходной конфигурации; доступность роли определяется учётной записью.",
      links:[{title:"Вход для учителя",href:"/journal-esia-action/mode.elk/role.teacher"}],
      steps:[
        {title:"Откройте вход для учителя",instruction:"Перейдите по ссылке для роли учителя.",selectorText:"Система Электронного журнала"},
        {title:"Авторизуйтесь",instruction:"Выполните авторизацию и дождитесь загрузки рабочего интерфейса.",selectorText:null},
        {title:"Проверьте доступные разделы",instruction:"Состав разделов зависит от назначенных прав вашей организации.",selectorText:null}
      ]
    },
    {
      id:"pfdo", title:"Переход родителя в ПФДО", category:"ПФДО",
      sample:"как родителю перейти в ПФДО и записать ребенка на кружок",
      keywords:["пфдо","кружок","секция","дополнительное образование","сертификат","записать на программу","запись на обучение"],
      role:"Родитель", startScreen:"ЦОП → раздел ПФДО / Навигатор",
      expectedResult:"Открыт портал персонифицированного дополнительного образования",
      confidence:"Адрес портала подтверждается опубликованными муниципальными материалами; наличие и расположение кнопки на главной ЦОП нужно сверять с текущей версией.",
      links:[{title:"Портал ПФДО ХМАО — Югры",href:"https://hmao.pfdo.ru/app"},{title:"ЦОП",href:"/elk"}],
      steps:[
        {title:"Откройте раздел ПФДО",instruction:"На ЦОП найдите раздел «ПФДО» или «Навигатор». Название и расположение блока могут меняться.",selectorText:"ПФДО"},
        {title:"Перейдите на портал",instruction:"Откройте портал ПФДО. Если ссылка на странице отличается, используйте кнопку перехода на самом ЦОП.",selectorText:"Перейти"},
        {title:"Войдите и выберите программу",instruction:"Авторизуйтесь доступным способом, проверьте данные ребёнка и выберите подходящую дополнительную общеобразовательную программу.",selectorText:null}
      ]
    },
    {
      id:"online-lesson", title:"Назначение онлайн-урока", category:"ЭЖД",
      sample:"как учителю назначить онлайн урок классу",
      keywords:["онлайн урок","онлайн-урок","дистанционный урок","вебинар","назначить урок","ссылка на урок"],
      role:"Учитель", startScreen:"Электронный журнал → рабочее место учителя",
      expectedResult:"Онлайн-занятие создано и отображается участникам",
      confidence:"Требует сверки с актуальной инструкцией и интерфейсом. Точные названия кнопок не подтверждены.",
      links:[{title:"Открыть электронный журнал",href:"/journal-app"}],
      steps:[
        {title:"Откройте рабочее место учителя",instruction:"Войдите в электронный журнал под учётной записью учителя.",selectorText:null},
        {title:"Найдите управление уроками",instruction:"Проверьте доступные разделы расписания и проведения занятий. Названия элементов зависят от версии интерфейса.",selectorText:"Расписание"},
        {title:"Сверьте действия с инструкцией организации",instruction:"Не выполняйте назначение по этой демонстрационной подсказке без актуальной инструкции: точный сценарий пока не подтверждён.",selectorText:null}
      ]
    },
    {
      id:"meal", title:"Назначение и подтверждение питания", category:"Питание",
      sample:"как учителю подтвердить питание ученика",
      keywords:["питание","обед","завтрак","назначить питание","подтвердить питание","питание ученика"],
      role:"Учитель", startScreen:"Подсистема питания / рабочее место учителя",
      expectedResult:"Операция с питанием выполнена и подтверждена системой",
      confidence:"Требует сверки с актуальной инструкцией и интерфейсом. Точные кнопки и порядок действий не подтверждены.",
      links:[{title:"Подсистема питания",href:"https://cop-pitanie.admhmao.ru/"}],
      steps:[
        {title:"Откройте подсистему питания",instruction:"Перейдите в подсистему питания по ссылке, если она доступна вашей организации.",selectorText:"Питание"},
        {title:"Проверьте класс и дату",instruction:"Перед подтверждением обязательно проверьте выбранный класс, дату и список обучающихся.",selectorText:null},
        {title:"Не подтверждайте наугад",instruction:"Точный порядок назначения и подтверждения требует актуальной инструкции администратора ЦОП.",selectorText:null}
      ]
    },
    {
      id:"school-map", title:"Подбор школы или детского сада", category:"Услуги",
      sample:"где подобрать школу или детский сад на ЦОП",
      keywords:["школ","детский сад","детсад","дошколь","подобрать","карта организаций"],
      role:"Без авторизации / родитель", startScreen:"Главная ЦОП",
      expectedResult:"Открыта карта школ и дошкольных организаций",
      confidence:"Путь из исходной конфигурации расширения; актуальность страницы следует проверить.",
      links:[{title:"Открыть карту организаций",href:"/elk?page=map-schools-preschools"}],
      steps:[
        {title:"Откройте карту организаций",instruction:"Перейдите к карте школ и детских садов.",selectorText:"Подобрать"},
        {title:"Используйте фильтры карты",instruction:"Уточните тип организации и местоположение, затем откройте карточку подходящей организации.",selectorText:null}
      ]
    },
    {
      id:"support", title:"Связаться со службой поддержки", category:"Помощь",
      sample:"куда обратиться если не работает ЦОП",
      keywords:["поддержк","не работает","ошибка входа","обратиться","специалист","помощь","техподдержка"],
      role:"Любая", startScreen:"ЦОП → служба поддержки",
      expectedResult:"Обращение направлено специалистам",
      confidence:"Контакты взяты из исходной версии расширения; перед публикацией их необходимо подтвердить на странице поддержки.",
      links:[{title:"Служба поддержки ЦОП",href:"/journal-help-action"}],
      steps:[
        {title:"Откройте службу поддержки",instruction:"Перейдите на страницу службы поддержки ЦОП.",selectorText:"Служба поддержки"},
        {title:"Опишите проблему",instruction:"Укажите организацию, раздел, время возникновения ошибки и последовательность действий. Не отправляйте пароль, коды ЕСИА и другие секретные данные.",selectorText:null},
        {title:"Передайте обращение",instruction:"Используйте контакты, опубликованные непосредственно на официальной странице поддержки.",selectorText:null}
      ]
    }
  ];
  const norm = value => String(value || "").toLocaleLowerCase("ru").replace(/ё/g,"е").replace(/[«»„“”"'.,!?():;]/g," ").replace(/[^\\p{L}\\p{N}\\s-]/gu," ").replace(/\\s+/g," ").trim();
  const roleHints = {
    parent:["родител","мам","пап","законный представитель"],
    student:["учен","школьник","учащ"],
    teacher:["учител","педагог","классный руководитель"]
  };
  function tokens(value){ return norm(value).split(/\\s+/).filter(x=>x.length>1); }
  function score(query, route) {
    const q=norm(query); if(!q) return 0;
    const words=tokens(q); let points=0;
    const sample=norm(route.sample), title=norm(route.title);
    if(q===sample) points+=30;
    if(sample.includes(q) || q.includes(sample)) points+=12;
    if(q.includes(title)) points+=12;
    for(const kw of route.keywords){
      const k=norm(kw);
      if(q.includes(k)) points+=Math.min(12,4+k.length/3);
      else if(k.length>4 && words.some(w=>k.startsWith(w)||w.startsWith(k.slice(0,Math.min(5,k.length))))) points+=2;
    }
    const matched=words.filter(w=>title.includes(w)||route.keywords.some(k=>norm(k).includes(w))).length;
    points+=matched*1.5;
    const role=Object.keys(roleHints).find(r=>roleHints[r].some(h=>q.includes(h)));
    if(role && route.role.toLowerCase().includes(role)) points+=7;
    else if(role && route.role.toLowerCase()!=="любая" && !route.role.toLowerCase().includes(role)) points-=4;
    return points;
  }
  function find(query) {
    const ranked=routes.map(s=>({scenario:s,score:score(query,s)})).filter(x=>x.score>=4).sort((a,b)=>b.score-a.score);
    if(!ranked.length) return {type:"none"};
    const top=ranked[0], second=ranked[1];
    if(second && second.score>=top.score*0.78) return {type:"clarify",variants:ranked.filter(x=>x.score>=top.score*0.78).slice(0,4).map(x=>x.scenario)};
    if(top.score<6) return {type:"clarify",variants:ranked.slice(0,3).map(x=>x.scenario)};
    return {type:"found",scenario:top.scenario};
  }
  window.COP_KB=routes;
  window.COP_BASE_URL=BASE;
  window.COP_norm=norm;
  window.COP_absUrl=function(href){
    if(!href) return "";
    try { const u=new URL(href,BASE); return ["https:","http:"].includes(u.protocol) ? u.href : ""; } catch(e){ return ""; }
  };
  window.COP_find=find;
})();