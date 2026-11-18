/**
 * SPIDER-MAN NEOBRUTALISM PORTFOLIO — PROJECTS & CERTIFICATES (SWIPER.JS)
 * Evreki Wan Refanja
 */

'use strict';

window.SpiderProjects = (function () {
    let projectsSwiper = null;
    let certsSwiper = null;

    function init() {
        initProjectsSwiper();
        initCertificatesSwiper();
    }

    function initProjectsSwiper() {
        const container = document.querySelector('.projects-swiper');
        if (!container || typeof Swiper === 'undefined') return;

        projectsSwiper = new Swiper('.projects-swiper', {
            slidesPerView: 1,
            spaceBetween: 16,
            speed: 600,
            grabCursor: true,
            keyboard: {
                enabled: true,
                onlyInViewport: true
            },
            navigation: {
                nextEl: '.project-nav-next',
                prevEl: '.project-nav-prev'
            },
            pagination: {
                el: '.projects-pagination',
                clickable: true,
                renderBullet: function (index, className) {
                    return `<span class="${className}">0${index + 1}</span>`;
                }
            },
            // breakpoints follow the card's width, not the window (the main column is narrow)
            breakpointsBase: 'container',
            breakpoints: {
                0:   { slidesPerView: 1.08, spaceBetween: 12 },
                480: { slidesPerView: 1.6,  spaceBetween: 14 },
                640: { slidesPerView: 2.15, spaceBetween: 16 }
            }
        });
    }

    function initCertificatesSwiper() {
        const container = document.querySelector('.certs-swiper');
        if (!container || typeof Swiper === 'undefined') return;

        certsSwiper = new Swiper('.certs-swiper', {
            slidesPerView: 1,
            spaceBetween: 16,
            speed: 500,
            grabCursor: true,
            navigation: {
                nextEl: '.cert-nav-next',
                prevEl: '.cert-nav-prev'
            },
            breakpointsBase: 'container',
            breakpoints: {
                0:   { slidesPerView: 1.15, spaceBetween: 12 },
                480: { slidesPerView: 2,    spaceBetween: 14 },
                640: { slidesPerView: 2.6,  spaceBetween: 16 }
            }
        });
    }

    return {
        init: init,
        getProjectsSwiper: () => projectsSwiper,
        getCertsSwiper: () => certsSwiper
    };
})();
