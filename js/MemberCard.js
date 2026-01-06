// MemberCard Component with DOMPurify sanitization
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';

export class MemberCard {
    constructor(member) {
        this.member = member;
    }

    sanitize(html) {
        if (!html) return '';
        return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'] });
    }

    getTeamColor(team) {
        const colors = {
            'newbie': 'text-green-500',
            'member': 'text-blue-500',
            'contributor': 'text-yellow-500',
            'advanced-contributor': 'text-orange-500',
            'mentor': 'text-red-500',
            'admin': 'text-red-500'
        };
        return colors[team?.toLowerCase()] || 'text-gray-400';
    }

    render() {
        const { name, username, location, team, interests, github, linkedin, twitter } = this.member;
        
        const safeName = this.sanitize(name || username);
        const safeLocation = this.sanitize(location || 'Pakistan');
        const safeInterests = interests ? this.sanitize(interests.join(', ')) : '';
        
        return `
            <article class="bg-gray-900 border border-green-500/20 p-6 rounded-lg hover:border-green-500/50 transition-all duration-300" role="article">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="text-xl font-bold text-green-500 mb-1 font-mono">${safeName}</h3>
                        <p class="text-gray-400 text-sm font-mono">@${username}</p>
                    </div>
                    ${team ? `
                        <span class="px-3 py-1 bg-green-500/20 ${this.getTeamColor(team)} text-xs font-mono rounded capitalize">
                            ${team}
                        </span>
                    ` : ''}
                </div>
                <div class="space-y-2 mb-4">
                    <p class="text-gray-400 text-sm">📍 ${safeLocation}</p>
                    ${safeInterests ? `<p class="text-gray-400 text-sm">💡 ${safeInterests}</p>` : ''}
                </div>
                <div class="flex gap-3">
                    ${github ? `
                        <a href="https://github.com/${github}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="text-gray-400 hover:text-green-500 transition-colors"
                           aria-label="GitHub profile">
                            💻
                        </a>
                    ` : ''}
                    ${linkedin ? `
                        <a href="${linkedin}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="text-gray-400 hover:text-green-500 transition-colors"
                           aria-label="LinkedIn profile">
                            💼
                        </a>
                    ` : ''}
                    ${twitter ? `
                        <a href="https://twitter.com/${twitter}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="text-gray-400 hover:text-green-500 transition-colors"
                           aria-label="Twitter profile">
                            🐦
                        </a>
                    ` : ''}
                </div>
            </article>
        `;
    }
}

