/* ================================================
   YVONNE NAFULA JUMA — PORTFOLIO SCRIPTS
   ================================================ */

/* ── Custom cursor ── */
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
});

(function animateRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .stat-card, .skill-category, .project-card, .contact-link, .hero-image-box').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});


/* ── Navbar scroll shrink ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


/* ── Active nav link on scroll ── */
const sections     = document.querySelectorAll('section[id]');
const navAnchors   = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObs.observe(s));


/* ── Scroll reveal ── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => revealObs.observe(el));


/* ── Typing animation ── */
const typedEl  = document.getElementById('typedText');
const phrases  = [
  'Data Scientist',
  'Software Engineer',
  'ICT Specialist',
  'Python Developer',
  'BScIT Student',
  'Problem Solver',
];
let pIdx = 0, cIdx = 0, deleting = false;

function type() {
  const word = phrases[pIdx];
  typedEl.textContent = deleting
    ? word.substring(0, cIdx - 1)
    : word.substring(0, cIdx + 1);

  deleting ? cIdx-- : cIdx++;

  let delay = deleting ? 50 : 85;

  if (!deleting && cIdx === word.length)   { delay = 1800; deleting = true; }
  else if (deleting && cIdx === 0)          { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 320; }

  setTimeout(type, delay);
}
type();


/* ── Particle canvas ── */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [], raf;

function resize() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); init(); }, { passive: true });

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = init ? Math.random() * canvas.height : (Math.random() < 0.5 ? 0 : canvas.height);
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r  = Math.random() * 1.4 + 0.4;
    this.a  = Math.random() * 0.45 + 0.08;
    this.c  = Math.random() > 0.55 ? '0,229,255' : '124,58,237';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.c},${this.a})`;
    ctx.fill();
  }
}

function init() {
  particles = [];
  const n = Math.min(Math.floor((canvas.width * canvas.height) / 13000), 90);
  for (let i = 0; i < n; i++) particles.push(new Particle());
}
init();

function connect() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.hypot(dx, dy);
      if (d < 105) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,229,255,${0.06 * (1 - d / 105)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connect();
  raf = requestAnimationFrame(animate);
}
animate();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(raf);
  else animate();
});
