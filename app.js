'use strict';
const $ = s => document.querySelector(s);
const KEY = 'huey-workspace-v1';
const ICONS = {
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9H3Z"/>',
 check:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m7 12 3 3 7-7"/>',
 book:'<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/>',
 settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="3" fill="currentColor" stroke="none"/>',
 search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 5h3"/>',
 edit:'<path d="m14 5 5 5M4 20l5-1L21 7l-5-5L4 14Zm0 0 5-1"/>',
 trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
 external:'<path d="M14 3h7v7m0-7L10 14m0-11H3v18h18v-7"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
 upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',
 link:'<path d="m10 13 4-4m-6 5-2 2a4 4 0 0 0 6 6l4-4m0-8 2-2a4 4 0 0 0-6-6L8 6"/>'
};
function icon(n){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[n]||ICONS.folder)+'</svg>'}
function fillIcons(){document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon))}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function dateKey(d=new Date()){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function dateObj(v){return new Date(v+'T12:00:00')}
function dayAdd(n, base=new Date()){const d=new Date(base);d.setDate(d.getDate()+n);return dateKey(d)}
function today(){return dateKey()}
function humanDate(d){if(!d)return '未设截止日期';if(d===today())return '今天';if(d===dayAdd(1))return '明天';return Number(d.slice(5,7))+'月'+Number(d.slice(8))+'日'}
function fullDate(d=new Date()){return d.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'})}
function validDate(v){return v==='' || (typeof v==='string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && dateKey(dateObj(v))===v)}
function safeUrl(v){try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null}catch{return null}}
const statuses={active:'进行中',pending:'待开始',blocked:'待补资料',done:'已完成'};
const types=['Higg FEM','SLCP','ZDHC','其他'];
const priorities={normal:'普通',high:'优先'};
const seed=()=>({version:1,projects:[
{id:'demo-p1',name:'青禾工厂 · 环境绩效审核',type:'Higg FEM',due:dayAdd(4),status:'active',progress:65,notes:'整理能源与用水记录，完成证据核对后推进报告。此项目仅用于展示。',demo:true},
{id:'demo-p2',name:'远山制造 · 社会责任审核',type:'SLCP',due:dayAdd(7),status:'pending',progress:20,notes:'准备现场审核清单，提前确认资料收集情况。此项目仅用于展示。',demo:true},
{id:'demo-p3',name:'森屿制衣 · 化学品管理',type:'ZDHC',due:dayAdd(2),status:'blocked',progress:80,notes:'跟进化学品清单中的缺失资料。此项目仅用于展示。',demo:true}
],tasks:[
{id:'demo-t1',title:'核对能源与用水数据',due:today(),project:'demo-p1',priority:'high',done:false,demo:true},
{id:'demo-t2',title:'跟进化学品清单补充资料',due:today(),project:'demo-p3',priority:'high',done:false,demo:true},
{id:'demo-t3',title:'准备下次现场审核清单',due:dayAdd(1),project:'demo-p2',priority:'normal',done:false,demo:true},
{id:'demo-t4',title:'整理本周出差凭证',due:dayAdd(3),project:'',priority:'normal',done:false,demo:true},
{id:'demo-t5',title:'确认项目资料收集范围',due:today(),project:'demo-p1',priority:'normal',done:true,demo:true}
],resources:[
{id:'demo-r1',name:'SLCP 官方网站',category:'审核标准',url:'https://slconvergence.org/',description:'社会与劳工融合项目',demo:true},
{id:'demo-r2',name:'Cascale 官方网站',category:'审核标准',url:'https://cascale.org/',description:'了解 Higg Index 相关信息',demo:true},
{id:'demo-r3',name:'ZDHC 官方网站',category:'化学品管理',url:'https://www.roadmaptozero.com/',description:'化学品管理与项目资料',demo:true}
]});
function validate(input){
 if(!input||input.version!==1||!['projects','tasks','resources'].every(k=>Array.isArray(input[k])&&input[k].length<=5000))throw Error('文件格式不符，请选择此工作台导出的 JSON 备份。');
 const ids=new Set();
 function base(x){if(!x||typeof x.id!=='string'||x.id.length>100||!x.id||ids.has(x.id))throw Error('数据中包含无效或重复编号。');ids.add(x.id);return {id:x.id,demo:x.demo===true}}
 function txt(v,max,required=false){if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw Error('数据文本缺失或超出允许长度。');return v.trim()}
 function dt(v){if(!validDate(v))throw Error('数据中包含无效日期。');return v}
 const projects=input.projects.map(x=>{const b=base(x);if(!Object.hasOwn(statuses,x.status)||!types.includes(x.type)||!Number.isInteger(x.progress)||x.progress<0||x.progress>100)throw Error('项目状态或进度无效。');return {...b,name:txt(x.name,160,true),type:x.type,due:dt(x.due),status:x.status,progress:x.status==='done'?100:x.progress,notes:txt(x.notes,3000)}});
 const projectIds=new Set(projects.map(x=>x.id));
 const tasks=input.tasks.map(x=>{const b=base(x);if(typeof x.done!=='boolean'||!Object.hasOwn(priorities,x.priority)||typeof x.project!=='string'||(x.project&&!projectIds.has(x.project)))throw Error('待办的关联项目或状态无效。');return {...b,title:txt(x.title,200,true),due:dt(x.due),project:x.project,priority:x.priority,done:x.done}});
 const resources=input.resources.map(x=>{const b=base(x);const url=safeUrl(txt(x.url,2048,true));if(!url)throw Error('资料网址须为有效的 HTTP 或 HTTPS 链接。');return {...b,name:txt(x.name,160,true),category:txt(x.category,60,true),url,description:txt(x.description,400)}});
 return {version:1,projects,tasks,resources}
}
let state,storageError='',rawBackup=null;
try{rawBackup=localStorage.getItem(KEY);state=rawBackup?validate(JSON.parse(rawBackup)):seed()}catch(e){state={version:1,projects:[],tasks:[],resources:[]};storageError='读取本地数据失败。原有内容未被覆盖，请先在「数据与设置」导出原始数据，再导入有效备份恢复。'}
let view='overview',query='',projectFilter='all',taskFilter='open',resourceFilter='all',weekOffset=0,selectedDay=today(),editing=null;
let toastTimer,returnFocus=null;
function notify(msg){$('#toast').textContent=msg;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3300)}
function commit(next,allowRecovery=false){
 if(storageError&&!allowRecovery){notify('请先在数据与设置中恢复数据。');return false}
 try{next=validate(next);localStorage.setItem(KEY,JSON.stringify(next));state=next;storageError='';$('#saveStatus').textContent='已保存到此浏览器';return true}
 catch(e){notify('未能保存：'+(e.name==='QuotaExceededError'?'浏览器存储空间不足，请先导出备份。':e.message));return false}
}
function change(fn){const next=structuredClone(state);fn(next);if(commit(next)){render();return true}return false}
function projectName(id){return state.projects.find(p=>p.id===id)?.name||'个人事项'}
function tasksSorted(a){return [...a].sort((x,y)=>Number(x.done)-Number(y.done)||(x.due||'9999').localeCompare(y.due||'9999')||(x.priority==='high'?-1:1))}
function titleRow(title,sub,kind){return '<div class="page-title-row"><div><div class="eyebrow">'+(view==='overview'?'A LITTLE CLARITY, EVERY DAY.':'YOUR PERSONAL WORKSPACE')+'</div><h1>'+title+'</h1><p class="subtitle">'+sub+'</p></div>'+(kind?'<button class="btn primary" data-add="'+kind+'">'+icon('plus')+'新建'+({project:'项目',task:'待办',resource:'资料'}[kind])+'</button>':'')+'</div>'}
function empty(title,desc,kind){return '<div class="empty">'+icon('folder')+'<strong>'+title+'</strong>'+desc+(kind?'<br><button class="btn secondary" data-add="'+kind+'">'+icon('plus')+'添加第一项</button>':'')+'</div>'}
function statusBadge(p){return '<span class="status '+esc(p.status)+'">'+statuses[p.status]+'</span>'}
function projectRow(p){
 const theme=p.type==='SLCP'?'gold':p.type==='ZDHC'?'blue':'';
 return '<div class="project-row"><div class="project-symbol '+theme+'">'+(p.type==='Higg FEM'?'FEM':p.type==='其他'?'PRO':esc(p.type))+'</div><div class="project-info"><h3 class="item-title"><button class="title-button" data-edit="project" data-id="'+esc(p.id)+'">'+esc(p.name)+'</button></h3><div class="item-meta"><span class="type-tag">'+esc(p.type)+'</span><span class="'+(p.due&&p.due<today()&&p.status!=='done'?'overdue':'')+'">'+humanDate(p.due)+'截止</span>'+(p.demo?'<span class="demo-tag">示例</span>':'')+'</div><div class="progress-line"><div class="progress-track" role="progressbar" aria-label="'+esc(p.name)+'进度" aria-valuenow="'+p.progress+'" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:'+p.progress+'%"></div></div><span class="progress-num">'+p.progress+'%</span></div></div><div class="row-right">'+statusBadge(p)+'</div></div>'
}
function taskRow(t,full=false){return '<div class="task-row '+(t.done?'completed':'')+'"><input class="task-check" type="checkbox" data-toggle-task="'+esc(t.id)+'" aria-label="'+(t.done?'取消完成：':'完成：')+esc(t.title)+'" '+(t.done?'checked':'')+'><div class="task-content"><h3 class="item-title"><button class="title-button" data-edit="task" data-id="'+esc(t.id)+'">'+esc(t.title)+'</button></h3><div class="item-meta"><span class="priority-dot '+esc(t.priority)+'"></span><span class="'+(!t.done&&t.due&&t.due<today()?'overdue':'')+'">'+humanDate(t.due)+(!t.done&&t.due&&t.due<today()?' · 已逾期':'')+'</span><span>'+esc(projectName(t.project))+'</span>'+(t.demo?'<span class="demo-tag">示例</span>':'')+'</div></div>'+(full?'<button class="icon-button" data-delete="task" data-id="'+esc(t.id)+'" aria-label="删除待办 '+esc(t.title)+'">'+icon('trash')+'</button>':'')+'</div>'}
function resourceCard(r,full=false){return '<article class="resource-card"><a class="resource-link" href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer"><span class="external-icon">↗</span><div class="resource-icon">'+icon('book')+'</div><h3>'+esc(r.name)+'</h3><p>'+esc(r.description||r.category)+'</p></a>'+(full?'<div class="item-meta" style="margin-top:12px"><span class="type-tag">'+esc(r.category)+'</span>'+(r.demo?'<span class="demo-tag">示例</span>':'')+'</div><div class="resource-tools"><button class="icon-button" data-edit="resource" data-id="'+esc(r.id)+'" aria-label="编辑资料 '+esc(r.name)+'">'+icon('edit')+'</button><button class="icon-button" data-delete="resource" data-id="'+esc(r.id)+'" aria-label="删除资料 '+esc(r.name)+'">'+icon('trash')+'</button></div>':'')+'</article>'}
function demoNotice(){return ['projects','tasks','resources'].some(k=>state[k].some(x=>x.demo))?'<div class="demo-notice"><span>当前含演示内容，方便你先熟悉工作台。示例项目与工厂均为虚构。</span><button data-action="clearDemo">移除示例内容</button></div>':''}
function stat(label,n,unit,ico,theme,target,filter){return '<button class="stat" data-stat="'+target+'" data-filter="'+filter+'"><div><span class="stat-title">'+label+'</span><span class="stat-number">'+n+'<small>'+unit+'</small></span></div><span class="stat-icon '+theme+'">'+icon(ico)+'</span></button>'}
function calendar(){
 const base=new Date();const weekday=(base.getDay()+6)%7;base.setDate(base.getDate()-weekday+weekOffset*7);
 const dates=Array.from({length:7},(_,i)=>dayAdd(i,base));
 const events=[...state.tasks.filter(t=>!t.done&&t.due===selectedDay).map(t=>({id:t.id,kind:'task',name:t.title,sub:'待办事项'})),...state.projects.filter(p=>p.status!=='done'&&p.due===selectedDay).map(p=>({id:p.id,kind:'project',name:p.name,sub:'项目截止'}))];
 return '<section class="panel"><div class="panel-head"><h2>本周安排</h2><div class="cal-actions"><button class="icon-button" data-week="-1" aria-label="上一周">‹</button><button class="quiet" data-action="todayWeek">'+Number(dates[0].slice(5,7))+'月'+Number(dates[0].slice(8))+'日 — '+Number(dates[6].slice(5,7))+'月'+Number(dates[6].slice(8))+'日</button><button class="icon-button" data-week="1" aria-label="下一周">›</button></div></div><div class="week-days">'+dates.map((d,i)=>'<button class="week-day '+(d===selectedDay?'active ':'')+(state.tasks.some(t=>t.due===d&&!t.done)||state.projects.some(p=>p.due===d&&p.status!=='done')?'has-task':'')+'" data-day="'+d+'" aria-label="'+d+'" aria-pressed="'+(d===selectedDay)+'"><span>'+['一','二','三','四','五','六','日'][i]+'</span><strong>'+Number(d.slice(8))+'</strong><i></i></button>').join('')+'</div>'+(events.length?'<div class="calendar-events">'+events.map(e=>'<div class="calendar-event"><button class="title-button" data-edit="'+e.kind+'" data-id="'+esc(e.id)+'">'+esc(e.name)+'</button><span>'+e.sub+' · '+humanDate(selectedDay)+'</span></div>').join('')+'</div>':'<div class="calendar-note">'+humanDate(selectedDay)+'暂无截止事项，给自己留一点从容。</div>')+'</section>'
}
function overview(){
 const open=state.tasks.filter(t=>!t.done),active=state.projects.filter(p=>p.status!=='done'),todayTasks=tasksSorted(state.tasks.filter(t=>t.due===today()));
 const list=state.projects.filter(p=>projectFilter==='all'||p.status===projectFilter).slice(0,3);
 const hour=new Date().getHours(),greeting=hour<6?'夜深了':hour<12?'早上好':hour<18?'下午好':'晚上好';
 return titleRow(greeting+'，Huey <span style="font-size:22px;color:#b7a86e" aria-hidden="true">☀</span>',fullDate()+' · 今天也按自己的节奏来。','project')+
 '<section class="hero"><div class="hero-copy"><div class="hero-tag">MAKE ROOM FOR FOCUS</div><h2>有条不紊，自在推进。</h2><p>把项目、待办和资料放在一起，让每一步都清晰。<br>今天有 <strong>'+todayTasks.filter(t=>!t.done).length+'</strong> 项待办等你推进，专注做好眼前的事。</p></div><div class="hero-art" aria-hidden="true"><div class="art-ring"></div><div class="art-line"></div><span class="art-star">✳</span><div class="art-card"></div><span class="art-check">✓</span><span class="art-label">ONE STEP AT A TIME.</span></div></section>'+
 '<div class="stats">'+stat('未完成项目',active.length,'个','folder','','projects','ongoing')+stat('待完成事项',open.length,'项','clock','amber','tasks','open')+stat('本周截止待办',open.filter(t=>t.due&&t.due>=weekStart()&&t.due<=weekEnd()).length,'项','calendar','blue','tasks','week')+stat('已完成项目',state.projects.filter(p=>p.status==='done').length,'个','check','gray','projects','done')+'</div>'+
 '<div class="dashboard-columns"><div><section class="panel"><div class="panel-head"><h2>审核项目 <span class="count-pill">'+state.projects.length+'</span></h2><button class="quiet" data-view="projects">查看全部 '+icon('arrow')+'</button></div><div class="tabs">'+[['all','全部项目'],['active','进行中'],['pending','待开始'],['done','已完成']].map(([k,v])=>'<button class="tab '+(projectFilter===k?'active':'')+'" data-project-filter="'+k+'">'+v+'</button>').join('')+'</div>'+ (list.length?list.map(projectRow).join(''):empty('这里还没有项目','添加一个项目，开始安排下一步。','project'))+'</section>'+
 '<div class="section-head"><h2>常用资料</h2><button class="quiet" data-view="resources">管理资料 '+icon('arrow')+'</button></div>'+(state.resources.length?'<div class="resource-grid">'+state.resources.slice(0,3).map(r=>resourceCard(r)).join('')+'</div>':'<section class="panel">'+empty('常用链接，随手可达','把常用的文档、网盘或指南链接添加到这里。','resource')+'</section>')+demoNotice()+'</div>'+
 '<div><section class="panel"><div class="panel-head"><h2>今日待办 <span class="count-pill">'+todayTasks.filter(t=>!t.done).length+'</span></h2><button class="quiet" data-view="tasks">全部 '+icon('arrow')+'</button></div><div class="task-list">'+(todayTasks.length?todayTasks.map(t=>taskRow(t)).join(''):empty('今天的待办已安排妥当','也可以为自己添加一个小目标。'))+'</div><button class="task-add" data-add="task">'+icon('plus')+'添加待办事项</button></section>'+calendar()+'</div></div>'
}
function weekStart(){const d=new Date();return dayAdd(-((d.getDay()+6)%7),d)}
function weekEnd(){return dayAdd(6,dateObj(weekStart()))}
function projectPage(){
 const filtered=state.projects.filter(p=>projectFilter==='all'||(projectFilter==='ongoing'?p.status!=='done':p.status===projectFilter));
 return titleRow('审核项目','从准备到交付，清晰掌握每个项目的节奏。','project')+
 '<div class="toolbar"><div class="filter-group">'+[['all','全部项目'],['ongoing','未完成'],...Object.entries(statuses)].map(([k,v])=>'<button class="filter-btn '+(projectFilter===k?'active':'')+'" data-project-filter="'+k+'">'+v+'</button>').join('')+'</div><span class="subtle-note">'+filtered.length+' 个项目</span></div>'+
 (filtered.length?'<div class="full-projects">'+filtered.map(p=>'<article class="project-card">'+projectRow(p)+'<p class="project-description">'+esc(p.notes||'暂无项目备注。')+'</p><div class="project-card-bottom"><span class="item-meta">'+state.tasks.filter(t=>t.project===p.id&&!t.done).length+' 项未完成待办</span><div><button class="icon-button" data-edit="project" data-id="'+esc(p.id)+'" aria-label="编辑项目 '+esc(p.name)+'">'+icon('edit')+'</button><button class="icon-button" data-delete="project" data-id="'+esc(p.id)+'" aria-label="删除项目 '+esc(p.name)+'">'+icon('trash')+'</button></div></div></article>').join('')+'</div>':'<section class="panel">'+empty('没有符合条件的项目','试试其他筛选条件，或新建一个项目。','project')+'</section>')+demoNotice()
}
function taskPage(){
 let list=state.tasks.filter(t=>taskFilter==='all'||(taskFilter==='done'?t.done:taskFilter==='today'?t.due===today()&&!t.done:taskFilter==='overdue'?t.due&&t.due<today()&&!t.done:taskFilter==='week'?t.due&&t.due>=weekStart()&&t.due<=weekEnd()&&!t.done:!t.done));
 list=tasksSorted(list);
 return titleRow('待办事项','把大事拆小，一件一件完成。','task')+'<div class="toolbar"><div class="filter-group">'+[['open','待完成'],['today','今天'],['week','本周'],['overdue','已逾期'],['done','已完成'],['all','全部']].map(([k,v])=>'<button class="filter-btn '+(taskFilter===k?'active':'')+'" data-task-filter="'+k+'">'+v+'</button>').join('')+'</div><span class="subtle-note">'+list.length+' 项待办</span></div><section class="panel full-tasks"><div class="task-list">'+(list.length?list.map(t=>taskRow(t,true)).join(''):empty('暂时没有这些待办','为下一步留一个清晰的提醒。','task'))+'</div></section>'+demoNotice()
}
function resourcePage(){
 const categories=[...new Set(state.resources.map(r=>r.category))];
 if(resourceFilter!=='all'&&!categories.includes(resourceFilter))resourceFilter='all';
 const list=state.resources.filter(r=>resourceFilter==='all'||r.category===resourceFilter);
 return titleRow('常用资料','常用的标准、指南和文档链接，随手可达。','resource')+'<div class="toolbar"><div class="filter-group">'+['all',...categories].map(c=>'<button class="filter-btn '+(resourceFilter===c?'active':'')+'" data-resource-filter="'+esc(c)+'">'+(c==='all'?'全部资料':esc(c))+'</button>').join('')+'</div><span class="subtle-note">'+list.length+' 个链接</span></div>'+(list.length?'<div class="resource-grid resources-page">'+list.map(r=>resourceCard(r,true)).join('')+'</div>':'<section class="panel">'+empty('建立你的资料入口','支持公开网页、个人网盘或在线文档的链接。','resource')+'</section>')+demoNotice()
}
function settingsPage(){return titleRow('数据与设置','让工作资料有备份，换个设备也能接着用。')+
 '<section class="settings-card"><h2>属于你的工作空间</h2><p>项目、待办和资料链接仅保存在当前浏览器中，不会自动同步到其他设备。清除浏览器数据可能会删除这些内容。建议定期导出备份，再在另一台设备上导入。此网站页面可通过链接访问；你录入的内容仅保存在当前浏览器，不会上传到网站服务器。</p><div class="item-meta">'+state.projects.length+' 个项目 · '+state.tasks.length+' 项待办 · '+state.resources.length+' 个资料链接</div></section>'+
 '<section class="settings-card"><h2>备份与迁移</h2><p>导出一个 JSON 文件，完整保留项目、进度、待办和资料链接。导入前会显示内容数量；确认后将替换当前工作台数据。</p><div class="settings-actions"><button class="btn primary" data-action="export">'+icon('download')+'导出完整备份</button><button class="btn secondary" data-action="import">'+icon('upload')+'导入备份</button>'+(storageError?'<button class="btn secondary" data-action="rawExport">导出原始数据</button>':'')+'</div></section>'+
 '<section class="settings-card"><h2>示例内容</h2><p>首次进入时提供了虚构项目与示例待办，帮助你熟悉用法。移除示例会保留你新建的所有内容；编辑示例后保存的内容也会保留。</p><button class="btn secondary" data-action="clearDemo">移除示例内容</button></section>'+
 '<section class="settings-card"><h2>使用小贴士</h2><p>点击项目或待办标题即可编辑；勾选待办表示完成。顶部搜索可查找整个工作台，按 / 快速开始搜索，Esc 清除搜索。项目进度由你手动更新，标记项目完成后会设为 100%。常用资料存储链接，不上传文件。</p></section>'
}
function searchPage(){
 const match=vals=>vals.some(v=>String(v).toLowerCase().includes(query.toLowerCase()));
 const ps=state.projects.filter(p=>match([p.name,p.type,p.notes])),ts=state.tasks.filter(t=>match([t.title,projectName(t.project)])),rs=state.resources.filter(r=>match([r.name,r.category,r.description,r.url]));
 return titleRow('搜索结果','“'+esc(query)+'” · 找到 '+(ps.length+ts.length+rs.length)+' 项内容')+
 (ps.length?'<h2 class="search-heading">审核项目</h2><section class="panel">'+ps.map(projectRow).join('')+'</section>':'')+
 (ts.length?'<h2 class="search-heading">待办事项</h2><section class="panel"><div class="task-list">'+ts.map(t=>taskRow(t,true)).join('')+'</div></section>':'')+
 (rs.length?'<h2 class="search-heading">常用资料</h2><div class="resource-grid resources-page">'+rs.map(r=>resourceCard(r,true)).join('')+'</div>':'')+
 (!ps.length&&!ts.length&&!rs.length?'<section class="panel">'+empty('没有找到相关内容','换个关键词试试，或清除搜索返回工作台。')+'<div style="text-align:center;padding-bottom:25px"><button class="btn secondary" data-action="clearSearch">清除搜索</button></div></section>':'')
}
function render(){
 const names={overview:'工作概览',projects:'审核项目',tasks:'待办事项',resources:'常用资料',settings:'数据与设置'};
 $('#breadcrumbTitle').textContent=query?'搜索结果':names[view];
 document.querySelectorAll('.nav-item').forEach(b=>{b.classList.toggle('active',!query&&b.dataset.view===view);if(!query&&b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 $('#navProjects').textContent=state.projects.filter(p=>p.status!=='done').length;$('#navTasks').textContent=state.tasks.filter(t=>!t.done).length;
 $('#main').innerHTML=(storageError?'<div class="storage-notice" role="alert">'+esc(storageError)+' <button class="quiet" data-view="settings">前往数据与设置</button></div>':'')+(query?searchPage():({overview,projects:projectPage,tasks:taskPage,resources:resourcePage,settings:settingsPage}[view])());
 if(storageError)$('#saveStatus').textContent='本地数据需要恢复';fillIcons()
}
function go(v){if(!['overview','projects','tasks','resources','settings'].includes(v))return;view=v;query='';$('#searchInput').value='';if(v==='overview')projectFilter='all';history.replaceState(null,'','#'+v);$('#sidebar').classList.remove('open');$('#mobileMenu').setAttribute('aria-expanded','false');render();window.scrollTo({top:0,behavior:'instant'})}
function field(label,name,value,type='text',extra=''){return '<label class="field"><span>'+label+'</span><input type="'+type+'" name="'+name+'" value="'+esc(value)+'" '+extra+'></label>'}
function selectField(label,name,opts,value){return '<label class="field"><span>'+label+'</span><select name="'+name+'">'+opts.map(([v,t])=>'<option value="'+esc(v)+'" '+(value===v?'selected':'')+'>'+esc(t)+'</option>').join('')+'</select></label>'}
function openEditor(kind,id){
 if(storageError){notify('请先恢复工作台数据。');return}
 const key={project:'projects',task:'tasks',resource:'resources'}[kind],item=id?state[key].find(x=>x.id===id):{};
 if(!item)return;editing={kind,id};returnFocus=document.activeElement;
 $('#dialogTitle').textContent=(id?'编辑':'新建')+{project:'项目',task:'待办',resource:'资料'}[kind];$('#formError').textContent='';
 let html='';
 if(kind==='project')html=field('项目名称 *','name',item.name||'','text','required maxlength="160" placeholder="例如：某工厂 · 环境绩效审核"')+'<div class="field-row">'+selectField('审核类型','type',types.map(x=>[x,x]),item.type||types[0])+selectField('项目状态','status',Object.entries(statuses),item.status||'active')+'</div><div class="field-row">'+field('截止日期','due',item.due||'','date')+field('进度（0–100%）','progress',item.progress??0,'number','required min="0" max="100" step="1"')+'</div><label class="field"><span>项目备注</span><textarea name="notes" maxlength="3000" placeholder="记录当前进展、下一步或需要跟进的资料…">'+esc(item.notes||'')+'</textarea></label><div class="form-hint">进度可手动更新。选择「已完成」时会自动设为 100%。</div>';
 if(kind==='task')html=field('待办事项 *','title',item.title||'','text','required maxlength="200" placeholder="用一句话写清楚下一步要做什么"')+'<div class="field-row">'+field('截止日期','due',item.due??today(),'date')+selectField('优先级','priority',Object.entries(priorities),item.priority||'normal')+'</div>'+selectField('关联项目','project',[['','个人事项'],...state.projects.map(p=>[p.id,p.name])],item.project||'')+selectField('完成状态','done',[['false','待完成'],['true','已完成']],String(item.done||false));
 if(kind==='resource')html=field('资料名称 *','name',item.name||'','text','required maxlength="160" placeholder="例如：常用审核指南"')+field('网址 *','url',item.url||'','url','required maxlength="2048" placeholder="https://"')+field('分类 *','category',item.category||'常用资料','text','required maxlength="60" placeholder="例如：审核标准、工作文件"')+field('简短说明','description',item.description||'','text','maxlength="400" placeholder="写下这份资料的用途"')+'<div class="form-hint">支持 HTTP / HTTPS 网页与在线文档链接。工作台不会更改原链接的访问权限。</div>';
 $('#editorFields').innerHTML=html;$('#editor').showModal()
}
$('#editorForm').addEventListener('submit',e=>{
 e.preventDefault();const data=Object.fromEntries(new FormData(e.target));for(const k of Object.keys(data))data[k]=data[k].trim();
 const {kind,id}=editing,key={project:'projects',task:'tasks',resource:'resources'}[kind];
 if(!(data.name||data.title)){ $('#formError').textContent='名称不能为空或只有空格。';return}
 if(kind==='resource'&&(!data.category||!safeUrl(data.url))){$('#formError').textContent='请填写分类，并使用有效的 HTTP 或 HTTPS 网址。';return}
 if('due'in data&&!validDate(data.due)){$('#formError').textContent='请选择有效日期。';return}
 let record={...data,id:id||crypto.randomUUID(),demo:false};
 if(kind==='project'){record.progress=data.status==='done'?100:Number(data.progress);if(!Number.isInteger(record.progress)||record.progress<0||record.progress>100){$('#formError').textContent='进度须为 0 到 100 之间的整数。';return}}
 if(kind==='task')record.done=data.done==='true';
 if(kind==='resource')record.url=safeUrl(data.url);
 const ok=change(s=>{if(id)s[key]=s[key].map(x=>x.id===id?record:x);else s[key].unshift(record)});
 if(ok){closeEditor();notify('已保存'+{project:'项目',task:'待办',resource:'资料'}[kind])}
});
function closeEditor(){$('#editor').close();returnFocus?.isConnected&&returnFocus.focus();editing=null}
$('#closeEditor').onclick=closeEditor;$('#cancelEditor').onclick=closeEditor;
$('#editor').addEventListener('click',e=>{if(e.target===$('#editor')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeEditor()}});
function askConfirm(title,msg,action){
 $('#confirmTitle').textContent=title;$('#confirmMessage').textContent=msg;$('#confirmDialog').showModal();
 $('#confirmOk').onclick=()=>{$('#confirmDialog').close();action()};
 $('#confirmCancel').onclick=()=>$('#confirmDialog').close()
}
function deleteItem(kind,id){
 const key={project:'projects',task:'tasks',resource:'resources'}[kind],item=state[key].find(x=>x.id===id);if(!item)return;
 askConfirm('删除'+{project:'项目',task:'待办',resource:'资料'}[kind],'确定删除「'+(item.name||item.title)+'」？'+(kind==='project'?'关联待办会保留，并改为个人事项。':'此操作无法撤销。'),()=>{if(change(s=>{s[key]=s[key].filter(x=>x.id!==id);if(kind==='project')s.tasks.forEach(t=>{if(t.project===id)t.project=''})}))notify('已删除')})
}
function clearDemo(){
 const count=['projects','tasks','resources'].reduce((n,k)=>n+state[k].filter(x=>x.demo).length,0);
 if(!count){notify('没有需要移除的示例内容。');return}
 askConfirm('移除示例内容','将移除 '+count+' 项示例。你新增或编辑保存的内容会保留；关联到示例项目的待办会改为个人事项。',()=>{if(change(s=>{for(const k of ['projects','tasks','resources'])s[k]=s[k].filter(x=>!x.demo);const ids=new Set(s.projects.map(x=>x.id));s.tasks.forEach(t=>{if(t.project&&!ids.has(t.project))t.project=''})}))notify('示例已移除，开始安排自己的工作吧。')})
}
function download(content,name,type='application/json'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportData(){if(storageError){notify('读取异常时请使用「导出原始数据」。');return}download(JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2),'Huey_Workspace_'+today()+'.json');notify('已导出完整备份')}
$('#importInput').onchange=async e=>{
 const file=e.target.files[0];e.target.value='';if(!file)return;
 try{if(file.size>10000000)throw Error('备份文件过大，请使用 10 MB 以内的 JSON 文件。');const next=validate(JSON.parse(await file.text()));
 askConfirm('导入工作台备份','包含 '+next.projects.length+' 个项目、'+next.tasks.length+' 项待办和 '+next.resources.length+' 个资料链接。\n导入会替换当前全部数据，建议先导出当前备份。',()=>{if(commit(next,true)){render();notify('备份已导入')}})
 }catch(err){notify('导入失败：'+(err instanceof SyntaxError?'文件不是有效的 JSON。':err.message))}
};
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.view){go(b.dataset.view);return}
 if(b.dataset.add){openEditor(b.dataset.add);return}
 if(b.dataset.edit){openEditor(b.dataset.edit,b.dataset.id);return}
 if(b.dataset.delete){deleteItem(b.dataset.delete,b.dataset.id);return}
 if(b.dataset.stat){if(b.dataset.stat==='projects')projectFilter=b.dataset.filter;if(b.dataset.stat==='tasks')taskFilter=b.dataset.filter;go(b.dataset.stat);return}
 if(b.dataset.projectFilter){projectFilter=b.dataset.projectFilter;render();return}
 if(b.dataset.taskFilter){taskFilter=b.dataset.taskFilter;render();return}
 if(b.dataset.resourceFilter){resourceFilter=b.dataset.resourceFilter;render();return}
 if(b.dataset.day){selectedDay=b.dataset.day;render();return}
 if(b.dataset.week){weekOffset+=Number(b.dataset.week);selectedDay=dayAdd(weekOffset*7,dateObj(weekStart()));render();return}
 const action=b.dataset.action;
 if(action==='todayWeek'){weekOffset=0;selectedDay=today();render()}
 if(action==='clearDemo')clearDemo();
 if(action==='export')exportData();
 if(action==='import')$('#importInput').click();
 if(action==='rawExport'){if(rawBackup!==null)download(rawBackup,'Huey_Workspace_Recovery_'+today()+'.txt','text/plain');else notify('浏览器未提供可恢复的原始内容。')}
 if(action==='clearSearch'){query='';$('#searchInput').value='';render()}
});
document.addEventListener('change',e=>{const id=e.target.dataset.toggleTask;if(id){const done=e.target.checked;if(change(s=>{const t=s.tasks.find(x=>x.id===id);if(t){t.done=done;t.demo=false}}))notify(done?'已完成，事情又少了一件。':'已重新加入待办');else e.target.checked=!done}});
$('#searchInput').oninput=e=>{query=e.target.value.trim();render()};
$('#mobileMenu').onclick=()=>{const open=$('#sidebar').classList.toggle('open');$('#mobileMenu').setAttribute('aria-expanded',String(open))};
document.addEventListener('click',e=>{if($('#sidebar').classList.contains('open')&&!e.target.closest('#sidebar')&&!e.target.closest('#mobileMenu')){$('#sidebar').classList.remove('open');$('#mobileMenu').setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.target.matches('input,textarea,select')&&!document.querySelector('dialog[open]')){e.preventDefault();$('#searchInput').focus()}if(e.key==='Escape'&&query&&!document.querySelector('dialog[open]')){query='';$('#searchInput').value='';render()}if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('#mobileMenu').setAttribute('aria-expanded','false')}});
window.addEventListener('hashchange',()=>go(location.hash.slice(1)||'overview'));
window.addEventListener('storage',e=>{if(e.key===KEY){try{state=e.newValue?validate(JSON.parse(e.newValue)):{version:1,projects:[],tasks:[],resources:[]};storageError='';if($('#editor').open)closeEditor();render();notify('已同步此浏览器其他标签页的更新')}catch{storageError='另一标签页的数据格式异常，请先备份并恢复。';render()}}});
go(['overview','projects','tasks','resources','settings'].includes(location.hash.slice(1))?location.hash.slice(1):'overview');



