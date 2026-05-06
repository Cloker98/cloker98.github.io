/* PRELOADER */
    const preloader = document.getElementById('preloader');
    const video = document.getElementById('preloaderVideo');
    let preloaderDone = false;
    function exitPreloader() {
      if (preloaderDone) return;
      preloaderDone = true;
      setTimeout(() => {
        preloader.classList.add('exit');
        document.body.style.overflow = '';
        triggerReveal();
      }, 400);
    }
    document.body.style.overflow = 'hidden';
    video.addEventListener('ended', exitPreloader);
    setTimeout(exitPreloader, 3200);
    window.addEventListener('load', () => setTimeout(exitPreloader, 2800));

    /* REVEAL ON SCROLL */
    function triggerReveal() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            e.target.querySelectorAll('.bar-fill[data-width]').forEach(bar => {
              bar.style.width = bar.dataset.width + '%';
            });
            e.target.querySelectorAll('[data-target]').forEach(el => {
              animateCount(el, parseInt(el.dataset.target));
            });
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    /* COUNT UP */
    function animateCount(el, target) {
      let start = 0;
      const duration = 1400;
      const step = target === 0 ? 0 : Math.ceil(target / (duration / 16));
      if (target === 0) { el.textContent = '0'; return; }
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = start + (target >= 100 ? '%' : target > 20 ? '+' : '');
        if (start >= target) clearInterval(timer);
      }, 16);
    }

    /* CUSTOM CURSOR */
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    let currentAngle = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    if (window.matchMedia('(pointer:fine)').matches) {
      (function tick() {
        const dx = mx - rx;
        const dy = my - ry;

        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          let targetAngle = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
          let angleDiff = targetAngle - currentAngle;
          angleDiff = ((angleDiff + 180) % 360 + 360) % 360 - 180;
          currentAngle += angleDiff * 0.2;
        }

        rx += (mx - rx) * .15;
        ry += (my - ry) * .15;
        dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%) rotate(${currentAngle}deg)`;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(tick);
      })();
      document.querySelectorAll('a,button,.project-item,.sdd-phase').forEach(el => {
        el.addEventListener('mouseenter', () => ring.style.cssText += ';width:52px;height:52px;border-color:var(--primary-80)');
        el.addEventListener('mouseleave', () => ring.style.cssText += ';width:36px;height:36px;border-color:var(--primary-40)');
      });
    } else {
      dot.style.display = ring.style.display = 'none';
    }

    /* FLASHLIGHT CARDS — update selector to include new filterable cards */
    function attachFlashlight() {
      document.querySelectorAll('.service-card,.stat-item,.sdd-phase,.exp-card,.ts-category').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${e.clientX - r.left}px`);
          card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
      });
    }
    attachFlashlight();

    /* SERVICE FILTER TABS — Two-Phase Transition */
    const srvTabs = document.querySelectorAll('.srv-tab');
    const srvCards = Array.from(document.querySelectorAll('#servicesGrid .service-card'));
    let filterTimeout;

    // Remove data-gone from all cards on page load
    srvCards.forEach(c => c.removeAttribute('data-gone'));

    srvTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.classList.contains('active')) return;

        clearTimeout(filterTimeout);
        srvTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.dataset.filter;
        const toHide = [];
        const toShow = [];

        srvCards.forEach(card => {
          const match = cat === 'all' || card.dataset.cat === cat;
          const isVisible = !card.hasAttribute('data-gone');

          if (isVisible) toHide.push(card);
          if (match) toShow.push(card);
        });

        // Phase 1: Fade out
        toHide.forEach(card => {
          card.classList.add('srv-hidden');
          card.style.pointerEvents = 'none';
        });

        const delay = toHide.length > 0 ? 350 : 0;

        filterTimeout = setTimeout(() => {
          // Phase 2: Reflow (Remove old, add new to DOM)
          toHide.forEach(card => card.setAttribute('data-gone', '1'));

          toShow.forEach(card => {
            card.removeAttribute('data-gone');
            card.classList.add('srv-hidden');
          });

          // Phase 3: Fade in
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              toShow.forEach(card => {
                card.classList.remove('srv-hidden');
                card.style.pointerEvents = '';
              });
            });
          });
        }, delay);
      });
    });

    /* RIPPLE BUTTONS */
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('click', e => {
        const r = document.createElement('span');
        r.className = 'ripple';
        const rect = btn.getBoundingClientRect();
        const sz = Math.max(rect.width, rect.height);
        r.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - rect.left - sz / 2}px;top:${e.clientY - rect.top - sz / 2}px;animation:ripple .7s linear;background:rgba(255,255,255,.2);pointer-events:none;position:absolute;border-radius:50%;`;
        btn.appendChild(r);
        setTimeout(() => r.remove(), 700);
      });
    });

    /* PROJECT ACCORDION */
    function toggleProject(item) {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.project-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    }

    /* NAV MOBILE */
    document.getElementById('menuBtn').addEventListener('click', () => {
      document.getElementById('navLinks').classList.toggle('open');
    });

    /* NAV SCROLL OPACITY */
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      nav.style.background = window.scrollY > 60 ? 'rgba(28,31,36,.95)' : 'rgba(28,31,36,.7)';
    });
    /* MATRIX RAIN ANIMATION */
    (function () {
      const canvas = document.getElementById('matrixCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // Resize canvas to match its display size
      function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      resizeCanvas();

      const fontSize = 13;
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF.NET C# JAVA AI SDD';
      const charArr = chars.split('');
      let columns = Math.floor(canvas.width / fontSize);
      let drops = Array.from({ length: columns }, () => Math.random() * -50);

      const primaryColor = '#97BF5C';

      function drawMatrix() {
        // Semi-transparent black background for trail
        ctx.fillStyle = 'rgba(28, 31, 36, 0.18)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px "Roboto Mono", monospace';

        for (let i = 0; i < drops.length; i++) {
          // Leading character brighter
          const char = charArr[Math.floor(Math.random() * charArr.length)];
          const y = drops[i] * fontSize;

          // Leading char: white/bright
          ctx.fillStyle = drops[i] > 2 ? 'rgba(255,255,255,0.92)' : primaryColor;
          ctx.fillStyle = primaryColor;
          // First character of stream: extra bright
          if (Math.random() > 0.97) {
            ctx.fillStyle = '#e8ffcc';
          }
          ctx.fillText(char, i * fontSize, y);

          // Reset drop randomly after it passes the bottom
          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += 0.6;
        }
      }

      let matrixInterval = setInterval(drawMatrix, 50);

      // Handle resize
      window.addEventListener('resize', () => {
        resizeCanvas();
        columns = Math.floor(canvas.width / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * -50);
      });
    })();