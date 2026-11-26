"use strict";
const LOG_KEY="cop_response_log", STEP_KEY="cop_current_step";
const $=id=>document.getElementById(id);
function node(tag,text,cls){const n=document.createElement(tag);if(text!==undefined&&text!==null)n.textContent=String(text);if(cls)n.className=cls;return n;}
function storage(){try{return typeof browser!=="undefined"&&browser.storage?browser.storage.local:null;}catch(e){return null;}}
function openLink(href){const url=window.COP_absUrl(href);if(!url)return;try{browser.tabs.create({url});}catch(e){window.open(url,"_blank","noopener");}}
async function logQuery(query,result){const s=storage();if(!s)return;try{const d=await s.get(LOG_KEY);const items=Array.isArray(d[LOG_KEY])?d[LOG_KEY]:[];items.unshift({time:new Date().toLocaleString("ru-RU"),query,result});await s.set({[LOG_KEY]:items.slice(0,30)});renderLog();}catch(e){}}
async function renderLog(){const root=$("log");root.replaceChildren();const s=storage();if(!s){root.append(node("div","Хранилище недоступно.","empty"));return;}try{const d=await s.get(LOG_KEY),items=Array.isArray(d[LOG_KEY])?d[LOG_KEY]:[];if(!items.length){root.append(node("div","Запросов пока нет.","empty"));return;}items.forEach(x=>{const row=node("div",x.time+" · "+x.query+" → "+x.result,"log-entry");root.append(row);});}catch(e){root.append(node("div","Не удалось загрузить журнал.","empty"));}}
function activateStep(step){const s=storage();if(!s){$("status").textContent="Хранилище недоступно.";return;}s.set({[STEP_KEY]:step}).then(()=>{$("status").textContent="Подсказка отправлена на открытую страницу ЦОП.";}).catch(()=>{$("status").textContent="Откройте страницу ЦОП и попробуйте ещё раз.";});}
function renderScenario(root,s){
 const head=node("div",null,"result-head");head.append(node("div",s.title,"route-title"));head.append(node("span",s.category,"pill"));root.append(head);
 root.append(node("div","Роль: "+s.role+" · Старт: "+s.startScreen,"meta"));
 root.append(node("p","Результат: "+s.expectedResult,"meta"));
 const note=node("div",s.confidence,"note");root.append(note);
 const actions=node("div",null,"actions");(s.links||[]).forEach(l=>{const b=node("button","Открыть: "+l.title);b.addEventListener("click",()=>openLink(l.href));actions.append(b);});root.append(actions);
 const list=node("ol",null,"steps");(s.steps||[]).forEach((step,i)=>{const li=node("li");li.append(node("b",step.title));li.append(node("p",step.instruction));if(step.selectorText){const b=node("button","Подсветить «"+step.selectorText+"»");b.style.marginTop="7px";b.addEventListener("click",()=>activateStep({...step,id:s.id+"-"+i}));li.append(b);}list.append(li);});root.append(list);
}
function search(query){const q=String(query||"").trim();const root=$("result");root.replaceChildren();if(!q)return;const state=window.COP_find(q);
 if(state.type==="clarify"){root.append(node("p","Уточните, какой сценарий вам нужен:","meta"));state.variants.forEach(s=>{const b=node("button",s.title,"route");b.addEventListener("click",()=>{$("query").value=s.sample;search(s.sample);});root.append(b);});logQuery(q,"уточнение");return;}
 if(state.type==="none"){root.append(node("p","Не удалось надёжно определить маршрут. Попробуйте указать роль и действие: например, «учителю назначить онлайн-урок».","meta"));const b=node("button","Открыть службу поддержки","route");b.addEventListener("click",()=>openLink("/journal-help-action"));root.append(b);logQuery(q,"не распознано");return;}
 renderScenario(root,state.scenario);logQuery(q,state.scenario.title);
}
$("searchBtn").addEventListener("click",()=>search($("query").value));
$("query").addEventListener("keydown",e=>{if(e.key==="Enter")search($("query").value);});
$("wordBtn").addEventListener("click",()=>{const word=$("word").value.trim();if(!word){$("status").textContent="Введите название элемента.";return;}activateStep({noPanel:true,title:"Поиск: "+word,selectorText:word});});
$("word").addEventListener("keydown",e=>{if(e.key==="Enter")$("wordBtn").click();});
$("clearLog").addEventListener("click",async()=>{const s=storage();if(s){await s.set({[LOG_KEY]:[]});renderLog();}});
$("openCop").addEventListener("click",e=>{e.preventDefault();openLink("/elk");});
function renderRoutes(){const root=$("routes");(window.COP_KB||[]).forEach(s=>{const b=node("button",s.title,"route");b.addEventListener("click",()=>{$("query").value=s.sample;search(s.sample);});root.append(b);});}
renderRoutes();renderLog();$("query").focus();