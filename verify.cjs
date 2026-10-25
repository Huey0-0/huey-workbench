const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('app.js','utf8');
function env(raw=null,failWrite=false){
 const els={};function el(s){return els[s]||=( {innerHTML:'',textContent:'',value:'',open:false,files:[],dataset:{},classList:{add(){},remove(){},toggle(){return false},contains(){return false}},setAttribute(){},removeAttribute(){},addEventListener(){},focus(){},showModal(){this.open=true},close(){this.open=false},click(){},append(){},remove(){}})}
 const saved=new Map();if(raw!==null)saved.set('huey-workspace-v1',raw);
 const ctx={console,Date,URL,Blob,Set,Map,JSON,Object,String,Number,Array,Error,SyntaxError,structuredClone,crypto:require('node:crypto').webcrypto,setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:k=>saved.get(k)??null,setItem:(k,v)=>{if(failWrite)throw Error('Simulated storage failure');saved.set(k,v)}},document:{querySelector:el,querySelectorAll:()=>[],addEventListener(){},createElement:()=>el('created'),body:el('body')},location:{hash:''},history:{replaceState(){}},window:{scrollTo(){},addEventListener(){}}};
 vm.createContext(ctx);vm.runInContext(source,ctx);
 return {run:s=>vm.runInContext(s,ctx),saved,els}
}
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name)}
const e=env();
test('Initial overview includes demo disclosure, 3 projects, and linked tasks',()=>{assert.equal(e.run('state.projects.length'),3);assert.match(e.els['#main'].innerHTML,/均为虚构/);assert.equal(e.run('state.tasks.filter(t=>t.project).length'),4)});
test('Valid exported JSON restores exact project, task and resource data',()=>{assert.deepEqual(JSON.parse(e.run('JSON.stringify(validate(JSON.parse(JSON.stringify(state))))')),JSON.parse(e.run('JSON.stringify(state)')))});
test('Reject malformed backups and dangling project references',()=>{assert.throws(()=>e.run('validate({version:2,projects:[],tasks:[],resources:[]})'));assert.throws(()=>e.run('validate({...state,tasks:[{...state.tasks[0],project:"missing"}]})'));assert.throws(()=>e.run('validate({...state,projects:[state.projects[0],state.projects[0]]})'))});
test('Reject unsafe URLs and impossible dates',()=>{assert.equal(e.run('safeUrl("javascript:alert(1)")'),null);assert.equal(e.run('safeUrl("https://user:pass@example.com")'),null);assert.equal(e.run('validDate("2026-02-30")'),false);assert.equal(e.run('validDate("2028-02-29")'),true);assert.equal(e.run('validDate("")'),true)});
test('HTML payloads are displayed as plain text in projects and tasks',()=>{assert.equal(e.run('projectRow({...state.projects[0],name:"<img src=x onerror=alert(1)>"}).includes("<img")'),false);assert.equal(e.run('taskRow({...state.tasks[0],title:"<script>alert(1)</script>"}).includes("<script>")'),false)});
test('Completed project progress is normalized to 100%',()=>{assert.equal(e.run('validate({...state,projects:[{...state.projects[0],status:"done",progress:20}],tasks:[]}).projects[0].progress'),100)});
test('Successful save persists edits across reload',()=>{assert.equal(e.run('change(s=>{s.projects[0].name="QA saved project"})'),true);const re=env(e.saved.get('huey-workspace-v1'));assert.equal(re.run('state.projects[0].name'),'QA saved project')});
test('Write failure preserves prior in-memory state',()=>{const f=env(null,true);assert.equal(f.run('change(s=>{s.projects=[];s.tasks=[]})'),false);assert.equal(f.run('state.projects.length'),3)});
test('Corrupt existing storage is not overwritten by ordinary edits',()=>{const f=env('{broken');assert.equal(f.run('Boolean(storageError)'),true);assert.equal(f.run('commit(seed())'),false);assert.equal(f.saved.get('huey-workspace-v1'),'{broken');assert.equal(f.run('commit(seed(),true)'),true)});
test('Search works across projects, tasks, and resources',()=>{e.run('query="SLCP";render()');assert.match(e.els['#main'].innerHTML,/SLCP 官方网站/);assert.match(e.els['#main'].innerHTML,/远山制造/);e.run('query="unlikely-no-match";render()');assert.match(e.els['#main'].innerHTML,/没有找到/);});
test('Empty workspace renders all views without exceptions',()=>{e.run('state={version:1,projects:[],tasks:[],resources:[]};query=""');for(const v of ['overview','projects','tasks','resources','settings'])e.run('go("'+v+'")')});
test('Today is not labeled overdue, yesterday is overdue',()=>{assert.equal(e.run('taskRow({...seed().tasks[0],due:today()}).includes("已逾期")'),false);assert.equal(e.run('taskRow({...seed().tasks[0],due:dayAdd(-1)}).includes("已逾期")'),true)});
console.log(passed+' checks passed');



