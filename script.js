// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate GSAP's ScrollTrigger with Lenis
gsap.registerPlugin(ScrollTrigger);

// Preloader Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.logo-text', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    })
        .to('.logo-text', {
            scale: 1.1,
            duration: 3,
            ease: 'power1.inOut'
        }, "-=0.5")
        .to('.preloader', {
            yPercent: -100,
            duration: 1,
            ease: 'power3.inOut'
        })
        .add(() => {
            document.body.classList.add('loaded');
            initAnimations();
        }, "-=0.5");
});

function initAnimations() {
    // Reveal Text Animation for Hero
    gsap.utils.toArray('.reveal-text').forEach((text, i) => {
        gsap.from(text, {
            y: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.2 * i
        });
    });

    // Parallax Effects using data-speed attributes
    // Use Lenis scroll listener or GSAP ScrollTrigger
    // Since we're using Lenis, we can stick to ScrollTrigger which works with native scroll (Lenis emulates it)

    // Hero Parallax
    gsap.to('.hero-bg', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        yPercent: 30, // Move image slower than scroll
        ease: 'none'
    });

    // Collections Parallax & Fade In
    gsap.utils.toArray('.collection-item').forEach((item) => {
        const speed = item.dataset.speed || 1;

        // Parallax vertical movement
        gsap.to(item, {
            scrollTrigger: {
                trigger: '.collections-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: (i, target) => -50 * speed, // Subtle shift
            ease: 'none'
        });

        // Fade in on entry
        gsap.from(item.querySelector('.img-container'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 1
            },
            scale: 1.2, // Zoom out effect
            opacity: 0.8,
            ease: 'power2.out'
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.glass-header');
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {
            className: 'scrolled',
            targets: header
        }
    });

    // Editorial Text Reveal
    gsap.from('.editorial-text', {
        scrollTrigger: {
            trigger: '.editorial-section',
            start: 'top 75%',
            end: 'bottom 75%',
            scrub: 1
        },
        opacity: 0.2,
        y: 50,
        color: '#ffffff'
    });
}

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileOverlay = document.querySelector('.mobile-menu-overlay');
const body = document.body;

mobileToggle.addEventListener('click', toggleMenu);

function toggleMenu() {
    body.classList.toggle('nav-open');
    mobileOverlay.classList.toggle('active');

    // Animate hamburger (Simple 2-bar crossing)
    const spans = mobileToggle.querySelectorAll('span');
    if (body.classList.contains('nav-open')) {
        gsap.to(spans[0], { rotation: 45, y: 4, duration: 0.3 });
        gsap.to(spans[1], { rotation: -45, y: -4, duration: 0.3 });
    } else {
        gsap.to(spans, { rotation: 0, y: 0, duration: 0.3 });
    }
}

// Consultation Modal Logic
const modal = document.getElementById('consultation-modal');
// Select all buttons that should open the modal (Book Consultation buttons)
const consultationBtns = document.querySelectorAll('a[href="#contact"]'); // Targeting existing buttons

consultationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent scroll to #contact
        openModal();
    });
});

function openModal() {
    modal.classList.add('active');
    // Optional: Stop Lenis scroll if desired, but overlay handles pointers
    // lenis.stop();
}

function closeModal() {
    modal.classList.remove('active');
    // lenis.start();
}

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function submitConsultation(e) {
    e.preventDefault();

    const name = document.getElementById('customer-name').value;
    const contact = document.getElementById('contact-number').value;
    const requirement = document.getElementById('requirement').value;

    // Format message for WhatsApp
    const message = `*New Consultation Request*%0a%0a*Name:* ${name}%0a*Contact:* ${contact}%0a*Requirement:* ${requirement}`;
    const whatsappUrl = `https://wa.me/917207478600?text=${message}`;

    // Format for Email
    const emailSubject = "New Consultation Request";
    const emailBody = `Name: ${name}%0D%0AContact: ${contact}%0D%0ARequirement: ${requirement}`;
    const mailtoUrl = `mailto:ikramali7@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`;

    // Open WhatsApp (New Tab)
    window.open(whatsappUrl, '_blank');

    // Trigger Email (Default Client) - Small delay to allow browser to process both
    setTimeout(() => {
        window.location.href = mailtoUrl;
    }, 500);

    // Close modal and reset form
    closeModal();
    document.getElementById('consultation-form').reset();
}
