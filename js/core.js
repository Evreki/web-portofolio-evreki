/**
 * PORTFOLIO — CORE & SMOOTH SCROLL (LENIS + GSAP)
 * Evreki Wan Refanja
 */

'use strict';

window.AppCore = (function () {
    let lenis = null;

    function initLenis() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Phones & tablets: native scrolling is the smoothest there (it runs off the main thread)
        const isTouch = window.matchMedia('(pointer: coarse)').matches;
        if (prefersReducedMotion || isTouch || typeof Lenis === 'undefined') {
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
            initNativeAnchors();
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
            return;
        }
        // native fallback that still honours `offset` and `immediate`
        let top = 0;
        if (typeof target === 'number') {
            top = target;
        } else {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (!el) return;
            top = el.getBoundingClientRect().top + window.scrollY;
        }
        window.scrollTo({ top: Math.max(0, top + (options.offset || 0)), behavior: options.immediate ? 'auto' : 'smooth' });
    }

    // In-page links without Lenis: smooth native scroll that clears the fixed top bar
    function initNativeAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                const id = anchor.getAttribute('href');
                if (!id || id === '#') return;
                const el = document.querySelector(id);
                if (!el) return;
                e.preventDefault();
                scrollTo(el, { offset: -64 });
            });
        });
    }

    return {
        init: initLenis,
        stop: stopScroll,
        start: startScroll,
        scrollTo: scrollTo,
        getLenis: () => lenis
    };
})();
