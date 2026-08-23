/**
 * SPIDER-MAN NEOBRUTALISM PORTFOLIO — CORE & SMOOTH SCROLL (LENIS + GSAP)
 * Evreki Wan Refanja
 */

'use strict';

window.SpiderCore = (function () {
    let lenis = null;

    function initLenis() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || typeof Lenis === 'undefined') {
            document.documentElement.style.scrollBehavior = 'smooth';
            return;
        }

        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            infinite: false
        });

        // Sync Lenis with GSAP ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }

        // Handle internal anchor links with Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    lenis.scrollTo(targetEl, { offset: -60, duration: 1.4 });
                }
            });
        });
    }

    function stopScroll() {
        if (lenis) lenis.stop();
        document.body.style.overflow = 'hidden';
    }

    function startScroll() {
        if (lenis) lenis.start();
        document.body.style.overflow = '';
    }

    function scrollTo(target, options = {}) {
        if (lenis) {
            lenis.scrollTo(target, options);
        } else {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return {
        init: initLenis,
        stop: stopScroll,
        start: startScroll,
        scrollTo: scrollTo,
        getLenis: () => lenis
    };
})();
