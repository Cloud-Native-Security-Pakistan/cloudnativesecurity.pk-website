import { sanitize } from './utils.js';

export class SpeakerTrophy {
    constructor(session) {
        this.session = session;
    }

    render() {
        const { id, title, date, duration, topic, speaker } = this.session;

        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const shareUrl = `${window.location.origin}/sessions/trophy/?id=${id}`;
        const shareText = encodeURIComponent(`🏆 I spoke at Cloud Native Security Pakistan on "${title}"! Check it out:`);
        const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;

        return `
            <div class="min-h-screen flex items-center justify-center p-6">
                <div class="relative max-w-lg w-full">
                    <!-- Glow Effects -->
                    <div class="absolute -top-20 -left-20 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                    <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                    
                    <!-- Trophy Card -->
                    <div class="relative glass-panel rounded-3xl overflow-hidden border-2 border-brand-500/30 hover:border-brand-500/50 transition-all duration-500" id="trophy-card">
                        <!-- Trophy Header -->
                        <div class="bg-gradient-to-br from-brand-600/30 via-brand-500/20 to-amber-500/10 p-8 text-center border-b border-white/10">
                            <!-- Trophy Icon -->
                            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 mb-4">
                                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                                </svg>
                            </div>
                            
                            <p class="text-sm text-brand-400 font-mono uppercase tracking-widest mb-2">Speaker Recognition</p>
                            <h1 class="text-2xl font-bold text-white">Cloud Native Security Pakistan</h1>
                        </div>
                        
                        <!-- Speaker Info -->
                        <div class="p-8">
                            <div class="flex flex-col items-center mb-6">
                                <img src="${sanitize(speaker.image)}" 
                                     alt="${sanitize(speaker.name)}"
                                     class="w-24 h-24 rounded-full border-4 border-brand-500/50 shadow-lg shadow-brand-500/20 mb-4 object-cover"
                                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&background=059669&color=fff&size=200'">
                                <h2 class="text-2xl font-bold text-white">${sanitize(speaker.name)}</h2>
                                <p class="text-gray-400">${sanitize(speaker.role)}</p>
                                <p class="text-brand-500 text-sm">${sanitize(speaker.company)}</p>
                            </div>
                            
                            <!-- Session Details -->
                            <div class="bg-white/5 rounded-xl p-4 mb-6">
                                <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Presented</p>
                                <h3 class="text-lg font-semibold text-white mb-3">"${sanitize(title)}"</h3>
                                <div class="flex items-center justify-between text-sm text-gray-400">
                                    <span class="flex items-center gap-1">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        ${formattedDate}
                                    </span>
                                    <span class="px-2 py-0.5 bg-brand-500/20 text-brand-400 rounded text-xs">${sanitize(topic)}</span>
                                </div>
                            </div>
                            
                            <!-- Share Buttons -->
                            <div class="flex gap-3">
                                <a href="${linkedInShareUrl}" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   class="flex-1 text-center px-4 py-3 bg-[#0077B5] hover:bg-[#006399] text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    LinkedIn
                                </a>
                                <a href="${twitterShareUrl}" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   class="flex-1 text-center px-4 py-3 bg-[#1DA1F2] hover:bg-[#0d8bd9] text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                    Twitter
                                </a>
                            </div>
                            
                            <button onclick="navigator.clipboard.writeText('${shareUrl}').then(() => { this.textContent = 'Link Copied!'; setTimeout(() => { this.innerHTML = '<svg class=\\'w-4 h-4\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z\\'></path></svg>Copy Link'; }, 2000); })"
                                    class="w-full mt-3 px-4 py-3 border border-white/10 hover:border-brand-500/50 hover:bg-white/5 text-gray-300 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                </svg>
                                Copy Link
                            </button>
                        </div>
                        
                        <!-- Footer Branding -->
                        <div class="px-8 py-4 bg-white/[0.02] border-t border-white/5 text-center">
                            <p class="text-xs text-gray-500">
                                Verified by <span class="text-brand-500 font-semibold">Cloud Native Security Pakistan</span> • CNCF Chapter
                            </p>
                        </div>
                    </div>
                    
                    <!-- Back Link -->
                    <div class="text-center mt-6">
                        <a href="/sessions/" class="text-gray-400 hover:text-white text-sm transition-colors">
                            ← Back to all sessions
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}
