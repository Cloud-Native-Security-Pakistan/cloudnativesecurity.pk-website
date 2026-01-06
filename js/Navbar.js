/**
 * Navigation Bar Component
 */
class Navbar {
  constructor() {
    this.navbar = null;
    this.mobileMenuOpen = false;
  }

  init() {
    this.navbar = document.getElementById('navbar');
    if (!this.navbar) return;

    this.render();
    this.attachEventListeners();
  }

  render() {
    this.navbar.innerHTML = `
      <nav class="bg-white shadow-md" role="navigation" aria-label="Main navigation">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex-shrink-0">
              <a href="index.html" class="flex items-center" aria-label="CNSPK Home">
                <span class="text-2xl font-bold text-cnspk-blue">CNSPK</span>
              </a>
            </div>

            <!-- Desktop Menu -->
            <div class="hidden md:flex md:space-x-8">
              <a href="index.html" class="text-gray-700 hover:text-cnspk-blue px-3 py-2 text-sm font-medium transition-colors">Home</a>
              <a href="about.html" class="text-gray-700 hover:text-cnspk-blue px-3 py-2 text-sm font-medium transition-colors">About</a>
              <a href="join.html" class="text-gray-700 hover:text-cnspk-blue px-3 py-2 text-sm font-medium transition-colors">Join</a>
              <a href="projects.html" class="text-gray-700 hover:text-cnspk-blue px-3 py-2 text-sm font-medium transition-colors">Projects</a>
              <a href="members.html" class="text-gray-700 hover:text-cnspk-blue px-3 py-2 text-sm font-medium transition-colors">Members</a>
              <a href="events.html" class="text-gray-700 hover:text-cnspk-blue px-3 py-2 text-sm font-medium transition-colors">Events</a>
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden">
              <button 
                id="mobile-menu-button"
                class="text-gray-700 hover:text-cnspk-blue focus:outline-none focus:text-cnspk-blue"
                aria-label="Toggle menu"
                aria-expanded="false"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            <a href="index.html" class="block px-3 py-2 text-gray-700 hover:text-cnspk-blue hover:bg-gray-50 rounded-md text-base font-medium">Home</a>
            <a href="about.html" class="block px-3 py-2 text-gray-700 hover:text-cnspk-blue hover:bg-gray-50 rounded-md text-base font-medium">About</a>
            <a href="join.html" class="block px-3 py-2 text-gray-700 hover:text-cnspk-blue hover:bg-gray-50 rounded-md text-base font-medium">Join</a>
            <a href="projects.html" class="block px-3 py-2 text-gray-700 hover:text-cnspk-blue hover:bg-gray-50 rounded-md text-base font-medium">Projects</a>
            <a href="members.html" class="block px-3 py-2 text-gray-700 hover:text-cnspk-blue hover:bg-gray-50 rounded-md text-base font-medium">Members</a>
            <a href="events.html" class="block px-3 py-2 text-gray-700 hover:text-cnspk-blue hover:bg-gray-50 rounded-md text-base font-medium">Events</a>
          </div>
        </div>
      </nav>
    `;
  }

  attachEventListeners() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        mobileMenu.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded', this.mobileMenuOpen.toString());
      });
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const navbar = new Navbar();
    navbar.init();
  });
} else {
  const navbar = new Navbar();
  navbar.init();
}

