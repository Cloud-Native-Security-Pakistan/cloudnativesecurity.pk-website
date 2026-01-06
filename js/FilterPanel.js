// FilterPanel Component
export class FilterPanel {
    constructor(onFilterChange) {
        this.onFilterChange = onFilterChange;
        this.filters = {
            city: '',
            team: '',
            skill: ''
        };
    }

    render() {
        return `
            <div class="bg-gray-900 border border-green-500/20 p-6 rounded-lg mb-6" role="search" aria-label="Filter members">
                <h3 class="text-xl font-bold text-green-500 mb-4 font-mono">Filters</h3>
                <div class="grid md:grid-cols-3 gap-4">
                    <div>
                        <label for="city-filter" class="block text-gray-400 text-sm mb-2 font-mono">City</label>
                        <select id="city-filter" 
                                class="w-full bg-gray-800 border border-green-500/20 text-green-500 rounded px-3 py-2 font-mono focus:border-green-500 focus:outline-none">
                            <option value="">All Cities</option>
                            <option value="Lahore">Lahore</option>
                            <option value="Karachi">Karachi</option>
                            <option value="Islamabad">Islamabad</option>
                            <option value="Rawalpindi">Rawalpindi</option>
                        </select>
                    </div>
                    <div>
                        <label for="team-filter" class="block text-gray-400 text-sm mb-2 font-mono">Team</label>
                        <select id="team-filter" 
                                class="w-full bg-gray-800 border border-green-500/20 text-green-500 rounded px-3 py-2 font-mono focus:border-green-500 focus:outline-none">
                            <option value="">All Teams</option>
                            <option value="newbie">Newbie</option>
                            <option value="member">Member</option>
                            <option value="contributor">Contributor</option>
                            <option value="advanced-contributor">Advanced Contributor</option>
                            <option value="mentor">Mentor/Admin</option>
                        </select>
                    </div>
                    <div>
                        <label for="skill-filter" class="block text-gray-400 text-sm mb-2 font-mono">Skill</label>
                        <select id="skill-filter" 
                                class="w-full bg-gray-800 border border-green-500/20 text-green-500 rounded px-3 py-2 font-mono focus:border-green-500 focus:outline-none">
                            <option value="">All Skills</option>
                            <option value="kubernetes">Kubernetes</option>
                            <option value="devsecops">DevSecOps</option>
                            <option value="security">Security</option>
                            <option value="cloud">Cloud</option>
                        </select>
                    </div>
                </div>
                <button id="clear-filters" 
                        class="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-green-500 font-mono rounded border border-green-500/20 transition-all duration-200">
                    Clear Filters
                </button>
            </div>
        `;
    }

    init() {
        const panelContainer = document.getElementById('filter-panel');
        if (panelContainer) {
            panelContainer.innerHTML = this.render();
            
            const cityFilter = document.getElementById('city-filter');
            const teamFilter = document.getElementById('team-filter');
            const skillFilter = document.getElementById('skill-filter');
            const clearBtn = document.getElementById('clear-filters');

            const updateFilters = () => {
                this.filters = {
                    city: cityFilter.value,
                    team: teamFilter.value,
                    skill: skillFilter.value
                };
                if (this.onFilterChange) {
                    this.onFilterChange(this.filters);
                }
            };

            cityFilter?.addEventListener('change', updateFilters);
            teamFilter?.addEventListener('change', updateFilters);
            skillFilter?.addEventListener('change', updateFilters);

            clearBtn?.addEventListener('click', () => {
                cityFilter.value = '';
                teamFilter.value = '';
                skillFilter.value = '';
                updateFilters();
            });
        }
    }

    getFilters() {
        return this.filters;
    }
}

