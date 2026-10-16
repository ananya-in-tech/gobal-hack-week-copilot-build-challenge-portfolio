const toggleButton = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

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
