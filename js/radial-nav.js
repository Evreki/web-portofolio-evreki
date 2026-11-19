/**
 * RADIAL SIDEBAR: rotatable section dial
 * Evreki Wan Refanja
 *
 * - Section icons sit on a circle on the left edge; the wheel rotates so
 *   the focused item points right, next to the label.
 * - Rotate with the mouse wheel, by dragging (mouse or touch), or with the
 *   arrow keys. Click an icon or the label to jump to that section.
 * - While you scroll the page, the dial turns to the section you're reading.
 */

'use strict';

window.AppRadialNav = (function () {
    let nav, dial, items, label, labelText, hub;
    let N = 0, STEP = 0;
    let rot = 0;                // current rotation in degrees (continuous)
    let focusIdx = 0;
    let lastUserAction = 0;     // pauses scroll-spy right after the user turns the dial
    let wheelAcc = 0;
    let introTween = null;

    const WIDE = () => window.innerWidth >= 1360;

    function init() {
        nav = document.getElementById('radial-nav');
        if (!nav) return;
        dial = document.getElementById('radial-dial');
        items = [...nav.querySelectorAll('.radial-item')];
        label = document.getElementById('radial-label');
        labelText = label && label.querySelector('.radial-label-text');
        hub = document.getElementById('radial-hub');
        N = items.length;
        STEP = 360 / N;
        nav.style.setProperty('--step', `${STEP}deg`);

        setOpen(WIDE(), false);
        setRot(0);

        items.forEach((item, i) => {
            item.addEventListener('click', e => {
                e.preventDefault();
                if (dragMoved) return;      // it was a drag, not a click
                touched();
                rotateTo(i);
                go(i);
            });
            item.addEventListener('focus', () => { touched(); rotateTo(i); });
        });

        if (label) label.addEventListener('click', () => go(focusIdx));
        if (hub) hub.addEventListener('click', () => setOpen(nav.classList.contains('is-closed'), true));

        dial.addEventListener('wheel', onWheel, { passive: false });
        initDrag();
        initKeys();
        initScrollSpy();
        entrance();

        window.addEventListener('resize', () => {
            if (WIDE() && nav.classList.contains('is-closed') && !nav.dataset.userClosed) setOpen(true, false);
        }, { passive: true });
    }

    // ── state helpers ──────────────────────────────────────────
    function touched() { lastUserAction = Date.now(); }

    function setRot(deg) {
        rot = deg;
        if (introTween) { introTween.kill(); introTween = null; }
        nav.style.setProperty('--rot', `${rot}deg`);
        const idx = ((Math.round(-rot / STEP) % N) + N) % N;
        if (idx !== focusIdx || !items[idx].classList.contains('is-focus')) setFocus(idx);
    }

    function setFocus(idx) {
        focusIdx = idx;
        items.forEach((it, i) => it.classList.toggle('is-focus', i === idx));
        if (labelText) {
            labelText.textContent = items[idx].dataset.label;
            label.classList.remove('is-swap');
            void label.offsetWidth;
            label.classList.add('is-swap');
        }
        nav.classList.add('show-label');
        clearTimeout(setFocus.t);
        setFocus.t = setTimeout(() => nav.classList.remove('show-label'), 1800);
    }

    // rotate the shortest way so item `i` sits on the pointer
    function rotateTo(i) {
        let target = -i * STEP;
        while (target - rot > 180) target -= 360;
        while (target - rot < -180) target += 360;
        setRot(target);
    }

    function snap() {
        setRot(Math.round(rot / STEP) * STEP);
    }

    function go(i) {
        const target = document.querySelector(items[i].dataset.target);
        if (!target) return;
        const offset = target.id === 'hero-section' ? -120 : -72;
        if (window.AppCore) window.AppCore.scrollTo(target, { offset, duration: 1.2 });
        else target.scrollIntoView({ behavior: 'smooth' });
        if (!WIDE()) setTimeout(() => setOpen(false, false), 450);
    }

    function setOpen(open, byUser) {
        nav.classList.toggle('is-closed', !open);
        if (hub) hub.setAttribute('aria-expanded', String(open));
        if (byUser) {
            if (open) delete nav.dataset.userClosed;
            else nav.dataset.userClosed = '1';
        }
        if (open && byUser && typeof gsap !== 'undefined') {
            gsap.fromTo(items.map(it => it.firstElementChild),
                { opacity: 0 },
                { opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out', clearProps: 'opacity' });
        }
    }

    // ── mouse wheel: one notch = one item ─────────────────────
    function onWheel(e) {
        e.preventDefault();
        e.stopPropagation();
        touched();
        wheelAcc += e.deltaY || e.deltaX;
        if (Math.abs(wheelAcc) < 40) return;
        const dir = wheelAcc > 0 ? 1 : -1;
        wheelAcc = 0;
        setRot(Math.round(rot / STEP) * STEP - dir * STEP);
    }

    // ── drag to spin (pointer events: mouse + touch) ───────────
    let dragMoved = false;
    function initDrag() {
        let dragging = false, startAngle = 0, startRot = 0, center = null, travelled = 0, lastAngle = 0;

        const angleAt = (x, y) => Math.atan2(y - center.y, x - center.x) * 180 / Math.PI;

        dial.addEventListener('pointerdown', e => {
            if (e.button !== undefined && e.button !== 0) return;
            const r = dial.getBoundingClientRect();
            center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            dragging = true;
            dragMoved = false;
            travelled = 0;
            startAngle = lastAngle = angleAt(e.clientX, e.clientY);
            startRot = rot;
        });

        dial.addEventListener('pointermove', e => {
            if (!dragging) return;
            const a = angleAt(e.clientX, e.clientY);
            let d = a - lastAngle;
            if (d > 180) d -= 360;
            if (d < -180) d += 360;
            travelled += Math.abs(d);
            lastAngle = a;
            if (travelled > 4) {
                if (!dragMoved && dial.setPointerCapture) { try { dial.setPointerCapture(e.pointerId); } catch (err) {} }
                dragMoved = true;
                dial.classList.add('is-dragging');
                touched();
                let total = a - startAngle;
                while (total > 180) total -= 360;
                while (total < -180) total += 360;
                setRot(startRot + total);
                startRot = rot;
                startAngle = a;
            }
        });

        const end = () => {
            if (!dragging) return;
            dragging = false;
            dial.classList.remove('is-dragging');
            if (dragMoved) snap();
            setTimeout(() => { dragMoved = false; }, 0);
        };
        dial.addEventListener('pointerup', end);
        dial.addEventListener('pointercancel', end);
        dial.addEventListener('lostpointercapture', end);
        window.addEventListener('pointerup', end);
    }

    // ── keyboard ───────────────────────────────────────────────
    function initKeys() {
        nav.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault(); touched();
                setRot(Math.round(rot / STEP) * STEP - STEP);
                items[focusIdx].focus({ preventScroll: true });
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault(); touched();
                setRot(Math.round(rot / STEP) * STEP + STEP);
                items[focusIdx].focus({ preventScroll: true });
            } else if (e.key === 'Escape' && !WIDE()) {
                setOpen(false, true);
            }
        });
    }

    // ── scroll-spy: turn the dial to the section on screen ─────
    function initScrollSpy() {
        if (!('IntersectionObserver' in window)) return;
        const map = new Map();
        items.forEach((it, i) => {
            const sec = document.querySelector(it.dataset.target);
            if (sec) map.set(sec, i);
        });
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const i = map.get(entry.target);
                items.forEach((it, k) => it.classList.toggle('is-current', k === i));
                if (Date.now() - lastUserAction > 1600) rotateTo(i);
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        map.forEach((_, sec) => io.observe(sec));
    }

    // ── entrance: the dial spins in after the preloader ────────
    function entrance() {
        if (typeof gsap === 'undefined' || nav.classList.contains('is-closed')) return;
        const run = () => {
            const proxy = { r: rot - 160 };
            introTween = gsap.to(proxy, { r: rot, duration: 1.4, ease: 'power3.out', onUpdate: () => nav.style.setProperty('--rot', `${proxy.r}deg`), onComplete: () => setRot(rot) });
            gsap.from(dial, { scale: 0.5, opacity: 0, duration: 0.9, ease: 'back.out(1.4)', clearProps: 'transform,opacity' });
            gsap.from(items.map(it => it.firstElementChild), { opacity: 0, duration: 0.5, stagger: 0.06, delay: 0.3, clearProps: 'opacity' });
        };
        const loader = document.getElementById('brutal-loader');
        if (loader && getComputedStyle(loader).display !== 'none') {
            const mo = new MutationObserver(() => {
                if (loader.style.display === 'none') { mo.disconnect(); run(); }
            });
            mo.observe(loader, { attributes: true, attributeFilter: ['style'] });
        } else run();
    }

    return { init };
})();
