// ============================================
// AUTHENTICATION JAVASCRIPT
// Login, Signup, Password Management
// ============================================

// Password Toggle
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Password Strength Checker
const passwordInput = document.getElementById('passwordSignup');
if (passwordInput) {
    passwordInput.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        updatePasswordStrength(strength);
    });
}

function checkPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

function updatePasswordStrength(strength) {
    const strengthBar = document.querySelector('.strength-bar');
    if (strengthBar) {
        strengthBar.className = 'strength-bar ' + strength;
    }
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        submitBtn.disabled = true;

        // Simulate API call
        try {
            await simulateLogin(email, password, remember);

            if (typeof showNotification === 'function') {
                showNotification('Login successful! Redirecting...', 'success');
            }

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            if (typeof showNotification === 'function') {
                showNotification(error.message, 'error');
            }

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Sign Up Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('emailSignup').value,
            company: document.getElementById('company').value,
            password: document.getElementById('passwordSignup').value
        };

        // Validate password strength
        const strength = checkPasswordStrength(formData.password);
        if (strength === 'weak') {
            if (typeof showNotification === 'function') {
                showNotification('Please choose a stronger password', 'error');
            }
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitBtn.disabled = true;

        // Simulate API call
        try {
            await simulateSignup(formData);

            if (typeof showNotification === 'function') {
                showNotification('Account created successfully! Redirecting...', 'success');
            }

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            if (typeof showNotification === 'function') {
                showNotification(error.message, 'error');
            }

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Social Login Handlers
document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'Google' : 'Microsoft';

        if (typeof showNotification === 'function') {
            showNotification(`Connecting to ${provider}...`, 'info');
        }

        // Simulate OAuth flow
        setTimeout(() => {
            if (typeof showNotification === 'function') {
                showNotification(`${provider} authentication successful!`, 'success');
            }

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 1500);
    });
});

// Simulate Login API Call
function simulateLogin(email, password, remember) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email && password.length >= 6) {
                // Store session
                localStorage.setItem('user', JSON.stringify({
                    email: email,
                    name: email.split('@')[0],
                    loggedIn: true,
                    timestamp: Date.now()
                }));

                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                }

                resolve();
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 1500);
    });
}

// Simulate Signup API Call
function simulateSignup(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (formData.email && formData.password.length >= 8) {
                // Store user data
                localStorage.setItem('user', JSON.stringify({
                    email: formData.email,
                    name: `${formData.firstName} ${formData.lastName}`,
                    company: formData.company,
                    loggedIn: true,
                    timestamp: Date.now()
                }));

                resolve();
            } else {
                reject(new Error('Please fill in all required fields'));
            }
        }, 1500);
    });
}

// Email Validation
function validateEmail(email) {
    const re = /^[^s@]+@[^s@]+.[^s@]+$/;
    return re.test(email);
}

// Real-time Email Validation
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#ef4444';

            // Show error message
            let errorMsg = this.parentElement.querySelector('.error-msg');
            if (!errorMsg) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-msg';
                errorMsg.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
                errorMsg.textContent = 'Please enter a valid email address';
                this.parentElement.appendChild(errorMsg);
            }
        } else {
            this.style.borderColor = '';
            const errorMsg = this.parentElement.querySelector('.error-msg');
            if (errorMsg) errorMsg.remove();
        }
    });
});

console.log('🔐 Auth.js loaded successfully');
