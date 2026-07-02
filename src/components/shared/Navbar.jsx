// Navbar.jsx
// Top navigation bar — visible on every page.
// Handles the home button, app title, and the dark/light mode toggle.
// The theme toggle flips a data-theme attribute on the <html> element;
// CSS variables in index.css do the rest — no state needs to go any deeper.

import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Read the saved theme from localStorage on first render so it persists across sessions.
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Whenever theme changes, apply it to the root element and save it.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <nav className="navbar">
      <div className="navbar__left">
        {/* Only show the home button when we're not already on the home page */}
        {!isHome && (
          <button
            className="navbar__home-btn"
            onClick={() => navigate('/')}
            aria-label="Go to home page"
          >
            ← Home
          </button>
        )}
        <span
          className="navbar__title"
          onClick={() => navigate('/')}
          role="link"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/')}
        >
          Project Manager
        </span>
      </div>

      <div className="navbar__right">
        <button
          className="navbar__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}