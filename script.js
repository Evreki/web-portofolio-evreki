// Initialize Lucide Icons
lucide.createIcons();

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
