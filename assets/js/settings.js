// ============================================
// SETTINGS PAGE JAVASCRIPT
// ============================================

// Section Navigation
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Remove active class from all links and sections
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));

        // Add active class to clicked link
        this.classList.add('active');

        // Show corresponding section
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');

        // Update URL hash
        window.location.hash = sectionId;
    });
});

// Load section from URL hash on page load
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const link = document.querySelector(`[data-section="${hash}"]`);
        if (link) link.click();
    }
});

// Profile Form Handler
document.querySelector('#profile .settings-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    if (typeof showNotification === 'function') {
        showNotification('Profile updated successfully!', 'success');
    }

    console.log('Profile form submitted');
});

// Password Change Handler
document.querySelector('#account form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const currentPassword = this.querySelector('input[type="password"]').value;
    const newPassword = this.querySelectorAll('input[type="password"]')[1].value;
    const confirmPassword = this.querySelectorAll('input[type="password"]')[2].value;

    if (newPassword !== confirmPassword) {
        if (typeof showNotification === 'function') {
            showNotification('Passwords do not match', 'error');
        }
        return;
    }

    if (newPassword.length < 8) {
        if (typeof showNotification === 'function') {
            showNotification('Password must be at least 8 characters', 'error');
        }
        return;
    }

    if (typeof showNotification === 'function') {
        showNotification('Password updated successfully!', 'success');
    }

    this.reset();
});

// Toggle Switches
document.querySelectorAll('.switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
        const label = this.closest('.notification-item')?.querySelector('h4')?.textContent;
        const status = this.checked ? 'enabled' : 'disabled';

        console.log(`${label} ${status}`);

        if (typeof showNotification === 'function') {
            showNotification(`${label} ${status}`, 'success');
        }
    });
});

// Integration Connect/Disconnect
document.querySelectorAll('.integration-card button').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.integration-card');
        const service = card.querySelector('h3').textContent;
        const isConnected = card.classList.contains('connected');

        if (isConnected) {
            // Disconnect
            card.classList.remove('connected');
            card.querySelector('.status-badge').textContent = 'Not Connected';
            card.querySelector('.status-badge').classList.remove('connected');
            this.textContent = 'Connect';
            this.classList.remove('btn-secondary');
            this.classList.add('btn-primary');

            if (typeof showNotification === 'function') {
                showNotification(`${service} disconnected`, 'info');
            }
        } else {
            // Connect
            card.classList.add('connected');
            card.querySelector('.status-badge').textContent = 'Connected';
            card.querySelector('.status-badge').classList.add('connected');
            this.textContent = 'Disconnect';
            this.classList.remove('btn-primary');
            this.classList.add('btn-secondary');

            if (typeof showNotification === 'function') {
                showNotification(`${service} connected successfully!`, 'success');
            }
        }
    });
});

// Theme Selection
document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');

        const theme = this.querySelector('span').textContent;

        if (typeof showNotification === 'function') {
            showNotification(`Theme changed to ${theme}`, 'success');
        }

        // Apply theme
        if (theme === 'Dark') {
            document.body.classList.add('dark-mode');
        } else if (theme === 'Light') {
            document.body.classList.remove('dark-mode');
        }
    });
});

// Invite Team Member
document.querySelector('.settings-header .btn-primary')?.addEventListener('click', function() {
    const email = prompt('Enter team member email:');

    if (email && /^[^s@]+@[^s@]+.[^s@]+$/.test(email)) {
        if (typeof showNotification === 'function') {
            showNotification(`Invitation sent to ${email}`, 'success');
        }
    } else if (email) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter a valid email', 'error');
        }
    }
});

// Delete Account Confirmation
document.querySelector('.btn-danger')?.addEventListener('click', function() {
    const confirmed = confirm(
        'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    );

    if (confirmed) {
        const doubleConfirm = confirm(
            'This is your last warning. Are you absolutely sure you want to delete your account?'
        );

        if (doubleConfirm) {
            if (typeof showNotification === 'function') {
                showNotification('Account deletion initiated. You will receive a confirmation email.', 'info');
            }
        }
    }
});

// Upload Photo
document.querySelector('.btn-secondary')?.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/gif';

    input.onchange = function(e) {
        const file = e.target.files[0];

        if (file && file.size <= 5 * 1024 * 1024) {
            if (typeof showNotification === 'function') {
                showNotification('Photo uploaded successfully!', 'success');
            }

            // Show preview (simplified)
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatar = document.querySelector('.avatar-large');
                avatar.style.backgroundImage = `url(${e.target.result})`;
                avatar.style.backgroundSize = 'cover';
                avatar.textContent = '';
            };
            reader.readAsDataURL(file);
        } else {
            if (typeof showNotification === 'function') {
                showNotification('File must be less than 5MB', 'error');
            }
        }
    };

    input.click();
});

console.log('⚙️ Settings.js loaded successfully');
