// ========================================
// LOADING SCREEN
// ========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');

    // Hide loader after 2 seconds
    setTimeout(() => {
        loader.classList.add('hidden');

        // Start animations after loader is hidden
        setTimeout(() => {
            initScrollAnimations();
        }, 500);
    }, 2000);
});

// ========================================
// SCROLL ANIMATIONS (Slide from Left)
// ========================================
function initScrollAnimations() {
    const slideElements = document.querySelectorAll('.slide-left');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    slideElements.forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// SMOOTH SCROLL NAVIGATION
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// ACTIVE SECTION HIGHLIGHTING IN SIDEBAR
// ========================================
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-item');

function updateActiveSection() {
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === currentSection) {
            item.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveSection);

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTopBtn() {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', toggleScrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// CONTACT FORM HANDLING
// ========================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Create mailto link
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:evrekiwanrefanja@gmail.com?subject=${subject}&body=${body}`;

    // Open mail client
    window.location.href = mailtoLink;

    // Show success message
    showNotification('Thank you! Your default email client will open.', 'success');

    // Reset form
    contactForm.reset();
});

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 20px 30px;
        background: linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(255, 0, 255, 0.2));
        backdrop-filter: blur(15px);
        border: 1px solid rgba(0, 217, 255, 0.5);
        border-radius: 15px;
        color: white;
        font-weight: 600;
        box-shadow: 0 0 30px rgba(0, 217, 255, 0.5);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        max-width: 350px;
    `;
    notification.textContent = message;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 500);
    }, 4000);
}

// ========================================
// DYNAMIC GRADIENT BACKGROUND ANIMATION
// ========================================
function createFloatingParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;

    // Create 20 floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const colors = [
            'rgba(0, 217, 255, 0.3)',
            'rgba(255, 0, 255, 0.3)',
            'rgba(255, 255, 0, 0.3)',
            'rgba(0, 255, 127, 0.3)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            bottom: -10px;
            left: ${startX}%;
            animation: floatUp ${duration}s linear ${delay}s infinite;
            box-shadow: 0 0 10px ${color};
        `;

        particlesContainer.appendChild(particle);
    }

    // Add float animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            to {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(particlesContainer);
}

// Initialize particles
createFloatingParticles();

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Debounce scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            updateActiveSection();
            toggleScrollTopBtn();
        }, 10);
    }
}, { passive: true });

// ========================================
// CURSOR TRAIL EFFECT (OPTIONAL ENHANCEMENT)
// ========================================
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    // Don't add trail on mobile
    if (window.innerWidth < 768) return;

    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: linear-gradient(45deg, rgba(0, 217, 255, 0.5), rgba(255, 0, 255, 0.5));
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        transform: translate(-50%, -50%);
        animation: trailFade 0.8s ease-out forwards;
    `;

    document.body.appendChild(trail);
    cursorTrail.push(trail);

    // Limit trail length
    if (cursorTrail.length > maxTrailLength) {
        const oldTrail = cursorTrail.shift();
        oldTrail.remove();
    }

    // Remove after animation
    setTimeout(() => {
        trail.remove();
        const index = cursorTrail.indexOf(trail);
        if (index > -1) {
            cursorTrail.splice(index, 1);
        }
    }, 800);
});

// Add trail fade animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
        }
    }
`;
document.head.appendChild(trailStyle);

// ========================================
// CONSOLE MESSAGE (EASTER EGG)
// ========================================
console.log('%c👋 Hello There!', 'color: #00D9FF; font-size: 24px; font-weight: bold;');
console.log('%cYou found the developer console! 🎉', 'color: #FF00FF; font-size: 16px;');
console.log('%cImpressed with this portfolio?', 'color: #00FF7F; font-size: 14px;');
console.log('%cLet\'s connect: evrekiwanrefanja@gmail.com', 'color: #FFFF00; font-size: 14px;');

console.log('%c\n' +
    '███████╗██╗   ██╗██████╗ ███████╗██╗  ██╗██╗\n' +
    '██╔════╝██║   ██║██╔══██╗██╔════╝██║ ██╔╝██║\n' +
    '█████╗  ██║   ██║██████╔╝█████╗  █████╔╝ ██║\n' +
    '██╔══╝  ╚██╗ ██╔╝██╔══██╗██╔══╝  ██╔═██╗ ██║\n' +
    '███████╗ ╚████╔╝ ██║  ██║███████╗██║  ██╗██║\n' +
    '╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝\n',
    'color: #00D9FF; font-family: monospace;'
);

// ========================================
// ROTATING TEXT ANIMATION
// ========================================
window.addEventListener('load', () => {
    const rotatingText = document.getElementById('rotatingText');
    if (!rotatingText) return;

    const titles = ['Software Engineer', 'Mobile Developer', 'Full Stack Developer', 'Web Developer'];
    let currentIndex = 0;
    setInterval(() => {
        rotatingText.style.opacity = '0';
        rotatingText.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % titles.length;
            rotatingText.textContent = titles[currentIndex];
            rotatingText.style.opacity = '1';
        }, 300);
    }, 3000);
});

// ========================================
// IMAGE GALLERY MODAL  
// ========================================
const projectImages = {
    kknm: ['foto/Picture1.png', 'foto/Picture2.png', 'foto/Picture3.png', 'foto/Picture4.png', 'foto/Picture5.png'],
    flutter: ['foto/WhatsApp Image 2025-12-07 at 15.35.05_7f45f625.jpg', 'foto/WhatsApp Image 2025-12-07 at 15.35.05_b15b0462.jpg', 'foto/WhatsApp Image 2025-12-07 at 15.35.14_61830844.jpg']
};
let currentProject = '';
let currentSlideIndex = 0;

function openGallery(projectType) {
    currentProject = projectType;
    currentSlideIndex = 0;
    const modal = document.getElementById('galleryModal');
    const slidesContainer = document.getElementById('gallerySlides');
    slidesContainer.innerHTML = '';
    if (projectImages[projectType] && projectImages[projectType].length > 0) {
        const img = document.createElement('img');
        img.src = projectImages[projectType][0];
        img.alt = projectType + ' screenshot';
        slidesContainer.appendChild(img);
        updateGalleryCounter();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function changeSlide(direction) {
    const images = projectImages[currentProject];
    if (!images) return;
    currentSlideIndex += direction;
    if (currentSlideIndex < 0) currentSlideIndex = images.length - 1;
    else if (currentSlideIndex >= images.length) currentSlideIndex = 0;
    const slidesContainer = document.getElementById('gallerySlides');
    slidesContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = images[currentSlideIndex];
    img.alt = currentProject + ' screenshot ' + (currentSlideIndex + 1);
    slidesContainer.appendChild(img);
    updateGalleryCounter();
}

function updateGalleryCounter() {
    const counter = document.getElementById('galleryCounter');
    const images = projectImages[currentProject];
    if (images) counter.textContent = (currentSlideIndex + 1) + ' / ' + images.length;
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeGallery();
    const modal = document.getElementById('galleryModal');
    if (modal && modal.classList.contains('active')) {
        if (event.key === 'ArrowLeft') changeSlide(-1);
        else if (event.key === 'ArrowRight') changeSlide(1);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === this) closeGallery();
        });
    }
});

// ========================================
// 3D TILT EFFECT FOR PROFILE CARD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const profileCard = document.querySelector('.profile-card');

    if (profileCard) {
        // Mouse move - tilt effect
        profileCard.addEventListener('mousemove', (e) => {
            const rect = profileCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            profileCard.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.05, 1.05, 1.05)';
            profileCard.style.boxShadow = (rotateY * 2) + 'px ' + (rotateX * 2) + 'px 30px rgba(0, 217, 255, 0.4), 0 20px 60px rgba(0, 0, 0, 0.5)';
        });

        // Mouse leave - reset
        profileCard.addEventListener('mouseleave', () => {
            profileCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            profileCard.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.4), 0 20px 60px rgba(0, 0, 0, 0.5)';
        });

        // Touch support for mobile
        profileCard.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const rect = profileCard.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            profileCard.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.03, 1.03, 1.03)';
        });

        profileCard.addEventListener('touchend', () => {
            profileCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    }
});

