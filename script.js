const toggleButton = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const yearElement = document.getElementById('year');
const navbar = document.getElementById('navbar');
const heroHeading = document.querySelector('#hero h1');
const projectGrid = document.getElementById('project-grid');
const projectsStatus = document.getElementById('projects-status');
const contactForm = document.getElementById('contact-form');

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

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks && toggleButton) {
    navLinks.classList.remove('show');
    toggleButton.setAttribute('aria-expanded', 'false');
  }
});

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
let fadeObserver;

const observeFadeElement = (element) => {
  if (!element) return;
  element.classList.add('fade-item');

  if (fadeObserver) {
    fadeObserver.observe(element);
  } else {
    element.classList.add('visible');
  }
};

if ('IntersectionObserver' in window) {
  fadeObserver = new IntersectionObserver(
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

  fadeElements.forEach((element) => observeFadeElement(element));
} else {
  fadeElements.forEach((element) => element.classList.add('visible'));
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

const renderProjects = (repos) => {
  if (!projectGrid) return;

  projectGrid.innerHTML = '';

  repos.forEach((repo) => {
    const card = document.createElement('a');
    card.className = 'project-card project-link';
    card.href = repo.html_url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `Open ${repo.name} repository`);

    const title = document.createElement('h3');
    title.textContent = repo.name;

    const description = document.createElement('p');
    description.textContent = repo.description || 'No description provided.';

    const meta = document.createElement('div');
    meta.className = 'project-meta';

    const language = document.createElement('span');
    language.textContent = `Language: ${repo.language || 'N/A'}`;

    const stars = document.createElement('span');
    stars.textContent = `⭐ ${repo.stargazers_count}`;

    meta.append(language, stars);
    card.append(title, description, meta);
    projectGrid.append(card);
    observeFadeElement(card);
  });
};

const loadLatestRepositories = async () => {
  if (!projectGrid || !projectsStatus) return;

  projectsStatus.textContent = 'Loading repositories...';

  try {
    const response = await fetch('https://api.github.com/users/ananya-in-tech/repos');
    if (!response.ok) {
      throw new Error('Request failed');
    }

    const repositories = await response.json();
    const latestRepos = repositories
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 6);

    if (latestRepos.length === 0) {
      projectsStatus.textContent = 'No repositories available to display right now.';
      return;
    }

    renderProjects(latestRepos);
    projectsStatus.textContent = '';
  } catch (error) {
    projectsStatus.textContent = 'Unable to load repositories right now. Please try again later.';
  }
};

loadLatestRepositories();

const getFieldValue = (id) => {
  const field = document.getElementById(id);
  return field ? field.value.trim() : '';
};

const setFieldError = (id, message) => {
  const field = document.getElementById(id);
  const errorField = document.getElementById(`${id}-error`);
  if (field) {
    field.setAttribute('aria-invalid', String(Boolean(message)));
  }
  if (errorField) {
    errorField.textContent = message;
  }
};

if (contactForm) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const successMessage = document.getElementById('form-success');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const clearFormMessages = () => {
    setFieldError('name', '');
    setFieldError('email', '');
    setFieldError('message', '');
    if (successMessage) {
      successMessage.textContent = '';
    }
  };

  [nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      setFieldError(input.id, '');
      if (successMessage) {
        successMessage.textContent = '';
      }
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFormMessages();

    const name = getFieldValue('name');
    const email = getFieldValue('email');
    const message = getFieldValue('message');

    let hasError = false;

    if (!name) {
      setFieldError('name', 'Please enter your name.');
      hasError = true;
    }

    if (!email) {
      setFieldError('email', 'Please enter your email.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError('email', 'Please enter a valid email address.');
      hasError = true;
    }

    if (!message) {
      setFieldError('message', 'Please enter your message.');
      hasError = true;
    }

    if (hasError) return;

    contactForm.reset();
    if (successMessage) {
      successMessage.textContent = 'Thanks! Your message has been validated and sent successfully.';
    }
  });
}
