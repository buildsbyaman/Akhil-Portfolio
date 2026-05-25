document.addEventListener("DOMContentLoaded", () => {
  // --- Lenis Smooth Scroll ---
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // --- Cursor Glow & Parallax Tracking ---
  const cursorGlow = document.querySelector(".cursor-glow");
  const interactiveBg = document.querySelector(".interactive-bg");

  if (cursorGlow || interactiveBg) {
    window.addEventListener("mousemove", (e) => {
      if (cursorGlow) {
        cursorGlow.style.setProperty("--mouse-x", `${e.clientX}px`);
        cursorGlow.style.setProperty("--mouse-y", `${e.clientY}px`);
      }

      if (interactiveBg) {
        // Calculate offsets from center for slight parallax effect
        const xOffset = (e.clientX - window.innerWidth / 2) * 0.05;
        const yOffset = (e.clientY - window.innerHeight / 2) * 0.05;
        interactiveBg.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      }
    });
  }

  // --- Mobile Menu Logic ---
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileOverlay = document.querySelector(".mobile-overlay");
  const mobileClose = document.querySelector(".mobile-close");

  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener("click", (e) => {
      e.preventDefault();
      mobileOverlay.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    });
  }

  if (mobileClose && mobileOverlay) {
    mobileClose.addEventListener("click", (e) => {
      e.preventDefault();
      mobileOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close when clicking a link
  const mobileLinks = document.querySelectorAll(
    ".mobile-nav-item, .mobile-main-cta, .nav-link",
  );
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileOverlay) {
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // Reveal animations logic (Intersection Observer)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  }, observerOptions);

  const elementsToReveal = document.querySelectorAll(
    ".section-header, .categories-grid, .hero-left, .hero-media, .marquee-section-container, .about-glass-card, .experience-card, .project-card",
  );
  elementsToReveal.forEach((el) => revealObserver.observe(el));

  // Lenis-Aware Smooth Scroll for Internal Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        lenis.scrollTo(targetElement, {
          offset: -80,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        // Close mobile overlay if active
        if (mobileOverlay && mobileOverlay.classList.contains("active")) {
          mobileOverlay.classList.remove("active");
          document.body.style.overflow = "auto";
        }
      }
    });
  });
  // --- Dynamic Year ---
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
