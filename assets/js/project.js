const BASE_URL = window.BASE_URL || '';

(async function() {
  // 1. Parse slug from URL
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('id');

  if (!slug) {
    window.location.href = '../';
    return;
  }

  // 2. Fetch projects data
  let projects;
  try {
    const res = await fetch(`../data/projects.json`);
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    projects = data.projects;
  } catch(e) {
    // Try alternate path
    try {
      const res = await fetch(`/data/projects.json`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      projects = data.projects;
    } catch(e2) {
      renderError('Could not load project data.');
      return;
    }
  }

  // 3. Find project
  const project = projects.find(p => p.slug === slug);
  if (!project) {
    renderError(`Project "${slug}" not found.`);
    return;
  }

  // 4. Update page title
  document.title = `${project.title} \u2014 shihanmahfuz.geocities.com`;

  // 5. Update nav path
  document.getElementById('navPath').textContent = `D:\\projects\\${slug}`;

  // 6. Update taskbar
  const tbn = document.getElementById('taskbarProjectName');
  if (tbn) tbn.textContent = `\ud83d\udcc2 ${project.title}`;

  // 7. Render titlebar
  document.getElementById('projectTitle').innerHTML = `
    <svg class="icon" viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="10" fill="#fff" stroke="#000" stroke-width="1"/><rect x="2" y="2" width="6" height="3" fill="#ffcc00" stroke="#aa8800" stroke-width="0.5"/></svg>
    ${project.emoji || ''} ${project.title} \u2014 Details
  `;

  // 8. Render body
  document.getElementById('projectBody').innerHTML = buildProjectHTML(project);

  // 9. Update statusbar
  document.getElementById('projectStatus').innerHTML = `
    <span>${project.tags.join(' | ')}</span>
    <span>${project.date}</span>
  `;

  // 10. Render other projects
  const others = projects.filter(p => p.slug !== slug);
  if (others.length > 0) {
    const otherWin = document.getElementById('otherProjectsWindow');
    const otherGrid = document.getElementById('otherProjectsGrid');
    if (otherWin && otherGrid) {
      otherWin.style.display = '';
      otherGrid.innerHTML = '';
      others.forEach(p => {
        const a = document.createElement('a');
        a.className = 'project-card';
        a.href = `index.html?id=${p.slug}`;
        const thumbStyle = p.thumbnail
          ? `background-image:url('${p.thumbnail}');background-size:cover;background-position:center;`
          : p.gradient || '';
        a.innerHTML = `
          <div class="project-card-thumb" style="${thumbStyle}">
            <span style="font-size:36px;opacity:0.4;position:relative;z-index:1">${p.emoji || ''}</span>
          </div>
          <div class="project-info">
            <h3>${p.emoji || ''} ${p.title}</h3>
            <p>${p.summary}</p>
          </div>`;
        otherGrid.appendChild(a);
      });
    }
  }
})();

function buildProjectHTML(p) {
  const heroSection = p.heroImage
    ? `<div class="project-hero" style="background-image:url('${p.heroImage}')">
         <div class="thumb-overlay"></div>
       </div>`
    : `<div class="project-hero project-hero-placeholder" ${p.gradient ? `style="${p.gradient}"` : ''}>
         <span style="font-size:72px;opacity:0.25;position:relative;z-index:1">${p.emoji || '\ud83d\udcc2'}</span>
       </div>`;

  const tagsHTML = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');

  const linksHTML = (p.links || []).map(l =>
    `<a href="${l.url}" target="_blank" class="retro-action-btn">${l.label}</a>`
  ).join('');

  const statsHTML = p.stats
    ? Object.entries(p.stats).map(([k,v]) =>
        `<div class="stat-block"><div class="stat-value">${v}</div><div class="stat-key">${k}</div></div>`
      ).join('')
    : '';

  return `
    <div class="inset-panel dark">
      ${heroSection}
      <div class="project-meta">
        <div class="project-tags" style="margin-bottom:12px">${tagsHTML}</div>
        <div class="project-meta-date">
          ${p.date} &nbsp;|&nbsp; ${p.category || 'Project'}
        </div>
      </div>
    </div>
    ${statsHTML ? `<div class="stats-row">${statsHTML}</div>` : ''}
    <div class="inset-panel dark" style="margin-top:12px">
      <p style="color:var(--text-yellow);font-family:var(--pixel);font-size:9px;margin-bottom:12px">
        // PROJECT_DETAILS.TXT
      </p>
      <div class="project-long-desc">${p.longDescription}</div>
    </div>
    ${linksHTML ? `<div class="project-links-row">${linksHTML}</div>` : ''}
  `;
}

function renderError(msg) {
  document.getElementById('projectBody').innerHTML = `
    <div class="inset-panel dark">
      <p style="color:#ff0000;font-family:var(--pixel);font-size:9px;margin-bottom:12px">ERROR: ${msg}</p>
      <p style="color:#aaa;font-family:var(--terminal);font-size:16px;margin-bottom:16px">The requested project could not be found in the database.</p>
      <a href="../" class="retro-action-btn">&larr; RETURN HOME</a>
    </div>`;
  document.getElementById('projectStatus').innerHTML = `<span>Error</span><span>404</span>`;
}

// Cursor Trail
const trailColors = ['#00ff00','#00ffff','#ffff00','#ff00ff','#ff8800','#ff0000'];
let trailCount = 0;
document.addEventListener('mousemove', e => {
  if (++trailCount % 3 !== 0) return;
  const p = document.createElement('div');
  p.className = 'trail-particle';
  const s = Math.random() * 4 + 2;
  const c = trailColors[Math.floor(Math.random() * trailColors.length)];
  p.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${s}px;height:${s}px;background:${c};box-shadow:0 0 ${s*2}px ${c}`;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 800);
});

// Clock
function updateClock() {
  const n = new Date();
  const h = n.getHours(), m = n.getMinutes().toString().padStart(2,'0');
  const el = document.getElementById('taskbarClock');
  if (el) el.textContent = `${h%12||12}:${m} ${h>=12?'PM':'AM'}`;
}
updateClock(); setInterval(updateClock, 1000);
