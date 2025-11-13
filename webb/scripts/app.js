// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set places data
    appState.places = placesData;

    loadReviewsAndUpdateRatings();
    initializePages();
    initializeMap();
    renderFeaturedPlaces();
    // Render all places for explore page
    renderAllPlaces();
    renderFavorites();
    initializeEventListeners();
    updateAuthButtons();
    console.log('App initialized with favorites:', appState.favorites);
}

function loadReviewsAndUpdateRatings() {
    // Update each place's rating based on actual reviews
    appState.places.forEach(place => {
        const placeReviews = appState.reviews[place.id] || [];
        place.reviewCount = placeReviews.length;

        if (placeReviews.length > 0) {
            const totalRating = placeReviews.reduce((sum, review) => sum + review.rating, 0);
            place.rating = parseFloat((totalRating / placeReviews.length).toFixed(1));
        } else {
            place.rating = 0;
        }
    });
}

function initializeEventListeners() {
    // Modal close button
    document.querySelector('.modal-close').addEventListener('click', function() {
        document.getElementById('review-modal').classList.remove('active');
    });

    // Close modal when clicking outside
    document.getElementById('review-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // Rating stars
    document.querySelectorAll('#rating-stars .star').forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
    
            // Update stars appearance
            document.querySelectorAll('#rating-stars .star').forEach(s => {
                if (parseInt(s.getAttribute('data-rating')) <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Submit review button
    document.getElementById('submit-review').addEventListener('click', function() {
        const rating = document.querySelectorAll('#rating-stars .star.active').length;
        const reviewText = document.getElementById('review-text').value.trim();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        if (reviewText === '') {
            alert('Please write a review');
            return;
        }

        // Create review object
        const review = {
            author: appState.currentUser ? appState.currentUser.name : 'Anonymous',
            date: new Date().toLocaleDateString(),
            rating: rating,
            text: reviewText
        };

        // Add to reviews
        if (!appState.reviews[appState.currentPlace.id]) {
            appState.reviews[appState.currentPlace.id] = [];
        }

        appState.reviews[appState.currentPlace.id].unshift(review);

        // Save to localStorage
        localStorage.setItem('reviews', JSON.stringify(appState.reviews));

        // Update place rating and review count
        updatePlaceRatingAndReviewCount(appState.currentPlace.id);

        // Reload reviews
        loadReviews(appState.currentPlace.id);
        loadPlaceReviews(appState.currentPlace.id);

        // Clear form
        document.getElementById('review-text').value = '';
        document.querySelectorAll('#rating-stars .star').forEach(star => {
            star.classList.remove('active');
        });

        // Show success message
        alert('Thank you for your review!');

        // Close modal
        document.getElementById('review-modal').classList.remove('active');
    });

    // Initialize auth event listeners
    initializeAuthEventListeners();
}