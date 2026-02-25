/* =========================================================
   PORTFOLIO SCRIPT — Mohamed Uzair
   Features: particles · typewriter · skill counters ·
             portfolio filter · sticky nav · 3D tilt · scroll top
   ========================================================= */

/* -------------------------------------------------------
   1. PARTICLE CANVAS
   ------------------------------------------------------- */
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const PARTICLE_COUNT = 60;
  const particles = [];

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:  randomBetween(0, canvas.width),
      y:  randomBetween(0, canvas.height),
      r:  randomBetween(0.8, 2.5),
      dx: randomBetween(-0.3, 0.3),
      dy: randomBetween(-0.3, 0.3),
      o:  randomBetween(0.2, 0.7),
    });
  }

  // Mouse repel
  let mouse = { x: null, y: null };
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

  function drawLine(p1, p2, dist, maxDist) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    const alpha = (1 - dist / maxDist) * 0.15;
    ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maxDist = 130;

    particles.forEach((p) => {
      // Mouse repel
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const force = (80 - dist) / 80;
          p.x += (dx / dist) * force * 2;
          p.y += (dy / dist) * force * 2;
        }
      }

      p.x += p.dx;
      p.y += p.dy;

      // Bounce
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,58,237,${p.o})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) drawLine(particles[i], particles[j], dist, maxDist);
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
})();


/* -------------------------------------------------------
   2. TYPEWRITER EFFECT
   ------------------------------------------------------- */
(function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const words = [
    "Flutter Apps",
    "Web Platforms",
    "Full-Stack APIs",
    "Mobile Experiences",
    "Secure Systems",
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let pauseTick = 0;

  function type() {
    const current = words[wordIndex];
    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) { deleting = true; pauseTick = 0; setTimeout(type, 1800); return; }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  setTimeout(type, 1200);
})();


/* -------------------------------------------------------
   3. CIRCULAR SKILL PROGRESS BARS
   ------------------------------------------------------- */
function animateCircle(selector, valueSelector, endValue, color) {
  const progressEl = document.querySelector(selector);
  const valueEl    = document.querySelector(valueSelector);
  if (!progressEl || !valueEl) return;

  let current = 0;
  const interval = setInterval(() => {
    current++;
    valueEl.textContent = `${current}%`;
    progressEl.style.background =
      `conic-gradient(${color} ${current * 3.6}deg, rgba(255,255,255,0.06) 0deg)`;
    if (current >= endValue) clearInterval(interval);
  }, 25);
}

// Trigger only when skills section is visible (IntersectionObserver)
const skillSection = document.querySelector(".skill");
let skillsAnimated = false;

if (skillSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        animateCircle(".html-css",   ".html-progress",       90, "#f59e0b");
        animateCircle(".javascript", ".javascript-progress", 85, "#7c3aed");
        animateCircle(".php",        ".php-progress",        88, "#06b6d4");
        animateCircle(".reactjs",    ".reactjs-progress",    80, "#10b981");
      }
    },
    { threshold: 0.3 }
  );
  observer.observe(skillSection);
}


/* -------------------------------------------------------
   4. PORTFOLIO FILTER
   ------------------------------------------------------- */
$(document).ready(function () {
  $(".filter-item").on("click", function () {
    $(".filter-item").removeClass("active");
    $(this).addClass("active");
    const value = $(this).attr("data-filter");
    if (value === "all") {
      $(".post").show(600);
    } else {
      $(".post").not("." + value).hide(600);
      $(".post").filter("." + value).show(600);
    }
  });
});


/* -------------------------------------------------------
   5. STICKY NAVBAR
   ------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.getElementById("navbar-top");
  if (!nav) return;
  window.addEventListener("scroll", function () {
    if (window.scrollY > 60) {
      nav.classList.add("fixed-top");
      document.body.style.paddingTop = nav.offsetHeight + "px";
    } else {
      nav.classList.remove("fixed-top");
      document.body.style.paddingTop = "0";
    }
  });
});


/* -------------------------------------------------------
   6. BACK TO TOP BUTTON
   ------------------------------------------------------- */
const topBtn = document.getElementById("btn-back-to-top");
if (topBtn) {
  window.addEventListener("scroll", () => {
    topBtn.style.display = document.documentElement.scrollTop > 300 ? "block" : "none";
  });
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


/* -------------------------------------------------------
   7. 3D TILT ON SERVICE CARDS (mousemove)
   ------------------------------------------------------- */
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) *  8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


/* -------------------------------------------------------
   8. 3D TILT ON PORTFOLIO CARDS
   ------------------------------------------------------- */
document.querySelectorAll(".post .card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;
    const rotY = ((x - cx) / cx) *  5;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


/* -------------------------------------------------------
   9. ACTIVE NAV LINK ON SCROLL
   ------------------------------------------------------- */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});


/* -------------------------------------------------------
   10. ANIMATED COUNT-UP FOR HOME STATS
   ------------------------------------------------------- */
function countUp(el, target, suffix, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Number.isInteger(target)
      ? Math.floor(start) + suffix
      : start.toFixed(1) + suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      const nums = document.querySelectorAll(".stat-item .num");
      if (nums.length >= 3) {
        countUp(nums[0], 1.5, "+", 1200);
        countUp(nums[1], 6,   "+", 1200);
        countUp(nums[2], 3,   "",  1200);
      }
      statsObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);
const homeSection = document.querySelector(".home");
if (homeSection) statsObserver.observe(homeSection);