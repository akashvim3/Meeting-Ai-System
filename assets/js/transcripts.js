// ============================================
// TRANSCRIPTS PAGE JAVASCRIPT
// MeetingAI - Transcripts Library
// ============================================

// DOM references
const searchInput = document.getElementById('transcriptSearch');
const clearSearch = document.getElementById('clearSearch');
const dateFilter = document.getElementById('dateFilter');
const speakerFilter = document.getElementById('speakerFilter');
const transcriptsContainer = document.querySelector('.transcripts-container');
const viewModal = document.getElementById('viewModal');
const fullTranscriptView = document.getElementById('fullTranscriptView');

// -------------------------------
// Search
// -------------------------------
searchInput?.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  clearSearch && (clearSearch.style.display = q.length ? 'block' : 'none');
  filterTranscripts(q);
});

clearSearch?.addEventListener('click', () => {
  if (!searchInput) return;
  searchInput.value = '';
  clearSearch.style.display = 'none';
  filterTranscripts('');
});

// Core filter by text
function filterTranscripts(query) {
  const items = document.querySelectorAll('.transcript-item');
  let visible = 0;
  items.forEach((item) => {
    const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
    const preview = item.querySelector('.transcript-preview')?.textContent.toLowerCase() || '';
    const tags = Array.from(item.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase()).join(' ');
    const match = !query || title.includes(query) || preview.includes(query) || tags.includes(query);
    item.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  toggleNoResults(visible === 0);
}

// Show/hide "no results"
function toggleNoResults(show) {
  let el = document.querySelector('.no-results-message');
  if (show) {
    if (!el) {
      el = document.createElement('div');
      el.className = 'no-results-message';
      el.style.cssText = 'text-align:center;padding:3rem;color:var(--text-secondary)';
      el.innerHTML = `
        <i class="fas fa-search" style="font-size:3rem;margin-bottom:1rem;opacity:0.5"></i>
        <h3>No transcripts found</h3>
        <p>Try adjusting your search or filters</p>
      `;
      transcriptsContainer?.appendChild(el);
    }
  } else {
    el?.remove();
  }
}

// -------------------------------
// Filters (date/speaker)
// -------------------------------
dateFilter?.addEventListener('change', function() {
  notify(`Filtering by: ${this.options[this.selectedIndex].text}`, 'info');
  // Hook for real date-range filtering if needed
});

speakerFilter?.addEventListener('change', function() {
  notify(`Filtering by speaker: ${this.options[this.selectedIndex].text}`, 'info');
  // Hook for real speaker filtering if needed
});

// -------------------------------
// Expand / Collapse preview
// -------------------------------
window.toggleExpand = function(btn) {
  const preview = btn.closest('.transcript-preview');
  if (!preview) return;
  const expanded = preview.classList.toggle('expanded');
  btn.innerHTML = expanded
    ? '<i class="fas fa-chevron-up"></i> Show Less'
    : '<i class="fas fa-chevron-down"></i> Show More';

  // Lazy inject extra sample content on first expand
  if (expanded && !preview.querySelector('.expanded-content')) {
    const extra = document.createElement('div');
    extra.className = 'expanded-content';
    extra.innerHTML = `
      <div class="speaker-line">
        <span class="speaker-badge" style="background:#f59e0b;">ET</span>
        <div class="speaker-content">
          <strong>Emily Thompson:</strong> Marketing campaign timeline needs final alignment with product milestones and messaging consistency across channels...
        </div>
      </div>
      <div class="speaker-line">
        <span class="speaker-badge" style="background:#6366f1;">JM</span>
        <div class="speaker-content">
          <strong>John Mitchell:</strong> Let's confirm deliverables and schedule a follow-up to validate launch readiness and materials sign-off...
        </div>
      </div>
    `;
    btn.before(extra);
  }
};

// -------------------------------
// View Full Transcript (Modal)
// -------------------------------
window.viewTranscript = function(id) {
  if (!viewModal || !fullTranscriptView) return;
  fullTranscriptView.innerHTML = buildFullTranscriptMock();
  viewModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Close modal
window.closeViewModal = function() {
  if (!viewModal) return;
  viewModal.classList.remove('active');
  document.body.style.overflow = 'auto';
};

// Click outside to close (optional enhancement)
viewModal?.addEventListener('click', (e) => {
  if (e.target === viewModal) closeViewModal();
});

// Build mock full transcript content
function buildFullTranscriptMock() {
  const speakers = [
    { name: 'John Mitchell', badge: 'JM', color: '#6366f1' },
    { name: 'Sarah Chen', badge: 'SC', color: '#ec4899' },
    { name: 'Michael Rodriguez', badge: 'MR', color: '#10b981' },
    { name: 'Emily Thompson', badge: 'ET', color: '#f59e0b' }
  ];
  const blocks = [
    "Welcome everyone to today’s quarterly planning meeting. Let's review Q4 objectives.",
    "Presenting the roadmap and milestone targets for the quarter.",
    "Technical updates and architecture decisions to finalize.",
    "Marketing launch plan and timing alignment with the product team.",
    "Capture action items with owners and deadlines for each stream.",
    "Prioritize customer feedback items into the next sprint backlog.",
    "Prepare API documentation and integration guides by Friday.",
    "Confirm campaign materials and launch assets by Monday."
  ];
  let html = `
    <div style="margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:2px solid var(--light-secondary);">
      <h3 style="margin-bottom:0.5rem;">Q4 Product Roadmap Review</h3>
      <div style="color:var(--text-secondary);font-size:0.95rem;">
        <span><i class="fas fa-calendar"></i> Oct 2, 2025</span> •
        <span><i class="fas fa-clock"></i> 1h 30m</span> •
        <span><i class="fas fa-users"></i> 5 participants</span>
      </div>
    </div>
  `;
  blocks.forEach((text, i) => {
    const s = speakers[i % speakers.length];
    const mm = String(Math.floor((i * 3) % 60)).padStart(2, '0');
    const ts = `00:${mm}`;
    html += `
      <div style="display:flex;gap:1rem;margin-bottom:1.25rem;padding:1rem;background:var(--light);border-radius:var(--radius-lg);">
        <span style="width:40px;height:40px;border-radius:50%;background:${s.color};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">${s.badge}</span>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
            <strong style="color:var(--primary-color);">${s.name}</strong>
            <span style="font-size:0.875rem;color:var(--text-light);">${ts}</span>
          </div>
          <p style="margin:0;line-height:1.7;color:var(--text-primary);">${text}</p>
        </div>
      </div>
    `;
  });
  return `<div style="max-height:65vh;overflow:auto;">${html}</div>`;
}

// -------------------------------
// Download single transcript (TXT)
// -------------------------------
window.downloadTranscript = function(id) {
  notify('Preparing transcript download...', 'info');
  setTimeout(() => {
    const content = `MEETING TRANSCRIPT
Generated: ${new Date().toLocaleString()}

Title: Q4 Product Roadmap Review
Date: Oct 2, 2025
Duration: 1h 30m
Participants: 5

TRANSCRIPT:
John Mitchell [00:00]: Welcome everyone...
Sarah Chen   [00:15]: I’ll present the roadmap...
Michael R.   [00:32]: Technical updates pending...
Emily T.     [00:48]: Launch plan discussion...

---
Generated by MeetingAI`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); // Blob for download
    const url = URL.createObjectURL(blob); // object URL
    anchorDownload(url, `transcript_${id}_${Date.now()}.txt`);
    URL.revokeObjectURL(url); // cleanup
    notify('Transcript downloaded successfully', 'success');
  }, 800);
};

// -------------------------------
// Share transcript (Web Share API)
// -------------------------------
window.shareTranscript = async function(id) {
  const shareData = {
    title: 'Meeting Transcript',
    text: 'MeetingAI transcript: Q4 Product Roadmap Review',
    url: location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData); // native share
      notify('Shared successfully', 'success');
    } else {
      await navigator.clipboard.writeText(shareData.url); // fallback: copy URL
      notify('Link copied to clipboard', 'success');
    }
  } catch (e) {
    // User canceled or unsupported
  }
};

// -------------------------------
// Export selected transcripts (mock)
// -------------------------------
window.exportSelected = function() {
  const selected = document.querySelectorAll('.transcript-checkbox:checked');
  if (!selected.length) {
    notify('Please select transcripts to export', 'error');
    return;
  }
  notify(`Exporting ${selected.length} transcript(s)...`, 'info');
  setTimeout(() => {
    const data = Array.from(selected).map((cb, idx) => ({
      id: idx + 1,
      title: cb.closest('.transcript-item')?.querySelector('h3')?.textContent || 'Untitled',
      date: cb.closest('.transcript-item')?.querySelector('.fa-calendar')?.parentElement?.textContent?.trim() || ''
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); // Blob export
    const url = URL.createObjectURL(blob);
    anchorDownload(url, `transcripts_export_${Date.now()}.json`);
    URL.revokeObjectURL(url);
    notify('Export completed successfully', 'success');
  }, 900);
};

// -------------------------------
// Utilities
// -------------------------------
function anchorDownload(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function notify(message, type = 'info') {
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
  } else {
    console.log(`[${type}] ${message}`);
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + F focuses search
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    searchInput?.focus();
  }
  // Escape clears query
  if (e.key === 'Escape' && searchInput?.value) {
    searchInput.value = '';
    clearSearch && (clearSearch.style.display = 'none');
    filterTranscripts('');
  }
});