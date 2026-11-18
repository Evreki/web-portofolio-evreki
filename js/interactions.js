/**
 * SPIDER-MAN NEOBRUTALISM PORTFOLIO — INTERACTIVITY SYSTEM
 * Cursor, Audio FX, 3D Card Tilt, Magnetic Physics, Stickers, Toast
 * Evreki Wan Refanja
 */

'use strict';

// ── RETRO AUDIO SYSTEM (WEB AUDIO API) ─────────────────────────
window.SpiderAudio = (function () {
    let ctx = null;
    let muted = localStorage.getItem('sound_enabled') === 'false';

    function getAudioContext() {
        if (!ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) ctx = new AudioCtx();
        }
        if (ctx && ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.1) {
        if (muted) return;
        try {
            const ac = getAudioContext();
            if (!ac) return;
            const osc = ac.createOscillator();
            const gain = ac.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ac.currentTime);
            gain.gain.setValueAtTime(gainVal, ac.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);

            osc.connect(gain);
            gain.connect(ac.destination);

            osc.start();
            osc.stop(ac.currentTime + duration);
        } catch (_) {}
    }

    return {
        toggle() {
            muted = !muted;
            localStorage.setItem('sound_enabled', String(!muted));
            return !muted;
        },
        isOn: () => !muted,
        click: () => playTone(280, 'triangle', 0.05, 0.08),
        pop: () => playTone(440, 'sine', 0.05, 0.06),
        coin: () => {
            playTone(988, 'square', 0.07, 0.06);
            setTimeout(() => playTone(1319, 'square', 0.2, 0.08), 75);
        },
        thwip: () => {
            // Web-Slinging "THWIP" sound effect
            try {
                if (muted) return;
                const ac = getAudioContext();
                if (!ac) return;
                const osc = ac.createOscillator();
                const gain = ac.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(1400, ac.currentTime);
                osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.12);

                gain.gain.setValueAtTime(0.12, ac.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);

                osc.connect(gain);
                gain.connect(ac.destination);

                osc.start();
                osc.stop(ac.currentTime + 0.12);
            } catch (_) {}
        },
        laser: () => {
            try {
                if (muted) return;
                const ac = getAudioContext();
                if (!ac) return;
                const osc = ac.createOscillator();
                const gain = ac.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(900, ac.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ac.currentTime + 0.18);

                gain.gain.setValueAtTime(0.1, ac.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);

                osc.connect(gain);
                gain.connect(ac.destination);

                osc.start();
                osc.stop(ac.currentTime + 0.18);
            } catch (_) {}
        }
    };
})();

// ── MAIN INTERACTIONS MODULE ──────────────────────────────────
window.SpiderInteractions = (function () {

    function init() {
        initCustomCursor();
        initSoundControls();
        initMagneticButtons();
        init3DCardTilt();
        initDraggableStickers();
        initCopyToClipboard();
        initBackToTop();
        initButtonRipples();
        initNavbarSpy();
        initSkeletonLoading();
        initExperience();
        initContentSkeletons();
    }

    // ── SKELETON SHIMMER FOR IMAGES ────────────────────────────
    // Shows a shimmering placeholder until each image has really loaded.
    function attachSkeleton(box, img) {
        if (!box || !img) return;
        box.classList.add('skeleton');
        const done = () => {
            if (img.naturalWidth > 0) {
                box.classList.add('is-loaded');
                box.classList.remove('is-error');
            }
        };
        if (img.complete && img.naturalWidth > 0) { done(); return; }
        img.addEventListener('load', done);
        // inline onerror handlers may swap to a fallback src; only flag error if nothing loads
        img.addEventListener('error', () => {
            setTimeout(() => { if (!box.classList.contains('is-loaded')) box.classList.add('is-error'); }, 1500);
        });
    }

    function initSkeletonLoading() {
        document.querySelectorAll('.project-img-box, .cert-img-box, .polaroid-img-container, .exp-logo').forEach(box => {
            attachSkeleton(box, box.querySelector('img'));
        });
    }

    // ── EXPERIENCE: DURATIONS + AUTO "SEE MORE" ─────────────────
    function initExperience() {
        const section = document.getElementById('experience');
        if (!section) return;

        // LinkedIn-style duration (inclusive months), recalculated from today.
        // data-duration="..." pins a fixed label instead.
        const now = new Date();
        section.querySelectorAll('.exp-item[data-start]').forEach(item => {
            const el = item.querySelector('.exp-duration');
            if (!el) return;
            if (item.dataset.duration) { el.textContent = item.dataset.duration; return; }
            const [sy, sm] = item.dataset.start.split('-').map(Number);
            let ey = now.getFullYear(), em = now.getMonth() + 1;
            if (item.dataset.end) [ey, em] = item.dataset.end.split('-').map(Number);
            const total = Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
            const yrs = Math.floor(total / 12), mos = total % 12;
            const parts = [];
            if (yrs) parts.push(`${yrs} yr${yrs > 1 ? 's' : ''}`);
            if (mos) parts.push(`${mos} mo${mos > 1 ? 's' : ''}`);
            el.textContent = parts.join(' ');
        });

        // Every experience whose description is long gets a "...see more" toggle,
        // so by default each entry stays short.
        const COLLAPSED = 118; // px of text visible while collapsed (~4 lines)
        section.querySelectorAll('.exp-body').forEach((body, i) => {
            const parts = [...body.children].filter(el => el.matches('.exp-desc, .exp-points'));
            if (!parts.length) return;

            const box = document.createElement('div');
            box.className = 'exp-collapse';
            box.id = `exp-more-${i}`;
            parts[0].before(box);
            parts.forEach(p => box.appendChild(p));

            if (box.scrollHeight <= COLLAPSED + 36) return; // short enough, no toggle

            box.classList.add('is-collapsible');
            box.style.maxHeight = COLLAPSED + 'px';

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'exp-more-btn';
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-controls', box.id);
            btn.innerHTML = '<span class="exp-more-label">…see more</span> <i data-lucide="chevron-down"></i>';
            box.after(btn);

            btn.addEventListener('click', () => {
                const open = btn.getAttribute('aria-expanded') === 'true';
                if (open) {
                    box.style.maxHeight = box.scrollHeight + 'px';
                    void box.offsetHeight; // force reflow so the collapse animates
                    box.style.maxHeight = COLLAPSED + 'px';
                    box.classList.remove('is-open');
                } else {
                    box.style.maxHeight = box.scrollHeight + 'px';
                    box.classList.add('is-open');
                    box.addEventListener('transitionend', function handler() {
                        if (box.classList.contains('is-open')) box.style.maxHeight = 'none';
                        box.removeEventListener('transitionend', handler);
                    });
                }
                btn.setAttribute('aria-expanded', String(!open));
                btn.querySelector('.exp-more-label').textContent = open ? '…see more' : 'see less';
                if (typeof ScrollTrigger !== 'undefined') setTimeout(() => ScrollTrigger.refresh(), 600);
            });
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ── CONTENT SKELETON (shown when a card scrolls into view) ──
    // Each card first shows shimmering bars drawn exactly where its real
    // text, images, chips and bars sit; then the real content fades in.
    function initContentSkeletons() {
        if (!('IntersectionObserver' in window)) return;

        const CARDS = '.exp-item, .skill-card, .project-card, .cert-card, .edu-item, .stat-item';
        const PARTS = [
            'h3', 'h4', 'p', 'li', '.skill-info', '.progress-bar', '.skill-tag', '.exp-chip',
            '.brutal-badge', '.project-img-box', '.cert-img-box', '.exp-logo', '.brutal-btn',
            '.timeline-year-badge', '.exp-now', '.exp-more-btn', '.project-issue-badge',
            '.stat-number-row', '.stat-label', '.about-info-icon', '.about-info-label', '.about-info-value',
            '.exp-skills > svg', '.skill-card-title'
        ].join(',');
        const TEXT = 'h3, h4, p, li, .stat-label, .about-info-label, .about-info-value';

        const cards = [...document.querySelectorAll(CARDS)];
        cards.forEach(c => c.classList.add('is-skeleton'));

        function bar(layer, x, y, w, h, cls) {
            if (w < 2 || h < 2) return;
            const b = document.createElement('span');
            b.className = 'sk sk-bar' + (cls ? ' ' + cls : '');
            b.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
            layer.appendChild(b);
        }

        function build(card) {
            const cr = card.getBoundingClientRect();
            if (!cr.width || !cr.height) return null;
            const scale = cr.width / (card.offsetWidth || cr.width);
            const layer = document.createElement('div');
            layer.className = 'card-skeleton';
            layer.setAttribute('aria-hidden', 'true');

            const all = [...card.querySelectorAll(PARTS)];
            const parts = all.filter(el => !all.some(o => o !== el && o.contains(el)));

            parts.forEach(el => {
                const clip = el.closest('.exp-collapse');
                const clipBottom = clip ? clip.getBoundingClientRect().bottom : Infinity;
                const rel = r => [(r.left - cr.left) / scale, (r.top - cr.top) / scale, r.width / scale, r.height / scale];

                if (el.matches(TEXT)) {
                    // one bar per rendered text line
                    const range = document.createRange();
                    range.selectNodeContents(el);
                    const lines = [];
                    [...range.getClientRects()].forEach(r => {
                        if (r.width < 2 || r.top >= clipBottom) return;
                        const line = lines.find(l => Math.abs(l.top - r.top) < 4);
                        if (line) { line.left = Math.min(line.left, r.left); line.right = Math.max(line.right, r.right); line.h = Math.max(line.h, r.height); }
                        else lines.push({ top: r.top, left: r.left, right: r.right, h: r.height });
                    });
                    lines.forEach(l => {
                        const [x, y, w, h] = rel({ left: l.left, top: l.top, width: l.right - l.left, height: l.h });
                        const bh = Math.max(8, Math.min(h * 0.62, 18));
                        bar(layer, x, y + (h - bh) / 2, w, bh, 'sk-text');
                    });
                } else {
                    const r = el.getBoundingClientRect();
                    if (r.top >= clipBottom) return;
                    const [x, y, w, h] = rel(r);
                    bar(layer, x, y, w, h, el.matches('.project-img-box, .cert-img-box, .exp-logo') ? 'sk-media' : '');
                }
            });

            card.appendChild(layer);
            return layer;
        }

        function reveal(card, order) {
            const layer = build(card);
            const hold = 650 + order * 110;
            setTimeout(() => {
                card.classList.remove('is-skeleton');
                card.classList.add('skeleton-reveal');
                if (layer) {
                    layer.classList.add('is-out');
                    setTimeout(() => layer.remove(), 450);
                }
                setTimeout(() => card.classList.remove('skeleton-reveal'), 600);
            }, hold);
        }

        const io = new IntersectionObserver(entries => {
            let order = 0;
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                io.unobserve(entry.target);
                reveal(entry.target, Math.min(order++, 4));
            });
        }, { threshold: 0.12 });

        // wait for the preloader so the skeleton is actually seen in the content
        const start = () => cards.forEach(c => io.observe(c));
        const loader = document.getElementById('brutal-loader');
        if (loader && getComputedStyle(loader).display !== 'none') {
            const mo = new MutationObserver(() => {
                if (loader.style.display === 'none') { mo.disconnect(); start(); }
            });
            mo.observe(loader, { attributes: true, attributeFilter: ['style', 'class'] });
            setTimeout(() => { mo.disconnect(); start(); }, 4000); // safety net
        } else {
            start();
        }
    }

    // ── SPIDER-WEB CUSTOM CURSOR ───────────────────────────────
    function initCustomCursor() {
        const cursor = document.querySelector('.brutal-cursor');
        if (!cursor || !window.matchMedia('(pointer:fine)').matches) return;

        let mouseX = -100, mouseY = -100;
        let cursorX = -100, cursorY = -100;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function renderCursor() {
            cursorX += (mouseX - cursorX) * 0.35;
            cursorY += (mouseY - cursorY) * 0.35;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        // Hover expansions
        const hoverTargets = 'a, button, .brutal-btn, .social-btn, .t-chip, .open-modal-btn, .draggable-sticker, .about-info-card';
        document.querySelectorAll(hoverTargets).forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        // Web cursor particle trail
        const COLORS = ['#0A66C2', '#378FE9', '#70B5F9'];
        let lastTrailTime = 0;
        document.addEventListener('mousemove', e => {
            const now = Date.now();
            if (now - lastTrailTime < 45) return;
            lastTrailTime = now;

            const dot = document.createElement('div');
            dot.className = 'cursor-trail-dot';
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
            dot.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            document.body.appendChild(dot);

            setTimeout(() => {
                dot.style.opacity = '0';
                dot.style.transform = 'translate(-50%, -50%) scale(0.2)';
                setTimeout(() => dot.remove(), 250);
            }, 180);
        }, { passive: true });
    }

    // ── SOUND FX CONTROLS ──────────────────────────────────────
    function initSoundControls() {
        const btn = document.getElementById('sound-btn');
        const iconOn = document.getElementById('sound-icon-on');
        const iconOff = document.getElementById('sound-icon-off');
        if (!btn) return;

        function updateIcon(isOn) {
            if (iconOn && iconOff) {
                iconOn.style.display = isOn ? 'block' : 'none';
                iconOff.style.display = isOn ? 'none' : 'block';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }

        updateIcon(SpiderAudio.isOn());

        btn.addEventListener('click', () => {
            const isOn = SpiderAudio.toggle();
            updateIcon(isOn);
            if (isOn) SpiderAudio.coin();
        });

        // Attach audio to UI elements
        document.querySelectorAll('.brutal-btn, .nav-link, .social-btn, .t-chip, .modal-close, .modal-dismiss-btn').forEach(el => {
            el.addEventListener('click', () => {
                if (el.classList.contains('danger') || el.classList.contains('open-modal-btn')) {
                    SpiderAudio.thwip();
                } else {
                    SpiderAudio.click();
                }
            });
            el.addEventListener('mouseenter', () => SpiderAudio.pop());
        });
    }

    // ── MAGNETIC BUTTONS ───────────────────────────────────────
    function initMagneticButtons() {
        if (!window.matchMedia('(pointer:fine)').matches) return;

        document.querySelectorAll('.magnet-btn, .social-btn, .nav-cta').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const dx = (e.clientX - rect.left - rect.width / 2) * 0.38;
                const dy = (e.clientY - rect.top - rect.height / 2) * 0.38;
                btn.style.transform = `translate(${dx}px, ${dy}px) translate(-3px, -3px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ── 3D CARD PERSPECTIVE TILT ───────────────────────────────
    function init3DCardTilt() {
        if (!window.matchMedia('(pointer:fine)').matches) return;

        document.querySelectorAll('.project-card').forEach(card => {
            // Create subtle glare element if missing
            if (!card.querySelector('.card-glare')) {
                const glare = document.createElement('div');
                glare.className = 'card-glare';
                card.appendChild(glare);
            }

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', (mouseX / rect.width * 100) + '%');
                card.style.setProperty('--mouse-y', (mouseY / rect.height * 100) + '%');

                const rotateX = ((mouseY - rect.height / 2) / rect.height) * -4;
                const rotateY = ((mouseX - rect.width / 2) / rect.width) * 4;

                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ── DRAGGABLE STICKERS ─────────────────────────────────────
    function initDraggableStickers() {
        document.querySelectorAll('.draggable-sticker').forEach(sticker => {
            let isDragging = false, startX = 0, startY = 0, origX = 0, origY = 0;

            function startDrag(e) {
                isDragging = true;
                sticker.classList.add('is-dragging');
                SpiderAudio.pop();

                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                startX = clientX;
                startY = clientY;

                const parentRect = sticker.parentElement.getBoundingClientRect();
                const stickerRect = sticker.getBoundingClientRect();
                origX = stickerRect.left - parentRect.left;
                origY = stickerRect.top - parentRect.top;

                document.addEventListener('mousemove', moveDrag);
                document.addEventListener('mouseup', stopDrag);
                document.addEventListener('touchmove', moveDrag, { passive: false });
                document.addEventListener('touchend', stopDrag);
            }

            function moveDrag(e) {
                if (!isDragging) return;
                if (e.cancelable) e.preventDefault();

                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                sticker.style.left = `${origX + clientX - startX}px`;
                sticker.style.top = `${origY + clientY - startY}px`;
                sticker.style.right = 'auto';
                sticker.style.bottom = 'auto';
            }

            function stopDrag() {
                isDragging = false;
                sticker.classList.remove('is-dragging');
                document.removeEventListener('mousemove', moveDrag);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchmove', moveDrag);
                document.removeEventListener('touchend', stopDrag);
            }

            sticker.addEventListener('mousedown', startDrag);
            sticker.addEventListener('touchstart', startDrag, { passive: true });
        });
    }

    // ── COPY TO CLIPBOARD + TOAST ──────────────────────────────
    function initCopyToClipboard() {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        if (!toast) return;
        let timer = null;

        function showToast(msg) {
            toastMsg.textContent = msg;
            toast.classList.add('show');
            SpiderAudio.coin();
            clearTimeout(timer);
            timer = setTimeout(() => toast.classList.remove('show'), 2200);
        }

        document.querySelectorAll('[data-copy]').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                const text = el.dataset.copy;
                const label = el.dataset.copyLabel || 'Copied to clipboard!';
                if (!text) return;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text)
                        .then(() => showToast('✦ ' + label))
                        .catch(() => fallbackCopy(text, label));
                } else {
                    fallbackCopy(text, label);
                }
            });
        });

        function fallbackCopy(text, label) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                showToast('✦ ' + label);
            } catch (_) {}
            ta.remove();
        }
    }

    // ── BACK TO TOP ────────────────────────────────────────────
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        btn.addEventListener('click', () => {
            SpiderAudio.thwip();
            if (window.SpiderCore) {
                window.SpiderCore.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // ── BUTTON RIPPLE ──────────────────────────────────────────
    function initButtonRipples() {
        document.querySelectorAll('.brutal-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 1.6;
                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple';
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
                btn.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove());
            });
        });
    }

    // ── NAVBAR SCROLL SHADOW + SCROLLSPY ──────────────────────
    function initNavbarSpy() {
        const navbar = document.querySelector('.navbar');
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });

        // Scrollspy
        if (sections.length && links.length) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const id = entry.target.id;
                    links.forEach(l => {
                        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                    });
                });
            }, { rootMargin: '-35% 0px -55% 0px' });

            sections.forEach(s => observer.observe(s));
        }

        // Hamburger mobile menu toggle
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                const isOpen = navLinks.classList.contains('mobile-open');
                if (isOpen) {
                    navLinks.classList.remove('mobile-open');
                    hamburger.setAttribute('aria-expanded', 'false');
                } else {
                    navLinks.classList.add('mobile-open');
                    hamburger.setAttribute('aria-expanded', 'true');
                }
            });

            // Close on link click
            navLinks.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => {
                    navLinks.classList.remove('mobile-open');
                    hamburger.setAttribute('aria-expanded', 'false');
                });
            });

            // Close on outside click
            document.addEventListener('click', e => {
                if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('mobile-open');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }


    return {
        init: init
    };
})();
