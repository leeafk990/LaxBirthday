// ── PASSWORD LOGIC ──────────────────────────────
function checkPass() {
  const pass = document.getElementById('secretPass').value;
  const screen = document.getElementById('password-screen');
  const wrapper = document.getElementById('gift-wrapper');
  const error = document.getElementById('passError');

  if(pass === '1403') {
    // Success
    error.style.opacity = '0';
    screen.style.opacity = '0';
    setTimeout(() => {
      screen.style.display = 'none';
      wrapper.style.display = 'block';
      // slight delay to allow display:block to apply before opacity
      setTimeout(() => {
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'scale(1)';
      }, 50);
    }, 600);
  } else {
    // Failure
    error.style.opacity = '1';
    document.getElementById('secretPass').value = '';
    setTimeout(() => { error.style.opacity = '0'; }, 2000);
  }
}

// ── CURSOR ──────────────────────────────────────
const cur = document.getElementById('cursor');
const curDot = document.getElementById('cursor-dot');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top = e.clientY + 'px';
  curDot.style.left = e.clientX + 'px';
  curDot.style.top = e.clientY + 'px';
});

// ── SCROLL PROGRESS ──────────────────────────────
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  prog.style.width = (scrolled * 100) + '%';
});

// ── MUSIC ─────────────────────────────────────────
const musicBtn = document.getElementById('musicBtn');
const audio = document.getElementById('bgAudio');
audio.volume = 0.7;
let playing = false;

// Show a "tap to play" overlay so user gesture unlocks audio
const tapOverlay = document.createElement('div');
tapOverlay.id = 'tapOverlay';
tapOverlay.innerHTML = `
  <div style="
    position:fixed;inset:0;z-index:9000;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:rgba(10,5,2,0.82);backdrop-filter:blur(8px);cursor:pointer;
  ">
    <div style="font-size:3rem;margin-bottom:16px;animation:tapPulse 1.5s ease-in-out infinite;">🕯️</div>
    <p style="font-family:'Playfair Display',serif;font-size:1.6rem;color:#f0d080;margin-bottom:8px;">Happy Birthday</p>
    <p style="font-family:'Cormorant Garamond',serif;font-style:italic;color:rgba(253,246,227,0.6);font-size:1rem;letter-spacing:3px;">tap anywhere to begin with music</p>
    <style>@keyframes tapPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}</style>
  </div>
`;
document.body.appendChild(tapOverlay);

tapOverlay.addEventListener('click', () => {
  audio.play().then(() => {
    playing = true;
    musicBtn.classList.add('playing');
    musicBtn.textContent = '♪';
  }).catch(() => {});
  tapOverlay.style.opacity = '0';
  tapOverlay.style.transition = 'opacity 0.6s ease';
  setTimeout(() => tapOverlay.remove(), 700);
});

musicBtn.addEventListener('click', () => {
  if (playing) {
    audio.pause();
    musicBtn.textContent = '♩';
    musicBtn.classList.remove('playing');
  } else {
    audio.play();
    musicBtn.textContent = '♪';
    musicBtn.classList.add('playing');
  }
  playing = !playing;
});

// ── OPENING ANIMATIONS ───────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('s1date').classList.add('visible');
    document.getElementById('s1title').classList.add('visible');
    document.getElementById('s1name').classList.add('visible');
    document.getElementById('s1sub').classList.add('visible');
    document.getElementById('scrollHint').classList.add('visible');
  }, 300);
});

// ── INTERSECTION OBSERVER (reversible) ───────────
const photoSections = document.querySelectorAll('.photo-section');
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    } else {
      entry.target.classList.remove('in-view');
    }
  });
}, { threshold: 0.25 });
photoSections.forEach(s => obs.observe(s));

// FINALE — reversible
const finaleEls = ['finaleRing','finale-tag','finale-hb','finale-name','finale-div','finale-msg','finale-emoji'];
const finaleObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    finaleEls.forEach(id => {
      const el = document.getElementById(id);
      if (entry.isIntersecting) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
    if (entry.isIntersecting) startFireworks();
  });
}, { threshold: 0.25 });
finaleObs.observe(document.getElementById('s7'));

// ── PETALS ───────────────────────────────────────
const petalEmojis = ['🌸','🌺','✿','❀','🌼','🍂'];
['petals2','petals3','petals4','petals5','petals6'].forEach(id => {
  const container = document.getElementById(id);
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    p.style.left = (Math.random() * 100) + '%';
    p.style.animationDuration = (6 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.fontSize = (0.7 + Math.random() * 0.8) + 'rem';
    container.appendChild(p);
  }
});

// ── FIREWORKS ────────────────────────────────────
const fwCanvas = document.getElementById('fireworks');
const fwCtx = fwCanvas.getContext('2d');
fwCanvas.width = window.innerWidth;
fwCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
});

let fwParticles = [];
let fwActive = false;

function Firework(x, y) {
  const colors = ['#f5c842','#f06292','#ff7f6e','#c084fc','#67e8f9','#a3e635','#fb923c','#fff','#ffd700'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = 60 + Math.floor(Math.random() * 40);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i;
    const speed = 2 + Math.random() * 5;
    fwParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color,
      size: 2 + Math.random() * 2,
      decay: 0.015 + Math.random() * 0.01,
      gravity: 0.06,
    });
  }
}

function startFireworks() {
  fwParticles = [];
  fwActive = true;
  let count = 0;
  const interval = setInterval(() => {
    Firework(
      fwCanvas.width * (0.2 + Math.random() * 0.6),
      fwCanvas.height * (0.1 + Math.random() * 0.5)
    );
    count++;
    if (count >= 14) clearInterval(interval);
  }, 350);
  animFw();
}

function animFw() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  fwParticles = fwParticles.filter(p => p.alpha > 0.02);
  fwParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.98;
    p.alpha -= p.decay;
    fwCtx.save();
    fwCtx.globalAlpha = p.alpha;
    fwCtx.fillStyle = p.color;
    fwCtx.shadowColor = p.color;
    fwCtx.shadowBlur = 6;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  });
  if (fwParticles.length > 0) requestAnimationFrame(animFw);
  else { fwActive = false; fwCtx.clearRect(0,0,fwCanvas.width,fwCanvas.height); }
}

// ── FINALE FLOWER RAIN ─────────────────────────────────────────
(function rainFlowers() {
  const container = document.getElementById('petalsFinale');
  if(!container) return;
  const emojis = ['🌸','🌼','🌷','❄️','✨','🌺','🍃'];
  // Create many small flowers for "rain" effect
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.position = 'absolute';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = -10 + '%';
    // Smaller size: 0.5rem to 1.0rem
    p.style.fontSize = (0.5 + Math.random() * 0.5) + 'rem';
    // Faster, more chaotic fall
    p.style.animation = `petalFall ${4 + Math.random() * 6}s linear infinite`;
    p.style.animationDelay = Math.random() * 5 + 's';
    p.style.opacity = 0.9;
    container.appendChild(p);
  }
})();