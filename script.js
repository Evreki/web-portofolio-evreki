/**
 * PORTFOLIO — MAIN ENTRY (script.js)
 * Evreki Wan Refanja — Creative Developer & Software Engineer
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Initialize Core Smooth Scrolling & GSAP integration
    if (window.AppCore) {
        window.AppCore.init();
    }

    // 3. Initialize the profile banner animation (Three.js)
    if (window.AppBanner) {
        window.AppBanner.init();
    }

    // 4. Initialize GSAP Animation Timelines & ScrollTriggers
    if (window.AppAnimations) {
        window.AppAnimations.init();
    }

    // 5. Initialize Micro-Interactions (Cursor, Audio, Tilt, Magnet, Stickers, Toast)
    if (window.AppInteractions) {
        window.AppInteractions.init();
    }

    // 5b. Radial sidebar (rotatable section dial)
    if (window.AppRadialNav) {
        window.AppRadialNav.init();
    }

    // 6. Initialize Swiper.js Showcases (Projects & Certificates)
    if (window.AppProjects) {
        window.AppProjects.init();
    }

    // 7. Initialize Project Modal & Fullscreen Lightbox
    if (window.AppModal) {
        window.AppModal.init();
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
    window.AppBarbaHook = {
        beforeEnter: () => {
            if (window.AppCore) window.AppCore.stop();
        },
        afterEnter: () => {
            if (window.AppCore) {
                window.AppCore.start();
                window.AppCore.scrollTo(0, { immediate: true });
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
