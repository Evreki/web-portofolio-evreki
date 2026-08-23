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
                    return `<span class="${className}">ISSUE #00${index + 1}</span>`;
                }
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 16
                },
                680: {
                    slidesPerView: 1.4,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 2.2,
                    spaceBetween: 24
                },
                1240: {
                    slidesPerView: 3,
                    spaceBetween: 28
                }
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
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 16
                },
                580: {
                    slidesPerView: 1.8,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 2.8,
                    spaceBetween: 24
                },
                1240: {
                    slidesPerView: 4,
                    spaceBetween: 24
                }
            }
        });
    }

    return {
        init: init,
        getProjectsSwiper: () => projectsSwiper,
        getCertsSwiper: () => certsSwiper
    };
})();
