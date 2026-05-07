// DomeGallery.js - Vanilla JS Port of React Bits DomeGallery component
// Designed with absolute native performance using Web APIs, zero dependencies.

(function () {
    const GALLERY_IMAGES = [
        // --- Web Development ---
        { src: 'images/webdevelopment/react.png', alt: 'React Development' },
        { src: 'images/webdevelopment/next.js.png', alt: 'NextJS Framework' },
        { src: 'images/webdevelopment/node.png', alt: 'NodeJS Runtime' },
        { src: 'images/webdevelopment/laravel.png', alt: 'Laravel PHP MVC' },
        { src: 'images/webdevelopment/pythin.png', alt: 'Python Engineering & scripting' },
        { src: 'images/webdevelopment/aws.png', alt: 'Amazon Web Services Cloud' },
        { src: 'images/webdevelopment/docker.png', alt: 'Docker Containers' },
        { src: 'images/webdevelopment/html.png', alt: 'HTML5 Modern Web' },
        { src: 'images/webdevelopment/css.png', alt: 'CSS3 Layouts' },
        { src: 'images/webdevelopment/js.png', alt: 'JavaScript ESNext' },
        { src: 'images/webdevelopment/tailwind.png', alt: 'Tailwind CSS' },
        { src: 'images/webdevelopment/github.png', alt: 'GitHub Version Control' },
        { src: 'images/webdevelopment/graphql.png', alt: 'GraphQL API Systems' },
        { src: 'images/webdevelopment/express.png', alt: 'ExpressJS Framework' },
        { src: 'images/webdevelopment/redux.png', alt: 'Redux State Engine' },

        // --- Automation ---
        { src: 'images/automation/chagpt.png', alt: 'ChatGPT API Integration' },
        { src: 'images/automation/deepseak.png', alt: 'DeepSeek AI Automation' },
        { src: 'images/automation/firbase.png', alt: 'Google Firebase' },
        { src: 'images/automation/git.png', alt: 'Git Versioning' },
        { src: 'images/automation/mailchimp.png', alt: 'Mailchimp Email Workflows' },
        { src: 'images/automation/mongodb.png', alt: 'MongoDB NoSQL Database' },
        { src: 'images/automation/mysql.png', alt: 'MySQL Relational Database' },
        { src: 'images/automation/n8n.png', alt: 'n8n Workflow Automation' },
        { src: 'images/automation/psstgre.png', alt: 'PostgreSQL Database' },
        { src: 'images/automation/whatsapp api.png', alt: 'WhatsApp API Integration' },
        { src: 'images/automation/zapier.png', alt: 'Zapier Automation' },

        // --- Performance Marketing ---
        { src: 'images/performancemarketing/googleads.png', alt: 'Google Ads Campaigns' },
        { src: 'images/performancemarketing/linkedinads.png', alt: 'LinkedIn Ads B2B' },
        { src: 'images/performancemarketing/meta.png', alt: 'Meta Ads Manager' },
        { src: 'images/performancemarketing/mgid.png', alt: 'MGID Native Advertising' },
        { src: 'images/performancemarketing/nativo.png', alt: 'Nativo Native Ad Server' },
        { src: 'images/performancemarketing/rev.png', alt: 'RevContent Ad Network' },
        { src: 'images/performancemarketing/stack.png', alt: 'StackAdapt DSP' },
        { src: 'images/performancemarketing/taboola.png', alt: 'Taboola Content Recommendation' },
        { src: 'images/performancemarketing/tiktok ads.png', alt: 'TikTok Ads' },
        { src: 'images/performancemarketing/turecallersads.png', alt: 'Truecaller Ads' },
        { src: 'images/performancemarketing/utbrain.png', alt: 'Outbrain Native Advertising' },

        // --- Social Media ---
        { src: 'images/socailmedia/buffer.png', alt: 'Buffer Social Scheduler' },
        { src: 'images/socailmedia/facebook.png', alt: 'Facebook Page Management' },
        { src: 'images/socailmedia/hoot.png', alt: 'Hootsuite Management' },
        { src: 'images/socailmedia/insta.png', alt: 'Instagram Growth & Content' },
        { src: 'images/socailmedia/linkedin.png', alt: 'LinkedIn Professional Networking' },
        { src: 'images/socailmedia/metricool.png', alt: 'Metricool Social Analytics' },
        { src: 'images/socailmedia/pintereste.png', alt: 'Pinterest Creative Pinning' },
        { src: 'images/socailmedia/planable.png', alt: 'Planable Collaboration' },
        { src: 'images/socailmedia/quora.png', alt: 'Quora Q&A Marketing' },
        { src: 'images/socailmedia/reditt.png', alt: 'Reddit Community Engagement' },
        { src: 'images/socailmedia/socialpilot.png', alt: 'SocialPilot Tool' },
        { src: 'images/socailmedia/sprout.png', alt: 'Sprout Social Listening' },
        { src: 'images/socailmedia/tiktok.png', alt: 'TikTok Creative Video' },
        { src: 'images/socailmedia/zoho.png', alt: 'Zoho Social Management' },

        // --- SEO ---
        { src: 'images/seo/ahref.png', alt: 'Ahrefs Backlink & Keyword Auditor' },
        { src: 'images/seo/ga4.png', alt: 'Google Analytics 4' },
        { src: 'images/seo/gsc.png', alt: 'Google Search Console' },
        { src: 'images/seo/screaming frog.png', alt: 'Screaming Frog SEO Spider' },
        { src: 'images/seo/semrush.png', alt: 'SEMrush Marketing Suite' },
        { src: 'images/seo/ubersuggest.png', alt: 'Ubersuggest Auditor' },
        { src: 'images/seo/yost.png', alt: 'Yoast SEO Plugin' }
    ];

    const config = {
        fit: 0.55,
        fitBasis: 'auto',
        minRadius: 400,
        maxRadius: 800,
        padFactor: 0.25,
        overlayBlurColor: '#0f0f0f',
        maxVerticalRotationDeg: 80,
        dragSensitivity: 20,
        enlargeTransitionMs: 400,
        segments: 35,
        dragDampening: 2,
        openedImageWidth: '320px',
        openedImageHeight: '320px',
        imageBorderRadius: '28px',
        openedImageBorderRadius: '28px',
        grayscale: true
    };

    // Helper utilities
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const normalizeAngle = d => ((d % 360) + 360) % 360;
    const wrapAngleSigned = deg => {
        const a = (((deg + 180) % 360) + 360) % 360;
        return a - 180;
    };

    function buildItems(pool, seg) {
        const xCols = Array.from({ length: seg }, (_, i) => -Math.floor(seg / 2) + i * 2);
        const evenYs = [-14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14];
        const oddYs = [-13, -11, -9, -7, -5, -3, -1, 1, 3, 5, 7, 9, 11, 13, 15];

        const coords = [];
        xCols.forEach((x, c) => {
            const ys = c % 2 === 0 ? evenYs : oddYs;
            ys.forEach(y => {
                coords.push({ x, y, sizeX: 2, sizeY: 2 });
            });
        });

        const totalSlots = coords.length;
        if (pool.length === 0) {
            return coords.map(c => ({ ...c, src: '', alt: '' }));
        }

        const normalizedImages = pool.map(image => {
            if (typeof image === 'string') return { src: image, alt: '' };
            return { src: image.src || '', alt: image.alt || '' };
        });

        const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

        // Stagger placement to ensure neighboring tiles do not display the exact same logo
        for (let i = 1; i < usedImages.length; i++) {
            if (usedImages[i].src === usedImages[i - 1].src) {
                for (let j = i + 1; j < usedImages.length; j++) {
                    if (usedImages[j].src !== usedImages[i].src) {
                        const tmp = usedImages[i];
                        usedImages[i] = usedImages[j];
                        usedImages[j] = tmp;
                        break;
                    }
                }
            }
        }

        return coords.map((c, i) => ({
            ...c,
            src: usedImages[i].src,
            alt: usedImages[i].alt
        }));
    }

    function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
        const unit = 360 / segments / 2;
        const rotateY = unit * (offsetX + (sizeX - 1) / 2);
        const rotateX = unit * (offsetY - (sizeY - 1) / 2);
        return { rotateX, rotateY };
    }

    // Initialize DOM references
    const rootEl = document.getElementById('dome-gallery-root');
    if (!rootEl) return;

    const mainEl = rootEl.querySelector('.sphere-main');
    const sphereEl = rootEl.querySelector('.sphere');
    const frameEl = rootEl.querySelector('.frame');
    const viewerEl = rootEl.querySelector('.viewer');
    const scrimEl = rootEl.querySelector('.scrim');

    let focusedEl = null;
    let originalTilePosition = null;

    let rotation = { x: 0, y: 30 }; // Slight initial rotation to make it feel dimensional
    let startRot = { x: 0, y: 0 };
    let startPos = null;
    let dragging = false;
    let moved = false;
    let inertiaRAF = null;
    let opening = false;
    let openStartedAt = 0;
    let lastDragEndAt = 0;
    let lockedRadius = 500;

    const items = buildItems(GALLERY_IMAGES, config.segments);

    // Render Tiles
    sphereEl.innerHTML = items.map((it, i) => {
        return `
            <div class="item" 
                 data-src="${it.src}" 
                 data-offset-x="${it.x}" 
                 data-offset-y="${it.y}" 
                 data-size-x="${it.sizeX}" 
                 data-size-y="${it.sizeY}"
                 style="--offset-x: ${it.x}; --offset-y: ${it.y}; --item-size-x: ${it.sizeX}; --item-size-y: ${it.sizeY};">
                <div class="item__image" role="button" tabindex="0" aria-label="${it.alt || 'Open image'}">
                    <img src="${it.src}" draggable="false" alt="${it.alt}" style="object-fit: contain; padding: 12px; background: rgba(255,255,255,0.03);" />
                </div>
            </div>
        `;
    }).join('');

    const applyTransform = (xDeg, yDeg) => {
        if (sphereEl) {
            sphereEl.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
        }
    };

    // Resize Observer to handle responsiveness
    const ro = new ResizeObserver(entries => {
        const cr = entries[0].contentRect;
        const w = Math.max(1, cr.width);
        const h = Math.max(1, cr.height);
        const minDim = Math.min(w, h);
        const maxDim = Math.max(w, h);
        const aspect = w / h;

        let basis;
        switch (config.fitBasis) {
            case 'min': basis = minDim; break;
            case 'max': basis = maxDim; break;
            case 'width': basis = w; break;
            case 'height': basis = h; break;
            default: basis = aspect >= 1.3 ? w : minDim;
        }

        let radius = basis * config.fit;
        const heightGuard = h * 1.35;
        radius = Math.min(radius, heightGuard);
        radius = clamp(radius, config.minRadius, config.maxRadius);
        lockedRadius = Math.round(radius);

        const viewerPad = Math.max(8, Math.round(minDim * config.padFactor));
        rootEl.style.setProperty('--radius', `${lockedRadius}px`);
        rootEl.style.setProperty('--segments-x', config.segments);
        rootEl.style.setProperty('--segments-y', 12);
        rootEl.style.setProperty('--viewer-pad', `${viewerPad}px`);
        rootEl.style.setProperty('--overlay-blur-color', config.overlayBlurColor);
        rootEl.style.setProperty('--tile-radius', config.imageBorderRadius);
        rootEl.style.setProperty('--enlarge-radius', config.openedImageBorderRadius);
        rootEl.style.setProperty('--image-filter', config.grayscale ? 'grayscale(1)' : 'none');

        applyTransform(rotation.x, rotation.y);

        const enlargedOverlay = viewerEl.querySelector('.enlarge');
        if (enlargedOverlay && frameEl && mainEl) {
            const frameR = frameEl.getBoundingClientRect();
            const mainR = mainEl.getBoundingClientRect();

            if (config.openedImageWidth && config.openedImageHeight) {
                const tempDiv = document.createElement('div');
                tempDiv.style.cssText = `position: absolute; width: ${config.openedImageWidth}; height: ${config.openedImageHeight}; visibility: hidden;`;
                document.body.appendChild(tempDiv);
                const tempRect = tempDiv.getBoundingClientRect();
                document.body.removeChild(tempDiv);

                const centeredLeft = frameR.left - mainR.left + (frameR.width - tempRect.width) / 2;
                const centeredTop = frameR.top - mainR.top + (frameR.height - tempRect.height) / 2;

                enlargedOverlay.style.left = `${centeredLeft}px`;
                enlargedOverlay.style.top = `${centeredTop}px`;
            } else {
                enlargedOverlay.style.left = `${frameR.left - mainR.left}px`;
                enlargedOverlay.style.top = `${frameR.top - mainR.top}px`;
                enlargedOverlay.style.width = `${frameR.width}px`;
                enlargedOverlay.style.height = `${frameR.height}px`;
            }
        }
    });
    ro.observe(rootEl);

    // Drag Gesture Handlers
    const stopInertia = () => {
        if (inertiaRAF) {
            cancelAnimationFrame(inertiaRAF);
            inertiaRAF = null;
        }
    };

    const startInertia = (vx, vy) => {
        const MAX_V = 1.4;
        let vX = clamp(vx, -MAX_V, MAX_V) * 80;
        let vY = clamp(vy, -MAX_V, MAX_V) * 80;
        let frames = 0;
        const d = clamp(config.dragDampening, 0, 1);
        const frictionMul = 0.94 + 0.055 * d;
        const stopThreshold = 0.015 - 0.01 * d;
        const maxFrames = Math.round(90 + 270 * d);

        const step = () => {
            vX *= frictionMul;
            vY *= frictionMul;
            if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
                inertiaRAF = null;
                return;
            }
            if (++frames > maxFrames) {
                inertiaRAF = null;
                return;
            }
            const nextX = clamp(rotation.x - vY / 200, -config.maxVerticalRotationDeg, config.maxVerticalRotationDeg);
            const nextY = wrapAngleSigned(rotation.y + vX / 200);
            rotation = { x: nextX, y: nextY };
            applyTransform(nextX, nextY);
            inertiaRAF = requestAnimationFrame(step);
        };
        stopInertia();
        inertiaRAF = requestAnimationFrame(step);
    };

    // Hooking Pointer Events for absolute cross-platform interaction
    mainEl.addEventListener('pointerdown', e => {
        if (focusedEl) return;
        stopInertia();
        dragging = true;
        moved = false;
        startRot = { ...rotation };
        startPos = { x: e.clientX, y: e.clientY };
        mainEl.setPointerCapture(e.pointerId);
    });

    mainEl.addEventListener('pointermove', e => {
        if (!dragging || !startPos) return;
        const dxTotal = e.clientX - startPos.x;
        const dyTotal = e.clientY - startPos.y;

        if (!moved) {
            const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
            if (dist2 > 16) moved = true;
        }

        const nextX = clamp(startRot.x - dyTotal / config.dragSensitivity, -config.maxVerticalRotationDeg, config.maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(startRot.y + dxTotal / config.dragSensitivity);

        rotation = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
    });

    mainEl.addEventListener('pointerup', e => {
        if (!dragging) return;
        dragging = false;
        mainEl.releasePointerCapture(e.pointerId);

        if (moved) {
            lastDragEndAt = performance.now();
            startInertia(e.movementX * 0.05, e.movementY * 0.05);
        }
        moved = false;
    });

    // Expand & Centering zoom calculations
    const openItemFromElement = el => {
        if (opening) return;
        opening = true;
        openStartedAt = performance.now();

        const parent = el.parentElement;
        focusedEl = el;
        el.setAttribute('data-focused', 'true');

        const offsetX = parseFloat(parent.dataset.offsetX || 0);
        const offsetY = parseFloat(parent.dataset.offsetY || 0);
        const sizeX = parseFloat(parent.dataset.sizeX || 2);
        const sizeY = parseFloat(parent.dataset.sizeY || 2);

        const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, config.segments);
        const parentY = normalizeAngle(parentRot.rotateY);
        const globalY = normalizeAngle(rotation.y);
        let rotY = -(parentY + globalY) % 360;
        if (rotY < -180) rotY += 360;
        const rotX = -parentRot.rotateX - rotation.x;

        parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
        parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

        const refDiv = document.createElement('div');
        refDiv.className = 'item__image item__image--reference';
        refDiv.style.opacity = '0';
        refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
        parent.appendChild(refDiv);

        void refDiv.offsetHeight;

        const tileR = refDiv.getBoundingClientRect();
        const mainR = mainEl.getBoundingClientRect();
        const frameR = frameEl.getBoundingClientRect();

        if (tileR.width <= 0 || tileR.height <= 0) {
            opening = false;
            focusedEl = null;
            parent.removeChild(refDiv);
            return;
        }

        originalTilePosition = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
        el.style.visibility = 'hidden';
        el.style.zIndex = '0';

        const overlay = document.createElement('div');
        overlay.className = 'enlarge';
        overlay.style.position = 'absolute';
        overlay.style.left = frameR.left - mainR.left + 'px';
        overlay.style.top = frameR.top - mainR.top + 'px';
        overlay.style.width = frameR.width + 'px';
        overlay.style.height = frameR.height + 'px';
        overlay.style.opacity = '0';
        overlay.style.zIndex = '30';
        overlay.style.willChange = 'transform, opacity';
        overlay.style.transformOrigin = 'top left';
        overlay.style.transition = `transform ${config.enlargeTransitionMs}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${config.enlargeTransitionMs}ms ease`;

        const rawSrc = parent.dataset.src || el.querySelector('img')?.src || '';
        const img = document.createElement('img');
        img.src = rawSrc;
        img.style.objectFit = 'contain';
        img.style.background = '#1a1a1a';
        img.style.padding = '30px';
        overlay.appendChild(img);
        viewerEl.appendChild(overlay);

        const tx0 = tileR.left - frameR.left;
        const ty0 = tileR.top - frameR.top;
        const sx0 = tileR.width / frameR.width;
        const sy0 = tileR.height / frameR.height;

        overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${sx0}, ${sy0})`;

        setTimeout(() => {
            if (!overlay.parentElement) return;
            overlay.style.opacity = '1';
            overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
            rootEl.setAttribute('data-enlarging', 'true');
        }, 16);

        if (config.openedImageWidth || config.openedImageHeight) {
            const onFirstEnd = ev => {
                if (ev.propertyName !== 'transform') return;
                overlay.removeEventListener('transitionend', onFirstEnd);
                const prevTransition = overlay.style.transition;
                overlay.style.transition = 'none';

                const tempWidth = config.openedImageWidth || `${frameR.width}px`;
                const tempHeight = config.openedImageHeight || `${frameR.height}px`;
                overlay.style.width = tempWidth;
                overlay.style.height = tempHeight;

                const newRect = overlay.getBoundingClientRect();
                overlay.style.width = frameR.width + 'px';
                overlay.style.height = frameR.height + 'px';

                void overlay.offsetWidth;
                overlay.style.transition = `left ${config.enlargeTransitionMs}ms ease, top ${config.enlargeTransitionMs}ms ease, width ${config.enlargeTransitionMs}ms ease, height ${config.enlargeTransitionMs}ms ease`;

                const centeredLeft = frameR.left - mainR.left + (frameR.width - newRect.width) / 2;
                const centeredTop = frameR.top - mainR.top + (frameR.height - newRect.height) / 2;

                requestAnimationFrame(() => {
                    overlay.style.left = `${centeredLeft}px`;
                    overlay.style.top = `${centeredTop}px`;
                    overlay.style.width = tempWidth;
                    overlay.style.height = tempHeight;
                });

                const cleanupSecond = () => {
                    overlay.removeEventListener('transitionend', cleanupSecond);
                    overlay.style.transition = prevTransition;
                };
                overlay.addEventListener('transitionend', cleanupSecond, { once: true });
            };
            overlay.addEventListener('transitionend', onFirstEnd);
        }
    };

    const closeFocusedItem = () => {
        if (performance.now() - openStartedAt < 250) return;
        const el = focusedEl;
        if (!el) return;

        const parent = el.parentElement;
        const overlay = viewerEl.querySelector('.enlarge');
        if (!overlay) return;

        const refDiv = parent.querySelector('.item__image--reference');
        const originalPos = originalTilePosition;

        if (!originalPos) {
            overlay.remove();
            if (refDiv) refDiv.remove();
            parent.style.setProperty('--rot-y-delta', '0deg');
            parent.style.setProperty('--rot-x-delta', '0deg');
            el.style.visibility = '';
            el.style.zIndex = '0';
            focusedEl = null;
            rootEl.removeAttribute('data-enlarging');
            opening = false;
            return;
        }

        const currentRect = overlay.getBoundingClientRect();
        const rootRect = rootEl.getBoundingClientRect();

        const originalPosRelativeToRoot = {
            left: originalPos.left - rootRect.left,
            top: originalPos.top - rootRect.top,
            width: originalPos.width,
            height: originalPos.height
        };

        const overlayRelativeToRoot = {
            left: currentRect.left - rootRect.left,
            top: currentRect.top - rootRect.top,
            width: currentRect.width,
            height: currentRect.height
        };

        const animatingOverlay = document.createElement('div');
        animatingOverlay.className = 'enlarge-closing';
        animatingOverlay.style.cssText = `position:absolute;left:${overlayRelativeToRoot.left}px;top:${overlayRelativeToRoot.top}px;width:${overlayRelativeToRoot.width}px;height:${overlayRelativeToRoot.height}px;z-index:9999;border-radius: var(--enlarge-radius, 32px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${config.enlargeTransitionMs}ms cubic-bezier(0.25, 1, 0.5, 1);pointer-events:none;`;

        const originalImg = overlay.querySelector('img');
        if (originalImg) {
            const img = originalImg.cloneNode();
            img.style.cssText = 'width:100%;height:100%;object-fit:contain;padding:30px;background:#1a1a1a;';
            animatingOverlay.appendChild(img);
        }

        overlay.remove();
        rootEl.appendChild(animatingOverlay);

        void animatingOverlay.getBoundingClientRect();

        requestAnimationFrame(() => {
            animatingOverlay.style.left = originalPosRelativeToRoot.left + 'px';
            animatingOverlay.style.top = originalPosRelativeToRoot.top + 'px';
            animatingOverlay.style.width = originalPosRelativeToRoot.width + 'px';
            animatingOverlay.style.height = originalPosRelativeToRoot.height + 'px';
            animatingOverlay.style.opacity = '0';
        });

        const cleanup = () => {
            animatingOverlay.remove();
            originalTilePosition = null;
            if (refDiv) refDiv.remove();

            parent.style.transition = 'none';
            el.style.transition = 'none';
            parent.style.setProperty('--rot-y-delta', '0deg');
            parent.style.setProperty('--rot-x-delta', '0deg');

            requestAnimationFrame(() => {
                el.style.visibility = '';
                el.style.opacity = '0';
                el.style.zIndex = '0';
                focusedEl = null;
                rootEl.removeAttribute('data-enlarging');

                requestAnimationFrame(() => {
                    parent.style.transition = '';
                    el.style.transition = 'opacity 300ms ease-out';
                    requestAnimationFrame(() => {
                        el.style.opacity = '1';
                        setTimeout(() => {
                            el.style.transition = '';
                            el.style.opacity = '';
                            opening = false;
                        }, 300);
                    });
                });
            });
        };
        animatingOverlay.addEventListener('transitionend', cleanup, { once: true });
    };

    // Attach click events to tiles
    sphereEl.addEventListener('click', e => {
        const tile = e.target.closest('.item__image');
        if (!tile) return;
        if (dragging || moved) return;
        if (performance.now() - lastDragEndAt < 100) return;
        if (opening) return;
        openItemFromElement(tile);
    });

    scrimEl.addEventListener('click', closeFocusedItem);
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeFocusedItem();
    });

    // Inertia looping auto rotation
    let autoRotationSpeed = 0.05; // Gentle auto scroll rotation for stunning ambient effects!
    const autoScroll = () => {
        if (!dragging && !focusedEl && !inertiaRAF) {
            rotation.y = wrapAngleSigned(rotation.y + autoRotationSpeed);
            applyTransform(rotation.x, rotation.y);
        }
        requestAnimationFrame(autoScroll);
    };
    autoScroll();
})();
