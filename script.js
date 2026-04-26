/**
 * AJIT MANE PORTFOLIO v3 — script.js
 * Cyber Neon Aesthetic
 */

/* ── Grain canvas ────────────────────────────────────────── */
(function generateGrain() {
  const canvas = document.getElementById('grainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawGrain() {
    const w = canvas.width, h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.random() * 255;
      data[i] = data[i+1] = data[i+2] = val;
      data[i+3] = 20; // very faint
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Redraw grain at low fps for performance
  let last = 0;
  function loop(ts) {
    if (ts - last > 80) { drawGrain(); last = ts; }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ── Navbar scroll ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Mobile menu ─────────────────────────────────────────── */
const burger    = document.getElementById('burger');
const navLinks  = document.getElementById('navLinks');
const navCenter = document.querySelector('.nav-center');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  if (navCenter) navCenter.classList.toggle('mobile-open');
});

document.querySelectorAll('.nl').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    if (navCenter) navCenter.classList.remove('mobile-open');
  });
});

document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* ── Active nav ──────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nl');

function updateActiveNav() {
  const y = window.scrollY + 90;
  sections.forEach(sec => {
    if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
      navItems.forEach(n => n.classList.remove('active'));
      const a = document.querySelector(`.nl[href="#${sec.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive:true });
updateActiveNav();

/* ── Scroll reveal ───────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement?.querySelectorAll('.reveal') || []);
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 120, 480));
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Smooth scroll ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
    }
  });
});

/* ── Contact form ────────────────────────────────────────── */
const form    = document.getElementById('contactForm');
const formOk  = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.querySelector('#cname').value.trim();
    const email = form.querySelector('#cemail').value.trim();
    const msg   = form.querySelector('#cmessage').value.trim();

    if (!name || !email || !msg) { alert('Please fill in Name, Email and Message.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Invalid email address.'); return; }

    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.querySelector('span:last-child').innerHTML = '<i class="fas fa-spinner fa-spin"></i> TRANSMITTING...';

    setTimeout(() => {
      btn.disabled = false;
      btn.querySelector('span:last-child').innerHTML = 'TRANSMIT MESSAGE <i class="fas fa-paper-plane"></i>';
      formOk.classList.add('show');
      form.reset();
      setTimeout(() => formOk.classList.remove('show'), 5500);
    }, 1400);
  });
}

/* ── Service card tilt ───────────────────────────────────── */
document.querySelectorAll('.svc-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    card.style.transform    = `translateY(-6px) rotateX(${dy * -5}deg) rotateY(${dx * 5}deg)`;
    card.style.transition   = 'transform .08s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'all .3s cubic-bezier(.4,0,.2,1)';
  });
});

/* ── Glitch flash on hero name (subtle) ─────────────────── */
(function heroGlitch() {
  const first = document.querySelector('.hero-firstname');
  const last  = document.querySelector('.hero-lastname span');
  if (!first || !last) return;

  function flash(el) {
    el.style.textShadow = '2px 0 var(--green), -2px 0 var(--blue)';
    el.style.transform  = 'skewX(-2deg)';
    setTimeout(() => {
      el.style.textShadow = '';
      el.style.transform  = '';
    }, 80);
  }

  setInterval(() => {
    if (Math.random() < .3) flash(Math.random() < .5 ? first : last);
  }, 3500);
})();

/* ── Edu progress bars ───────────────────────────────────── */
const eduObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      eduObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.edu-card').forEach(c => eduObs.observe(c));

/* ── Ticker mouse pause ──────────────────────────────────── */
const ticker = document.querySelector('.ticker-inner');
if (ticker) {
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}

/* ── rAF scroll batch ────────────────────────────────────── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { updateActiveNav(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
