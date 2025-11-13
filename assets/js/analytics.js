// ============================================
// ANALYTICS JAVASCRIPT
// ============================================

// Date Selector
document.querySelectorAll('.date-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const period = this.textContent;
        updateAnalytics(period);
    });
});

// Update Analytics
function updateAnalytics(period) {
    if (typeof showNotification === 'function') {
        showNotification(`Loading analytics for ${period}`, 'info');
    }

    // Simulate data update
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            showNotification('Analytics updated', 'success');
        }
    }, 1000);
}

// Chart Buttons
document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const parent = this.closest('.chart-actions');
        parent.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const chartType = this.textContent;
        if (typeof showNotification === 'function') {
            showNotification(`Showing ${chartType} data`, 'info');
        }
    });
});

// Initialize Charts
document.addEventListener('DOMContentLoaded', function() {
    initializeTrendChart();
    initializeDistributionChart();
    initializeTimeChart();
});

// Trend Chart
function initializeTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Meetings',
                data: [12, 19, 15, 25, 22, 8, 5],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Distribution Chart (Doughnut)
function initializeDistributionChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Product', 'Team', 'Client', 'Strategy'],
            datasets: [{
                data: [35, 28, 22, 15],
                backgroundColor: [
                    '#6366f1',
                    '#ec4899',
                    '#10b981',
                    '#f59e0b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Time Distribution Chart (Bar)
function initializeTimeChart() {
    const ctx = document.getElementById('timeChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['8-10 AM', '10-12 PM', '12-2 PM', '2-4 PM', '4-6 PM'],
            datasets: [{
                label: 'Meetings',
                data: [8, 32, 18, 24, 12],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Export Report
function exportReport(format) {
    if (typeof showNotification === 'function') {
        showNotification(`Exporting analytics as ${format.toUpperCase()}...`, 'info');
    }

    setTimeout(() => {
        const data = {
            totalMeetings: 156,
            totalDuration: '342h',
            avgParticipants: 5.2,
            actionItems: 284,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics_report_${Date.now()}.${format}`;
        link.click();

        if (typeof showNotification === 'function') {
            showNotification('Export completed successfully', 'success');
        }
    }, 1500);
}

// Make function global
window.exportReport = exportReport;

console.log('📊 Analytics.js loaded successfully');
