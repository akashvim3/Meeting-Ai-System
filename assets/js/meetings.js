// ============================================
// MEETING HISTORY JAVASCRIPT
// ============================================

// Filter Toggle
document.getElementById('filterToggle')?.addEventListener('click', function() {
    this.classList.toggle('active');
    document.getElementById('filtersPanel').classList.toggle('active');
});

// Dropdown Toggle
document.querySelectorAll('.dropdown-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.dropdown').classList.toggle('active');
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    }
});

// Sort Options
document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sortBy = this.getAttribute('data-sort');
        const dropdown = this.closest('.dropdown');
        const btn = dropdown.querySelector('.dropdown-btn');

        // Update button text
        btn.childNodes[2].textContent = ' Sort By: ' + this.textContent + ' ';

        // Sort meetings
        sortMeetings(sortBy);

        dropdown.classList.remove('active');
    });
});

// View Toggle
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const view = this.getAttribute('data-view');
        const grid = document.getElementById('meetingsGrid');

        if (view === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }
    });
});

// Search Meetings
document.getElementById('searchMeetings')?.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.meeting-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const summary = card.querySelector('.meeting-summary').textContent.toLowerCase();

        if (title.includes(query) || summary.includes(query)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});

// Apply Filters
document.getElementById('applyFilters')?.addEventListener('click', function() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const duration = document.getElementById('durationFilter').value;
    const participant = document.getElementById('participantFilter').value;
    const selectedTags = Array.from(document.querySelectorAll('.tag-filter input:checked')).map(cb => cb.value);

    filterMeetings(dateFrom, dateTo, duration, participant, selectedTags);

    if (typeof showNotification === 'function') {
        showNotification('Filters applied successfully', 'success');
    }
});

// Clear Filters
document.getElementById('clearFilters')?.addEventListener('click', function() {
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    document.getElementById('durationFilter').value = '';
    document.getElementById('participantFilter').value = '';
    document.querySelectorAll('.tag-filter input').forEach(cb => cb.checked = false);

    // Show all meetings
    document.querySelectorAll('.meeting-card').forEach(card => {
        card.style.display = '';
    });

    if (typeof showNotification === 'function') {
        showNotification('Filters cleared', 'info');
    }
});

// Filter Meetings Function
function filterMeetings(dateFrom, dateTo, duration, participant, tags) {
    const cards = document.querySelectorAll('.meeting-card');

    cards.forEach(card => {
        let show = true;

        // Date filter
        if (dateFrom || dateTo) {
            const cardDate = card.getAttribute('data-date');
            if (dateFrom && cardDate < dateFrom) show = false;
            if (dateTo && cardDate > dateTo) show = false;
        }

        // Duration filter
        if (duration) {
            const cardDuration = parseInt(card.getAttribute('data-duration'));
            const [min, max] = duration.split('-').map(v => v.replace('+', ''));

            if (max) {
                if (cardDuration < parseInt(min) || cardDuration > parseInt(max)) show = false;
            } else {
                if (cardDuration < parseInt(min)) show = false;
            }
        }

        // Tags filter
        if (tags.length > 0) {
            const cardTags = card.getAttribute('data-tags').split(',');
            const hasTag = tags.some(tag => cardTags.includes(tag));
            if (!hasTag) show = false;
        }

        card.style.display = show ? '' : 'none';
    });
}

// Sort Meetings Function
function sortMeetings(sortBy) {
    const grid = document.getElementById('meetingsGrid');
    const cards = Array.from(grid.querySelectorAll('.meeting-card'));

    cards.sort((a, b) => {
        switch(sortBy) {
            case 'date':
                return b.getAttribute('data-date').localeCompare(a.getAttribute('data-date'));
            case 'date-old':
                return a.getAttribute('data-date').localeCompare(b.getAttribute('data-date'));
            case 'duration':
                return parseInt(b.getAttribute('data-duration')) - parseInt(a.getAttribute('data-duration'));
            case 'title':
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            default:
                return 0;
        }
    });

    // Re-append sorted cards
    cards.forEach(card => grid.appendChild(card));

    if (typeof showNotification === 'function') {
        showNotification('Meetings sorted', 'info');
    }
}

// Meeting Card Actions
document.querySelectorAll('.actions-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const action = this.textContent.trim();
        const card = this.closest('.meeting-card');
        const title = card.querySelector('h3').textContent;

        if (action.includes('Delete')) {
            const confirmed = confirm(`Are you sure you want to delete "${title}"?`);
            if (confirmed) {
                card.remove();
                if (typeof showNotification === 'function') {
                    showNotification('Meeting deleted successfully', 'success');
                }
            }
        } else {
            if (typeof showNotification === 'function') {
                showNotification(`${action}: ${title}`, 'info');
            }
        }
    });
});

// View Summary Button
document.querySelectorAll('.meeting-card-footer .btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.meeting-card');
        const title = card.querySelector('h3').textContent;

        // Open summary modal or navigate to details page
        if (typeof showNotification === 'function') {
            showNotification(`Loading summary for: ${title}`, 'info');
        }

        // Simulate loading
        setTimeout(() => {
            window.location.href = 'meeting-details.html';
        }, 1000);
    });
});

// Pagination
document.querySelectorAll('.pagination-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.disabled) return;

        document.querySelectorAll('.pagination-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (typeof showNotification === 'function') {
            showNotification('Loading page...', 'info');
        }
    });
});

// Export Meetings
function exportMeetings(format) {
    const meetings = Array.from(document.querySelectorAll('.meeting-card')).map(card => ({
        title: card.querySelector('h3').textContent,
        date: card.getAttribute('data-date'),
        duration: card.getAttribute('data-duration') + ' minutes',
        summary: card.querySelector('.meeting-summary').textContent
    }));

    const dataStr = JSON.stringify(meetings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meetings_export_${new Date().toISOString().slice(0, 10)}.${format}`;
    link.click();

    if (typeof showNotification === 'function') {
        showNotification('Export completed', 'success');
    }
}

// Bulk Actions
function selectAllMeetings() {
    document.querySelectorAll('.meeting-card').forEach(card => {
        card.classList.toggle('selected');
    });
}

console.log('📅 Meetings.js loaded successfully');
