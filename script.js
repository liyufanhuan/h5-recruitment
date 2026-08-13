/* ============================================
   Lumora - Interactive Logic
   ============================================ */

(function() {
    // Register GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // State
    let activeVideo = 0;
    let isTransitioning = false;
    const TRANSITION_DURATION = 1000; // matches CSS opacity transition

    // DOM Elements
    const videoLayers = document.querySelectorAll('.video-layer');
    const switchBtns = document.querySelectorAll('.switch-btn');
    const heroContent = document.querySelector('.hero-content');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    // ========== Video Switching Logic ==========
    // Color themes for each video button
    const videoColors = [
        { color: '#ffffff', shadow: 'rgba(0, 0, 0, 0.55)' },   // 数字工厂 - 白色
        { color: '#FFD700', shadow: 'rgba(139, 100, 0, 0.55)' }, // 影视后期 - 金色
        { color: '#87CEEB', shadow: 'rgba(0, 80, 120, 0.55)' },  // 三维动画 - 天蓝
        { color: '#E8E8E8', shadow: 'rgba(60, 60, 60, 0.55)' }   // 寂静的黎明 - 浅灰
    ];

    function switchVideo(index) {
        if (index === activeVideo || isTransitioning) return;

        isTransitioning = true;

        // Remove active from current
        videoLayers[activeVideo].classList.remove('active');
        switchBtns[activeVideo].classList.remove('active');

        // Set new active
        activeVideo = index;
        videoLayers[activeVideo].classList.add('active');
        switchBtns[activeVideo].classList.add('active');

        // Update fold text color based on selected video
        const foldChars = document.querySelectorAll('.fold-char');
        const theme = videoColors[index] || videoColors[0];
        foldChars.forEach(char => {
            char.style.color = theme.color;
            char.style.textShadow = `0 1px 0 ${theme.shadow}`;
        });

        // Dark mode for Deep Woods (index 2)
        if (activeVideo === 2) {
            heroContent.classList.add('dark-mode');
        } else {
            heroContent.classList.remove('dark-mode');
        }

        // Cooldown
        setTimeout(() => {
            isTransitioning = false;
        }, TRANSITION_DURATION);
    }

    // Attach click listeners to switch buttons
    switchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index, 10);
            switchVideo(index);
        });
    });

    // ========== Mobile Menu Toggle ==========
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close menu on backdrop click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        hamburgerBtn.classList.add('open');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        hamburgerBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    // ========== FAQ Accordion ==========
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all others
            faqItems.forEach(i => i.classList.remove('open'));
            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // ========== Back to Top Button ==========
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== Fold Text Animation (3D fold unfold) ==========
    if (typeof gsap !== 'undefined') {
        const foldChars = document.querySelectorAll('.fold-char');

        if (foldChars.length) {
            const duration = 0.65;
            const stagger = 0.045;
            const ease = 'power3.out';

            // Check reduced motion preference
            const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

            if (!prefersReducedMotion) {
                // Build timeline - fold from top hinge
                const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

                tl.to(foldChars, {
                    rotateX: 0,
                    scaleY: 1,
                    opacity: 1,
                    duration: duration,
                    ease: ease,
                    stagger: { each: stagger, from: 'start' },
                    transformOrigin: 'top center'
                }, 0);

                // Play on load
                tl.play(0);
            } else {
                // Reduced motion: show final state immediately
                gsap.set(foldChars, {
                    rotateX: 0,
                    scaleY: 1,
                    opacity: 1,
                    transformOrigin: 'top center'
                });
            }
        }
    }

})();