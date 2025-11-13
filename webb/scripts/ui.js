function initializePages() {
    const navLinks = document.querySelectorAll('.nav-link');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const homeLogo = document.getElementById('home-logo');
    const exploreCta = document.getElementById('explore-cta');
    const footerLinks = document.querySelectorAll('.footer-links a');
    const registerLink = document.getElementById('register-link');
    const goToLogin = document.getElementById('go-to-login');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    loginBtn.addEventListener('click', function() {
        showPage('login');
    });

    registerBtn.addEventListener('click', function() {
        showPage('register');
    });
    
    homeLogo.addEventListener('click', function() {
        showPage('home');
    });
    
    exploreCta.addEventListener('click', function() {
        showPage('explore');
    });
    
    footerLinks.forEach(link => {
        if (link.hasAttribute('data-page')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                showPage(pageId);
            });
        }
    });

    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage('register');
    });

    goToLogin.addEventListener('click', function(e) { 
        e.preventDefault();
        showPage('login');
    });
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    // Update active navigation link
    updateActiveNavLink(pageId);
    // Special handling for certain pages
    if (pageId === 'explore') {
        // Refresh map when explore page is shown
        setTimeout(() => {
            if (window.map) window.map.invalidateSize();
        }, 300);
    } else if (pageId === 'favorites') {
        // Refresh favorites when favorites page is shown
        renderFavorites();
    }
}

function updateActiveNavLink(pageId) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the corresponding nav link
    const activeNavLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }
}

function renderFeaturedPlaces() {
    const featuredContainer = document.getElementById('featured-places');
    const featuredPlaces = appState.places.slice(0, 3); // Get first 3 places as featured

    featuredContainer.innerHTML = featuredPlaces.map(place => `
        <div class="place-card" data-id="${place.id}">
            <div class="favorite-icon ${appState.favorites.includes(place.id) ? 'active' : ''}" data-id="${place.id}">
                <i class="${appState.favorites.includes(place.id) ? 'fas' : 'far'} fa-heart"></i>
            </div>
            <img src="${place.image}" alt="${place.name}" class="place-image">
            <div class="place-content">
                <h3 class="place-title">${place.name}</h3>
                <div class="place-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${place.location}</span>
                </div>
                <p class="place-description">${place.description.substring(0, 100)}...</p>
                <div class="place-actions">
                    <div class="place-rating">
                        <span>${place.rating > 0 ? place.rating : 'No ratings'}</span>
                        ${place.rating > 0 ? '<i class="fas fa-star"></i>' : ''}
                        ${place.reviewCount > 0 ? `<span class="review-count">(${place.reviewCount})</span>` : ''}
                    </div>
                    <button class="btn btn-primary view-detail-btn" data-id="${place.id}">View Details</button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to view detail buttons
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const placeId = parseInt(this.getAttribute('data-id'));
            showPlaceDetail(placeId);
        });
    });

    // Add event listeners to favorite icons
    featuredContainer.addEventListener('click', function(e) {
        if (e.target.closest('.favorite-icon')) {
            const favoriteIcon = e.target.closest('.favorite-icon');
            const placeId = parseInt(favoriteIcon.getAttribute('data-id'));
            toggleFavorite(placeId);
        }
    });
}

function renderAllPlaces() {
    const exploreContainer = document.getElementById('explore-places');

    exploreContainer.innerHTML = appState.places.map(place => `
        <div class="place-card" data-id="${place.id}" data-category="${place.category}">
            <div class="favorite-icon ${appState.favorites.includes(place.id) ? 'active' : ''}" data-id="${place.id}">
                <i class="${appState.favorites.includes(place.id) ? 'fas' : 'far'} fa-heart"></i>
            </div>
            <img src="${place.image}" alt="${place.name}" class="place-image">
            <div class="place-content">
                <h3 class="place-title">${place.name}</h3>
                <div class="place-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${place.location}</span>
                </div>
                <p class="place-description">${place.description.substring(0, 100)}...</p>
                <div class="place-actions">
                    <div class="place-rating">
                        <span>${place.rating > 0 ? place.rating : 'No ratings'}</span>
                        ${place.rating > 0 ? '<i class="fas fa-star"></i>' : ''}
                        ${place.reviewCount > 0 ? `<span class="review-count">(${place.reviewCount})</span>` : ''}
                    </div>
                    <button class="btn btn-primary view-detail-btn" data-id="${place.id}">View Details</button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to view detail buttons
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const placeId = parseInt(this.getAttribute('data-id'));
            showPlaceDetail(placeId);
        });
    });

    // Add event listeners to favorite icons
    exploreContainer.addEventListener('click', function(e) {
        if (e.target.closest('.favorite-icon')) {
            const favoriteIcon = e.target.closest('.favorite-icon');
            const placeId = parseInt(favoriteIcon.getAttribute('data-id'));
            toggleFavorite(placeId);
        }
    });

    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            filterPlaces(category);
        });
    });
}

function showPlaceDetail(placeId) {
    const place = appState.places.find(p => p.id === placeId);
    if (!place) return;

    appState.currentPlace = place;

    const detailPage = document.getElementById('place-detail');
    detailPage.innerHTML = `
        <div class="place-detail">
            <div class="favorite-icon ${appState.favorites.includes(place.id) ? 'active' : ''}" data-id="${place.id}">
                <i class="${appState.favorites.includes(place.id) ? 'fas' : 'far'} fa-heart"></i>
            </div>
            <img src="${place.image}" alt="${place.name}" class="place-detail-image">
            <div class="place-detail-content">
                <div class="place-detail-header">
                    <div>
                        <h1 class="place-detail-title">${place.name}</h1>
                        <div class="place-detail-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${place.location}</span>
                        </div>
                    </div>
                    <div class="place-detail-rating">
                        <span>${place.rating > 0 ? place.rating : 'No ratings'}</span>
                        ${place.rating > 0 ? '<i class="fas fa-star"></i>' : ''}
                        ${place.reviewCount > 0 ? `<span class="review-count">(${place.reviewCount} reviews)</span>` : ''}
                    </div>
                </div>
        
                <p class="place-detail-description">${place.description}</p>
        
                <div class="place-detail-actions">
                    <button class="btn btn-primary" id="add-review-btn">Add Review</button>
                    <button class="btn btn-secondary" id="back-to-explore">Back to Explore</button>
                </div>
        
                <div class="place-info-grid">
                    <div class="info-card">
                        <h3>Opening Hours</h3>
                        <p>${place.hours}</p>
                    </div>
                    <div class="info-card">
                        <h3>Entrance Fee</h3>
                        <p>${place.price}</p>
                    </div>
                    <div class="info-card">
                        <h3>Best Time to Visit</h3>
                        <p>${place.bestTime}</p>
                    </div>
                    <div class="info-card">
                        <h3>Travel Tips</h3>
                        <p>${place.tips}</p>
                    </div>
                </div>
        
                <div class="reviews-section">
                    <div class="reviews-header">
                        <h2>Reviews ${place.reviewCount > 0 ? `(${place.reviewCount})` : ''}</h2>
                        ${place.reviewCount > 0 ? '<button class="btn btn-primary" id="show-all-reviews">Show All Reviews</button>' : ''}
                    </div>
                    <div id="place-reviews">
                    </div>
                </div>
            </div>
        </div>
    `;

    // Load reviews for this place
    loadPlaceReviews(placeId);

    // Add event listeners
    detailPage.addEventListener('click', function(e) {
        // Favorite icon click
        if (e.target.closest('.favorite-icon')) {
            const favoriteIcon = e.target.closest('.favorite-icon');
            const placeId = parseInt(favoriteIcon.getAttribute('data-id'));
            toggleFavorite(placeId);
    
            // Immediate visual feedback
            if (appState.favorites.includes(placeId)) {
                favoriteIcon.classList.add('active');
                favoriteIcon.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                favoriteIcon.classList.remove('active');
                favoriteIcon.innerHTML = '<i class="far fa-heart"></i>';
            }
        }

        // Other button clicks
        if (e.target.id === 'add-review-btn' || e.target.closest('#add-review-btn')) {
            openReviewModal(place);
        }

        if (e.target.id === 'back-to-explore' || e.target.closest('#back-to-explore')) {
            showPage('explore');
        }

        if (e.target.id === 'show-all-reviews' || e.target.closest('#show-all-reviews')) {
            openReviewModal(place);
        }
    });

    // Show the detail page
    showPage('place-detail');
}

function loadPlaceReviews(placeId) {
    const reviewsContainer = document.getElementById('place-reviews');
    const placeReviews = appState.reviews[placeId] || [];

    if (placeReviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
    } else {
        // Show only the first 3 reviews in the detail page
        const reviewsToShow = placeReviews.slice(0, 3);
        reviewsContainer.innerHTML = reviewsToShow.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    
        // If there are more than 3 reviews, show a message
        if (placeReviews.length > 3) {
            reviewsContainer.innerHTML += `<p>... and ${placeReviews.length - 3} more reviews. <button class="btn-text" id="view-all-reviews">View all</button></p>`;
            document.getElementById('view-all-reviews').addEventListener('click', function() {
                openReviewModal(appState.currentPlace);
            });
        }
    }
}

function renderFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const favoritePlaces = appState.places.filter(place => appState.favorites.includes(place.id));

    if (favoritePlaces.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="empty-favorites">
                <i class="far fa-heart"></i>
                <h3>No favorites yet</h3>
                <p>Start exploring and add places to your favorites!</p>
            </div>
        `;
    } else {
        favoritesContainer.innerHTML = favoritePlaces.map(place => `
            <div class="place-card" data-id="${place.id}">
                <div class="favorite-icon active" data-id="${place.id}">
                    <i class="fas fa-heart"></i>
                </div>
                <img src="${place.image}" alt="${place.name}" class="place-image">
                <div class="place-content">
                    <h3 class="place-title">${place.name}</h3>
                    <div class="place-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${place.location}</span>
                    </div>
                    <p class="place-description">${place.description.substring(0, 100)}...</p>
                    <div class="place-actions">
                        <div class="place-rating">
                            <span>${place.rating > 0 ? place.rating : 'No ratings'}</span>
                            ${place.rating > 0 ? '<i class="fas fa-star"></i>' : ''}
                            ${place.reviewCount > 0 ? `<span class="review-count">(${place.reviewCount})</span>` : ''}
                        </div>
                        <button class="btn btn-primary view-detail-btn" data-id="${place.id}">View Details</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to view detail buttons
        document.querySelectorAll('.view-detail-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const placeId = parseInt(this.getAttribute('data-id'));
                showPlaceDetail(placeId);
            });
        });

        // Add event listeners to favorite icons
        favoritesContainer.addEventListener('click', function(e) {
            if (e.target.closest('.favorite-icon')) {
                const favoriteIcon = e.target.closest('.favorite-icon');
                const placeId = parseInt(favoriteIcon.getAttribute('data-id'));
                toggleFavorite(placeId);

                // If we're on favorites page and removing, immediately remove the card
                if (!appState.favorites.includes(placeId)) {
                    const card = favoriteIcon.closest('.place-card');
                    if (card) {
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.remove();
                            // If no favorites left, show empty state
                            if (favoritesContainer.children.length === 0) {
                                renderFavorites();
                            }
                        }, 300);
                    }
                }
            }
        });
    }
}

function toggleFavorite(placeId) {
    console.log('Toggling favorite for place:', placeId);
    console.log('Current favorites:', appState.favorites);

    const index = appState.favorites.indexOf(placeId);

    if (index === -1) {
        // Add to favorites
        appState.favorites.push(placeId);
        console.log('Added to favorites. New favorites:', appState.favorites);
    } else {
        // Remove from favorites
        appState.favorites.splice(index, 1);
        console.log('Removed from favorites. New favorites:', appState.favorites);
    }

    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(appState.favorites));

    // Update UI across all pages
    updateFavoriteUI(placeId);

    // Force refresh all pages
    refreshAllPages();
}

function updateFavoriteUI(placeId) {
    console.log('Updating UI for place:', placeId);

    // Update favorite icons on all pages
    document.querySelectorAll(`.favorite-icon[data-id="${placeId}"]`).forEach(icon => {
        if (appState.favorites.includes(placeId)) {
            icon.classList.add('active');
            icon.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            icon.classList.remove('active');
            icon.innerHTML = '<i class="far fa-heart"></i>';
        }
    });

    console.log('UI updated for place:', placeId);
}

function filterPlaces(category) {
    const placeCards = document.querySelectorAll('#explore-places .place-card');
    
    placeCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function openReviewModal(place) {
    appState.currentPlace = place;
    
    // Update modal content
    document.getElementById('modal-place-name').textContent = place.name;
    
    // Reset stars
    document.querySelectorAll('#rating-stars .star').forEach(star => {
        star.classList.remove('active');
    });
    
    // Load existing reviews
    loadReviews(place.id);
    
    // Show modal
    document.getElementById('review-modal').classList.add('active');
}

function loadReviews(placeId) {
    const reviewsContainer = document.getElementById('reviews-container');
    const placeReviews = appState.reviews[placeId] || [];
    
    if (placeReviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
    } else {
        reviewsContainer.innerHTML = placeReviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    }
}

function updatePlaceRatingAndReviewCount(placeId) {
    const placeReviews = appState.reviews[placeId] || [];
    const place = appState.places.find(p => p.id === placeId);

    if (place) {
        place.reviewCount = placeReviews.length;
    
        if (placeReviews.length > 0) {
            const totalRating = placeReviews.reduce((sum, review) => sum + review.rating, 0);
            place.rating = parseFloat((totalRating / placeReviews.length).toFixed(1));
        } else {
            place.rating = 0;
        }
    
        // Update UI across all pages
        renderAllPlaces();
        renderFeaturedPlaces();
        renderFavorites();
    
        // If we're on the detail page, update the rating and review count
        if (document.getElementById('place-detail').classList.contains('active') && 
            appState.currentPlace && appState.currentPlace.id === placeId) {
            const ratingElement = document.querySelector('.place-detail-rating span');
            const reviewCountElement = document.querySelector('.place-detail-rating .review-count');
            const reviewsHeader = document.querySelector('.reviews-header h2');
    
            if (ratingElement) {
                ratingElement.textContent = place.rating > 0 ? place.rating : 'No ratings';
            }
    
            if (reviewCountElement) {
                reviewCountElement.textContent = `(${place.reviewCount} reviews)`;
            } else if (place.reviewCount > 0) {
                document.querySelector('.place-detail-rating').innerHTML += `<span class="review-count">(${place.reviewCount} reviews)</span>`;
            }
    
            if (reviewsHeader) {
                reviewsHeader.textContent = `Reviews ${place.reviewCount > 0 ? `(${place.reviewCount})` : ''}`;
            }
        }
    }
}

function refreshAllPages() {
    renderFeaturedPlaces();
    renderAllPlaces();
    renderFavorites();
}