# Priyanshu Chaurasia Portfolio

A responsive single-page developer portfolio built for the **MLH Global Hack Week Copilot Build Challenge** using **GitHub Copilot**.

## About this project

This project is a personal portfolio website for **Priyanshu Chaurasia** (`priyanshu-1006`) built with plain web technologies (no framework).  
It highlights profile information, skills, projects, and contact options with a modern and accessible UI.

## Features

- Responsive single-page layout with sections for Hero, About, Skills, Projects, Contact, and Footer
- Sticky navigation with mobile hamburger menu
- Typing animation in the hero section
- Scroll-based fade-in animations
- Light/Dark theme toggle with saved preference (`localStorage`)
- Dynamic Projects section:
  - Fetches public repositories from GitHub API
  - Sorts by most recently updated
  - Shows top 6 repositories with language and star count
  - Handles loading and fallback states
- Contact form with client-side validation and success messaging
- Accessibility improvements:
  - Skip link
  - ARIA labels/attributes
  - Keyboard focus-visible states and keyboard-friendly interactions

## Tech stack

- **HTML5**
- **CSS3**
- **Vanilla JavaScript (ES6+)**
- **Google Fonts (Inter)**
- **GitHub REST API** (`/users/priyanshu-1006/repos`)

## Run locally

1. Clone the repository:
   ```bash
   git clone https://github.com/ananya-in-tech/gobal-hack-week-copilot-build-challenge-portfolio.git
   ```
2. Move into the project folder:
   ```bash
   cd gobal-hack-week-copilot-build-challenge-portfolio
   ```
3. Start a local static server (recommended):
   ```bash
   python3 -m http.server 8000
   ```
4. Open in your browser:
   - `http://localhost:8000`

You can also open `index.html` directly in a browser, but using a local server is recommended for consistent behavior.