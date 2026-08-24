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

        // Compact & refined radius: perfect for revealing eyes, nose, or chest spider
        const RADIUS_DESKTOP = 52;
        const RADIUS_MOBILE = 45;

        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;
        let targetRadius = 0, currentRadius = 0;
        let isHovered = false;
        let isTouchActive = false;
        let animId = null;
        let audioPlayed = false;

        function render() {
            // Linear Interpolation (LERP) for silky 60-120fps physics glide
            const ease = 0.22;
            const radiusEase = 0.16;

            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;
            currentRadius += (targetRadius - currentRadius) * radiusEase;

            // Apply smooth CSS properties
            avatar.style.setProperty('--spider-x', `${currentX.toFixed(2)}px`);
            avatar.style.setProperty('--spider-y', `${currentY.toFixed(2)}px`);
            avatar.style.setProperty('--spider-radius', `${Math.max(0, currentRadius).toFixed(2)}px`);

            // Keep animating while active or while smoothly shrinking to 0
            if (isHovered || isTouchActive || currentRadius > 0.4) {
                animId = requestAnimationFrame(render);
            } else {
                avatar.style.setProperty('--spider-radius', '0px');
                avatar.classList.remove('is-spidey-lens-active');
                if (badge) badge.textContent = '✦ EARTH-616 // DEV';
                audioPlayed = false;
                animId = null;
            }
        }

        function startTracking() {
            if (!animId) {
                animId = requestAnimationFrame(render);
            }
        }

        function updateCoords(clientX, clientY, isMobile = false) {
            const rect = avatar.getBoundingClientRect();
            targetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
            targetY = Math.max(0, Math.min(rect.height, clientY - rect.top));
            targetRadius = isMobile ? RADIUS_MOBILE : RADIUS_DESKTOP;

            if (!avatar.classList.contains('is-spidey-lens-active')) {
                avatar.classList.add('is-spidey-lens-active');
                if (badge) badge.textContent = '⚡ SPIDER-SENSE REVEAL! ⚡';
                if (!audioPlayed && window.SpiderAudio) {
                    SpiderAudio.thwip();
                    audioPlayed = true;
                }
            }

            startTracking();
        }

        // Desktop Mouse Tracking
        avatar.addEventListener('mouseenter', e => {
            isHovered = true;
            const rect = avatar.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
            currentX = targetX;
            currentY = targetY;
            updateCoords(e.clientX, e.clientY, false);
        });

        avatar.addEventListener('mousemove', e => {
            isHovered = true;
            updateCoords(e.clientX, e.clientY, false);
        });

        avatar.addEventListener('mouseleave', () => {
            isHovered = false;
            targetRadius = 0;
            startTracking();
        });

        // Mobile Touch Tracking
        avatar.addEventListener('touchstart', e => {
            if (e.touches && e.touches.length > 0) {
                isTouchActive = true;
                const rect = avatar.getBoundingClientRect();
                targetX = e.touches[0].clientX - rect.left;
                targetY = e.touches[0].clientY - rect.top;
                currentX = targetX;
                currentY = targetY;
                updateCoords(e.touches[0].clientX, e.touches[0].clientY, true);
            }
        }, { passive: true });

        avatar.addEventListener('touchmove', e => {
            if (isTouchActive && e.touches && e.touches.length > 0) {
                updateCoords(e.touches[0].clientX, e.touches[0].clientY, true);
            }
        }, { passive: true });

        avatar.addEventListener('touchend', () => {
            isTouchActive = false;
            targetRadius = 0;
            startTracking();
        });

        avatar.addEventListener('touchcancel', () => {
            isTouchActive = false;
            targetRadius = 0;
            startTracking();
        });
    }

    return {
        init: init
    };
})();
