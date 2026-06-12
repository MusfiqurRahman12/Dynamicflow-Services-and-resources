/* ========================================
   Dynamicflow — Tech Stack Overview
   Interactive Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Scroll Reveal (IntersectionObserver) ───
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Only unobserve if NOT the nav grid (we want it to always stay visible once triggered)
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));


  // ─── Header scroll effect ───
  const header = document.getElementById('site-header');

  const handleHeaderScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initial check


  // ─── Back to Top button ───
  const backToTop = document.getElementById('back-to-top');

  const handleBackToTopVisibility = () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });
  handleBackToTopVisibility();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ─── Smooth scroll for nav cards ───
  const navCards = document.querySelectorAll('.nav-card[href^="#"]');

  navCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = card.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });


  // ─── Animated stat counters ───
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCounter = (element) => {
    const text = element.textContent.trim();
    const match = text.match(/^(\d+)/);

    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = text.replace(match[1], '');
    const duration = 1800;
    const startTime = performance.now();

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.floor(easedProgress * target);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));


  // ─── Staggered tech card reveal ───
  const techGrids = document.querySelectorAll('.tech-grid');

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.tech-card');
          cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            card.style.transition = `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms`;

            // Trigger in next frame to ensure transition works
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  techGrids.forEach((grid) => staggerObserver.observe(grid));


  // ─── Active section highlighting (optional visual polish) ───
  const sections = document.querySelectorAll('.service-section');
  const navCardElements = document.querySelectorAll('.nav-card');

  const highlightNav = () => {
    let currentSectionId = '';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 200 && rect.bottom > 200) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navCardElements.forEach((card) => {
      const href = card.getAttribute('href');
      if (href === '#' + currentSectionId) {
        card.style.borderColor = 'var(--border-hover)';
        card.style.background = 'var(--surface-hover)';
      } else {
        card.style.borderColor = '';
        card.style.background = '';
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
});
