// Initialize Lucide Icons — after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

// Mobile Hamburger Menu (basic toggle functionality)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if(hamburger) {
    hamburger.addEventListener('click', () => {
        // Simple toggle for mobile nav
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.backgroundColor = 'var(--bg)';
            navLinks.style.borderBottom = 'var(--border-width) solid var(--border-color)';
            navLinks.style.padding = '20px';
        }
    });
}

// VELOCITY SCROLL MARQUEE
const marqueeContent = document.querySelector('.marquee-content');
let scrollXPos = 0;
let lastScrollY = window.scrollY;
let velocity = 0;
const baseSpeed = 1.5; // Normal speed

function animateMarquee() {
    // Calculate scroll velocity
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Add absolute scroll delta to velocity (so it speeds up regardless of scroll direction)
    velocity += Math.abs(deltaY) * 0.15;

    // Apply friction (decays velocity back to 0 smoothly)
    velocity *= 0.9;

    // Update scroll position
    scrollXPos -= (baseSpeed + velocity);

    // Reset for infinite loop
    // Assuming the duplicate makes up exactly half the scrollWidth
    const resetWidth = marqueeContent.scrollWidth / 2;
    if (Math.abs(scrollXPos) >= resetWidth) {
        scrollXPos += resetWidth;
    }

    marqueeContent.style.transform = `translateX(${scrollXPos}px)`;
    requestAnimationFrame(animateMarquee);
}

if (marqueeContent) {
    animateMarquee();
}

// REVEAL ON SCROLL ANIMATION
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            
            // IF TARGET HAS PROGRESS BARS, ANIMATE THEM!
            const bars = entry.target.querySelectorAll('.progress-fill');
            if (bars.length > 0) {
                setTimeout(() => {
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }, 300); // Slight delay for dramatic effect
            }

            // IF TARGET HAS SKILL COUNTERS, ANIMATE THEM!
            const counters = entry.target.querySelectorAll('.skill-percent');
            if (counters.length > 0) {
                setTimeout(() => {
                    counters.forEach(c => {
                        if (typeof animateCounter === 'function') animateCounter(c);
                    });
                }, 350);
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with .reveal-element
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-element');
    revealElements.forEach(el => observer.observe(el));
});


// ================= BRUTAL PRELOADER =================
window.addEventListener('load', () => {
    const loader = document.getElementById('brutal-loader');
    
    // Tahan minimal 1.5 detik agar pengunjung menikmati animasinya
    setTimeout(() => {
        if(loader) {
            loader.classList.add('loader-hidden');
            
            // Hapus dari DOM setelah animasi slide-up selesai (0.6s)
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }
    }, 1500);
});

// ================= CUSTOM CURSOR =================
const cursor = document.querySelector('.brutal-cursor');
if (cursor && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        // We use pageX and pageY instead of clientX to prevent scroll glitching
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });

    const clickables = document.querySelectorAll('a, button');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
}

// ================= PARALLAX GEOMETRIC SHAPES =================
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.geo-shape');
    if (shapes.length > 0) {
        // Calculate offset based on mouse position relative to center of screen
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;

        shapes.forEach((shape) => {
            // Circle moves opposite to square
            const speed = shape.classList.contains('geo-circle') ? 1.5 : -2;
            shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    }
});


// =================================================================================
// VISUAL UPGRADE — TASKS 2–7
// =================================================================================

// ================= GLOBAL PARTICLE SYSTEM =================
// Injects floating particles into every section + hero
(function() {
    const COLORS = ['var(--primary)', 'var(--accent)', 'var(--danger)', 'var(--secondary)'];
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const COUNT_DESKTOP = 8;
    const COUNT_MOBILE  = 4;

    // Sections to inject particles into
    const targets = document.querySelectorAll('.hero, .section');

    targets.forEach(section => {
        // Make sure section has position relative for absolute children
        const pos = window.getComputedStyle(section).position;
        if (pos === 'static') section.style.position = 'relative';

        // Only clip overflow on sections where it's safe
        // (skip about & journey which have polaroid/timeline elements that intentionally overflow)
        const id = section.id || '';
        const isSafeToClip = !['about', 'journey'].includes(id) && !section.classList.contains('hero');
        if (isSafeToClip) {
            section.style.overflow = 'hidden';
        }

        const count = isMobile ? COUNT_MOBILE : COUNT_DESKTOP;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';

            // Random size 8–22px
            const size = Math.floor(Math.random() * 15) + 8;
            // Random shape: 0=square, 1=circle, 2=diamond (square rotated)
            const shape = Math.floor(Math.random() * 3);
            const borderRadius = shape === 1 ? '50%' : '0';

            // Random position within section
            const top  = Math.floor(Math.random() * 90) + 2;   // 2%–92%
            const left = Math.floor(Math.random() * 88) + 2;   // 2%–90%

            // Random color
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];

            // Random animation duration 5s–11s, random delay 0–5s
            const duration = (Math.random() * 6 + 5).toFixed(1);
            const delay    = (Math.random() * 5).toFixed(1);

            p.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                top: ${top}%;
                left: ${left}%;
                background: ${color};
                border-radius: ${borderRadius};
                animation-duration: ${duration}s;
                animation-delay: -${delay}s;
                ${shape === 2 ? 'transform: rotate(45deg);' : ''}
            `;

            section.appendChild(p);
        }
    });
})();

// ================= HERO TYPED ROLE ANIMATION =================
(function() {
    const el = document.getElementById('typed-role');
    if (!el) return;

    const roles = ['SOFTWARE ENGINEER', 'WEB DEVELOPER', 'MOBILE DEVELOPER', 'FULLSTACK DEV'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed   = 80;   // ms per character typed
    const deleteSpeed = 40;   // ms per character deleted
    const pauseAfter  = 1800; // ms pause at end of word

    function tick() {
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            // Typing forward
            el.textContent = currentRole.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                // Finished typing — pause then start deleting
                isDeleting = true;
                setTimeout(tick, pauseAfter);
                return;
            }
        } else {
            // Deleting
            el.textContent = currentRole.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                // Finished deleting — move to next role
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }

        setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
    }

    // Start after a short delay so the hero reveal animation completes first
    setTimeout(tick, 1200);
})();

// ================= TASK 2: NAVBAR SCROLL SHADOW =================
(function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
})();

// ================= TASK 2: SECTION HEADER UNDERLINE =================
// The underline triggers when the section-header itself becomes visible.
// Since section-headers are children of reveal-elements OR are reveal-elements themselves,
// we manually observe them too.
document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('.section-header');
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                headerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    headers.forEach(h => {
        // Only observe if not already wrapped in a reveal-element observer
        if (!h.classList.contains('reveal-element')) {
            headerObserver.observe(h);
        }
    });
});

// ================= TASK 3: PROJECT MODAL WITH GALLERY =================
(function() {
    const modal        = document.getElementById('project-modal');
    const overlay      = document.getElementById('modal-overlay');
    const closeBtn     = document.getElementById('modal-close');
    const modalTitle   = document.getElementById('modal-title');
    const modalDesc    = document.getElementById('modal-desc');
    const modalTech    = document.getElementById('modal-tech');
    const modalLink    = document.getElementById('modal-link');

    const galleryTrack   = document.getElementById('modal-gallery-track');
    const galleryDots    = document.getElementById('gallery-dots');
    const galleryCounter = document.getElementById('gallery-counter');
    const prevBtn        = document.getElementById('gallery-prev');
    const nextBtn        = document.getElementById('gallery-next');

    if (!modal) return;

    let currentIndex = 0;
    let images = [];

    function openModal(btn) {
        const title     = btn.dataset.title  || '';
        const desc      = btn.dataset.desc   || '';
        const imagesStr = btn.dataset.images || '';
        const tech      = btn.dataset.tech   || '';
        const link      = btn.dataset.link   || '#';

        images = imagesStr.split(',').map(s => s.trim()).filter(s => s);
        currentIndex = 0;

        modalTitle.textContent = title;
        modalDesc.textContent  = desc;
        modalLink.href         = link;

        // Build tech badges
        modalTech.innerHTML = '';
        tech.split(',').forEach(t => {
            const span = document.createElement('span');
            span.className = 'brutal-badge';
            span.textContent = t.trim();
            modalTech.appendChild(span);
        });

        // Build gallery
        buildGallery();

        modal.classList.add('modal-open');
        document.body.style.overflow = 'hidden';

        // Re-init lucide icons inside modal
        lucide.createIcons();
    }

    function buildGallery() {
        // Clear track
        galleryTrack.innerHTML = '';
        images.forEach((imgSrc, i) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Project image ${i + 1}`;
            img.loading = 'lazy';
            galleryTrack.appendChild(img);
        });

        // Build dots
        galleryDots.innerHTML = '';
        images.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'gallery-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            galleryDots.appendChild(dot);
        });

        // Hide nav/dots if only 1 image
        if (images.length <= 1) {
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
            galleryDots.style.display = 'none';
        } else {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
            galleryDots.style.display = 'flex';
        }

        updateGallery();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateGallery();
    }

    function updateGallery() {
        const offset = -currentIndex * 100;
        galleryTrack.style.transform = `translateX(${offset}%)`;

        // Update dots
        const dots = galleryDots.querySelectorAll('.gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Update counter
        galleryCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateGallery();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateGallery();
    }

    function closeModal() {
        modal.classList.remove('modal-open');
        document.body.style.overflow = '';
        currentIndex = 0;
    }

    // Open modal on button click
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn));
    });

    // Close on overlay click
    overlay.addEventListener('click', closeModal);

    // Close on X button
    closeBtn.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('modal-open')) return;
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Prev / Next
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Add cursor hovering
    if (window.matchMedia("(pointer: fine)").matches) {
        document.querySelectorAll('.open-modal-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => document.querySelector('.brutal-cursor')?.classList.add('hovering'));
            btn.addEventListener('mouseleave', () => document.querySelector('.brutal-cursor')?.classList.remove('hovering'));
        });
        [closeBtn, prevBtn, nextBtn].forEach(el => {
            el.addEventListener('mouseenter', () => document.querySelector('.brutal-cursor')?.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.querySelector('.brutal-cursor')?.classList.remove('hovering'));
        });
    }
})();

// ================= TASK 4: SKILL PERCENTAGE COUNTER =================
// Tag percentage spans with data-target so they can be animated by the observer.
// This runs before DOMContentLoaded fires the observer setup.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.skill-info').forEach(info => {
        const spans = info.querySelectorAll('span');
        if (spans.length >= 2) {
            const percentSpan = spans[spans.length - 1];
            const targetVal = parseInt(percentSpan.textContent, 10);
            if (!isNaN(targetVal)) {
                percentSpan.classList.add('skill-percent');
                percentSpan.dataset.target = targetVal;
                percentSpan.textContent = '0%';
            }
        }
    });
});

function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + '%';
        if (current >= target) clearInterval(interval);
    }, 30);
}

// ================= TASK 5: CERTIFICATES DRAG TO SCROLL =================
(function() {
    const slider = document.querySelector('.certificates-scroll');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('is-dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        e.preventDefault();
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('is-dragging');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('is-dragging');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });
})();

// ================= TASK 6: TEXTAREA CHAR COUNTER =================
(function() {
    const textarea  = document.getElementById('msg-textarea');
    const charCount = document.getElementById('char-count');
    if (!textarea || !charCount) return;

    textarea.addEventListener('input', () => {
        charCount.textContent = textarea.value.length;
    });
})();

// ================= TASK 6: BACK TO TOP =================
(function() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Cursor hover
    if (window.matchMedia("(pointer: fine)").matches) {
        btn.addEventListener('mouseenter', () => document.querySelector('.brutal-cursor')?.classList.add('hovering'));
        btn.addEventListener('mouseleave', () => document.querySelector('.brutal-cursor')?.classList.remove('hovering'));
    }
})();

// ================= TASK 6: FOOTER TYPING ANIMATION =================
(function() {
    const el = document.getElementById('footer-typing');
    if (!el) return;

    const fullText = '\u00A9 2026 Evreki Wan Refanja. Built with NeoBrutalism.';
    let started = false;

    function typeText() {
        let i = 0;
        el.textContent = '';
        const interval = setInterval(() => {
            el.textContent = fullText.slice(0, i + 1);
            i++;
            if (i >= fullText.length) {
                clearInterval(interval);
                // Remove blinking cursor after done
                el.style.cssText += '; ';
            }
        }, 40);
    }

    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                typeText();
                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    footerObserver.observe(el);
})();


// ================= SCROLLSPY: active nav link =================
(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        });
    }, {
        rootMargin: '-40% 0px -55% 0px', // fires when section is in the middle band of viewport
        threshold: 0
    });

    sections.forEach(s => spy.observe(s));
})();

// ================= 3D TILT on project cards =================
(function() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    // Only on devices with a fine pointer (mouse), skip touch/mobile
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const MAX_TILT  = 10;   // degrees
    const SCALE     = 1.03;
    const EASING    = 'cubic-bezier(0.22, 1, 0.36, 1)';

    cards.forEach(card => {
        card.style.transition = `transform 0.12s ${EASING}, box-shadow 0.12s ease`;
        card.style.willChange = 'transform';

        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;   // mouse X inside card
            const y      = e.clientY - rect.top;    // mouse Y inside card
            const cx     = rect.width  / 2;
            const cy     = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -MAX_TILT;  // tilt up/down
            const rotateY = ((x - cx) / cx) *  MAX_TILT;  // tilt left/right

            card.style.transform =
                `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${SCALE}) translate(-4px, -4px)`;
            card.style.boxShadow = `12px 12px 0 #000`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = `transform 0.4s ${EASING}, box-shadow 0.4s ease`;
            card.style.transform  = '';
            card.style.boxShadow  = '';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = `transform 0.12s ${EASING}, box-shadow 0.12s ease`;
        });
    });
})();

// ================= PROGRESS BAR: add .filled after animation =================
(function() {
    // Mark bars as filled after their width transition completes
    document.querySelectorAll('.progress-fill').forEach(bar => {
        bar.addEventListener('transitionend', () => {
            bar.classList.add('filled');
        });
    });
})();

// ================= CARD HOVER: preserve inline rotation =================
// Cards yang punya inline transform: rotate() — saat hover lift, rotation dipertahankan
(function() {
    document.querySelectorAll('.brutal-card').forEach(card => {
        const inlineTransform = card.style.transform; // e.g. "rotate(-1deg)"
        if (!inlineTransform || !inlineTransform.includes('rotate')) return;

        // Extract the rotate value to blend into hover state
        card.addEventListener('mouseenter', () => {
            card.style.transform = `translate(-4px, -4px) ${inlineTransform}`;
            card.style.boxShadow = '12px 12px 0 #000';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = inlineTransform;
            card.style.boxShadow = '';
        });
    });
})();
