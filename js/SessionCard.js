import { sanitize } from './utils.js';

export class SessionCard {
    constructor(session) {
        this.session = session;
    }

    render() {
        const { id, title, description, date, duration, type, topic, recordingUrl, registrationUrl, thumbnail, speaker } = this.session;

        const safeTitle = sanitize(title);
        const safeDesc = sanitize(description);
        const safeTopic = sanitize(topic);
        const safeDuration = sanitize(duration);

        const isUpcoming = type === 'upcoming';
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <article class="glass-panel rounded-xl overflow-hidden group hover:border-brand-500/30 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]" data-session-id="${id}">
                <!-- Thumbnail Container -->
                <div class="relative h-48 overflow-hidden">
                    <img src="${sanitize(thumbnail)}" 
                         alt="${safeTitle}" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                         loading="lazy"
                         onerror="this.src='https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent"></div>
                    
                    ${!isUpcoming ? `
                    <!-- Play Button Overlay -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="w-16 h-16 rounded-full bg-brand-500/90 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                            <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- Topic Badge -->
                    <div class="absolute top-4 left-4">
                        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-brand-500/20 text-brand-300 border border-brand-500/20">
                            ${safeTopic}
                        </span>
                    </div>

                    <!-- Duration Badge -->
                    <div class="absolute top-4 right-4 bg-dark-900/80 backdrop-blur border border-white/10 px-2 py-1 rounded-lg">
                        <span class="text-xs text-gray-300 font-mono">${safeDuration}</span>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6 flex flex-col flex-grow">
                    <!-- Speaker Info -->
                    <div class="flex items-center gap-3 mb-4">
                        <img src="${sanitize(speaker.image)}" 
                             alt="${sanitize(speaker.name)}"
                             class="w-10 h-10 rounded-full border-2 border-brand-500/30 object-cover"
                             onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&background=059669&color=fff'">
                        <div>
                            <p class="text-sm font-medium text-white">${sanitize(speaker.name)}</p>
                            <p class="text-xs text-gray-500">${sanitize(speaker.role)} @ ${sanitize(speaker.company)}</p>
                        </div>
                    </div>

                    <h3 class="text-lg font-bold text-white mb-2 group-hover:text-brand-500 transition-colors leading-tight line-clamp-2">
                        ${safeTitle}
                    </h3>

                    <p class="text-gray-400 text-sm mb-4 line-clamp-2 font-light leading-relaxed flex-grow">
                        ${safeDesc}
                    </p>

                    <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            ${formattedDate}
                        </span>
                        <span class="px-2 py-0.5 rounded ${isUpcoming ? 'bg-amber-500/20 text-amber-400' : 'bg-brand-500/20 text-brand-400'}">
                            ${isUpcoming ? 'Upcoming' : 'Available'}
                        </span>
                    </div>

                    <div class="mt-auto pt-4 border-t border-white/5 flex gap-3">
                        ${isUpcoming ? `
                            <a href="${sanitize(registrationUrl)}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               class="flex-1 text-center px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition-all">
                                Register Now
                            </a>
                        ` : `
                            <a href="${sanitize(recordingUrl)}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               class="flex-1 text-center px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition-all">
                                Watch Recording
                            </a>
                        `}
                        <a href="/sessions/trophy/?id=${id}" 
                           class="px-4 py-2.5 border border-white/10 hover:border-brand-500/50 hover:bg-white/5 text-gray-300 text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                           title="View Speaker Trophy">
                            <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 2h14v2H5zm0 4h14v2H5zM5 8h14v6c0 1.1-.9 2-2 2h-4v2h3v2H8v-2h3v-2H7c-1.1 0-2-.9-2-2V8zm2 2v4h10v-4H7z"/>
                            </svg>
                            <span>Trophy</span>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }
}
