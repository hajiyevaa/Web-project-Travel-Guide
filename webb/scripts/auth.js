function updateAuthButtons() {
    const authButtons = document.querySelector('.auth-buttons');
    if (appState.currentUser) {
        authButtons.innerHTML = `
            <span style="color: white; margin-right: 1rem;">Hello, ${appState.currentUser.name}</span>
            <button class="btn btn-secondary" id="logout-btn">Logout</button>
        `;
        document.getElementById('logout-btn').addEventListener('click', function() {
            appState.currentUser = null;
            localStorage.removeItem('currentUser');
            updateAuthButtons();
            showPage('home');
        });
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-primary" id="login-btn">Login</button>
            <button class="btn btn-secondary" id="register-btn">Sign Up</button>
        `;
        // Reattach event listeners
        document.getElementById('login-btn').addEventListener('click', function() {
            showPage('login');
        });
        document.getElementById('register-btn').addEventListener('click', function() {
            showPage('register');
        });
    }
}

function initializeAuthEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const user = appState.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            appState.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Login successful!');
            showPage('home');
            updateAuthButtons();
        } else {
            alert('Invalid email or password. Please try again or register for a new account.');
        }
    });

    // Register form
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address (e.g., user@example.com)');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
    
        // Check if user already exists
        if (appState.users.find(u => u.email === email)) {
            alert('An account with this email already exists. Please log in instead.');
            return;
        }
    
        // Create new user
        const newUser = {
            name: name,
            email: email,
            password: password
        };
    
        appState.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(appState.users));
    
        appState.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
    
        alert('Account created successfully! You are now logged in.');
        showPage('home');
        updateAuthButtons();
    });
}