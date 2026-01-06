/**
 * Utility functions for CNSPK Website
 * Security and helper functions
 */

// DOMPurify for sanitization (will be loaded via CDN)
const sanitize = (dirty) => {
  if (typeof DOMPurify !== 'undefined') {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
  }
  // Fallback: basic HTML entity encoding
  const div = document.createElement('div');
  div.textContent = dirty;
  return div.innerHTML;
};

// Environment variables loader
const getEnvVar = (key) => {
  // In production, these would be set via GitHub Pages environment variables
  // or injected at build time
  const env = window.__ENV__ || {};
  return env[key] || '';
};

// Fetch with error handling
const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Loading state helper
const showLoading = (element) => {
  if (element) {
    element.innerHTML = '<div class="flex justify-center items-center p-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cnspk-blue"></div></div>';
  }
};

const showError = (element, message = 'Failed to load content. Please try again later.') => {
  if (element) {
    element.innerHTML = `<div class="text-center p-8 text-red-600"><p>${sanitize(message)}</p></div>`;
  }
};

export { sanitize, getEnvVar, safeFetch, debounce, formatDate, showLoading, showError };

