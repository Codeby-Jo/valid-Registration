const projects = [
  { id:1, name:'NexFlow Core', sub:'nextjs · vercel', status:'live', env:'Production', progress:100, deploy:'2 min ago', branch:'main', commits:1482, memory:'512MB', region:'us-east-1' },
  { id:2, name:'Admin Panel', sub:'react · netlify', status:'build', env:'Staging', progress:64, deploy:'Running…', branch:'feat/auth', commits:340, memory:'256MB', region:'eu-west-1' },
  { id:3, name:'Marketing Site', sub:'astro · cloudflare', status:'live', env:'Production', progress:100, deploy:'1 hr ago', branch:'main', commits:218, memory:'128MB', region:'global' },
  { id:4, name:'API Gateway', sub:'node · aws lambda', status:'idle', env:'Development', progress:0, deploy:'3 days ago', branch:'develop', commits:905, memory:'1GB', region:'ap-south-1' },
  { id:5, name:'Mobile BFF', sub:'fastify · fly.io', status:'error', env:'Production', progress:18, deploy:'Failed', branch:'main', commits:431, memory:'512MB', region:'us-west-2' },
  { id:6, name:'Analytics Srv', sub:'python · gcp', status:'live', env:'Production', progress:100, deploy:'30 min ago', branch:'main', commits:670, memory:'2GB', region:'us-central-1' },
];

const statusConfig = {
  live:  { label:'Live',     cls:'pill-live',  icon:'bi-circle-fill' },
  build: { label:'Building', cls:'pill-build', icon:'bi-arrow-repeat' },
  idle:  { label:'Idle',     cls:'pill-idle',  icon:'bi-pause-circle' },
  error: { label:'Error',    cls:'pill-error', icon:'bi-exclamation-circle' },
};

const progressColors = { live:'var(--accent2)', build:'var(--accent)', idle:'var(--muted)', error:'var(--error)' };

const activity = [
  { type:'deploy', icon:'bi-cloud-check', cls:'act-deploy', text:'<strong>main</strong> deployed to <strong>NexFlow Core</strong> successfully', time:'2 min ago' },
  { type:'commit', icon:'bi-git', cls:'act-commit', text:'<strong>ada.l</strong> pushed 3 commits to <strong>feat/auth</strong>', time:'14 min ago' },
  { type:'alert',  icon:'bi-exclamation-triangle', cls:'act-alert', text:'<strong>Mobile BFF</strong> deploy failed — health check timeout', time:'1 hr ago' },
  { type:'member', icon:'bi-person-plus', cls:'act-member', text:'<strong>Raj Kumar</strong> joined the team', time:'2 hr ago' },
  { type:'deploy', icon:'bi-cloud-check', cls:'act-deploy', text:'<strong>Analytics Srv</strong> deployed to production', time:'30 min ago' },
];

// ─── RENDER TABLE ─────────────────────────────────────────────────────────────
let currentFilter = 'all';
let selectedId = null;

function renderTable(filter){
  const body = document.getElementById('projectBody');
  body.innerHTML = '';
  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);
  filtered.forEach(p => {
    const sc = statusConfig[p.status];
    const pc = progressColors[p.status];
    const tr = document.createElement('tr');
    tr.dataset.id = p.id;
    if(selectedId === p.id) tr.style.background = 'rgba(232,255,71,.04)';
    tr.innerHTML = `
      <td><div class="project-name">${p.name}</div><div class="project-sub">${p.sub}</div></td>
      <td><span class="status-pill ${sc.cls}"><span class="dot"></span>${sc.label}</span></td>
      <td style="color:var(--muted);font-size:.85rem">${p.env}</td>
      <td>
        <div class="progress-wrap">
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${p.progress}%;background:${pc}"></div></div>
          <div class="progress-val">${p.progress}%</div>
        </div>
      </td>
      <td style="color:var(--muted);font-size:.85rem;white-space:nowrap">${p.deploy}</td>
      <td>
        <button class="tab" style="font-size:.77rem" onclick="event.stopPropagation();alert('Redeploy: ${p.name}')"><i class="bi bi-arrow-clockwise"></i> Redeploy</button>
      </td>`;
    tr.addEventListener('click', () => showDetail(p.id));
    body.appendChild(tr);
  });
}

// ─── DETAIL PANEL (DOM Manipulation) ─────────────────────────────────────────
function showDetail(id){
  const p = projects.find(x => x.id === id);
  if(!p) return;
  selectedId = id;
  renderTable(currentFilter);

  document.getElementById('detailTitle').textContent = `${p.name} — Details`;
  document.getElementById('detailGrid').innerHTML = `
    <div class="detail-item"><label>Branch</label><span>${p.branch}</span></div>
    <div class="detail-item"><label>Environment</label><span>${p.env}</span></div>
    <div class="detail-item"><label>Region</label><span>${p.region}</span></div>
    <div class="detail-item"><label>Memory</label><span>${p.memory}</span></div>
    <div class="detail-item"><label>Total Commits</label><span>${p.commits.toLocaleString()}</span></div>
    <div class="detail-item"><label>Last Deploy</label><span>${p.deploy}</span></div>
  `;
  const panel = document.getElementById('detailPanel');
  panel.classList.add('visible');
  panel.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function closeDetail(){
  selectedId = null;
  document.getElementById('detailPanel').classList.remove('visible');
  renderTable(currentFilter);
}

// ─── FILTER ───────────────────────────────────────────────────────────────────
function filterProjects(el, filter){
  document.querySelectorAll('.filter-tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentFilter = filter;
  selectedId = null;
  document.getElementById('detailPanel').classList.remove('visible');
  renderTable(filter);
}

function setTab(el, group){
  el.closest('.filter-tabs').querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}

// ─── CHART ────────────────────────────────────────────────────────────────────
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const chartData = [
  {ok:18,fail:1},{ok:24,fail:2},{ok:31,fail:0},{ok:22,fail:3},
  {ok:28,fail:1},{ok:15,fail:0},{ok:20,fail:2}
];
const maxVal = Math.max(...chartData.map(d=>d.ok+d.fail));

function renderChart(){
  const bars = document.getElementById('chartBars');
  bars.innerHTML = '';
  chartData.forEach((d,i) => {
    const total = d.ok + d.fail;
    const okH   = Math.round((d.ok / maxVal) * 100);
    const failH = Math.round((d.fail / maxVal) * 100);
    bars.innerHTML += `
      <div class="bar-group">
        <div class="bar" style="height:${okH}px;background:var(--accent);opacity:.85" title="${d.ok} successful"></div>
        <div class="bar" style="height:${failH}px;background:var(--error);opacity:.85" title="${d.fail} failed"></div>
        <div class="bar-label">${days[i]}</div>
      </div>`;
  });
}

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────
function renderActivity(){
  const feed = document.getElementById('activityFeed');
  feed.innerHTML = '';
  activity.forEach(a => {
    feed.innerHTML += `
      <div class="activity-item">
        <div class="activity-icon ${a.cls}"><i class="bi ${a.icon}"></i></div>
        <div>
          <div class="activity-text">${a.text}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </div>`;
  });
}

// ─── SIDEBAR TOGGLE ───────────────────────────────────────────────────────────
function toggleSidebar(){
  const sb = document.getElementById('sidebar');
  const main = document.getElementById('main');
  sb.classList.toggle('collapsed');
  main.classList.toggle('expanded');
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
renderTable('all');
renderChart();
renderActivity();