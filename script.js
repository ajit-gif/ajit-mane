/**
 * AJIT MANE PORTFOLIO — script.js
 * Features: Sticky navbar, mobile menu, scroll animations,
 *           active nav highlight, contact form, back-to-top
 */

/* ============================================================
   1. STICKY NAVBAR — add .scrolled class on scroll
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ============================================================
   2. MOBILE HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on nav-link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* ============================================================
   3. ACTIVE NAV LINK — highlight section in view
   ============================================================ */
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link');

const highlightNav = () => {
  const scrollY = window.scrollY + 100; // offset for navbar height

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
};

window.addEventListener('scroll', highlightNav);
highlightNav(); // run on load

/* ============================================================
   4. SCROLL REVEAL ANIMATION
   Uses IntersectionObserver to add .visible to .reveal elements
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger delay for sibling cards
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
          : [];
        const order = siblings.indexOf(entry.target);
        const delay = Math.min(order * 100, 400); // max 400ms stagger

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  }
);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   5. CONTACT FORM — demo submit handler
   ============================================================ */
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = contactForm.querySelector('#name').value.trim();
    const email   = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in your name, email, and message.');
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Simulate form submission (replace with real backend / EmailJS / Formspree)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      formSuccess.classList.add('show');
      contactForm.reset();

      // Hide success after 5s
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 5000);
    }, 1200);
  });
}

/* ============================================================
   6. SMOOTH SCROLL — polyfill for browsers that don't support it
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height offset
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   7. TYPING EFFECT — hero subtitle (optional enhancement)
   Cycles through role titles in the hero section
   ============================================================ */
const roles = [
  'Digital Marketing Executive',
  'SEO Specialist',
  'Web Developer',
  'Content Strategist'
];

const roleEl = document.querySelector('.hero-role');

if (roleEl) {
  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let paused   = false;

  const type = () => {
    if (paused) return;

    const currentRole = roles[roleIdx];

    if (!deleting) {
      // Typing
      roleEl.textContent = currentRole.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentRole.length) {
        // Pause at end
        paused = true;
        setTimeout(() => {
          paused   = false;
          deleting = true;
          type();
        }, 2200);
        return;
      }
    } else {
      // Deleting
      roleEl.textContent = currentRole.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
      }
    }

    const speed = deleting ? 60 : 110;
    setTimeout(type, speed);
  };

  // Start after page load animation finishes
  setTimeout(type, 1400);
}

/* ============================================================
   8. SKILL CARD TILT EFFECT — subtle mouse parallax on hover
   ============================================================ */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const tiltX  = dy * -6;  // max 6deg
    const tiltY  = dx *  6;

    card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

/* ============================================================
   9. TOOLS MARQUEE — pause on hover (CSS handles it,
   but we also hook into JS for accessibility)
   ============================================================ */
const track = document.querySelector('.tools-track');
if (track) {
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

/* ============================================================
   10. PERFORMANCE — requestAnimationFrame for scroll events
   ============================================================ */
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      highlightNav();
      ticking = false;
    });
    ticking = true;
  }
});
