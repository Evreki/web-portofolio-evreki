/**
 * PORTFOLIO — GSAP & SCROLLTRIGGER ANIMATION SYSTEM
 * Evreki Wan Refanja
 */

'use strict';

window.AppAnimations = (function () {

    function init() {
        if (typeof gsap === 'undefined') return;

        initPreloader();
        initScrollProgress();
        initHeroAnimations();
        initSectionHeaders();
        initStatsCounter();
        initSkillsCounters();
        initTimelineAnimations();
        initExperienceAnimations();
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
            'Loading profile…',
            'Fetching experience…',
            'Loading projects…',
            'Almost there…',
            'Welcome!'
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
        const subLine = document.querySelector('.hero-subtitle-line') || document.querySelector('.hero-subtitle-badge');
        const social = document.querySelector('.social-links-hero');
        const btns = document.querySelector('.hero-btn-row');
        const words = document.querySelectorAll('.hero-title .hero-title-word');

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

        if (subLine) tl.from(subLine, { opacity: 0, x: 25, duration: 0.5, ease: 'power3.out', clearProps: 'all' }, '-=0.25');
        if (social) tl.from(social.querySelectorAll('.social-btn'), { scale: 0, opacity: 0, stagger: 0.06, duration: 0.35, ease: 'back.out(2)', clearProps: 'all' }, '-=0.2');
        if (btns) tl.from(btns.querySelectorAll('.brutal-btn'), { y: 30, opacity: 0, stagger: 0.1, duration: 0.45, ease: 'back.out(1.7)', clearProps: 'all' }, '-=0.15');
    }

    function initHeroAnimations() {
        const loader = document.getElementById('brutal-loader');
        if (!loader || loader.classList.contains('loader-hidden')) {
            setTimeout(triggerHeroEntrance, 300);
        }
        initTypedRole();

    }


    function initTypedRole() {
        const el = document.getElementById('typed-role');
        if (!el) return;
        const roles = ['Software Engineer', 'Fullstack Developer', 'Mobile & Web Developer', 'Problem Solver'];
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

        // transform-only + at most once per frame (no layout work while scrolling)
        let ticking = false;
        let total = 1;
        const measure = () => { total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); };
        measure();
        window.addEventListener('resize', measure, { passive: true });
        window.addEventListener('load', measure);
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.addEventListener('refresh', measure);

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                bar.style.setProperty('--progress', Math.min(window.scrollY / total, 1).toFixed(4));
                ticking = false;
            });
        }, { passive: true });
    }

    // ── SECTION HEADERS ────────────────────────────────────────
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

    // ── EDUCATION TIMELINE ─────────────────────────────────────
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

    // ── EXPERIENCE (WEB-THREAD SPIN + SWINGING LOGOS) ───────────
    // Different from the slide-in used elsewhere: the web thread is "spun"
    // down as you scroll (scrubbed), each company logo drops in and swings
    // on its strand, and the text is wiped in from the left.
    function initExperienceAnimations() {
        const section = document.getElementById('experience');
        if (!section || typeof ScrollTrigger === 'undefined') return;

        const list = section.querySelector('.exp-list');
        const fill = section.querySelector('.exp-thread-fill');
        const items = gsap.utils.toArray('#experience .exp-item');
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduce) {
            if (fill) fill.style.transform = 'scaleY(1)';
            return;
        }

        if (fill && list) {
            gsap.to(fill, {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: list,
                    start: 'top 70%',
                    end: 'bottom 60%',
                    scrub: 0.6
                }
            });
        }

        items.forEach(item => {
            const logo = item.querySelector('.exp-logo');
            const body = item.querySelector('.exp-body');
            const bits = item.querySelectorAll('.exp-points li, .exp-chip');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 78%',
                    toggleActions: 'play none none none',
                    onEnter: () => item.classList.add('is-active'),
                    onLeaveBack: () => item.classList.remove('is-active')
                }
            });

            if (logo) {
                tl.from(logo, { y: -70, rotation: -28, opacity: 0, duration: 1.1, ease: 'elastic.out(1, 0.45)', clearProps: 'transform,opacity' });
            }
            if (body) {
                tl.fromTo(body,
                    { clipPath: 'inset(0 100% 0 0)', opacity: 0.2 },
                    { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'clipPath,opacity' },
                    '-=0.85');
            }
            if (bits.length) {
                tl.from(bits, { x: -14, opacity: 0, stagger: 0.05, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' }, '-=0.35');
            }
        });
    }

    // ── MARQUEE SPEED & ACCELERATION ────────────────────────────
    function initMarquees() {
        const track1 = document.querySelector('.marquee-content');
        const track2 = document.querySelector('.marquee-content-reverse');
        if (!track1 && !track2) return; // no marquees on the page: don't run an empty loop every frame
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

        // Every profile card rises in softly as it enters (LinkedIn feed feel)
        gsap.utils.toArray('.page-main > .li-card:not(.profile-card), .page-aside > .li-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' },
                y: 32,
                scale: 0.985,
                opacity: 0,
                duration: 0.75,
                ease: 'expo.out',
                clearProps: 'transform,opacity'
            });
        });

        // Project & certificate cards: deal in one after another, like cards on a table
        ['.project-card', '.cert-card'].forEach(sel => {
            gsap.set(sel, { opacity: 0, y: 26, rotation: -1.5 });
            ScrollTrigger.batch(sel, {
                start: 'top 90%',
                once: true,
                onEnter: batch => gsap.to(batch, {
                    opacity: 1, y: 0, rotation: 0,
                    duration: 0.7, stagger: 0.09, ease: 'back.out(1.4)',
                    clearProps: 'transform,opacity'
                })
            });
        });

        // Photo in About: a slow, cinematic reveal
        const photo = document.querySelector('.about-photo');
        if (photo) {
            gsap.fromTo(photo,
                { clipPath: 'inset(12% 12% 12% 12% round 10px)', opacity: 0 },
                {
                    clipPath: 'inset(0% 0% 0% 0% round 10px)', opacity: 1,
                    duration: 1.1, ease: 'expo.out', clearProps: 'clipPath,opacity',
                    scrollTrigger: { trigger: photo, start: 'top 88%', once: true }
                });
            const img = photo.querySelector('img');
            if (img) {
                gsap.fromTo(img, { scale: 1.12 }, {
                    scale: 1, duration: 1.4, ease: 'expo.out', clearProps: 'transform',
                    scrollTrigger: { trigger: photo, start: 'top 88%', once: true }
                });
            }
        }

        const about = document.getElementById('about');
        if (about) {
            gsap.from('#about .about-text p, #about .about-top-skills, #about .about-ticker', {
                scrollTrigger: { trigger: about, start: 'top 85%', toggleActions: 'play none none none' },
                y: 18,
                opacity: 0,
                stagger: 0.08,
                duration: 0.5,
                ease: 'power2.out',
                clearProps: 'all'
            });
        }

        const contact = document.getElementById('contact');
        if (contact) {
            gsap.from('#contact .contact-info-card > *, #contact .contact-form > .input-group, #contact .contact-submit-btn', {
                scrollTrigger: { trigger: contact, start: 'top 85%', toggleActions: 'play none none none' },
                y: 20,
                opacity: 0,
                stagger: 0.06,
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
        const text = '© ' + new Date().getFullYear() + ' Evreki Wan Refanja · Software Engineer · Bandung, Indonesia';
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
