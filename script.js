/* =========================================
   SIMPLE & ROBUST JAVASCRIPT
   ========================================= */

// DOM Elements
const loader = document.getElementById('loader');
const cursorDot = document.querySelector('.cursor-dot'); // New
const cursorOutline = document.querySelector('.cursor-outline'); // New
const scrollProgress = document.querySelector('.scroll-progress'); // Changed selector

// --- 1. LOADER & INITIALIZATION ---
window.addEventListener('load', () => {
    // Lock scroll while loading
    document.body.style.overflow = 'hidden';

    // --- MAGNETIC BUTTONS (Universal Support) ---
    const magneticButtons = document.querySelectorAll('.btn, .social-icons a, .nav-links a');

    magneticButtons.forEach(btn => {
        // Desktop Mouse Interaction
        if (window.matchMedia('(hover: hover)').matches) {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transition = 'transform 0.1s ease-out';
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                btn.style.transform = 'translate(0px, 0px)';
            });
        }

        // Mobile Touch Interaction
        btn.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const rect = btn.getBoundingClientRect();
            // Calculate distance from center
            const x = touch.clientX - rect.left - rect.width / 2;
            const y = touch.clientY - rect.top - rect.height / 2;

            // Limit the magnetic pull on mobile to keep it contained
            // Only move if touch is relatively close/inside (touchmove fires even if outside if started inside)
            btn.style.transition = 'transform 0.1s ease-out';
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        }, { passive: true });

        btn.addEventListener('touchend', () => {
            btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- LOAD MORE CERTIFICATES ---
    const loadMoreBtn = document.getElementById('load-more-certs');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const hiddenCerts = document.querySelectorAll('.hidden-cert');
            hiddenCerts.forEach(cert => {
                cert.style.display = 'flex'; // Restore display flex (since it's a card)
                // Add fade-in animation
                cert.style.opacity = '0';
                cert.style.transform = 'translateY(20px)';
                cert.style.transition = 'all 0.5s ease';

                setTimeout(() => {
                    cert.style.opacity = '1';
                    cert.style.transform = 'translateY(0)';
                }, 50);
            });

            // Hide button after loading
            loadMoreBtn.style.display = 'none';
        });
    }

    // Scroll Progress Logic
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }
    });

    // Loader logic
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
            // Unlock scroll
            document.body.style.overflow = '';
        }
        // Trigger generic animations if needed
    }, 2000); // 2s visual duration
    // Check if device supports hover (Desktop)
    const isDesktop = window.matchMedia('(hover: hover)').matches;

    // --- NEON SCROLL PROGRESS (Works on all devices) ---
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (!scrollProgress) return;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / height) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });

    if (isDesktop) {
        // --- DESKTOP ONLY: SPOTLIGHT HOVER EFFECT ---
        const spotlightCards = document.querySelectorAll('.project-card, .skill-card');
        spotlightCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // (Magnetic Buttons moved to Universal block above)
    } // END DESKTOP ONLY BLOCK

    // --- 3D TILT EFFECT (Universal Support) ---
    const card = document.querySelector('.profile-card');
    const heroSection = document.querySelector('.hero-section');

    if (card && heroSection) {
        // Function to apply tilt
        const applyTilt = (cx, cy) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const x = cx - cardCenterX;
            const y = cy - cardCenterY;
            // Limit rotation on mobile to be subtle
            const divisor = window.innerWidth < 768 ? 20 : 15;
            const rotateY = x / divisor;
            const rotateX = -y / divisor;

            card.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };

        const resetTilt = () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        };

        // Desktop Interaction
        if (window.matchMedia('(hover: hover)').matches) {
            heroSection.addEventListener('mousemove', (e) => {
                applyTilt(e.clientX, e.clientY);
            });
            heroSection.addEventListener('mouseleave', resetTilt);
        }

        // Mobile Touch Interaction
        card.addEventListener('touchmove', (e) => {
            // Check if user is scrolling page (touch moving vertically fast? or multiple touches?)
            // We just allow it. 'passive: true' allows scroll.
            const touch = e.touches[0];
            applyTilt(touch.clientX, touch.clientY);
        }, { passive: true });

        card.addEventListener('touchend', resetTilt);
    }



    // --- CONSTELLATION BACKGROUND EFFECT (Optimized for Mobile) ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const particleCount = window.innerWidth < 768 ? 30 : 80; // Fewer on mobile
        const connectionDistance = 150;
        const color = 'rgba(52, 211, 153,'; // Mint base

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slow velocity
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }

            update(mouse) {
                // Move
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse repulsion
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const angle = Math.atan2(dy, dx);
                    const force = (150 - distance) / 150;
                    const repulsion = force * 2; // Strength

                    this.x -= Math.cos(angle) * repulsion;
                    this.y -= Math.sin(angle) * repulsion;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${color} 0.5)`;
                ctx.fill();
            }
        }

        // Init Particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Mouse Tracker
        let mouse = { x: -9999, y: -9999 };
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update(mouse);
                p.draw();
            });

            // Draw Connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `${color} ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- HACKER TEXT EFFECT (Matrix Decode) ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    const h1Element = document.querySelector(".hero-name");

    if (h1Element) {
        h1Element.dataset.value = h1Element.innerText; // Store original text

        h1Element.onmouseover = event => {
            let iterations = 0;

            const interval = setInterval(() => {
                event.target.innerText = event.target.innerText
                    .split("")
                    .map((letter, index) => {
                        if (index < iterations) {
                            return event.target.dataset.value[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iterations >= event.target.dataset.value.length) {
                    clearInterval(interval);
                }

                iterations += 1 / 3; // Speed of decoding
            }, 30);
        }
    }

    // --- Typewriter Logic ---
    const typewriterElement = document.getElementById('typewriter');
    const roles = ['Software Engineer', 'Mobile Developer', 'Full Stack Developer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimeout;

    function type() {
        if (!typewriterElement) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before start
        }

        typeTimeout = setTimeout(type, typeSpeed);
    }

    // Start typing
    if (typewriterElement) {
        typewriterElement.textContent = '';
        type();
    }

    // --- Reveal Animations on Scroll ---
    const revealElements = document.querySelectorAll('.reveal, section, .section-header, .about-grid, .project-card, .skill-category');

    // SAFE ANIMATION START: Only hide elements if JS is running
    revealElements.forEach(el => el.classList.add('reveal', 'pending')); // Force add reveal class to major blocks

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('pending');
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }); // Trigger slightly before enters view

    revealElements.forEach(el => revealObserver.observe(el));

    revealElements.forEach(el => revealObserver.observe(el));

    // Fallback removed to ensure true scroll-triggered animation.
    // The IntersectionObserver is robust enough.

    // --- Custom Cursor ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline) {
        // Move Listener
        window.addEventListener('mousemove', function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Effect Listeners (Replacing CSS Sibling Selectors)
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .btn, .nav-links a');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover-active');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover-active');
            });
        });
    }

    //* --- MOBILE BOTTOM NAVIGATION --- */
    const mobileNavItems = document.querySelectorAll('.mob-key');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function () {
            mobileNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Spy (Active Nav State) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.mobile-nav-item');

    const scrollSpyOptions = {
        root: null,
        rootMargin: '-30% 0px -30% 0px', // Focus on center 40% of screen
        threshold: 0
    };

    const scrollSpy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // Match href="#id"
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => scrollSpy.observe(section));

    // --- Image Modal ---
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeModal = document.querySelector(".close-modal");

    // Define images for each gallery
    const galleries = {
        'kknm': ['foto/Picture1.png', 'foto/Picture2.png', 'foto/Picture3.png', 'foto/Picture4.png', 'foto/Picture5.png'],
        'flutter': ['foto/WhatsApp Image 2025-12-07 at 15.35.05_7f45f625.jpg', 'foto/WhatsApp Image 2025-12-07 at 15.35.05_b15b0462.jpg', 'foto/WhatsApp Image 2025-12-07 at 15.35.14_61830844.jpg']
    };

    let currentGallery = [];
    let currentIndex = 0;

    // Open Modal Function (Global scope helper)
    window.openModal = function (galleryName) {
        if (!modal || !galleries[galleryName]) return;

        currentGallery = galleries[galleryName];
        currentIndex = 0;

        modal.style.display = "flex";
        showImage(currentIndex);
    }

    function showImage(index) {
        if (!modalImg) return;
        modalImg.src = currentGallery[index];
    }

    if (closeModal) {
        closeModal.onclick = function () {
            modal.style.display = "none";
        }
    }

    // Previous/Next Buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
        prevBtn.onclick = function () {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentGallery.length - 1;
            showImage(currentIndex);
        }
    }

    if (nextBtn) {
        nextBtn.onclick = function () {
            currentIndex = (currentIndex < currentGallery.length - 1) ? currentIndex + 1 : 0;
            showImage(currentIndex);
        }
    }

    // Close on outside click
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }






    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            window.location.href = `mailto:evrekiwanrefanja@gmail.com?subject=Contact from ${name}&body=${message}`;
        });
    }

    console.log("Portfolio Loaded Successfully 🌿");
});

// --- LOADER SAFETY FALLBACK ---
// Force loader to disappear after 5 seconds max, even if connection slow
setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
        console.warn("Loader timed out - forcing hidden");
        loader.classList.add('hidden');
    }
}, 5000);
