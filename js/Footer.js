// Footer Component
export class Footer {
    constructor() {
        this.socialLinks = [
            { name: 'CNCF Bevy', url: 'https://community.cncf.io/cloud-native-security-pakistan/', icon: '🌐' },
            { name: 'WhatsApp', url: 'https://chat.whatsapp.com/F5Hf1ZwI22TK6EcV6zz4wo', icon: '💬' },
            { name: 'LinkedIn', url: 'https://www.linkedin.com/company/cloud-native-security-pakistan', icon: '💼' },
            { name: 'Twitter', url: 'https://twitter.com/cnspk', icon: '🐦' },
            { name: 'GitHub', url: 'https://github.com/Cloud-Native-Security-Pakistan', icon: '💻' }
        ];
    }

    render() {
        return `
            <footer class="bg-black border-t border-green-500/20 mt-auto" role="contentinfo">
                <div class="container mx-auto px-4 py-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 class="text-green-500 font-mono font-bold text-lg mb-4">CNSP</h3>
                            <p class="text-gray-400 text-sm">
                                Cloud Native Security Pakistan - Building secure cloud native communities in Pakistan.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-green-500 font-mono mb-4">Quick Links</h4>
                            <ul class="space-y-2 text-sm">
                                <li><a href="about.html" class="text-gray-400 hover:text-green-500 transition-colors">About Us</a></li>
                                <li><a href="events.html" class="text-gray-400 hover:text-green-500 transition-colors">Events</a></li>
                                <li><a href="members.html" class="text-gray-400 hover:text-green-500 transition-colors">Members</a></li>
                                <li><a href="join.html" class="text-gray-400 hover:text-green-500 transition-colors">Join Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-green-500 font-mono mb-4">Connect</h4>
                            <div class="flex flex-wrap gap-3">
                                ${this.socialLinks.map(link => `
                                    <a href="${link.url}" 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       class="text-gray-400 hover:text-green-500 transition-colors"
                                       aria-label="${link.name}">
                                        ${link.icon}
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
                        <p>&copy; ${new Date().getFullYear()} Cloud Native Security Pakistan. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    }

    init() {
        const footerContainer = document.getElementById('footer');
        if (footerContainer) {
            footerContainer.innerHTML = this.render();
        }
    }
}

