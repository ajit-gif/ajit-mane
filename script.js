/**
 * AJIT MANE PORTFOLIO v4 — script.js
 * Modern marketing studio rebuild.
 */

/* ── Form backend (optional) ──────────────────────────────
   Create a free form at https://formspree.io (or use EmailJS),
   then paste your ID below, e.g. "https://formspree.io/f/abcdwxyz".
   If left empty, the form falls back to composing an email
   via the visitor's mail app — so no inquiry is ever lost.
*/
const FORM_ENDPOINT = "";

/* ── Navbar scroll state ───────────────────────────────── */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 16);
}, { passive: true });

/* ── Mobile menu ───────────────────────────────────────── */
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
});

/* ── Active nav link on scroll ─────────────────────────── */
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-link");

function updateActiveNav() {
  const y = window.scrollY + 120;
  let current = null;
  sections.forEach((sec) => {
    if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) current = sec.id;
  });
  navItems.forEach((n) => {
    n.classList.toggle("active", n.getAttribute("href") === "#" + current);
  });
}
window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

/* ── Scroll reveal (respects reduced motion) ───────────── */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
} else {
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
}

/* ── Contact form ──────────────────────────────────────── */
const form = document.getElementById("contactForm");
const formBtn = document.getElementById("formBtn");
const formStatus = document.getElementById("formStatus");

function setError(id, msg) {
  const field = document.getElementById(id);
  const err = document.getElementById("err-" + id);
  field.classList.toggle("invalid", !!msg);
  if (err) {
    err.textContent = msg;
    err.classList.toggle("show", !!msg);
  }
}

function validate() {
  let ok = true;
  const name = document.getElementById("cname").value.trim();
  const email = document.getElementById("cemail").value.trim();
  const msg = document.getElementById("cmessage").value.trim();

  setError("cname", name ? "" : "Please tell me your name.");
  setError("cemail", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Please enter a valid email.");
  setError("cmessage", msg ? "" : "Please add a short message.");
  if (!name || !email || !msg || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ok = false;
  return ok;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const name = document.getElementById("cname").value.trim();
  const email = document.getElementById("cemail").value.trim();
  const subject = document.getElementById("csubject").value.trim() || "Project inquiry";
  const message = document.getElementById("cmessage").value.trim();

  formStatus.className = "form-status";
  formStatus.textContent = "";
  formBtn.disabled = true;

  if (FORM_ENDPOINT) {
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        formStatus.classList.add("ok");
        formStatus.textContent = "Message sent — I'll get back to you soon.";
        form.reset();
      } else {
        formStatus.classList.add("err");
        formStatus.textContent = "Something went wrong. Please email me directly at ajitm272@gmail.com.";
      }
    } catch (err) {
      formStatus.classList.add("err");
      formStatus.textContent = "Network error. Your email app is opening instead…";
      openMailto(name, email, subject, message);
    }
  } else {
    /* Fallback: compose in the visitor's mail app */
    openMailto(name, email, subject, message);
    formStatus.classList.add("ok");
    formStatus.textContent = "Opening your email app — just hit send. (Or email me directly: ajitm272@gmail.com)";
  }

  formBtn.disabled = false;
});

function openMailto(name, email, subject, message) {
  const body =
    "Name: " + name + "\nEmail: " + email + "\n\n" + message;
  window.location.href =
    "mailto:ajitm272@gmail.com?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body);
}

/* ── Dynamic footer year ───────────────────────────────── */
document.getElementById("year").textContent = new Date().getFullYear();
