/**
 * Interactive Map Component using Leaflet
 * Displays members on an OpenStreetMap-based map
 */
class MemberMap {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.map = null;
    this.markers = [];
    this.members = [];
    this.options = {
      center: [31.5204, 74.3587], // Lahore, Pakistan default
      zoom: 6,
      ...options
    };
  }

  async init() {
    // Lazy load Leaflet CSS and JS
    await this.loadLeaflet();
    
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Map container #${this.containerId} not found`);
      return;
    }

    // Initialize map
    this.map = L.map(this.containerId, {
      center: this.options.center,
      zoom: this.options.zoom,
      zoomControl: true
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    return this.map;
  }

  async loadLeaflet() {
    return new Promise((resolve) => {
      if (window.L) {
        resolve();
        return;
      }

      // Load Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  addMember(member) {
    if (!this.map) return;

    const { location, name, username, github } = member;
    if (!location || !location.coordinates) return;

    const { latitude, longitude } = location.coordinates;
    if (!latitude || !longitude) return;

    // Create marker
    const marker = L.marker([latitude, longitude]).addTo(this.map);

    // Create popup content
    const popupContent = `
      <div class="p-2">
        <h3 class="font-semibold text-lg">${this.sanitize(name || username)}</h3>
        <p class="text-sm text-gray-600">${this.sanitize(location.city || '')}, ${this.sanitize(location.country || '')}</p>
        ${github ? `<a href="https://github.com/${this.sanitize(github)}" target="_blank" rel="noopener noreferrer" class="text-cnspk-blue hover:underline text-sm">@${this.sanitize(github)}</a>` : ''}
      </div>
    `;

    marker.bindPopup(popupContent);
    this.markers.push({ marker, member });
    this.members.push(member);
  }

  addMembers(members) {
    members.forEach(member => this.addMember(member));
    
    // Fit map to show all markers
    if (this.markers.length > 0 && this.map) {
      const group = new L.featureGroup(this.markers.map(m => m.marker));
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  clearMarkers() {
    this.markers.forEach(({ marker }) => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
    this.members = [];
  }

  filterMarkers(filterFn) {
    this.markers.forEach(({ marker, member }) => {
      if (filterFn(member)) {
        marker.addTo(this.map);
      } else {
        this.map.removeLayer(marker);
      }
    });
  }

  sanitize(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

export default MemberMap;

