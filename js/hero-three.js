/**
 * PORTFOLIO — PROFILE BANNER ANIMATION (THREE.JS)
 * Evreki Wan Refanja
 *
 * A calm "professional network" constellation: soft glowing nodes drift in
 * 3D, nearby nodes link up with fading lines, and the whole field tilts
 * gently toward the mouse. Pauses automatically when off-screen.
 */

'use strict';

window.SpiderHeroThree = (function () {
    let scene, camera, renderer, clock, container, canvas;
    let points, lines, nodes = [], linePos, lineCol, pointPos;
    let group;
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    let animId = null, isVisible = true, width, height;
    let halfW = 100, halfH = 40;

    const MAX_LINKS = 900;
    const LINK_DIST = 22;

    function isWebGLAvailable() {
        try {
            const c = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    function init() {
        container = document.getElementById('profile-banner') || document.getElementById('hero-section');
        canvas = document.getElementById('hero-three-canvas');
        if (!container || !canvas || !isWebGLAvailable() || typeof THREE === 'undefined') return;

        clock = new THREE.Clock();
        width = container.offsetWidth;
        height = container.offsetHeight;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 85;

        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        measure();
        group = new THREE.Group();
        scene.add(group);
        buildField();

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

    function measure() {
        halfH = Math.tan((50 / 2) * Math.PI / 180) * 85;
        halfW = halfH * (width / height);
    }

    function dotTexture() {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d');
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.3, 'rgba(200,228,255,0.9)');
        grad.addColorStop(0.7, 'rgba(112,181,249,0.15)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    }

    function buildField() {
        const count = Math.round(Math.min(110, Math.max(45, width / 9)));
        nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: (Math.random() * 2 - 1) * halfW * 1.05,
                y: (Math.random() * 2 - 1) * halfH * 1.05,
                z: (Math.random() * 2 - 1) * 12,
                vx: (Math.random() - 0.5) * 0.05,
                vy: (Math.random() - 0.5) * 0.05,
                phase: Math.random() * Math.PI * 2,
                big: Math.random() < 0.12
            });
        }

        // nodes
        pointPos = new Float32Array(count * 3);
        const pointCol = new Float32Array(count * 3);
        nodes.forEach((n, i) => {
            const c = n.big ? [1, 1, 1] : [0.62, 0.8, 1];
            pointCol.set(c, i * 3);
        });
        const pGeom = new THREE.BufferGeometry();
        pGeom.setAttribute('position', new THREE.BufferAttribute(pointPos, 3));
        pGeom.setAttribute('color', new THREE.BufferAttribute(pointCol, 3));
        points = new THREE.Points(pGeom, new THREE.PointsMaterial({
            size: 2.2, map: dotTexture(), vertexColors: true, transparent: true,
            opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false
        }));
        group.add(points);

        // links
        linePos = new Float32Array(MAX_LINKS * 6);
        lineCol = new Float32Array(MAX_LINKS * 6);
        const lGeom = new THREE.BufferGeometry();
        lGeom.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
        lGeom.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));
        lGeom.setDrawRange(0, 0);
        lines = new THREE.LineSegments(lGeom, new THREE.LineBasicMaterial({
            vertexColors: true, transparent: true, opacity: 0.75,
            blending: THREE.AdditiveBlending, depthWrite: false
        }));
        group.add(lines);
    }

    function update(t) {
        // drift + gentle bob; wrap around the banner edges
        const limX = halfW * 1.1, limY = halfH * 1.1;
        nodes.forEach((n, i) => {
            n.x += n.vx; n.y += n.vy;
            if (n.x > limX) n.x = -limX; else if (n.x < -limX) n.x = limX;
            if (n.y > limY) n.y = -limY; else if (n.y < -limY) n.y = limY;
            pointPos[i * 3] = n.x;
            pointPos[i * 3 + 1] = n.y + Math.sin(t * 0.6 + n.phase) * 0.8;
            pointPos[i * 3 + 2] = n.z;
        });
        points.geometry.attributes.position.needsUpdate = true;

        // connect nearby nodes, brighter when closer
        let k = 0;
        for (let i = 0; i < nodes.length && k < MAX_LINKS; i++) {
            const ax = pointPos[i * 3], ay = pointPos[i * 3 + 1], az = pointPos[i * 3 + 2];
            for (let j = i + 1; j < nodes.length && k < MAX_LINKS; j++) {
                const dx = ax - pointPos[j * 3], dy = ay - pointPos[j * 3 + 1], dz = az - pointPos[j * 3 + 2];
                const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (d > LINK_DIST) continue;
                const a = Math.pow(1 - d / LINK_DIST, 1.6) * 0.8;
                linePos.set([ax, ay, az, pointPos[j * 3], pointPos[j * 3 + 1], pointPos[j * 3 + 2]], k * 6);
                const r = 0.44 * a, g = 0.71 * a, b = 0.98 * a;
                lineCol.set([r, g, b, r, g, b], k * 6);
                k++;
            }
        }
        lines.geometry.setDrawRange(0, k * 2);
        lines.geometry.attributes.position.needsUpdate = true;
        lines.geometry.attributes.color.needsUpdate = true;
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
        renderer.setSize(width, height, false);
        measure();
    }

    function animate() {
        if (!isVisible) { animId = null; return; }
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
        update(t);
        group.rotation.y = targetX * 0.18;
        group.rotation.x = -targetY * 0.12;
        renderer.render(scene, camera);
    }

    return { init };
})();
