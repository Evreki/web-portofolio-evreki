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
