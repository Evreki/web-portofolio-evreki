/**
 * SPIDER-MAN NEOBRUTALISM PORTFOLIO — THREE.JS REALISTIC ORB WEB (HERO BACKGROUND)
 * Evreki Wan Refanja
 *
 * Built like a real orb-weaver web:
 *  - irregular frame threads anchored off-screen
 *  - uneven radial spokes running from the hub to the frame
 *  - one continuous capture spiral whose threads sag between spokes
 *  - a dense, messy hub and an open "free zone" around it
 *  - thin silver silk with a travelling light glint, faint iridescence,
 *    tiny dew drops that twinkle, and a gentle wind sway
 */

'use strict';

window.SpiderHeroThree = (function () {
    let scene, camera, renderer, clock;
    let container, canvas;
    let webs = [];
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    let animId = null, isVisible = true;
    let width, height;

    function isWebGLAvailable() {
        try {
            const c = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    // Seeded random so the web looks the same on every visit
    function rng(seed) {
        let s = seed >>> 0;
        return () => {
            s = (s * 1664525 + 1013904223) >>> 0;
            return s / 4294967296;
        };
    }

    function init() {
        container = document.getElementById('hero-section');
        canvas = document.getElementById('hero-three-canvas');
        if (!container || !canvas || !isWebGLAvailable() || typeof THREE === 'undefined') return;

        clock = new THREE.Clock();
        width = container.offsetWidth;
        height = container.offsetHeight;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 85;

        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const isMobile = window.innerWidth < 768;
        const dew = makeDewTexture();

        // Main web (big, slightly right of centre) + an older, smaller web in the corner
        webs.push(buildOrbWeb({
            seed: 7, radius: isMobile ? 46 : 62, spokes: isMobile ? 26 : 34,
            center: new THREE.Vector3(isMobile ? 0 : 14, isMobile ? 6 : 4, 0),
            tilt: { x: -0.18, y: 0.22, z: 0.12 }, opacity: 0.36, dew, dewCount: isMobile ? 70 : 140
        }));
        webs.push(buildOrbWeb({
            seed: 21, radius: isMobile ? 18 : 24, spokes: 22,
            center: new THREE.Vector3(isMobile ? -30 : -62, isMobile ? -34 : -28, -18),
            tilt: { x: 0.3, y: -0.35, z: -0.4 }, opacity: 0.24, dew, dewCount: 30, broken: true
        }));

        webs.forEach(w => scene.add(w.group));

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible && !animId) animate();
            });
        }, { threshold: 0.05 });
        obs.observe(container);

        animate();
    }

    function makeDewTexture() {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d');
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.25, 'rgba(220,240,255,0.85)');
        grad.addColorStop(0.6, 'rgba(120,190,255,0.18)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
        const tex = new THREE.CanvasTexture(c);
        return tex;
    }

    // Point on a sagging thread between a and b (sag pulls toward the hub and back in z)
    function sagPoint(a, b, t, sag) {
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        const k = 4 * t * (1 - t); // parabola, 0 at the ends, 1 in the middle
        const len = Math.hypot(x, y) || 1;
        return new THREE.Vector3(x - (x / len) * sag * k, y - (y / len) * sag * k, (a.z + (b.z - a.z) * t) - sag * 0.6 * k);
    }

    function buildOrbWeb(opt) {
        const rand = rng(opt.seed);
        const R = opt.radius;
        const N = opt.spokes;

        const segs = [];     // flat list of [x,y,z, x,y,z] line segments
        const kinds = [];    // 0 = frame/spoke, 1 = spiral, 2 = hub
        const push = (a, b, kind) => { segs.push(a.x, a.y, a.z, b.x, b.y, b.z); kinds.push(kind, kind); };
        const pushCurve = (a, b, sag, steps, kind) => {
            let prev = a;
            for (let s = 1; s <= steps; s++) {
                const p = sagPoint(a, b, s / steps, sag);
                push(prev, p, kind);
                prev = p;
            }
        };

        // 1. Irregular frame polygon (where the spokes end)
        const frameCount = 7;
        const frame = [];
        for (let i = 0; i < frameCount; i++) {
            const a = (i / frameCount) * Math.PI * 2 + (rand() - 0.5) * 0.35;
            const r = R * (0.95 + rand() * 0.35);
            frame.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, (rand() - 0.5) * 6));
        }
        for (let i = 0; i < frameCount; i++) {
            const a = frame[i], b = frame[(i + 1) % frameCount];
            pushCurve(a, b, -1.2, 6, 0);
            // anchor threads running off to distant "branches"
            if (rand() > 0.35) {
                const far = a.clone().multiplyScalar(2.4 + rand());
                far.z -= 10;
                push(a, far, 0);
            }
        }

        // ray from the hub at angle `ang`, distance to the frame polygon
        function frameDist(ang) {
            const dx = Math.cos(ang), dy = Math.sin(ang);
            let best = R;
            for (let i = 0; i < frameCount; i++) {
                const a = frame[i], b = frame[(i + 1) % frameCount];
                const ex = b.x - a.x, ey = b.y - a.y;
                const den = dx * ey - dy * ex;
                if (Math.abs(den) < 1e-6) continue;
                const t = (a.x * ey - a.y * ex) / den;
                const u = (a.x * dy - a.y * dx) / den;
                if (t > 0 && u >= 0 && u <= 1) best = t;
            }
            return best;
        }

        // 2. Uneven radial spokes
        const angles = [];
        for (let i = 0; i < N; i++) angles.push((i / N) * Math.PI * 2 + (rand() - 0.5) * (Math.PI * 2 / N) * 0.55);
        const spokeLen = angles.map(frameDist);
        angles.forEach((a, i) => {
            const end = new THREE.Vector3(Math.cos(a) * spokeLen[i], Math.sin(a) * spokeLen[i], -2 - rand() * 3);
            if (opt.broken && rand() > 0.8) return; // a few missing spokes on the old web
            pushCurve(new THREE.Vector3(0, 0, 0), end, 0.25, 4, 0);
        });

        // 3. Continuous capture spiral, sagging between spokes
        const spiralPts = [];
        const rStart = R * 0.2, rEnd = 0.93;
        const turns = opt.broken ? 7 : 12;
        for (let k = 0; k <= turns * N; k++) {
            const i = k % N;
            const progress = k / (turns * N);
            const rr = rStart + (rEnd * spokeLen[i] - rStart) * Math.pow(progress, 0.92);
            spiralPts.push(new THREE.Vector3(Math.cos(angles[i]) * rr, Math.sin(angles[i]) * rr, -progress * 3));
        }
        for (let k = 1; k < spiralPts.length; k++) {
            const a = spiralPts[k - 1], b = spiralPts[k];
            if (opt.broken && rand() > 0.86) continue; // torn gaps
            const gap = a.distanceTo(b);
            pushCurve(a, b, gap * 0.09, 3, 1);
        }

        // 4. Messy hub: short irregular rings + criss-cross threads
        for (let ring = 1; ring <= 4; ring++) {
            const hr = R * 0.035 * ring;
            let prev = null;
            for (let i = 0; i <= N; i++) {
                const a = angles[i % N] + (i === N ? Math.PI * 2 : 0);
                const jr = hr * (0.8 + rand() * 0.4);
                const p = new THREE.Vector3(Math.cos(a) * jr, Math.sin(a) * jr, 0.3);
                if (prev) push(prev, p, 2);
                prev = p;
            }
        }
        for (let i = 0; i < 14; i++) {
            const a1 = rand() * Math.PI * 2, a2 = a1 + 1 + rand() * 2;
            const r1 = R * 0.04 * (1 + rand() * 2.5), r2 = R * 0.04 * (1 + rand() * 2.5);
            push(new THREE.Vector3(Math.cos(a1) * r1, Math.sin(a1) * r1, 0.4),
                 new THREE.Vector3(Math.cos(a2) * r2, Math.sin(a2) * r2, 0.4), 2);
        }

        // Geometry
        const base = new Float32Array(segs);
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segs), 3));
        const colors = new Float32Array(base.length);
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: opt.opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const lines = new THREE.LineSegments(geom, mat);

        // Dew drops: small glowing beads sitting on the spiral threads
        const dewIdx = [];
        const dewPos = new Float32Array(opt.dewCount * 3);
        const dewCol = new Float32Array(opt.dewCount * 3);
        const spiralVerts = [];
        for (let v = 0; v < kinds.length; v++) if (kinds[v] === 1) spiralVerts.push(v);
        for (let d = 0; d < opt.dewCount; d++) {
            dewIdx.push(spiralVerts[Math.floor(rand() * spiralVerts.length)]);
        }
        const dewGeom = new THREE.BufferGeometry();
        dewGeom.setAttribute('position', new THREE.BufferAttribute(dewPos, 3));
        dewGeom.setAttribute('color', new THREE.BufferAttribute(dewCol, 3));
        const dewMat = new THREE.PointsMaterial({
            size: 1.25,
            map: opt.dew,
            vertexColors: true,
            transparent: true,
            opacity: opt.opacity + 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });
        const dewPoints = new THREE.Points(dewGeom, dewMat);
        const dewPhase = dewIdx.map(() => rand() * Math.PI * 2);

        const group = new THREE.Group();
        group.add(lines);
        group.add(dewPoints);
        group.position.copy(opt.center);
        group.rotation.set(opt.tilt.x, opt.tilt.y, opt.tilt.z);

        return { group, geom, base, kinds, colors, R, dewIdx, dewGeom, dewPhase, tilt: opt.tilt, seed: opt.seed };
    }

    function updateWeb(w, t) {
        const pos = w.geom.attributes.position.array;
        const col = w.colors;
        const base = w.base;
        const R = w.R;

        // a slow beam of light sweeping around the web
        const glintAngle = t * 0.35 + w.seed;
        const windPhase = t * 0.9 + w.seed;

        for (let i = 0; i < base.length; i += 3) {
            const x = base[i], y = base[i + 1], z = base[i + 2];
            const r = Math.hypot(x, y);
            const nr = Math.min(1, r / R);

            // wind: the web billows in z, more toward the outside, and breathes slightly
            const sway = Math.sin(windPhase + x * 0.045) * Math.cos(windPhase * 0.7 + y * 0.05);
            pos[i] = x * (1 + Math.sin(windPhase * 0.6) * 0.004);
            pos[i + 1] = y + Math.sin(windPhase * 0.8 + x * 0.03) * 0.25 * nr;
            pos[i + 2] = z + sway * 2.2 * nr;

            // silk colour: silver, a glint where the light hits, faint rainbow sheen
            let ang = Math.atan2(y, x) - glintAngle;
            ang = Math.atan2(Math.sin(ang), Math.cos(ang));
            const glint = Math.exp(-ang * ang * 10) * (0.35 + nr * 0.65);
            const kind = w.kinds[i / 3];
            const baseB = kind === 1 ? 0.55 : kind === 2 ? 0.7 : 0.48;
            const sheen = Math.sin(r * 0.35 - t * 0.6);
            const b = baseB + glint * 1.1;
            col[i]     = b * (0.86 + 0.08 * sheen);          // r
            col[i + 1] = b * (0.92 + 0.04 * Math.cos(r * 0.3)); // g
            col[i + 2] = b * (1.0 - 0.06 * sheen);           // b
        }
        w.geom.attributes.position.needsUpdate = true;
        w.geom.attributes.color.needsUpdate = true;

        // dew follows its thread and twinkles when the light passes
        const dp = w.dewGeom.attributes.position.array;
        const dc = w.dewGeom.attributes.color.array;
        w.dewIdx.forEach((v, n) => {
            const i = v * 3;
            dp[n * 3] = pos[i]; dp[n * 3 + 1] = pos[i + 1] - 0.12; dp[n * 3 + 2] = pos[i + 2];
            const tw = 0.35 + 0.65 * Math.pow(Math.max(0, Math.sin(t * 1.6 + w.dewPhase[n])), 6);
            const g = col[i] * 1.2;
            dc[n * 3] = (0.5 + g) * tw; dc[n * 3 + 1] = (0.6 + g) * tw; dc[n * 3 + 2] = (0.75 + g) * tw;
        });
        w.dewGeom.attributes.position.needsUpdate = true;
        w.dewGeom.attributes.color.needsUpdate = true;
    }

    function onMouseMove(e) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function onResize() {
        if (!container || !renderer || !camera) return;
        width = container.offsetWidth;
        height = container.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function animate() {
        if (!isVisible) { animId = null; return; }
        animId = requestAnimationFrame(animate);

        const t = clock.getElapsedTime();
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        webs.forEach((w, i) => {
            updateWeb(w, t);
            const depth = i === 0 ? 1 : 0.6;
            w.group.rotation.x = w.tilt.x + targetY * 0.12 * depth;
            w.group.rotation.y = w.tilt.y + targetX * 0.16 * depth;
        });

        renderer.render(scene, camera);
    }

    return { init };
})();
