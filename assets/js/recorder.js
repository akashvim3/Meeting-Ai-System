// ============================================
// AUDIO RECORDER MODULE
// Real-Time Meeting Summarizer
// Version: 2.0
// ============================================

// Global State
let mediaRecorder = null;
let micStream = null;
let audioChunks = [];
let isRecording = false;
let recordingStartTime = null;
let timerInterval = null;
let audioContext = null;
let analyser = null;
let freqData = null;
let rafId = null;
let transcriptionInterval = null;

// DOM Elements (expected in dashboard modal)
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const timer = document.getElementById('timer');
const statusEl = document.getElementById('status');
const transcriptContainer = document.getElementById('transcriptContainer');
const liveTranscript = document.getElementById('liveTranscript');
const audioVisualizer = document.getElementById('audioVisualizer');

// Init
document.addEventListener('DOMContentLoaded', () => {
  // Buttons
  recordBtn?.addEventListener('click', startRecording);
  stopBtn?.addEventListener('click', stopRecording);

  // Capability check
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    setStatus('Error: Recording not supported in this browser', '#ef4444');
    recordBtn?.setAttribute('disabled', 'true');
    logNotice('Browser lacks MediaRecorder or getUserMedia');
  }
});

// Start recording
async function startRecording() {
  if (isRecording) return;

  try {
    // Ask mic
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        channelCount: 1
      }
    });

    const mimeType = pickMime();
    mediaRecorder = new MediaRecorder(micStream, mimeType ? { mimeType } : {});
    audioChunks = [];

    mediaRecorder.addEventListener('dataavailable', e => {
      if (e.data && e.data.size > 0) audioChunks.push(e.data);
    });

    mediaRecorder.addEventListener('stop', onRecordingStop);
    mediaRecorder.addEventListener('error', e => {
      notify('Recording error occurred', 'error');
      console.error(e);
    });

    // UI state
    isRecording = true;
    toggleButtons(true);
    setStatus('Recording...', '#ef4444');
    transcriptContainer?.classList.remove('hidden');

    // Start
    mediaRecorder.start(1000);

    // Timer
    recordingStartTime = Date.now();
    startTimer();

    // Visualizer
    initVisualizer(micStream);

    // Simulated live transcription
    startSimulatedTranscription();

    notify('Recording started successfully!', 'success');
  } catch (err) {
    handleMicError(err);
  }
}

// Stop recording
function stopRecording() {
  if (!isRecording || !mediaRecorder) return;

  try {
    mediaRecorder.stop();
    isRecording = false;

    // Stop mic tracks
    micStream?.getTracks().forEach(t => t.stop());
    micStream = null;

    // UI state
    toggleButtons(false);
    setStatus('Processing...', '#6366f1');

    // Stop timer
    if (timerInterval) clearInterval(timerInterval);

    // Stop transcription
    if (transcriptionInterval) clearInterval(transcriptionInterval);

    // Stop visualizer
    if (rafId) cancelAnimationFrame(rafId);
    if (audioContext && audioContext.state !== 'closed') audioContext.close();
  } catch (err) {
    notify('Error stopping recording', 'error');
    console.error(err);
  }
}

// After MediaRecorder stops
function onRecordingStop() {
  const type = pickMime() || 'audio/webm';
  const blob = new Blob(audioChunks, { type });
  const url = URL.createObjectURL(blob);

  setStatus('Recording complete! Processing transcript...', '#6366f1');

  // Simulate short processing
  setTimeout(() => {
    setStatus('Ready to record', '#10b981');
    addDownloadSection(blob, url);
    addAISummary();
    addAnalytics();
    notify('Transcript generated successfully!', 'success');
  }, 1500);
}

// Timer
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - recordingStartTime;
    const h = Math.floor(elapsed / 3600000);
    const m = Math.floor((elapsed % 3600000) / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    if (timer) timer.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  }, 200);
}

function pad(n) { return n.toString().padStart(2, '0'); }

// Visualizer
function initVisualizer(stream) {
  if (!audioVisualizer) return;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.8;
  freqData = new Uint8Array(analyser.frequencyBinCount);

  const ctx = audioVisualizer.getContext('2d');

  const draw = () => {
    if (!isRecording) return;
    rafId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(freqData);

    const w = audioVisualizer.width = audioVisualizer.offsetWidth;
    const h = audioVisualizer.height = audioVisualizer.offsetHeight;

    // bg
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    const barW = (w / freqData.length) * 2.5;
    let x = 0;
    for (let i = 0; i < freqData.length; i++) {
      const barH = (freqData[i] / 255) * (h * 0.8);
      const grad = ctx.createLinearGradient(0, h, 0, h - barH);
      grad.addColorStop(0, '#ec4899');
      grad.addColorStop(1, '#6366f1');
      ctx.fillStyle = grad;
      roundRect(ctx, x, h - barH, barW - 1, barH, 3);
      x += barW + 1;
    }
  };
  draw();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

// Simulated transcription
function startSimulatedTranscription() {
  const lines = [
    { s: 'John Mitchell', t: 'Welcome everyone, let’s review Q4 objectives and agenda.', ts: '00:00' },
    { s: 'Sarah Chen', t: 'Presenting the roadmap and milestones for the quarter.', ts: '00:18' },
    { s: 'Michael Rodriguez', t: 'Tech updates and architecture decisions to discuss.', ts: '00:36' },
    { s: 'Emily Thompson', t: 'Marketing timeline and launch readiness checks.', ts: '00:54' },
    { s: 'John Mitchell', t: 'Capture action items with owners and deadlines.', ts: '01:12' },
    { s: 'Sarah Chen', t: 'Prioritize customer-requested features from feedback.', ts: '01:30' },
    { s: 'Michael Rodriguez', t: 'API spec and docs by Friday EOD.', ts: '01:48' },
    { s: 'Emily Thompson', t: 'Campaign launches Monday; ensure dependencies cleared.', ts: '02:06' },
  ];
  let i = 0;
  transcriptionInterval = setInterval(() => {
    if (!isRecording || i >= lines.length) {
      clearInterval(transcriptionInterval);
      return;
    }
    appendTranscript(lines[i].s, lines[i].t, lines[i].ts);
    i++;
  }, 3200);
}

function appendTranscript(speaker, text, ts) {
  if (!liveTranscript) return;
  const el = document.createElement('div');
  el.className = 'transcript-line';
  el.style.animation = 'fadeInUp 0.5s ease';
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
      <span class="speaker" style="font-weight:600;color:var(--primary-color)">${speaker}</span>
      <span style="font-size:0.875rem;color:var(--text-light)">${ts}</span>
    </div>
    <div style="color:var(--text-primary);line-height:1.6">${text}</div>
  `;
  liveTranscript.appendChild(el);
  liveTranscript.scrollTop = liveTranscript.scrollHeight;
}

// Downloads + summary + analytics
function addDownloadSection(audioBlob, audioUrl) {
  if (document.querySelector('.download-section')) return;
  const section = document.createElement('div');
  section.className = 'download-section';
  section.style.cssText = 'margin-top:2rem;padding:2rem;background:var(--light);border-radius:var(--radius-xl);border:2px solid var(--light-secondary);';
  section.innerHTML = `
    <h3 style="margin-bottom:1rem;"><i class="fas fa-download"></i> Download Options</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;">
      <button class="btn btn-primary" id="dl-audio"><i class="fas fa-microphone"></i> Download Audio</button>
      <button class="btn btn-secondary" id="dl-transcript"><i class="fas fa-file-alt"></i> Download Transcript</button>
      <button class="btn btn-secondary" id="dl-summary"><i class="fas fa-file-pdf"></i> Download Summary</button>
    </div>
  `;
  document.querySelector('.modal-body')?.appendChild(section);

  document.getElementById('dl-audio')?.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `meeting_${stamp()}.webm`;
    a.click();
    notify('Audio download started', 'success');
  });

  document.getElementById('dl-transcript')?.addEventListener('click', () => {
    const lines = Array.from(liveTranscript?.querySelectorAll('.transcript-line') || [])
      .map(x => x.textContent.trim()).join('

');
    const text = `MEETING TRANSCRIPT
Generated: ${new Date().toLocaleString()}
Duration: ${timer?.textContent || '00:00:00'}

${lines || '(No transcript)'}

---
MeetingAI`;
    downloadText(text, `transcript_${stamp()}.txt`);
    notify('Transcript download started', 'success');
  });

  document.getElementById('dl-summary')?.addEventListener('click', () => {
    const text = `MEETING SUMMARY
Generated: ${new Date().toLocaleString()}
Duration: ${timer?.textContent || '00:00:00'}

KEY POINTS:
• Roadmap and milestones
• Tech updates & architecture
• Marketing launch readiness
• Feature prioritization

ACTION ITEMS:
• Michael: API docs by Friday
• Emily: Launch Monday
• Sarah: Daily standups
• Team: Prioritize features

---
MeetingAI`;
    downloadText(text, `summary_${stamp()}.txt`);
    notify('Summary download complete', 'success');
  });
}

function addAISummary() {
  if (document.querySelector('.summary-section')) return;
  const wrap = document.createElement('div');
  wrap.className = 'summary-section';
  wrap.style.cssText = 'margin-top:2rem;padding:2rem;background:linear-gradient(135deg,rgba(99,102,241,.05),rgba(236,72,153,.05));border-radius:var(--radius-xl);border:2px solid var(--primary-color);';
  wrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
      <i class="fas fa-sparkles" style="font-size:1.25rem;color:var(--primary-color)"></i>
      <h3 style="margin:0">AI-Generated Summary</h3>
    </div>
    <div style="background:var(--white);padding:1.25rem;border-radius:var(--radius-lg);margin-bottom:1rem;">
      <h4 style="color:var(--primary-color);margin-bottom:0.5rem;"><i class="fas fa-lightbulb"></i> Key Points</h4>
      <ul style="padding-left:1.25rem;line-height:1.8;margin:0">
        <li>Roadmap review and quarterly milestones</li>
        <li>Technical progress and architecture alignment</li>
        <li>Marketing timing and launch preparation</li>
        <li>Customer feedback-driven prioritization</li>
      </ul>
    </div>
    <div style="background:var(--white);padding:1.25rem;border-radius:var(--radius-lg);margin-bottom:1rem;">
      <h4 style="color:var(--primary-color);margin-bottom:0.5rem;"><i class="fas fa-tasks"></i> Action Items</h4>
      <ul style="padding-left:1.25rem;line-height:1.8;margin:0">
        <li><strong>Michael:</strong> API docs by Friday</li>
        <li><strong>Emily:</strong> Launch campaign Monday</li>
        <li><strong>Sarah:</strong> Schedule daily standups</li>
        <li><strong>Team:</strong> Prioritize feature backlog</li>
      </ul>
    </div>
  `;
  document.querySelector('.modal-body')?.appendChild(wrap);
}

function addAnalytics() {
  if (document.querySelector('.analytics-section')) return;
  const duration = timer?.textContent || '00:00:00';
  const count = liveTranscript?.querySelectorAll('.transcript-line').length || 0;

  const wrap = document.createElement('div');
  wrap.className = 'analytics-section';
  wrap.style.cssText = 'margin-top:2rem;padding:2rem;background:var(--light);border-radius:var(--radius-xl);';
  wrap.innerHTML = `
    <h3 style="margin-bottom:1rem;"><i class="fas fa-chart-bar"></i> Meeting Analytics</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;">
      <div style="text-align:center;padding:1rem;background:var(--white);border-radius:var(--radius-lg);">
        <div style="font-size:1.5rem;font-weight:700;color:var(--primary-color)">${duration}</div>
        <div style="font-size:.875rem;color:var(--text-secondary)">Duration</div>
      </div>
      <div style="text-align:center;padding:1rem;background:var(--white);border-radius:var(--radius-lg);">
        <div style="font-size:1.5rem;font-weight:700;color:var(--primary-color)">${count}</div>
        <div style="font-size:.875rem;color:var(--text-secondary)">Statements</div>
      </div>
      <div style="text-align:center;padding:1rem;background:var(--white);border-radius:var(--radius-lg);">
        <div style="font-size:1.5rem;font-weight:700;color:var(--primary-color)">5</div>
        <div style="font-size:.875rem;color:var(--text-secondary)">Speakers</div>
      </div>
      <div style="text-align:center;padding:1rem;background:var(--white);border-radius:var(--radius-lg);">
        <div style="font-size:1.5rem;font-weight:700;color:var(--primary-color)">4</div>
        <div style="font-size:.875rem;color:var(--text-secondary)">Action Items</div>
      </div>
    </div>
  `;
  document.querySelector('.modal-body')?.appendChild(wrap);
}

// Helpers
function pickMime() {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/wav'
  ];
  for (const t of types) if (MediaRecorder.isTypeSupported(t)) return t;
  return null;
}

function toggleButtons(recording) {
  if (recordBtn) {
    recordBtn.classList.toggle('hidden', recording);
    recordBtn.disabled = recording;
  }
  if (stopBtn) {
    stopBtn.classList.toggle('hidden', !recording);
    stopBtn.disabled = !recording;
  }
}

function setStatus(txt, color) {
  if (!statusEl) return;
  statusEl.textContent = txt;
  statusEl.style.color = color;
}

function handleMicError(err) {
  let msg = 'Could not access microphone. ';
  switch (err?.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError': msg += 'Please allow mic permissions in the browser.'; break;
    case 'NotFoundError':
    case 'DevicesNotFoundError': msg += 'No microphone found. Please connect one.'; break;
    case 'NotReadableError':
    case 'TrackStartError': msg += 'Microphone is in use by another app.'; break;
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError': msg += 'Device does not meet audio constraints.'; break;
    default: msg += err?.message || 'Unknown error.'; break;
  }
  notify(msg, 'error');
  setStatus('Error: ' + msg, '#ef4444');
}

function notify(message, type = 'info') {
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function stamp() {
  return new Date().toISOString().slice(0, 19).replace(/:/g, '-');
}

// Safety on unload
window.addEventListener('beforeunload', e => {
  if (isRecording) {
    e.preventDefault();
    e.returnValue = '';
    stopRecording();
  }
});

// Export for external triggers
window.startRecording = startRecording;
window.stopRecording = stopRecording;