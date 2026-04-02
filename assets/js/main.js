// Base URL for asset paths (change if deployed under a subdirectory)
const BASE_URL = window.BASE_URL || '';

// Boot Sequence
const bootScreen = document.getElementById('bootScreen');
const mainContent = document.getElementById('mainContent');
document.querySelectorAll('.boot-line').forEach(line => {
  setTimeout(() => line.classList.add('visible'), parseInt(line.dataset.delay));
});
setTimeout(() => {
  bootScreen.classList.add('done');
  setTimeout(() => { bootScreen.style.display = 'none'; mainContent.classList.add('show'); }, 500);
}, 4200);

// Cursor Trail
const colors = ['#00ff00','#00ffff','#ffff00','#ff00ff','#ff8800','#ff0000'];
let tt = 0;
document.addEventListener('mousemove', e => {
  if (++tt % 3 !== 0) return;
  const p = document.createElement('div');
  p.className = 'trail-particle';
  const s = Math.random() * 4 + 2;
  const c = colors[Math.floor(Math.random() * colors.length)];
  p.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${s}px;height:${s}px;background:${c};box-shadow:0 0 ${s*2}px ${c}`;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 800);
});

// Clock
function updateClock() {
  const n = new Date();
  const h = n.getHours(), m = n.getMinutes().toString().padStart(2,'0');
  const ap = h >= 12 ? 'PM' : 'AM';
  document.getElementById('taskbarClock').textContent = `${h%12||12}:${m} ${ap}`;
}
updateClock(); setInterval(updateClock, 1000);

// Scroll Reveal
const wo = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.win98').forEach(w => wo.observe(w));

// Visitor Counter (persistent via localStorage)
const visits = parseInt(localStorage.getItem('sv') || '42069') + 1;
localStorage.setItem('sv', visits);
const targetDigits = visits.toString().padStart(7, '0').split('').map(Number);

function animateCounter() {
  document.querySelectorAll('.counter-digit').forEach((el, i) => {
    let c = 0; const t = targetDigits[i];
    const iv = setInterval(() => {
      el.textContent = Math.floor(Math.random() * 10);
      if (++c > 15 + i * 5) { el.textContent = t; clearInterval(iv); }
    }, 50);
  });
}
const co = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { animateCounter(); co.unobserve(e.target); } });
}, { threshold: 0.5 });
const vc = document.querySelector('.visitor-counter');
if (vc) co.observe(vc);

// Draggable Windows
document.querySelectorAll('.win98-titlebar').forEach(tb => {
  let dragging = false, sx, sy, ox, oy;
  const w = tb.parentElement;
  tb.addEventListener('pointerdown', e => {
    if (window.innerWidth < 768) return;
    dragging = true; tb.setPointerCapture(e.pointerId);
    sx = e.clientX; sy = e.clientY;
    ox = parseInt(w.style.left) || 0; oy = parseInt(w.style.top) || 0;
    w.style.zIndex = 100; w.style.transition = 'none';
  });
  tb.addEventListener('pointermove', e => {
    if (!dragging) return;
    w.style.position = 'relative';
    w.style.left = (ox + e.clientX - sx) + 'px';
    w.style.top = (oy + e.clientY - sy) + 'px';
  });
  tb.addEventListener('pointerup', () => { dragging = false; w.style.zIndex = ''; });
});

// Window Buttons
document.querySelectorAll('.win98-btn').forEach(btn => {
  // Stop pointer events from bubbling to titlebar drag handler
  btn.addEventListener('pointerdown', e => e.stopPropagation());
  const t = btn.textContent.trim();
  if (t === '\u00d7' || t === '\xd7') btn.addEventListener('click', () => {
    const w = btn.closest('.win98');
    w.style.transition = 'transform 0.3s, opacity 0.3s';
    w.style.transform = 'scale(0.95)'; w.style.opacity = '0';
    setTimeout(() => w.style.display = 'none', 300);
  });
  if (t === '_') btn.addEventListener('click', () => {
    const w = btn.closest('.win98');
    const b = w.querySelector('.win98-body'), s = w.querySelector('.win98-statusbar');
    if (b) b.style.display = b.style.display === 'none' ? '' : 'none';
    if (s) s.style.display = s.style.display === 'none' ? '' : 'none';
  });
});

// Start Button
document.getElementById('startBtn').addEventListener('click', () => {
  alert('\ud83d\udda5\ufe0f ShihanOS v98\n\nNo programs installed.\nPlease hire me to fix that.');
});

// Name Glitch
const nameEl = document.getElementById('bannerName');
if (nameEl) {
  const originalName = nameEl.textContent;
  const gc = '\u2588\u2593\u2592\u2591@#$%&*!?<>{}[]|/\\';
  setInterval(() => {
    let g = '';
    for (let i = 0; i < originalName.length; i++) {
      g += (originalName[i] !== ' ' && Math.random() < 0.1)
        ? gc[Math.floor(Math.random() * gc.length)] : originalName[i];
    }
    nameEl.textContent = g;
    setTimeout(() => nameEl.textContent = originalName, 100);
  }, 4000);
}

// Dynamic Project Cards
async function renderProjectCards() {
  try {
    const res = await fetch(`${BASE_URL}/data/projects.json`);
    const data = await res.json();
    const grid = document.querySelector('.projects-grid');
    if (!grid || !data.projects) return;

    grid.innerHTML = '';
    data.projects.forEach((p, i) => {
      const a = document.createElement('a');
      a.className = 'project-card';
      a.href = `${BASE_URL}/projects/index.html?id=${p.slug}`;

      const thumbStyle = p.thumbnail
        ? `background-image:url('${p.thumbnail}');background-size:cover;background-position:center;`
        : p.gradient || '';

      a.innerHTML = `
        <div class="project-card-thumb" style="${thumbStyle}">
          <div class="thumb-overlay"></div>
          <span style="font-size:48px;opacity:0.4;position:relative;z-index:1">${p.emoji || '&#128193;'}</span>
          <span class="project-card-hover-label">&gt; OPEN PROJECT</span>
        </div>
        <div class="project-info">
          <h3>${p.emoji || ''} ${p.title}</h3>
          <p>${p.summary}</p>
          <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
        </div>`;
      grid.appendChild(a);
    });

    // Update statusbar
    const sb = document.querySelector('#winProjects .win98-statusbar span');
    if (sb) sb.textContent = `${data.projects.length} object(s)`;
  } catch(e) {
    console.warn('Could not load projects.json, using static fallback:', e.message);
  }
}
renderProjectCards();
