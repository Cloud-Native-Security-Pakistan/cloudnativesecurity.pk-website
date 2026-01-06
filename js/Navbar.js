// Navbar Component
export class Navbar {
    constructor() {
        this.navItems = [
            { name: 'Home', href: 'index.html' },
            { name: 'About', href: 'about.html' },
            { name: 'Events', href: 'events.html' },
            { name: 'Members', href: 'members.html' },
            { name: 'Projects', href: 'projects.html' },
            { name: 'Join', href: 'join.html' }
        ];
    }

    render() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        return `
            <nav class="bg-black border-b border-green-500/20" role="navigation" aria-label="Main navigation">
                <div class="container mx-auto px-4">
                    <div class="flex items-center justify-between h-16">
                        <a href="index.html" class="flex items-center space-x-2">
                            <span class="text-green-500 font-mono font-bold text-xl">CNSP</span>
                        </a>
                        <button id="mobile-menu-btn" class="md:hidden text-green-500" aria-label="Toggle menu" aria-expanded="false">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                        <div id="nav-menu" class="hidden md:flex md:items-center md:space-x-6">
                            ${this.navItems.map(item => `
                                <a href="${item.href}" 
                                   class="${currentPage === item.href ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400 hover:text-green-500'} 
                                          px-3 py-2 transition-colors duration-200">
                                    ${item.name}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                    <div id="mobile-menu" class="hidden md:hidden py-4">
                        ${this.navItems.map(item => `
                            <a href="${item.href}" 
                               class="${currentPage === item.href ? 'text-green-500' : 'text-gray-400'} 
                                      block px-4 py-2 hover:bg-gray-900">
                                ${item.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </nav>
        `;
    }

    init() {
        const navbarContainer = document.getElementById('navbar');
        if (navbarContainer) {
            navbarContainer.innerHTML = this.render();
            
            // Mobile menu toggle
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                    mobileMenu.classList.toggle('hidden');
                    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
                });
            }
        }
    }
}

