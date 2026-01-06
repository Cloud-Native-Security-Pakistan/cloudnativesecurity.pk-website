// EventCard Component with DOMPurify sanitization
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';

export class EventCard {
    constructor(event) {
        this.event = event;
    }

    sanitize(html) {
        return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'] });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    render() {
        const { title, date, city, description, image, link, type } = this.event;
        
        const safeDescription = description ? this.sanitize(description.substring(0, 150) + '...') : '';
        const safeTitle = this.sanitize(title);
        const safeCity = this.sanitize(city || 'TBA');
        
        return `
            <article class="bg-gray-900 border border-green-500/20 rounded-lg overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10" role="article">
                ${image ? `
                    <div class="aspect-video bg-gray-800 overflow-hidden">
                        <img src="${image}" 
                             alt="${safeTitle}" 
                             class="w-full h-full object-cover lazy-load"
                             loading="lazy"
                             onerror="this.src='assets/placeholder-event.jpg'">
                    </div>
                ` : ''}
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <span class="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-mono rounded">
                            ${type || 'Event'}
                        </span>
                        <time class="text-gray-400 text-sm font-mono" datetime="${date}">
                            ${this.formatDate(date)}
                        </time>
                    </div>
                    <h3 class="text-xl font-bold text-green-500 mb-2 font-mono">
                        ${safeTitle}
                    </h3>
                    <p class="text-gray-400 text-sm mb-4 line-clamp-3">
                        ${safeDescription || 'Join us for an exciting event!'}
                    </p>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500 text-sm font-mono">📍 ${safeCity}</span>
                        ${link ? `
                            <a href="${link}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               class="px-4 py-2 bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-black font-mono text-sm rounded transition-colors duration-200">
                                Learn More →
                            </a>
                        ` : ''}
                    </div>
                </div>
            </article>
        `;
    }
}

