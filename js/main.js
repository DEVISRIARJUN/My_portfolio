/**
 * BOMMISETTY DEVI SRI ARJUN - PORTFOLIO INTERACTIVITY
 * High-performance, Awwwards-grade interactive experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initCanvasBackground();
  initCustomCursor();
  initTypewriter();
  initStatsCounter();
  initThemeSwitcher();
  initAudioSFX();
  initProjectFilters();
  initFraudSimulator();
  initQRSimulator();
  initCLITerminal();
  initContactForm();
  initLiveClock();
});

/* ===================================================================
   1. LIVE CLOCK (HYDERABAD, IST)
   =================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    clockEl.textContent = now.toLocaleTimeString('en-US', options) + ' IST (Hyderabad)';
  }
  update();
  setInterval(update, 1000);
}

/* ===================================================================
   2. INTERACTIVE PARTICLES CONSTELLATION CANVAS
   =================================================================== */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 12000), 95);
  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse collision interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 3;
          this.y -= dirY * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#06b6d4';
      ctx.globalAlpha = this.baseAlpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 130) {
          ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#06b6d4';
          ctx.globalAlpha = (1 - dist / 130) * 0.15;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   3. CUSTOM MAGNETIC CURSOR
   =================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const outline = document.querySelector('.custom-cursor-outline');
  if (!dot || !outline) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Enlarge cursor on interactive links/buttons
  const interactives = document.querySelectorAll('a, button, input, select, textarea, .interactive');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      outline.style.transform = 'translate(-50%, -50%) scale(1.6)';
      outline.style.borderColor = 'var(--primary)';
      outline.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
      dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
    });
    el.addEventListener('mouseleave', () => {
      outline.style.transform = 'translate(-50%, -50%) scale(1)';
      outline.style.borderColor = 'var(--primary-glow)';
      outline.style.backgroundColor = 'transparent';
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

/* ===================================================================
   4. DYNAMIC TYPEWRITER EFFECT
   =================================================================== */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter-text');
  if (!typewriterEl) return;

  const roles = [
    'Full Stack Python Developer',
    'Django & Flask Backend Engineer',
    'Real-Time Fraud Detection Architect',
    'Database & SQL Optimization Specialist',
    'Healthcare QR Verification Builder'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseEnd = 1600;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriterEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    if (!isDeleting && charIdx === current.length) {
      setTimeout(() => {
        isDeleting = true;
        type();
      }, pauseEnd);
      return;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }

    const currentSpeed = isDeleting ? deleteSpeed : typeSpeed;
    setTimeout(type, currentSpeed);
  }

  type();
}

/* ===================================================================
   5. STATS ANIMATED COUNTER ON SCROLL
   =================================================================== */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-counter');
  let animated = false;

  function countUp() {
    stats.forEach((stat) => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1800;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const currentVal = target * easeOutQuad;

        if (isDecimal) {
          stat.textContent = currentVal.toFixed(2);
        } else {
          stat.textContent = Math.floor(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          stat.textContent = isDecimal ? target.toFixed(2) : target;
        }
      }
      requestAnimationFrame(update);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          countUp();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('stats-bar');
  if (statsSection) observer.observe(statsSection);
}

/* ===================================================================
   6. THEME ACCENT COLOR SWITCHER
   =================================================================== */
function initThemeSwitcher() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-name');
      document.documentElement.setAttribute('data-theme', theme);
      themeBtns.forEach((b) => b.classList.remove('ring-2', 'ring-white'));
      btn.classList.add('ring-2', 'ring-white');
      playTone(480, 0.08);
      showToast(`Switched accent to ${theme.toUpperCase()}`);
    });
  });
}

/* ===================================================================
   7. WEB AUDIO API SYNTHESIZER SOUND EFFECTS
   =================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioSFX() {
  const soundToggleBtn = document.getElementById('sound-toggle');
  if (!soundToggleBtn) return;

  soundToggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      soundToggleBtn.innerHTML = `
        <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
        </svg>
      `;
      playTone(520, 0.12);
      showToast('Sound Effects Enabled 🔊');
    } else {
      soundToggleBtn.innerHTML = `
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
        </svg>
      `;
      showToast('Sound Muted 🔇');
    }
  });

  // Attach subtle tones to interactive elements
  document.querySelectorAll('.btn-primary, .btn-secondary, .filter-tab').forEach((el) => {
    el.addEventListener('mouseenter', () => playTone(330, 0.04));
    el.addEventListener('click', () => playTone(600, 0.07));
  });
}

function playTone(freq, duration = 0.08) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context may be locked until user interaction
  }
}

/* ===================================================================
   8. PROJECT CATEGORY FILTERING & MODAL
   =================================================================== */
function initProjectFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/40');
        t.classList.add('text-slate-400', 'border-slate-700/60');
      });
      tab.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/40');
      tab.classList.remove('text-slate-400', 'border-slate-700/60');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   9. INTERACTIVE LAB 1: REAL-TIME FRAUD DETECTION SIMULATOR
   =================================================================== */
function initFraudSimulator() {
  const amountSlider = document.getElementById('fraud-amount');
  const velocitySlider = document.getElementById('fraud-velocity');
  const newDeviceCheck = document.getElementById('fraud-device');
  const nightCheck = document.getElementById('fraud-night');

  const amountDisplay = document.getElementById('fraud-amount-val');
  const velocityDisplay = document.getElementById('fraud-velocity-val');
  const scoreDisplay = document.getElementById('fraud-score');
  const riskBadge = document.getElementById('fraud-risk-badge');
  const explainText = document.getElementById('fraud-explanation');
  const gaugeFill = document.getElementById('fraud-gauge-fill');
  const freezeBtn = document.getElementById('btn-emergency-freeze');

  if (!amountSlider) return;

  function calculateRisk() {
    const amount = parseFloat(amountSlider.value);
    const velocity = parseFloat(velocitySlider.value);
    const isNewDevice = newDeviceCheck.checked;
    const isNight = nightCheck.checked;

    amountDisplay.textContent = `$${amount.toLocaleString()}`;
    velocityDisplay.textContent = `${velocity} km/h`;

    // Algorithm:
    // Outlier penalty for extreme transaction amounts (mean ~ $250, baseline std ~ $500)
    let score = 5;
    if (amount > 1000) score += Math.min(35, (amount / 8000) * 35);

    // Geo-velocity: Physical velocity between consecutive transactions (>900 km/h is flight speed anomaly)
    if (velocity > 100) {
      score += Math.min(45, (velocity / 1200) * 45);
    }

    if (isNewDevice) score += 15;
    if (isNight) score += 8;

    score = Math.min(Math.round(score), 100);

    // UI Updates
    scoreDisplay.textContent = score;

    // Gauge circle calculation (circumference = 2 * PI * 58 ≈ 364.4)
    const circumference = 364.4;
    const offset = circumference - (score / 100) * circumference;
    if (gaugeFill) {
      gaugeFill.style.strokeDashoffset = offset;
    }

    if (score < 35) {
      gaugeFill.style.stroke = '#10b981'; // Green
      riskBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      riskBadge.textContent = 'LOW RISK • APPROVED';
      explainText.innerHTML = `
        <span class="text-emerald-400 font-medium">✓ Transaction Safe:</span> 
        Velocity of ${velocity} km/h is humanly plausible. Amount $${amount} falls comfortably within the user's historical spend profile.
      `;
    } else if (score < 70) {
      gaugeFill.style.stroke = '#f59e0b'; // Amber
      riskBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40';
      riskBadge.textContent = 'ELEVATED RISK • 2FA REQUIRED';
      explainText.innerHTML = `
        <span class="text-amber-400 font-medium">⚠️ Moderate Anomaly:</span> 
        ${velocity > 400 ? 'High transit speed (' + velocity + ' km/h). ' : ''}
        ${isNewDevice ? 'Unrecognized login footprint. ' : ''}
        Triggering step-up biometric / OTP verification.
      `;
    } else {
      gaugeFill.style.stroke = '#ef4444'; // Red
      riskBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse';
      riskBadge.textContent = 'CRITICAL FRAUD ALERT • BLOCKED';
      explainText.innerHTML = `
        <span class="text-red-400 font-medium">🚨 FRAUD DETECTED:</span> 
        Impossible travel velocity (${velocity} km/h exceeds commercial air limits). Outlier spend of $${amount}. Automatic card freezing protocol activated.
      `;
    }
  }

  [amountSlider, velocitySlider, newDeviceCheck, nightCheck].forEach((input) => {
    input.addEventListener('input', calculateRisk);
  });

  if (freezeBtn) {
    freezeBtn.addEventListener('click', () => {
      playTone(220, 0.25);
      showToast('🛡️ EMERGENCY FREEZE: Account isolated & security token revoked in 0.04s!');
    });
  }

  calculateRisk();
}

/* ===================================================================
   10. INTERACTIVE LAB 2: MEDICAL APPOINTMENT DYNAMIC QR ENGINE
   =================================================================== */
function initQRSimulator() {
  const patientInput = document.getElementById('qr-patient-name');
  const doctorSelect = document.getElementById('qr-doctor-select');
  const slotSelect = document.getElementById('qr-slot-select');
  const generateBtn = document.getElementById('btn-generate-ticket');
  const qrCanvas = document.getElementById('qr-canvas-preview');
  const tokenDisplay = document.getElementById('qr-token-text');
  const timerBadge = document.getElementById('qr-countdown-badge');
  const verifyBtn = document.getElementById('btn-verify-qr');

  if (!generateBtn || !qrCanvas) return;

  let countdown = 15;
  let timerInterval = null;

  function generateToken() {
    const chars = 'ABCDEF0123456789';
    let token = 'SEC-MED-';
    for (let i = 0; i < 8; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  function renderSimulatedQR(patient, doctor, slot, token) {
    const ctx = qrCanvas.getContext('2d');
    const size = qrCanvas.width;
    ctx.clearRect(0, 0, size, size);

    // Draw dark background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);

    // Draw dynamic matrix pattern based on hash
    const gridSize = 14;
    const cellSize = size / gridSize;

    // Corner Finder Patterns
    drawFinderPattern(ctx, 0, 0, cellSize);
    drawFinderPattern(ctx, (gridSize - 3) * cellSize, 0, cellSize);
    drawFinderPattern(ctx, 0, (gridSize - 3) * cellSize, cellSize);

    // Dynamic data dots based on token characters
    ctx.fillStyle = '#06b6d4';
    let seed = 0;
    for (let i = 0; i < token.length; i++) seed += token.charCodeAt(i);

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip corners
        if ((r < 4 && c < 4) || (r < 4 && c > gridSize - 5) || (r > gridSize - 5 && c < 4)) continue;
        const hashVal = Math.sin(seed * (r * gridSize + c)) * 10000;
        if (hashVal - Math.floor(hashVal) > 0.45) {
          ctx.beginPath();
          ctx.roundRect(c * cellSize + 2, r * cellSize + 2, cellSize - 4, cellSize - 4, 2);
          ctx.fill();
        }
      }
    }

    if (tokenDisplay) tokenDisplay.textContent = token;
  }

  function drawFinderPattern(ctx, x, y, size) {
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 2, y + 2, size * 3 - 4, size * 3 - 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + size * 0.7, y + size * 0.7, size * 1.6, size * 1.6);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + size * 1.1, y + size * 1.1, size * 0.8, size * 0.8);
  }

  function startQRRefreshLoop() {
    if (timerInterval) clearInterval(timerInterval);
    countdown = 15;

    timerInterval = setInterval(() => {
      countdown--;
      if (timerBadge) {
        timerBadge.textContent = `Auto-refresh in ${countdown}s`;
      }

      if (countdown <= 0) {
        countdown = 15;
        const newToken = generateToken();
        renderSimulatedQR(patientInput.value, doctorSelect.value, slotSelect.value, newToken);
        playTone(700, 0.05);
      }
    }, 1000);
  }

  generateBtn.addEventListener('click', () => {
    const patient = patientInput.value.trim() || 'Arjun Devi';
    const doctor = doctorSelect.value;
    const slot = slotSelect.value;
    const token = generateToken();

    renderSimulatedQR(patient, doctor, slot, token);
    startQRRefreshLoop();
    playTone(550, 0.1);
    showToast(`✓ Dynamic Pass generated for ${patient}!`);
  });

  if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      playTone(880, 0.12);
      showToast('✓ Scanner: QR Token Authenticated! No conflict detected.');
    });
  }

  // Initial draw
  renderSimulatedQR('B. Devi Sri Arjun', 'Dr. Ramesh (Cardiology)', '10:30 AM', 'SEC-MED-7A9B1C');
  startQRRefreshLoop();
}

/* ===================================================================
   11. INTERACTIVE DEVELOPER CLI TERMINAL
   =================================================================== */
function initCLITerminal() {
  const input = document.getElementById('cli-terminal-input');
  const output = document.getElementById('cli-terminal-output');
  if (!input || !output) return;

  const commands = {
    help: `Available commands:
  • <span class="text-cyan-400 font-semibold">about</span>          : Summary of Bommisetty Devi Sri Arjun
  • <span class="text-cyan-400 font-semibold">skills</span>         : Technical stack, frameworks & tools
  • <span class="text-cyan-400 font-semibold">projects</span>       : List key engineering projects
  • <span class="text-cyan-400 font-semibold">education</span>      : Degree, college & CGPA details
  • <span class="text-cyan-400 font-semibold">certifications</span> : Verified industry credentials
  • <span class="text-cyan-400 font-semibold">contact</span>        : Phone, Email, LinkedIn & GitHub
  • <span class="text-cyan-400 font-semibold">cat resume</span>     : Download / View PDF resume
  • <span class="text-cyan-400 font-semibold">hire</span>           : Fast-track hiring message
  • <span class="text-cyan-400 font-semibold">clear</span>          : Clear terminal screen`,

    about: `<span class="text-cyan-400 font-semibold">BOMMISETTY DEVI SRI ARJUN</span>
B.Tech CSE Graduate (Amrita Sai Institute of Science & Technology) | Hyderabad, India.
Specializes in Python, Django, SQL and modern web applications with integrated Machine Learning.
Passionate about building scalable backend architectures, anti-fraud algorithms, and frictionless healthcare systems.`,

    skills: `<span class="text-emerald-400 font-semibold">TECHNICAL CORE:</span>
  • Languages    : Python (Strong), SQL, JavaScript, HTML5/CSS3, Java
  • Frameworks   : Django, Flask, Scikit-learn, Tailwind CSS, Chart.js
  • Databases    : MySQL, SQLite, PostgreSQL
  • Tools        : Git, GitHub, VS Code, PyCharm, ESP32 IoT
  • Architecture : REST APIs, CRUD Operations, OOP, Real-time Fraud Engines`,

    projects: `<span class="text-cyan-400 font-semibold">FEATURED ENGINEERING PROJECTS:</span>
  1. <span class="text-white font-bold">Autonomous Personal Finance & Real-Time Fraud Detection</span>
     - Python, Flask, Scikit-learn, MySQL, Chart.js
     - Geo-velocity fraud engine (0-100 risk score), daily burn-rate models, automated account freezing.
  2. <span class="text-white font-bold">Medical Appointment System & Health Assistant</span>
     - Python, Django, SQLite, Tailwind CSS, JavaScript
     - Role-based dashboards, conflict-free booking, dynamic refreshing QR verification.`,

    education: `<span class="text-cyan-400 font-semibold">ACADEMIC EXCELLENCE:</span>
  • <span class="text-white">B.Tech - Computer Science Engineering</span> (2022 - 2026)
    Amrita Sai Institute of Science & Technology | <span class="text-amber-400 font-semibold">CGPA: 8.39 / 10.0</span>
  • <span class="text-white">Intermediate (MPC)</span> (2020 - 2022)
    Narayana Junior College, Vijayawada | CGPA: 8.0 / 10.0
  • <span class="text-white">Secondary School (10th)</span> (2019 - 2020)
    Sarada Rama Krishna Vidyalaya | <span class="text-amber-400 font-semibold">CGPA: 9.5 / 10.0</span>`,

    certifications: `<span class="text-purple-400 font-semibold">VERIFIED CREDENTIALS:</span>
  • Cisco Networking Academy: Python Essentials (2025)
  • Cisco Networking Academy: Foundational JavaScript Essentials (2025)
  • Cisco Networking Academy: JavaScript Development Concepts (2025)
  • Aajhub: Web Development Certification (2026)
  • ESP32 IoT: Surveillance System Engineering (2025)
  • LearnTube: Java Assessment Certified (2024)`,

    contact: `<span class="text-cyan-400 font-semibold">CONNECT DIRECTLY:</span>
  • Email    : <a href="mailto:devisriarjun268@gmail.com" class="text-cyan-400 underline">devisriarjun268@gmail.com</a>
  • Phone    : <a href="tel:+916304545993" class="text-cyan-400 underline">+91 6304545993</a>
  • Location : Hyderabad, Telangana, India
  • LinkedIn : <a href="https://linkedin.com/in/bommisetty-devi-sri-arjun-b63989283" target="_blank" class="text-cyan-400 underline">bommisetty-devi-sri-arjun-b63989283</a>
  • GitHub   : <a href="https://github.com/DEVISRIARJUN" target="_blank" class="text-cyan-400 underline">DEVISRIARJUN</a>`,

    hire: `<span class="text-emerald-400 font-bold">🚀 READY TO INTERVIEW & JOIN IMMEDIATELY!</span>
Arjun is open to Entry-Level Software Development, Python/Django Backend, and Full Stack roles.
Reach out at <span class="text-cyan-400 font-bold">devisriarjun268@gmail.com</span> or call <span class="text-cyan-400 font-bold">+91 6304545993</span>.`
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      const cmd = rawCmd.toLowerCase();
      input.value = '';

      if (!cmd) return;

      const userLine = document.createElement('div');
      userLine.className = 'flex items-center gap-2 text-slate-300 mt-2';
      userLine.innerHTML = `<span class="text-cyan-400 font-mono">arjun@portfolio:~$</span> <span>${rawCmd}</span>`;
      output.appendChild(userLine);

      if (cmd === 'clear') {
        output.innerHTML = '';
        return;
      }

      if (cmd === 'cat resume' || cmd === 'resume') {
        window.open('resume.pdf', '_blank');
        const resLine = document.createElement('div');
        resLine.className = 'text-emerald-400 pl-4 py-1';
        resLine.innerHTML = '📄 Opening ARJUN_RESUME.pdf in new tab...';
        output.appendChild(resLine);
        return;
      }

      if (cmd === 'sudo') {
        const resLine = document.createElement('div');
        resLine.className = 'text-amber-400 pl-4 py-1';
        resLine.innerHTML = '🛡️ [sudo] password for guest: Guest already granted root developer view access.';
        output.appendChild(resLine);
        return;
      }

      const resLine = document.createElement('div');
      resLine.className = 'text-slate-300 pl-4 py-1 leading-relaxed text-sm';

      if (commands[cmd]) {
        resLine.innerHTML = commands[cmd];
      } else {
        resLine.innerHTML = `Command not recognized: <span class="text-red-400">"${cmd}"</span>. Type <span class="text-cyan-400 font-semibold">'help'</span> for list of commands.`;
      }
      output.appendChild(resLine);

      // Auto scroll to bottom of terminal
      const terminalWindow = document.getElementById('cli-terminal-window');
      if (terminalWindow) {
        terminalWindow.scrollTop = terminalWindow.scrollHeight;
      }
    }
  });
}

/* ===================================================================
   12. WORKING CONTACT FORM & CLIPBOARD ACTIONS
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const message = document.getElementById('contact-message').value;

      if (!name || !email || !message) {
        showToast('⚠️ Please fill out all fields.');
        return;
      }

      // Simulate sending
      playTone(600, 0.15);
      showToast(`Thank you ${name}! Message dispatched to Arjun.`);
      form.reset();
    });
  }

  // Copy email / phone buttons
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('devisriarjun268@gmail.com').then(() => {
        playTone(660, 0.1);
        showToast('📋 Email copied to clipboard: devisriarjun268@gmail.com');
      });
    });
  }

  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('+91 6304545993').then(() => {
        playTone(660, 0.1);
        showToast('📋 Phone copied to clipboard: +91 6304545993');
      });
    });
  }
}

/* ===================================================================
   13. TOAST NOTIFICATIONS
   =================================================================== */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
    <span class="text-sm font-medium">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
