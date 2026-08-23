/**
 * SPIDER-MAN NEOBRUTALISM PORTFOLIO — GSAP & SCROLLTRIGGER ANIMATION SYSTEM
 * Evreki Wan Refanja
 */

'use strict';

window.SpiderAnimations = (function () {

    function init() {
        if (typeof gsap === 'undefined') return;

        initPreloader();
        initScrollProgress();
        initHeroAnimations();
        initSectionHeaders();
        initStatsCounter();
        initSkillsCounters();
        initTimelineAnimations();
        initMarquees();
        initGenericScrollReveals();
        initFooterTyping();
    }

    // ── PRELOADER ANIMATION ────────────────────────────────────
    function initPreloader() {
        const loader = document.getElementById('brutal-loader');
        const loaderText = document.querySelector('.loader-text');
        const loaderProgress = document.querySelector('.loader-progress-bar');
        if (!loader) return;

        const messages = [
            '01 // CONNECTING WEB...',
            '02 // SCANNING TECH ARSENAL...',
            '03 // SYNCING SPIDER-VERSE...',
            '04 // INITIALIZING EVREKI...',
            '05 // SPIDER SYSTEM READY!'
        ];

        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (loaderText && messages[step]) {
                loaderText.textContent = messages[step];
            }
            if (loaderProgress) {
                loaderProgress.style.width = ((step + 1) / messages.length * 100) + '%';
            }

            if (step >= messages.length - 1) {
                clearInterval(interval);
                setTimeout(() => {
                    gsap.to(loader, {
                        yPercent: -100,
                        duration: 0.65,
                        ease: 'power4.inOut',
                        onComplete: () => {
                            loader.style.display = 'none';
                            loader.classList.add('loader-hidden');
                            triggerHeroEntrance();
                            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
                        }
                    });
                }, 300);
            }
        }, 200);
    }

    // ── HERO ENTRANCE ──────────────────────────────────────────
    function triggerHeroEntrance() {
        if (typeof gsap === 'undefined') return;

        const tl = gsap.timeline({ defaults: { ease: 'back.out(1.4)', duration: 0.65 } });
        const avatar = document.querySelector('.geo-avatar');
        const badge = document.querySelector('.hero-badge');
        const title = document.querySelector('.hero-title');
        const words = document.querySelectorAll('.hero-title-word');
        const subBadge = document.querySelector('.hero-subtitle-badge');
        const social = document.querySelector('.social-links-hero');
        const btns = document.querySelector('.hero-btn-row');

        if (avatar) tl.from(avatar, { scale: 0.3, opacity: 0, rotation: -10, duration: 0.8, ease: 'elastic.out(1, 0.5)', clearProps: 'all' });
        if (badge) tl.from(badge, { x: -60, opacity: 0, duration: 0.4, clearProps: 'all' }, '-=0.4');
        
        if (words.length > 0) {
            tl.from(words, {
                y: 50,
                rotationX: -60,
                opacity: 0,
                stagger: 0.12,
                duration: 0.7,
                ease: 'back.out(2)',
                clearProps: 'all'
            }, '-=0.3');
        } else if (title) {
            tl.from(title, { y: 40, opacity: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all' }, '-=0.3');
        }

        if (subBadge) tl.from(subBadge, { scale: 0.8, opacity: 0, x: 30, duration: 0.5, ease: 'back.out(1.8)', clearProps: 'all' }, '-=0.25');
        if (social) tl.from(social.querySelectorAll('.social-btn'), { scale: 0, opacity: 0, stagger: 0.06, duration: 0.35, ease: 'back.out(2)', clearProps: 'all' }, '-=0.2');
        if (btns) tl.from(btns.querySelectorAll('.brutal-btn'), { y: 30, opacity: 0, stagger: 0.1, duration: 0.45, ease: 'back.out(1.7)', clearProps: 'all' }, '-=0.15');
    }

    function initHeroAnimations() {
        const loader = document.getElementById('brutal-loader');
        if (!loader || loader.classList.contains('loader-hidden')) {
            setTimeout(triggerHeroEntrance, 300);
        }
        initTypedRole();
        initTitleGlitchAndParallax();
    }

    function initTitleGlitchAndParallax() {
        const title = document.querySelector('.hero-title');
        const hero = document.getElementById('hero-section');
        if (!title) return;

        // Periodic Spider-Sense Glitch Pulse
        setInterval(() => {
            title.classList.add('is-glitching');
            setTimeout(() => {
                title.classList.remove('is-glitching');
            }, 380);
        }, 4200);

        // Click on title -> trigger instant burst + sound
        title.addEventListener('click', () => {
            title.classList.add('is-glitching');
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: { y: 0.4 },
                    colors: ['#E50914', '#2563EB', '#38BDF8', '#FFFFFF']
                });
            }
            if (window.SpiderCore && window.SpiderCore.playSound) {
                window.SpiderCore.playSound('web');
            }
            setTimeout(() => title.classList.remove('is-glitching'), 600);
        });

        // 3D Parallax on Mouse Move
        if (hero) {
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const xPct = (e.clientX - rect.left) / rect.width - 0.5;
                const yPct = (e.clientY - rect.top) / rect.height - 0.5;

                const shadowX1 = 4 + xPct * 8;
                const shadowY1 = 4 + yPct * 8;
                const shadowX2 = 8 + xPct * 16;
                const shadowY2 = 8 + yPct * 16;

                title.style.textShadow = `${shadowX1}px ${shadowY1}px 0 #E50914, ${shadowX2}px ${shadowY2}px 0 #2563EB, 14px 14px 0 #000000`;
            }, { passive: true });

            hero.addEventListener('mouseleave', () => {
                title.style.textShadow = '4px 4px 0 #E50914, 8px 8px 0 #2563EB, 12px 12px 0 #000000';
            });
        }
    }

    function initTypedRole() {
        const el = document.getElementById('typed-role');
        if (!el) return;
        const roles = ['SOFTWARE ENGINEER', 'FULLSTACK DEVELOPER', 'MOBILE & WEB DEV', 'PROBLEM SOLVER'];
        let roleIdx = 0, charIdx = 0, isDeleting = false;

        function tick() {
            const currentRole = roles[roleIdx];
            if (!isDeleting) {
                el.textContent = currentRole.slice(0, ++charIdx);
                if (charIdx === currentRole.length) {
                    isDeleting = true;
                    return setTimeout(tick, 2000);
                }
            } else {
                el.textContent = currentRole.slice(0, --charIdx);
                if (charIdx === 0) {
                    isDeleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                }
            }
            setTimeout(tick, isDeleting ? 30 : 65);
        }
        setTimeout(tick, 1000);
    }

    // ── SCROLL PROGRESS BAR ────────────────────────────────────
    function initScrollProgress() {
        const bar = document.getElementById('scroll-progress');
        if (!bar) return;

        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll <= 0) return;
            const pct = (window.scrollY / totalScroll) * 100;
            bar.style.width = Math.min(pct, 100) + '%';

            if (pct >= 99) {
                bar.classList.add('pulse-completed');
            } else {
                bar.classList.remove('pulse-completed');
            }
        }, { passive: true });
    }

    // ── SECTION HEADERS COMIC IMPACT ───────────────────────────
    function initSectionHeaders() {
        if (typeof ScrollTrigger === 'undefined') return;

        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                y: 35,
                opacity: 0,
                scale: 0.95,
                duration: 0.6,
                ease: 'back.out(1.5)',
                clearProps: 'all',
                onComplete: () => {
                    header.classList.add('reveal-visible');
                }
            });
        });
    }

    // ── STATS COUNTER ──────────────────────────────────────────
    function initStatsCounter() {
        const strip = document.querySelector('.stats-strip');
        if (!strip || typeof ScrollTrigger === 'undefined') return;

        gsap.from('.stat-item', {
            scrollTrigger: {
                trigger: strip,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    document.querySelectorAll('.stat-number').forEach(animateSingleStat);
                }
            },
            y: 40,
            opacity: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: 'back.out(1.3)',
            clearProps: 'all'
        });
    }

    function animateSingleStat(el) {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        const duration = 1400;
        const start = performance.now();
        (function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        })(start);
    }

    // ── SKILLS PROGRESS BARS & NUMERIC COUNTER ─────────────────
    function initSkillsCounters() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection || typeof ScrollTrigger === 'undefined') return;

        gsap.from('#skills .skill-card', {
            scrollTrigger: {
                trigger: skillsSection,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            scale: 0.85,
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.12,
            ease: 'back.out(1.3)',
            clearProps: 'all'
        });

        ScrollTrigger.create({
            trigger: skillsSection,
            start: 'top 75%',
            once: true,
            onEnter: () => {
                document.querySelectorAll('.skill-card').forEach(card => {
                    card.querySelectorAll('.progress-fill').forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width') || '0%';
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, 180);
                    });
                    card.querySelectorAll('.skill-percent').forEach(el => {
                        const target = parseInt(el.dataset.target, 10);
                        if (isNaN(target)) return;
                        let cur = 0;
                        const step = Math.ceil(target / 35);
                        const iv = setInterval(() => {
                            cur = Math.min(cur + step, target);
                            el.textContent = cur + '%';
                            if (cur >= target) clearInterval(iv);
                        }, 28);
                    });
                });
            }
        });
    }

    // ── TIMELINE (SPIDER-VERSE MULTIVERSE) ──────────────────────
    function initTimelineAnimations() {
        const journeySection = document.getElementById('journey');
        if (!journeySection || typeof ScrollTrigger === 'undefined') return;

        gsap.utils.toArray('.timeline-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                x: i % 2 === 0 ? -60 : 60,
                opacity: 0,
                duration: 0.65,
                ease: 'power3.out',
                clearProps: 'all'
            });
        });
    }

    // ── MARQUEE SPEED & ACCELERATION ────────────────────────────
    function initMarquees() {
        const track1 = document.querySelector('.marquee-content');
        const track2 = document.querySelector('.marquee-content-reverse');
        let pos1 = 0, pos2 = 0;
        let lastScrollY = window.scrollY;
        let scrollVelocity = 0;

        function animateMarquee() {
            const currentScrollY = window.scrollY;
            scrollVelocity += Math.abs(currentScrollY - lastScrollY) * 0.1;
            lastScrollY = currentScrollY;
            scrollVelocity *= 0.92;

            if (track1) {
                pos1 -= 1.3 + scrollVelocity;
                const half1 = track1.scrollWidth / 2;
                if (Math.abs(pos1) >= half1) pos1 += half1;
                track1.style.transform = `translateX(${pos1}px)`;
            }

            if (track2) {
                pos2 += 1.1 + scrollVelocity;
                const half2 = track2.scrollWidth / 2;
                if (pos2 >= half2) pos2 -= half2;
                track2.style.transform = `translateX(${pos2}px)`;
            }

            requestAnimationFrame(animateMarquee);
        }

        animateMarquee();
    }

    // ── GENERIC SCROLL REVEALS (ABOUT & CONTACT) ───────────────
    function initGenericScrollReveals() {
        if (typeof ScrollTrigger === 'undefined') return;

        // About Polaroid & Text — with clearProps to ensure photo is 100% visible
        const about = document.getElementById('about');
        if (about) {
            gsap.from('.polaroid-wrapper', {
                scrollTrigger: {
                    trigger: about,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 35,
                scale: 0.92,
                opacity: 0,
                duration: 0.65,
                ease: 'back.out(1.4)',
                clearProps: 'all'
            });
            gsap.from('.about-text p, .about-info-grid, .about-ticker', {
                scrollTrigger: {
                    trigger: about,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 25,
                opacity: 0,
                stagger: 0.08,
                duration: 0.5,
                ease: 'power2.out',
                clearProps: 'all'
            });
        }

        // Contact Section
        const contact = document.getElementById('contact');
        if (contact) {
            gsap.from('#contact .contact-info > *, #contact .contact-form', {
                scrollTrigger: {
                    trigger: contact,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 30,
                opacity: 0,
                stagger: 0.08,
                duration: 0.5,
                ease: 'power2.out',
                clearProps: 'all'
            });
        }
    }

    // ── FOOTER TYPING EFFECT ───────────────────────────────────
    function initFooterTyping() {
        const el = document.getElementById('footer-typing');
        if (!el) return;
        const text = '© 2026 Evreki Wan Refanja. Spider-Man NeoBrutalism.';
        let started = false;

        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting && !started) {
                    started = true;
                    let i = 0;
                    const iv = setInterval(() => {
                        el.textContent = text.slice(0, ++i);
                        if (i >= text.length) clearInterval(iv);
                    }, 35);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.3 });
        obs.observe(el);
    }

    return {
        init: init,
        triggerHeroEntrance: triggerHeroEntrance
    };
})();
