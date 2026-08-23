/**
 * SPIDER-MAN NEOBRUTALISM PORTFOLIO — MAIN ENTRY (script.js)
 * Evreki Wan Refanja — Creative Developer & Software Engineer
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Initialize Core Smooth Scrolling & GSAP integration
    if (window.SpiderCore) {
        window.SpiderCore.init();
    }

    // 3. Initialize Three.js 3D Spider-Web Hero Scene
    if (window.SpiderHeroThree) {
        window.SpiderHeroThree.init();
    }

    // 4. Initialize GSAP Animation Timelines & ScrollTriggers
    if (window.SpiderAnimations) {
        window.SpiderAnimations.init();
    }

    // 5. Initialize Micro-Interactions (Cursor, Audio, Tilt, Magnet, Stickers, Toast)
    if (window.SpiderInteractions) {
        window.SpiderInteractions.init();
    }

    // 6. Initialize Swiper.js Showcases (Projects & Certificates)
    if (window.SpiderProjects) {
        window.SpiderProjects.init();
    }

    // 7. Initialize Project Modal & Fullscreen Lightbox
    if (window.SpiderModal) {
        window.SpiderModal.init();
    }

    // 8. Initialize Dev Terminal Console
    if (window.SpiderTerminal) {
        window.SpiderTerminal.init();
    }

    // 9. Contact Message Character Counter & Form Feedback
    const msgInput = document.getElementById('msg-textarea');
    const charCounter = document.getElementById('char-count');
    if (msgInput && charCounter) {
        msgInput.addEventListener('input', () => {
            charCounter.textContent = msgInput.value.length;
        });
    }

    // 10. Barba.js Architectural Preparation Hook
    window.SpiderBarbaHook = {
        beforeEnter: () => {
            if (window.SpiderCore) window.SpiderCore.stop();
        },
        afterEnter: () => {
            if (window.SpiderCore) {
                window.SpiderCore.start();
                window.SpiderCore.scrollTo(0, { immediate: true });
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }
    };
});

// Refresh triggers when all images & fonts finish loading
window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
