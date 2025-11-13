// ============================================
// ACTION ITEMS PAGE JAVASCRIPT
// ============================================

// Tab Filtering
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Filter items
        const filter = this.getAttribute('data-filter');
        filterActionItems(filter);
    });
});

function filterActionItems(filter) {
    const items = document.querySelectorAll('.action-item');
    let visibleCount = 0;

    items.forEach(item => {
        const status = item.getAttribute('data-status');

        if (filter === 'all' || status === filter) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    // Update UI feedback
    if (typeof showNotification === 'function') {
        showNotification(`Showing ${visibleCount} ${filter === 'all' ? 'total' : filter} tasks`, 'info');
    }
}

// Checkbox Toggle
document.querySelectorAll('.checkbox-wrapper input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const actionItem = this.closest('.action-item');
        const taskTitle = actionItem.querySelector('h3').textContent;

        if (this.checked) {
            // Mark as completed
            actionItem.classList.add('completed');
            actionItem.setAttribute('data-status', 'completed');

            // Update status badge
            const statusBadge = actionItem.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = 'status-badge completed';
                statusBadge.textContent = 'Completed';
            }

            // Update date
            const dateSpan = actionItem.querySelector('.action-date');
            if (dateSpan) {
                dateSpan.className = 'action-date completed-date';
                dateSpan.innerHTML = `<i class="fas fa-check-circle"></i> Completed: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
            }

            if (typeof showNotification === 'function') {
                showNotification(`Task completed: ${taskTitle}`, 'success');
            }
        } else {
            // Mark as incomplete
            actionItem.classList.remove('completed');
            actionItem.setAttribute('data-status', 'todo');

            // Update status badge
            const statusBadge = actionItem.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = 'status-badge todo';
                statusBadge.textContent = 'To Do';
            }

            if (typeof showNotification === 'function') {
                showNotification(`Task marked incomplete: ${taskTitle}`, 'info');
            }
        }

        // Update stats
        updateStats();
    });
});

// Update Statistics
function updateStats() {
    const items = document.querySelectorAll('.action-item');
    const stats = {
        total: items.length,
        completed: 0,
        inprogress: 0,
        overdue: 0
    };

    items.forEach(item => {
        const status = item.getAttribute('data-status');
        if (status === 'completed') stats.completed++;
        else if (status === 'inprogress') stats.inprogress++;
        else if (status === 'overdue') stats.overdue++;
    });

    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[0]) statCards[0].querySelector('.stat-value').textContent = stats.total;
    if (statCards[1]) statCards[1].querySelector('.stat-value').textContent = stats.completed;
    if (statCards[2]) statCards[2].querySelector('.stat-value').textContent = stats.inprogress;
    if (statCards[3]) statCards[3].querySelector('.stat-value').textContent = stats.overdue;

    // Update tab counts
    document.querySelector('[data-filter="all"] .tab-count').textContent = stats.total;
    document.querySelector('[data-filter="completed"] .tab-count').textContent = stats.completed;
    document.querySelector('[data-filter="inprogress"] .tab-count').textContent = stats.inprogress;
    document.querySelector('[data-filter="overdue"] .tab-count').textContent = stats.overdue;
}

// Menu Actions
document.querySelectorAll('.menu-dropdown a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const action = this.textContent.trim();
        const actionItem = this.closest('.action-item');
        const taskTitle = actionItem.querySelector('h3').textContent;

        if (action.includes('Delete')) {
            if (confirm(`Are you sure you want to delete: "${taskTitle}"?`)) {
                actionItem.remove();
                updateStats();
                if (typeof showNotification === 'function') {
                    showNotification('Task deleted successfully', 'success');
                }
            }
        } else if (action.includes('Edit')) {
            if (typeof showNotification === 'function') {
                showNotification('Opening task editor...', 'info');
            }
        } else if (action.includes('Duplicate')) {
            const clone = actionItem.cloneNode(true);
            actionItem.after(clone);
            updateStats();
            if (typeof showNotification === 'function') {
                showNotification('Task duplicated', 'success');
            }
        } else if (action.includes('Reassign')) {
            if (typeof showNotification === 'function') {
                showNotification('Opening assignee selector...', 'info');
            }
        } else if (action.includes('Mark Incomplete')) {
            const checkbox = actionItem.querySelector('input[type="checkbox"]');
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
        } else {
            if (typeof showNotification === 'function') {
                showNotification(`Action: ${action}`, 'info');
            }
        }
    });
});

// Add New Task Modal
function openAddTaskModal() {
    if (typeof showNotification === 'function') {
        showNotification('Opening new task form...', 'info');
    }

    // In a real app, this would open a modal with a form
    const taskTitle = prompt('Enter task title:');

    if (taskTitle && taskTitle.trim()) {
        addNewTask(taskTitle.trim());
    }
}

function addNewTask(title) {
    const newTask = document.createElement('div');
    newTask.className = 'action-item priority-medium';
    newTask.setAttribute('data-status', 'todo');

    const taskId = 'task' + Date.now();

    newTask.innerHTML = `
        <div class="action-item-header">
            <div class="checkbox-wrapper">
                <input type="checkbox" id="${taskId}">
                <label for="${taskId}"></label>
            </div>
            <div class="action-item-content">
                <h3>${title}</h3>
                <p class="action-description">New task created manually</p>

                <div class="action-meta">
                    <span class="action-meeting">
                        <i class="fas fa-video"></i> Manual Entry
                    </span>
                    <span class="action-date">
                        <i class="fas fa-calendar"></i> Due: ${getNextWeekDate()}
                    </span>
                </div>

                <div class="action-footer">
                    <div class="action-assignee">
                        <div class="avatar-small" style="background: #6366f1;">U</div>
                        <span>Unassigned</span>
                    </div>
                    <div class="action-tags">
                        <span class="priority-badge medium">Medium Priority</span>
                        <span class="status-badge todo">To Do</span>
                    </div>
                </div>
            </div>

            <div class="action-item-menu">
                <button class="menu-btn">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="menu-dropdown">
                    <a href="#"><i class="fas fa-edit"></i> Edit</a>
                    <a href="#"><i class="fas fa-user"></i> Reassign</a>
                    <a href="#"><i class="fas fa-calendar-alt"></i> Change Due Date</a>
                    <a href="#"><i class="fas fa-copy"></i> Duplicate</a>
                    <a href="#" class="danger"><i class="fas fa-trash"></i> Delete</a>
                </div>
            </div>
        </div>
    `;

    document.querySelector('.action-items-board').prepend(newTask);

    // Re-attach event listeners
    attachEventListeners(newTask);

    updateStats();

    if (typeof showNotification === 'function') {
        showNotification('New task created successfully', 'success');
    }
}

function getNextWeekDate() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function attachEventListeners(element) {
    // Checkbox
    const checkbox = element.querySelector('input[type="checkbox"]');
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            const actionItem = this.closest('.action-item');
            if (this.checked) {
                actionItem.classList.add('completed');
                actionItem.setAttribute('data-status', 'completed');
            } else {
                actionItem.classList.remove('completed');
                actionItem.setAttribute('data-status', 'todo');
            }
            updateStats();
        });
    }

    // Menu actions
    element.querySelectorAll('.menu-dropdown a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            if (action.includes('Delete')) {
                if (confirm('Delete this task?')) {
                    element.remove();
                    updateStats();
                }
            }
        });
    });
}

// Make function global
window.openAddTaskModal = openAddTaskModal;

// Drag and Drop (Future Enhancement)
let draggedItem = null;

document.querySelectorAll('.action-item').forEach(item => {
    item.setAttribute('draggable', 'true');

    item.addEventListener('dragstart', function() {
        draggedItem = this;
        this.style.opacity = '0.5';
    });

    item.addEventListener('dragend', function() {
        this.style.opacity = '1';
    });

    item.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    item.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedItem !== this) {
            const parent = this.parentNode;
            const draggedIndex = Array.from(parent.children).indexOf(draggedItem);
            const targetIndex = Array.from(parent.children).indexOf(this);

            if (draggedIndex < targetIndex) {
                this.after(draggedItem);
            } else {
                this.before(draggedItem);
            }

            if (typeof showNotification === 'function') {
                showNotification('Task order updated', 'info');
            }
        }
    });
});

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N: New task
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openAddTaskModal();
    }

    // Escape: Clear filters
    if (e.key === 'Escape') {
        document.querySelector('[data-filter="all"]')?.click();
    }
});

console.log('✅ Action Items.js loaded successfully');
