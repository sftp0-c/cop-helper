const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const context={window:{},URL};
vm.createContext(context);
vm.runInContext(fs.readFileSync("data.js","utf8"),context);
const find=context.window.COP_find;
const cases=[
 ["как родителю посмотреть оценки ребенка в электронном дневнике","parent-journal"],
 ["как ученику открыть свой электронный дневник и оценки","student-journal"],
 ["как учителю войти в электронный журнал","teacher-journal"],
 ["как родителю перейти в ПФДО и записать ребенка на кружок","pfdo"],
 ["как учителю назначить онлайн урок классу","online-lesson"],
 ["как учителю подтвердить питание ученика","meal"],
 ["где подобрать школу или детский сад на ЦОП","school-map"],
 ["куда обратиться если не работает ЦОП","support"]
];
for(const [query,id] of cases){
 const result=find(query);
 assert.equal(result.type,"found",query+" should resolve to "+id);
 assert.equal(result.scenario.id,id,query+" should resolve to "+id);
}
assert.equal(find("абракадабра неизвестный запрос").type,"none");
console.log("Cop Helper v2 search smoke tests passed: "+cases.length+" routes + unknown query.");
