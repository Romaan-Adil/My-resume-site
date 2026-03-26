const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const skillItems = document.querySelectorAll(".skill-item");
const yearTarget = document.getElementById("current-year");
const canvas = document.getElementById("hero-canvas");
const typewriterTarget = document.getElementById("typewriter-role");

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (menuToggle && header) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const setSkillProgress = (item) => {
  const progress = item.querySelector(".progress-track span");
  const value = item.dataset.progress;
  if (progress && value) {
    progress.style.width = `${value}%`;
  }
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");

        if (entry.target.classList.contains("skill-item")) {
          setSkillProgress(entry.target);
        }

        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
  skillItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  skillItems.forEach(setSkillProgress);
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typewriterTarget) {
  const roles = [
    "Programmer",
    "BCA Student",
    "AI Developer",
    "Python Developer",
  ];

  if (prefersReducedMotion) {
    typewriterTarget.textContent = roles[0];
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const currentRole = roles[roleIndex];

      if (!deleting) {
        charIndex += 1;
        typewriterTarget.textContent = currentRole.slice(0, charIndex);

        if (charIndex === currentRole.length) {
          deleting = true;
          window.setTimeout(tick, 1200);
          return;
        }
      } else {
        charIndex -= 1;
        typewriterTarget.textContent = currentRole.slice(0, charIndex);

        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      const delay = deleting ? 60 : 95;
      window.setTimeout(tick, delay);
    };

    tick();
  }
}

if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationFrameId;

   const resizeCanvas = () => {
    const width = canvas.parentElement.offsetWidth;
    const height = canvas.parentElement.offsetHeight;
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    buildParticles(width, height);
  };

  const buildParticles = (width, height) => {
    const count = Math.max(28, Math.floor(width / 34));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.7,
      speedX: (Math.random() - 0.5) * 0.28,
      speedY: (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.45 + 0.12
    }));
  };

  const drawParticles = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x <= 0 || particle.x >= width) {
        particle.speedX *= -1;
      }

      if (particle.y <= 0 || particle.y >= height) {
        particle.speedY *= -1;
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(197, 255, 68, ${particle.alpha})`;
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
        const other = particles[otherIndex];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(197, 255, 68, ${0.12 - distance / 1100})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    });

    animationFrameId = window.requestAnimationFrame(drawParticles);
  };

  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(animationFrameId);
  });
}
