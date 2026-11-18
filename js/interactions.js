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
        initAvatarSpiderSense();
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

        const CARDS = '.exp-item, .skill-card, .project-card, .cert-card, .timeline-card, .about-info-card, .stat-item';
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
        const COLORS = ['#E50914', '#2563EB', '#38BDF8', '#F4E409'];
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

        document.querySelectorAll('.project-card, .timeline-card, .skill-card').forEach(card => {
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

                const rotateX = ((mouseY - rect.height / 2) / rect.height) * -8;
                const rotateY = ((mouseX - rect.width / 2) / rect.width) * 8;

                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(-4px, -4px)`;
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

    // ── AVATAR DYNAMIC SPIDER-MAN SPOTLIGHT LENS REVEAL ───────────
    function initAvatarSpiderSense() {
        const avatar = document.getElementById('hero-avatar');
        const badge = document.getElementById('avatar-badge-spider');
        if (!avatar) return;

        buildSpiderSuit(avatar);

        const BADGE_IDLE = '✦ EARTH-616 // DEV';
        const BADGE_LENS = '⚡ SPIDER-SENSE ⚡';
        const BADGE_SUIT = '🕷 SUITED UP!';

        // Bigger, softer lens so the mask actually reads
        const RADIUS_DESKTOP = 88;
        const RADIUS_MOBILE = 72;

        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;
        let targetRadius = 0, currentRadius = 0;
        let isHovered = false;
        let isTouchActive = false;
        let suited = false;
        let animId = null;
        let audioPlayed = false;

        const fullRadius = () => {
            const r = avatar.getBoundingClientRect();
            return Math.hypot(r.width, r.height) * 1.05;
        };

        function render() {
            const ease = 0.2;
            const radiusEase = suited ? 0.09 : 0.15;

            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;
            currentRadius += (targetRadius - currentRadius) * radiusEase;

            avatar.style.setProperty('--spider-x', `${currentX.toFixed(2)}px`);
            avatar.style.setProperty('--spider-y', `${currentY.toFixed(2)}px`);
            avatar.style.setProperty('--spider-radius', `${Math.max(0, currentRadius).toFixed(2)}px`);

            const settling = Math.abs(targetRadius - currentRadius) > 0.4 ||
                             Math.abs(targetX - currentX) > 0.3 || Math.abs(targetY - currentY) > 0.3;

            if (isHovered || isTouchActive || suited || settling) {
                animId = (settling || isHovered || isTouchActive) ? requestAnimationFrame(render) : null;
            } else {
                avatar.style.setProperty('--spider-radius', '0px');
                avatar.classList.remove('is-spidey-lens-active');
                if (badge) badge.textContent = BADGE_IDLE;
                audioPlayed = false;
                animId = null;
            }
        }

        function startTracking() {
            if (!animId) animId = requestAnimationFrame(render);
        }

        function updateCoords(clientX, clientY, isMobile = false) {
            const rect = avatar.getBoundingClientRect();
            targetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
            targetY = Math.max(0, Math.min(rect.height, clientY - rect.top));
            if (!suited) targetRadius = isMobile ? RADIUS_MOBILE : RADIUS_DESKTOP;

            if (!avatar.classList.contains('is-spidey-lens-active')) {
                avatar.classList.add('is-spidey-lens-active');
                if (badge) badge.textContent = suited ? BADGE_SUIT : BADGE_LENS;
                if (!audioPlayed && window.SpiderAudio) {
                    SpiderAudio.thwip();
                    audioPlayed = true;
                }
            }
            startTracking();
        }

        function release() {
            if (!suited) targetRadius = 0;
            startTracking();
        }

        // Click / tap: full "suit up" that expands from the pointer, click again to unmask
        avatar.addEventListener('click', e => {
            suited = !suited;
            avatar.classList.toggle('is-suited', suited);
            const rect = avatar.getBoundingClientRect();
            targetX = currentX = e.clientX - rect.left;
            targetY = currentY = e.clientY - rect.top;
            if (suited) {
                avatar.classList.add('is-spidey-lens-active');
                targetRadius = fullRadius();
                if (badge) badge.textContent = BADGE_SUIT;
                if (window.SpiderAudio) SpiderAudio.thwip();
            } else {
                targetRadius = (isHovered || isTouchActive) ? RADIUS_DESKTOP : 0;
                if (badge) badge.textContent = (isHovered || isTouchActive) ? BADGE_LENS : BADGE_IDLE;
            }
            startTracking();
        });

        // Desktop mouse tracking
        avatar.addEventListener('mouseenter', e => {
            isHovered = true;
            const rect = avatar.getBoundingClientRect();
            targetX = currentX = e.clientX - rect.left;
            targetY = currentY = e.clientY - rect.top;
            updateCoords(e.clientX, e.clientY, false);
        });
        avatar.addEventListener('mousemove', e => {
            isHovered = true;
            if (!suited) updateCoords(e.clientX, e.clientY, false);
        });
        avatar.addEventListener('mouseleave', () => {
            isHovered = false;
            release();
        });

        // Mobile touch tracking
        avatar.addEventListener('touchstart', e => {
            if (!e.touches || !e.touches.length || suited) return;
            isTouchActive = true;
            const rect = avatar.getBoundingClientRect();
            targetX = currentX = e.touches[0].clientX - rect.left;
            targetY = currentY = e.touches[0].clientY - rect.top;
            updateCoords(e.touches[0].clientX, e.touches[0].clientY, true);
        }, { passive: true });
        avatar.addEventListener('touchmove', e => {
            if (isTouchActive && e.touches && e.touches.length) {
                updateCoords(e.touches[0].clientX, e.touches[0].clientY, true);
            }
        }, { passive: true });
        avatar.addEventListener('touchend', () => { isTouchActive = false; release(); });
        avatar.addEventListener('touchcancel', () => { isTouchActive = false; release(); });
    }

    // Draws the suit in the photo's own coordinate space (427 x 584 px),
    // lined up with the head, eyes and shoulders of foto/profile-transparent.png.
    function buildSpiderSuit(avatar) {
        const color = avatar.querySelector('.suit-color');
        const detail = avatar.querySelector('.suit-detail');
        const ring = avatar.querySelector('.spidey-lens-ring');
        const f = n => n.toFixed(1);

        // Head outline (hair + face + jaw) and neck
        const HEAD = 'M217,62 C268,60 312,98 312,160 C312,210 300,252 282,282 C266,306 244,318 217,318 C190,318 168,306 152,282 C134,252 124,210 124,160 C124,98 166,60 217,62 Z';
        const NECK = 'M168,290 L266,290 L276,350 L158,350 Z';
        const CHEST = 'M160,322 L274,322 L300,420 L292,584 L142,584 L134,420 Z';
        const SHOULDERS = 'M0,372 C40,350 100,336 160,322 L150,372 C100,384 50,400 0,420 Z M427,372 C387,350 327,336 274,322 L284,372 C334,384 377,400 427,420 Z';

        if (color) {
            color.innerHTML = `
                <defs>
                    <linearGradient id="suitRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#FF3B3B"/><stop offset="1" stop-color="#C8101C"/>
                    </linearGradient>
                    <linearGradient id="suitBlue" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#3D5BD9"/><stop offset="1" stop-color="#14205E"/>
                    </linearGradient>
                </defs>
                <rect width="427" height="584" fill="url(#suitBlue)"/>
                <path d="${HEAD}" fill="url(#suitRed)"/>
                <path d="${NECK}" fill="url(#suitRed)"/>
                <path d="${CHEST}" fill="url(#suitRed)"/>
                <path d="${SHOULDERS}" fill="url(#suitRed)"/>`;
        }

        if (!detail) return;

        // Web pattern radiating from a hub between the eyes
        const hub = { x: 217, y: 206 };
        let headWeb = '';
        for (let i = 0; i < 18; i++) {
            const a = (i / 18) * Math.PI * 2 + 0.09;
            headWeb += `<line x1="${hub.x}" y1="${hub.y}" x2="${f(hub.x + Math.cos(a) * 190)}" y2="${f(hub.y + Math.sin(a) * 190)}"/>`;
        }
        // curved rings that sag between spokes, like real webbing on a mask
        for (let r = 1; r <= 7; r++) {
            const R = r * 19;
            let d = '';
            for (let i = 0; i <= 18; i++) {
                const a0 = (i / 18) * Math.PI * 2 + 0.09;
                const x = hub.x + Math.cos(a0) * R, y = hub.y + Math.sin(a0) * R * 1.12;
                if (i === 0) { d += `M${f(x)},${f(y)}`; continue; }
                const am = ((i - 0.5) / 18) * Math.PI * 2 + 0.09;
                const cx = hub.x + Math.cos(am) * R * 0.9, cy = hub.y + Math.sin(am) * R * 1.12 * 0.9;
                d += ` Q${f(cx)},${f(cy)} ${f(x)},${f(y)}`;
            }
            headWeb += `<path d="${d}"/>`;
        }

        // Web on the red chest panel, radiating from the emblem
        const chub = { x: 217, y: 430 };
        let chestWeb = '';
        for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2;
            chestWeb += `<line x1="${chub.x}" y1="${chub.y}" x2="${f(chub.x + Math.cos(a) * 220)}" y2="${f(chub.y + Math.sin(a) * 220)}"/>`;
        }
        for (let r = 1; r <= 7; r++) {
            const R = r * 28;
            chestWeb += `<ellipse cx="${chub.x}" cy="${chub.y}" rx="${R * 0.8}" ry="${R}"/>`;
        }

        const LENS_L = 'M146,176 C158,154 196,164 209,196 C206,216 182,222 166,211 C152,202 145,190 146,176 Z';
        const LENS_R = 'M288,176 C276,154 238,164 225,196 C228,216 252,222 268,211 C282,202 289,190 288,176 Z';

        // Chest spider emblem
        const legs = [
            [[210, 412], [186, 388], [180, 356]],
            [[208, 420], [178, 410], [160, 386]],
            [[208, 434], [178, 446], [166, 474]],
            [[210, 442], [190, 466], [188, 502]]
        ];
        let legPaths = '';
        legs.forEach(l => {
            legPaths += `<polyline points="${l.map(p => p.join(',')).join(' ')}"/>`;
            legPaths += `<polyline points="${l.map(p => [434 - p[0], p[1]].join(',')).join(' ')}"/>`;
        });

        detail.innerHTML = `
            <defs>
                <clipPath id="clipHead"><path d="${HEAD}"/><path d="${NECK}"/></clipPath>
                <clipPath id="clipChest"><path d="${CHEST}"/><path d="${SHOULDERS}"/></clipPath>
                <radialGradient id="lensFill" cx="0.45" cy="0.35" r="0.75">
                    <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.7" stop-color="#E6F4FF"/><stop offset="1" stop-color="#9CC8EA"/>
                </radialGradient>
                <radialGradient id="headShine" cx="0.38" cy="0.28" r="0.55">
                    <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.28"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
                </radialGradient>
            </defs>

            <!-- embossed web: light highlight under a dark thread -->
            <g clip-path="url(#clipHead)" fill="none" stroke-linecap="round">
                <g stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="2.6" transform="translate(0.9,1.1)">${headWeb}</g>
                <g stroke="#2A0006" stroke-opacity="0.85" stroke-width="1.7">${headWeb}</g>
                <path d="${HEAD}" fill="url(#headShine)" stroke="none"/>
            </g>
            <g clip-path="url(#clipChest)" fill="none" stroke-linecap="round">
                <g stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="2.4" transform="translate(0.9,1.1)">${chestWeb}</g>
                <g stroke="#1E0004" stroke-opacity="0.7" stroke-width="1.6">${chestWeb}</g>
            </g>

            <!-- panel seams -->
            <g fill="none" stroke="#05060F" stroke-opacity="0.7" stroke-width="3">
                <path d="${CHEST}"/><path d="${SHOULDERS}"/>
            </g>

            <!-- eye lenses -->
            <g stroke-linejoin="round">
                <path d="${LENS_L}" fill="url(#lensFill)" stroke="#06070C" stroke-width="8"/>
                <path d="${LENS_R}" fill="url(#lensFill)" stroke="#06070C" stroke-width="8"/>
                <path d="M160,182 C170,170 188,174 196,188" fill="none" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="3" stroke-linecap="round"/>
                <path d="M274,182 C264,170 246,174 238,188" fill="none" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="3" stroke-linecap="round"/>
            </g>

            <!-- chest spider -->
            <g fill="#07080F" stroke="#07080F" stroke-linecap="round" stroke-linejoin="round">
                <g fill="none" stroke-width="5.5">${legPaths}</g>
                <ellipse cx="217" cy="410" rx="8" ry="10"/>
                <ellipse cx="217" cy="440" rx="11.5" ry="21"/>
            </g>`;

        // Lens ring: a tiny rotating web
        if (ring) {
            let w = '';
            for (let i = 0; i < 12; i++) {
                const a = (i / 12) * Math.PI * 2;
                w += `<line x1="50" y1="50" x2="${f(50 + Math.cos(a) * 50)}" y2="${f(50 + Math.sin(a) * 50)}"/>`;
            }
            [16, 30, 44].forEach(r => { w += `<circle cx="50" cy="50" r="${r}"/>`; });
            ring.innerHTML = `<svg viewBox="0 0 100 100"><g fill="none" stroke="#FFFFFF" stroke-width="0.5">${w}</g></svg>`;
        }
    }

    return {
        init: init
    };
})();
