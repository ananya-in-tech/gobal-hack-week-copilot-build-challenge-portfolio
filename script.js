const toggleButton = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const yearElement = document.getElementById('year');
const navbar = document.getElementById('navbar');
const heroHeading = document.querySelector('#hero h1');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// 1) Hamburger menu toggle
if (toggleButton && navLinks) {
  toggleButton.addEventListener('click', () => {
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
    toggleButton.setAttribute('aria-expanded', String(!isExpanded));
    navLinks.classList.toggle('show');
  });
}

navAnchors.forEach((anchor) => {
  anchor.addEventListener('click', () => {
    if (navLinks && toggleButton) {
      navLinks.classList.remove('show');
      toggleButton.setAttribute('aria-expanded', 'false');
    }
  });
});

// 2) Typing animation in hero
const roles = ['Developer', 'Student', 'Problem Solver'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

if (heroHeading) {
  const roleLine = document.createElement('p');
  roleLine.className = 'hero-role';
  roleLine.innerHTML = 'I am a <span id="typing-text"></span><span class="typing-cursor">|</span>';
  heroHeading.insertAdjacentElement('afterend', roleLine);

  const typingText = document.getElementById('typing-text');

  const runTypingAnimation = () => {
    if (!typingText) return;

    const currentRole = roles[roleIndex];
    const nextText = currentRole.slice(0, charIndex);
    typingText.textContent = nextText;

    if (!isDeleting && charIndex < currentRole.length) {
      charIndex += 1;
      setTimeout(runTypingAnimation, 120);
      return;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(runTypingAnimation, 1200);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(runTypingAnimation, 65);
      return;
    }

    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(runTypingAnimation, 250);
  };

  runTypingAnimation();
}

// 3) Fade-in on scroll with IntersectionObserver
const fadeElements = document.querySelectorAll('.section, .project-card, .skill-grid span');

if ('IntersectionObserver' in window) {
  fadeElements.forEach((element) => {
    element.classList.add('fade-item');
  });

  const fadeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
  );

  fadeElements.forEach((element) => fadeObserver.observe(element));
}

// 4) Light/dark theme toggle with localStorage
const THEME_KEY = 'portfolio-theme';
const root = document.documentElement;

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
};

const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

if (navbar) {
  const themeToggle = document.createElement('button');
  themeToggle.id = 'theme-toggle';
  themeToggle.className = 'theme-toggle';
  themeToggle.type = 'button';
  themeToggle.setAttribute('aria-label', 'Toggle color theme');
  themeToggle.setAttribute('aria-pressed', String(savedTheme === 'light'));
  themeToggle.textContent = savedTheme === 'light' ? '☀' : '☾';

  navbar.insertBefore(themeToggle, navLinks);

  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    themeToggle.setAttribute('aria-pressed', String(nextTheme === 'light'));
    themeToggle.textContent = nextTheme === 'light' ? '☀' : '☾';
  });
}
