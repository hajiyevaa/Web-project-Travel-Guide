function initializeMap() {
    // Create map centered on Azerbaijan
    const map = L.map('map').setView([40.4093, 49.8671], 8);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add markers for each place
    appState.places.forEach(place => {
        const marker = L.marker(place.coordinates).addTo(map);
        marker.bindPopup(`
            <div class="map-popup">
                <h3>${place.name}</h3>
                <p>${place.location}</p>
                <p>${place.description.substring(0, 100)}...</p>
                <button class="btn btn-primary view-place-btn" data-id="${place.id}">View Details</button>
            </div>
        `);
        
        // Add event listener to the button in the popup
        marker.on('popupopen', function() {
            const viewBtn = document.querySelector('.view-place-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', function() {
                    const placeId = parseInt(this.getAttribute('data-id'));
                    showPlaceDetail(placeId);
                });
            }
        });
    });
    
    // Store map reference globally
    window.map = map;
}