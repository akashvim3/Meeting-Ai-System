// ============================================
// DASHBOARD JAVASCRIPT
// Real-Time Meeting Summarizer
// ============================================

// Modal Control
const startMeetingBtn = document.getElementById('startMeetingBtn');
const meetingModal = document.getElementById('meetingModal');
const closeModal = document.getElementById('closeModal');

if (startMeetingBtn && meetingModal) {
    startMeetingBtn.addEventListener('click', function() {
        meetingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (closeModal && meetingModal) {
    closeModal.addEventListener('click', function() {
        meetingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        stopRecording();
    });
}

// Close modal when clicking outside
if (meetingModal) {
    meetingModal.addEventListener('click', function(e) {
        if (e.target === meetingModal) {
            meetingModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            stopRecording();
        }
    });
}

// Sidebar Toggle for Mobile
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
}

// Action Item Checkbox Handler
document.querySelectorAll('.action-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const actionItem = this.closest('.action-item');
        if (this.checked) {
            actionItem.style.opacity = '0.5';
            actionItem.style.textDecoration = 'line-through';
            showNotification('Task marked as complete!', 'success');
        } else {
            actionItem.style.opacity = '1';
            actionItem.style.textDecoration = 'none';
        }
    });
});

// Quick Actions Handlers
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const action = this.querySelector('span').textContent;

        switch(action) {
            case 'Start Recording':
                document.getElementById('startMeetingBtn').click();
                break;
            case 'Upload Audio':
                uploadAudio();
                break;
            case 'Schedule Meeting':
                scheduleMeeting();
                break;
            case 'Invite Team':
                inviteTeam();
                break;
        }
    });
});

function uploadAudio() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*,video/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            showNotification(`Uploading ${file.name}...`, 'info');
            // Simulate upload
            setTimeout(() => {
                showNotification('File uploaded successfully!', 'success');
            }, 2000);
        }
    };
    input.click();
}

function scheduleMeeting() {
    showNotification('Opening calendar...', 'info');
    // Implement calendar integration
    setTimeout(() => {
        alert('Calendar integration coming soon!');
    }, 500);
}

function inviteTeam() {
    const email = prompt('Enter team member email:');
    if (email && validateEmail(email)) {
        showNotification(`Invitation sent to ${email}`, 'success');
    } else if (email) {
        showNotification('Invalid email address', 'error');
    }
}

function validateEmail(email) {
    const re = /^[^s@]+@[^s@]+.[^s@]+$/;
    return re.test(email);
}

// Meeting Item Actions
document.querySelectorAll('.btn-icon').forEach(btn => {
    btn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const meetingItem = this.closest('.meeting-item');
        const meetingTitle = meetingItem.querySelector('h4').textContent;

        if (icon.classList.contains('fa-file-alt')) {
            viewSummary(meetingTitle);
        } else if (icon.classList.contains('fa-download')) {
            downloadTranscript(meetingTitle);
        }
    });
});

function viewSummary(meetingTitle) {
    showNotification('Loading summary...', 'info');
    setTimeout(() => {
        alert(`Summary for: ${meetingTitle}

• Key Points
• Action Items
• Decisions Made`);
    }, 1000);
}

function downloadTranscript(meetingTitle) {
    showNotification('Preparing download...', 'info');
    setTimeout(() => {
        // Create a dummy download
        const element = document.createElement('a');
        const content = `Transcript for: ${meetingTitle}

Generated on: ${new Date().toLocaleDateString()}`;
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${meetingTitle.replace(/s+/g, '_')}_transcript.txt`;
        element.click();
        showNotification('Download started!', 'success');
    }, 1000);
}

// Search Functionality
const searchInput = document.getElementById('dashboardSearch');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        filterMeetings(query);
    });
}

function filterMeetings(query) {
    document.querySelectorAll('.meeting-item').forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const tags = Array.from(item.querySelectorAll('.tag'))
            .map(tag => tag.textContent.toLowerCase())
            .join(' ');

        if (title.includes(query) || tags.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter and Sort Options
function filterByDate(range) {
    showNotification(`Filtering by: ${range}`, 'info');
    // Implement date filtering logic
}

function sortMeetings(criteria) {
    showNotification(`Sorting by: ${criteria}`, 'info');
    // Implement sorting logic
}

// Export Data
function exportData(format) {
    showNotification(`Exporting data as ${format}...`, 'info');

    setTimeout(() => {
        const data = {
            totalMeetings: 156,
            totalHours: 342,
            actionItems: 45,
            teamMembers: 24
        };

        const element = document.createElement('a');
        const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        element.download = `meetingai_export_${new Date().getTime()}.${format}`;
        element.click();

        showNotification('Export completed!', 'success');
    }, 1500);
}

// Refresh Dashboard Data
function refreshDashboard() {
    showNotification('Refreshing data...', 'info');

    // Simulate data refresh
    setTimeout(() => {
        // Update stat numbers with animation
        document.querySelectorAll('.stat-number-dash').forEach(stat => {
            const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 10);
            stat.textContent = newValue.toLocaleString();
        });

        showNotification('Dashboard updated!', 'success');
    }, 1000);
}

// Auto-refresh every 5 minutes
setInterval(refreshDashboard, 300000);

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('dashboardSearch')?.focus();
    }

    // Ctrl/Cmd + N for new meeting
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('startMeetingBtn')?.click();
    }

    // Ctrl/Cmd + R for refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshDashboard();
    }
});

// Notification Badge Update
function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

// Real-time Updates Simulation
function simulateRealtimeUpdates() {
    setInterval(() => {
        const random = Math.random();

        if (random > 0.7) {
            // Simulate new meeting transcribed
            showNotification('New transcript available', 'info');
            updateNotificationBadge(Math.floor(Math.random() * 5) + 1);
        }
    }, 30000); // Every 30 seconds
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Load user preferences
    const savedView = localStorage.getItem('dashboardView');
    if (savedView) {
        applyView(savedView);
    }

    // Start real-time updates
    simulateRealtimeUpdates();

    console.log('Dashboard initialized');
});

// Save user preferences
function savePreferences() {
    const preferences = {
        view: getCurrentView(),
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    };
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
}

function getCurrentView() {
    return 'grid'; // or 'list', based on current view
}

function applyView(view) {
    // Apply saved view preferences
    console.log('Applying view:', view);
}

// Export functions for global use
window.exportData = exportData;
window.refreshDashboard = refreshDashboard;
window.filterByDate = filterByDate;
window.sortMeetings = sortMeetings;

console.log('Dashboard JS loaded successfully');
