/**
 * PORTFOLIO — MODAL & LIGHTBOX SYSTEM
 * Evreki Wan Refanja
 */

'use strict';

window.AppModal = (function () {
    const modal      = document.getElementById('project-modal');
    const overlay    = document.getElementById('modal-overlay');
    const modalBox   = document.querySelector('.modal-box');
    const closeBtn   = document.getElementById('modal-close');
    const dismissBtn = document.getElementById('modal-dismiss');
    const catEl      = document.getElementById('modal-category');
    const titleEl    = document.getElementById('modal-title');
    const descEl     = document.getElementById('modal-desc');
    const techEl     = document.getElementById('modal-tech');
    const linkEl     = document.getElementById('modal-link');
    const track      = document.getElementById('modal-gallery-track');
    const dotsEl     = document.getElementById('gallery-dots');
    const counterEl  = document.getElementById('gallery-counter-text');
    const prevBtn    = document.getElementById('gallery-prev');
    const nextBtn    = document.getElementById('gallery-next');

    // Lightbox elements
    const lightbox   = document.getElementById('image-lightbox');
    const lbOverlay  = document.getElementById('lightbox-overlay');
    const lbClose    = document.getElementById('lightbox-close');
    const lbImg      = document.getElementById('lightbox-img');
    const lbCaption  = document.getElementById('lightbox-caption');

    let currentIdx = 0;
    let images = [];
    let projectTitle = '';

    function init() {
        if (!modal) return;

        // Open modal listener on all trigger buttons
        document.querySelectorAll('.open-modal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(btn);
            });
        });

        // Close events
        if (overlay) overlay.addEventListener('click', closeModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

        // Gallery navigation
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

        // Lightbox close events
        if (lbOverlay) lbOverlay.addEventListener('click', closeLightbox);
        if (lbClose) lbClose.addEventListener('click', closeLightbox);

        // Polaroid photo click to open in fullscreen lightbox
        const polaroid = document.querySelector('.polaroid-frame');
        if (polaroid) {
            polaroid.addEventListener('click', () => {
                const img = polaroid.querySelector('img');
                const src = img ? img.getAttribute('src') : 'foto/whoiam.jpeg';
                openLightbox(src, 'Evreki Wan Refanja, S.Kom — Bachelor of Informatics Engineering');
            });
        }

        // Keyboard handler
        document.addEventListener('keydown', handleKeydown);

        // Gallery touch swipe
        if (track) {
            let touchStartX = 0;
            track.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            track.addEventListener('touchend', e => {
                const diff = e.changedTouches[0].screenX - touchStartX;
                if (Math.abs(diff) > 40) {
                    if (diff < 0) nextImage();
                    else prevImage();
                }
            }, { passive: true });
        }
    }

    function openModal(btn) {
        projectTitle = btn.dataset.title || 'Mission File';
        images = (btn.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
        currentIdx = 0;

        if (catEl) catEl.textContent = btn.dataset.category || 'Mission Dossier';
        if (titleEl) titleEl.textContent = projectTitle;
        if (descEl) descEl.textContent = btn.dataset.desc || '';

        // Source code / demo link
        const link = btn.dataset.link || '';
        if (!link || link === '#') {
            if (linkEl) linkEl.style.display = 'none';
        } else {
            if (linkEl) {
                linkEl.style.display = 'inline-flex';
                linkEl.href = link;
                linkEl.innerHTML = link.includes('github.com')
                    ? '<i data-lucide="github"></i> View Mission Code'
                    : '<i data-lucide="external-link"></i> Launch Live System';
            }
        }

        // Tech stack tags
        if (techEl) {
            techEl.innerHTML = '';
            const colorClasses = ['badge-pink', 'badge-blue', 'badge-yellow', ''];
            (btn.dataset.tech || '').split(',').forEach((t, i) => {
                if (!t.trim()) return;
                const badge = document.createElement('span');
                badge.className = 'brutal-badge ' + (colorClasses[i % colorClasses.length] || '');
                badge.textContent = t.trim();
                techEl.appendChild(badge);
            });
        }

        buildGallery();

        // Lock background scroll
        if (window.AppCore) window.AppCore.stop();
        else document.body.style.overflow = 'hidden';

        modal.classList.add('modal-open');

        // GSAP entrance animation
        if (typeof gsap !== 'undefined' && modalBox) {
            gsap.fromTo(modalBox,
                { scale: 0.85, rotation: -2, opacity: 0, y: 30 },
                { scale: 1, rotation: 0, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
            );
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function buildGallery() {
        if (!track || !dotsEl) return;
        track.innerHTML = '';
        dotsEl.innerHTML = '';

        if (images.length === 0) {
            track.innerHTML = '<div class="modal-gallery-slide"><div class="no-img-placeholder">No screenshots available</div></div>';
            if (counterEl) counterEl.textContent = '0 / 0';
            return;
        }

        images.forEach((src, i) => {
            const slide = document.createElement('div');
            slide.className = 'modal-gallery-slide';

            const backdrop = document.createElement('img');
            backdrop.className = 'modal-slide-backdrop';
            backdrop.src = src;
            backdrop.setAttribute('aria-hidden', 'true');

            const img = document.createElement('img');
            img.className = 'modal-slide-img';
            img.src = src;
            img.alt = `${projectTitle} Screenshot ${i + 1}`;
            img.loading = i === 0 ? 'eager' : 'lazy';

            slide.appendChild(backdrop);
            slide.appendChild(img);

            // skeleton shimmer until the screenshot is loaded
            slide.classList.add('skeleton');
            const markLoaded = () => slide.classList.add('is-loaded');
            if (img.complete && img.naturalWidth > 0) markLoaded();
            else img.addEventListener('load', markLoaded);

            slide.addEventListener('click', () => {
                openLightbox(src, `${projectTitle} — [ ${i + 1} / ${images.length} ]`);
            });

            track.appendChild(slide);

            const dot = document.createElement('div');
            dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToImage(i);
            });
            dotsEl.appendChild(dot);
        });

        const isSingle = images.length <= 1;
        if (prevBtn) prevBtn.classList.toggle('hidden', isSingle);
        if (nextBtn) nextBtn.classList.toggle('hidden', isSingle);
        if (dotsEl) dotsEl.style.display = isSingle ? 'none' : 'flex';

        updateGalleryPosition();
    }

    function goToImage(index) {
        currentIdx = index;
        updateGalleryPosition();
    }

    function nextImage() {
        if (images.length <= 1) return;
        currentIdx = (currentIdx + 1) % images.length;
        updateGalleryPosition();
    }

    function prevImage() {
        if (images.length <= 1) return;
        currentIdx = (currentIdx - 1 + images.length) % images.length;
        updateGalleryPosition();
    }

    function updateGalleryPosition() {
        if (track) {
            track.style.transform = `translateX(${-currentIdx * 100}%)`;
        }
        if (dotsEl) {
            dotsEl.querySelectorAll('.gallery-dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIdx);
            });
        }
        if (counterEl) {
            counterEl.textContent = `${currentIdx + 1} / ${images.length}`;
        }
    }

    function closeModal() {
        closeLightbox();
        if (typeof gsap !== 'undefined' && modalBox) {
            gsap.to(modalBox, {
                scale: 0.9,
                opacity: 0,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: () => {
                    modal.classList.remove('modal-open');
                    if (window.AppCore) window.AppCore.start();
                    else document.body.style.overflow = '';
                    currentIdx = 0;
                }
            });
        } else {
            modal.classList.remove('modal-open');
            if (window.AppCore) window.AppCore.start();
            else document.body.style.overflow = '';
            currentIdx = 0;
        }
    }

    function openLightbox(src, caption) {
        if (!lightbox || !lbImg) return;
        lbImg.src = src;
        if (lbCaption) lbCaption.textContent = caption || '';
        lightbox.classList.add('lightbox-open');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('lightbox-open');
        if (lbImg) lbImg.src = '';
    }

    function handleKeydown(e) {
        if (lightbox && lightbox.classList.contains('lightbox-open')) {
            if (e.key === 'Escape') closeLightbox();
            return;
        }

        if (!modal || !modal.classList.contains('modal-open')) return;

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    }

    return {
        init: init,
        open: openModal,
        close: closeModal,
        openLightbox: openLightbox,
        closeLightbox: closeLightbox
    };
})();
