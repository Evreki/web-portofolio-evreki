/**
 * SPIDER-MAN NEOBRUTALISM PORTFOLIO — THREE.JS 3D SPIDER WEB HERO
 * Evreki Wan Refanja — Pure Silk Web Vector Geometry (100% Clean Lines, Zero Square Dots)
 */

'use strict';

window.SpiderHeroThree = (function () {
    let scene, camera, renderer;
    let webGroup, spiralGroup, ambientGroup;
    let container, canvas;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let animId = null;
    let isVisible = true;
    let width, height;
    let clock;

    function isWebGLAvailable() {
        try {
            const c = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    function init() {
        container = document.getElementById('hero-section');
        canvas = document.getElementById('hero-three-canvas');
        if (!container || !canvas || !isWebGLAvailable() || typeof THREE === 'undefined') return;

        clock = new THREE.Clock();
        width = container.offsetWidth;
        height = container.offsetHeight;

        // Scene & Camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 85;

        // Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Groups (Only clean lines & web geometry, NO square points)
        webGroup = new THREE.Group();
        spiralGroup = new THREE.Group();
        ambientGroup = new THREE.Group();
        scene.add(webGroup);
        scene.add(spiralGroup);
        scene.add(ambientGroup);

        buildCleanSpiderWeb();

        // Mouse interaction
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        // Pause animation when hero is off-screen for maximum performance
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible && !animId) animate();
            });
        }, { threshold: 0.05 });
        obs.observe(container);

        animate();
    }

    function buildCleanSpiderWeb() {
        const isMobile = window.innerWidth < 768;
        const radialSpokes = isMobile ? 16 : 28;
        const concentricRings = isMobile ? 10 : 18;
        const maxRadius = isMobile ? 65 : 95;

        // Spider-Man Silk Materials
        const redLineMat = new THREE.LineBasicMaterial({
            color: 0xE50914,
            transparent: true,
            opacity: 0.55,
            linewidth: 1
        });

        const blueLineMat = new THREE.LineBasicMaterial({
            color: 0x38BDF8,
            transparent: true,
            opacity: 0.4,
            linewidth: 1
        });

        const whiteLineMat = new THREE.LineBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.25,
            linewidth: 1
        });

        const yellowLineMat = new THREE.LineBasicMaterial({
            color: 0xF4E409,
            transparent: true,
            opacity: 0.35,
            linewidth: 1
        });

        // 1. Radial Spoke Lines (Pure radiating silk lines with 3D organic depth)
        for (let i = 0; i < radialSpokes; i++) {
            const angle = (i / radialSpokes) * Math.PI * 2;
            const points = [];
            
            // Start from center hub
            points.push(new THREE.Vector3(0, 0, 0));

            // Mid curve point for organic tension
            const midRadius = maxRadius * 0.5;
            const midZ = Math.sin(i * 1.8) * 6 - 8;
            points.push(new THREE.Vector3(
                Math.cos(angle) * midRadius,
                Math.sin(angle) * midRadius,
                midZ
            ));

            // Outer perimeter anchor
            const endZ = Math.sin(i * 1.2) * 8 - 16;
            points.push(new THREE.Vector3(
                Math.cos(angle) * maxRadius,
                Math.sin(angle) * maxRadius,
                endZ
            ));

            const geom = new THREE.BufferGeometry().setFromPoints(points);
            let mat = whiteLineMat;
            if (i % 3 === 0) mat = redLineMat;
            else if (i % 3 === 1) mat = blueLineMat;
            else if (i % 6 === 2) mat = yellowLineMat;

            const line = new THREE.Line(geom, mat);
            webGroup.add(line);
        }

        // 2. Concentric Polygonal Web Spirals (Smooth web silk loops)
        for (let r = 1; r <= concentricRings; r++) {
            const ringRadius = (r / concentricRings) * maxRadius;
            const points = [];
            
            let ringMat = whiteLineMat;
            if (r % 3 === 0) ringMat = redLineMat;
            else if (r % 3 === 1) ringMat = blueLineMat;
            else if (r % 5 === 0) ringMat = yellowLineMat;

            for (let i = 0; i <= radialSpokes; i++) {
                const angle = (i / radialSpokes) * Math.PI * 2;
                // Subtle sag between web spokes (catenary curve illusion)
                const sag = Math.sin((i % 1) * Math.PI) * 0.8;
                const rad = ringRadius - sag;
                const zDepth = (r / concentricRings) * -14 + Math.cos(i + r) * 2;

                points.push(new THREE.Vector3(
                    Math.cos(angle) * rad,
                    Math.sin(angle) * rad,
                    zDepth
                ));
            }

            const ringGeom = new THREE.BufferGeometry().setFromPoints(points);
            const ringLine = new THREE.Line(ringGeom, ringMat);
            webGroup.add(ringLine);
        }

        // 3. Central Web Hub Spiral (Fine inner core weaving)
        const hubTurns = 4;
        const hubSteps = 120;
        const hubMaxRad = maxRadius * 0.22;
        const hubPoints = [];
        for (let s = 0; s <= hubSteps; s++) {
            const t = s / hubSteps;
            const theta = t * Math.PI * 2 * hubTurns;
            const rad = t * hubMaxRad;
            const z = (1 - t) * 2 - 2;
            hubPoints.push(new THREE.Vector3(
                Math.cos(theta) * rad,
                Math.sin(theta) * rad,
                z
            ));
        }
        const hubGeom = new THREE.BufferGeometry().setFromPoints(hubPoints);
        const hubLine = new THREE.Line(hubGeom, redLineMat);
        spiralGroup.add(hubLine);

        // 4. Auxiliary Secondary Web Filaments (Diagonal cross-reinforcements)
        const crossSteps = isMobile ? 8 : 16;
        for (let k = 0; k < crossSteps; k++) {
            const a1 = (k / crossSteps) * Math.PI * 2;
            const a2 = ((k + 1.5) / crossSteps) * Math.PI * 2;
            const r1 = maxRadius * (0.3 + (k % 4) * 0.18);
            const r2 = maxRadius * (0.45 + ((k + 1) % 4) * 0.18);

            const filamentPoints = [
                new THREE.Vector3(Math.cos(a1) * r1, Math.sin(a1) * r1, -6),
                new THREE.Vector3(Math.cos(a2) * r2, Math.sin(a2) * r2, -10)
            ];
            const filamentGeom = new THREE.BufferGeometry().setFromPoints(filamentPoints);
            const filamentLine = new THREE.Line(filamentGeom, k % 2 === 0 ? blueLineMat : whiteLineMat);
            ambientGroup.add(filamentLine);
        }
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
        if (!isVisible) {
            animId = null;
            return;
        }

        animId = requestAnimationFrame(animate);

        const elapsedTime = clock ? clock.getElapsedTime() : 0;

        // Smooth mouse lerp
        targetX += (mouseX - targetX) * 0.045;
        targetY += (mouseY - targetY) * 0.045;

        // Parallax web rotation & subtle organic flex
        if (webGroup) {
            webGroup.rotation.x = targetY * 0.2 + Math.sin(elapsedTime * 0.4) * 0.025;
            webGroup.rotation.y = targetX * 0.25 + Math.cos(elapsedTime * 0.3) * 0.025;
            webGroup.rotation.z = elapsedTime * 0.012;
        }

        if (spiralGroup) {
            spiralGroup.rotation.x = webGroup.rotation.x;
            spiralGroup.rotation.y = webGroup.rotation.y;
            spiralGroup.rotation.z = -elapsedTime * 0.02;
        }

        if (ambientGroup) {
            ambientGroup.rotation.x = webGroup.rotation.x;
            ambientGroup.rotation.y = webGroup.rotation.y;
            ambientGroup.rotation.z = webGroup.rotation.z * 1.2;
        }

        renderer.render(scene, camera);
    }

    return {
        init: init
    };
})();
