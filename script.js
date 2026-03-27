// ================================================
// OSITEX CREATIVE HUB - script.js
// ================================================


// ------------------------------------------------
// 1. INTRO ANIMATION SEQUENCE
// ------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

    const overlay     = document.getElementById('introOverlay');
    const flare       = document.getElementById('introFlare');
    const welcome     = document.getElementById('introWelcome');
    const company     = document.getElementById('introCompany');
    const typingEl    = document.getElementById('introTyping');
    const sub         = document.getElementById('introSub');
    const companyName = 'OSITEX CREATIVE HUB';

    // STEP 1 — Logo fades in via CSS automatically at 0.3s

    // STEP 2 — Golden flare shoots across at 1.2s
    setTimeout(() => {
        flare.classList.add('animate');
    }, 1200);

    // STEP 3 — Welcome To fades in at 2.2s
    setTimeout(() => {
        welcome.classList.add('show');
    }, 2200);

    // STEP 4 — Company name types out at 2.8s
    setTimeout(() => {
        company.classList.add('show');
        let i = 0;
        const typingSpeed = 80;

        function typeLetter() {
            if (i < companyName.length) {
                typingEl.textContent += companyName.charAt(i);
                i++;
                setTimeout(typeLetter, typingSpeed);
            }
        }
        typeLetter();
    }, 2800);

    // STEP 5 — Subheading fades in at 4.2s
    setTimeout(() => {
        sub.classList.add('show');
    }, 4200);

    // STEP 6 — Intro slides up at 5.5s
    setTimeout(() => {
        overlay.classList.add('slide-up');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 800);
    }, 5500);


    // ------------------------------------------------
    // 2. HAMBURGER MENU - event listener inside DOM
    // ------------------------------------------------
    const navLinks  = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');

    // Close menu when a nav link is clicked
    if (navLinks && hamburger) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', false);
            });
        });
    }

    // Highlight active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const links    = document.querySelectorAll('.nav-links a');
        let current    = '';

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 100) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // ------------------------------------------------
    // 3. GET STARTED MODAL - event listeners inside DOM
    // ------------------------------------------------
    const modal = document.getElementById('getStartedModal');
    const form  = document.getElementById('getStartedForm');

    // Close modal when clicking outside the box
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const data = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    form.style.display = 'none';
                    document.getElementById('modalThankyou').classList.add('show');
                } else {
                    alert('Something went wrong. Please try again.');
                }
            })
            .catch(error => {
                alert('Something went wrong. Please check your connection and try again.');
            });
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

});


// ================================================
// GLOBAL FUNCTIONS
// Must be OUTSIDE DOMContentLoaded so HTML
// onclick attributes can find them
// ================================================

// FAQ Accordion toggle
function toggleFaq(button) {
    const faqItem   = button.parentElement;
    const answer    = faqItem.querySelector('.faq-answer');
    const icon      = button.querySelector('.faq-icon');
    const isOpen    = faqItem.classList.contains('open');

    // Close all other open FAQ items first
    document.querySelectorAll('.faq-item.open').forEach(item => {
        item.classList.remove('open');
        item.querySelector('.faq-answer').style.maxHeight = null;
        item.querySelector('.faq-icon').textContent = '+';
    });

    // If it was not open, open it
    if (!isOpen) {
        faqItem.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.textContent = '×';
    }
}

// Hamburger toggle
function toggleMenu() {
    const navLinks  = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');

    if (navLinks && hamburger) {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    }
}

// Open modal
function openModal() {
    const modal = document.getElementById('getStartedModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal() {
    const modal    = document.getElementById('getStartedModal');
    const form     = document.getElementById('getStartedForm');
    const thankyou = document.getElementById('modalThankyou');

    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
    if (form) {
        form.style.display = 'flex';
        form.reset();
    }
    if (thankyou) {
        thankyou.classList.remove('show');
    }
}

// ------------------------------------------------
// PORTFOLIO FILTER
// ------------------------------------------------
function filterPortfolio(category) {
    const cards = document.querySelectorAll('.portfolio-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        }
    });

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}

// Add click events to filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        filterPortfolio(this.getAttribute('data-filter'));
    });
});


// ------------------------------------------------
// TESTIMONIALS SLIDER
// ------------------------------------------------
let currentSlide = 0;

function slideTestimonials(direction) {
    const track     = document.getElementById('testimonialsTrack');
    const cards     = document.querySelectorAll('.testimonial-card');
    const dots      = document.querySelectorAll('.dot');
    const total     = cards.length;

    currentSlide += direction;

    if (currentSlide < 0) currentSlide = total - 1;
    if (currentSlide >= total) currentSlide = 0;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Generate testimonial dots on load
generateDots();

// Generate dots
function generateDots() {
    const dotsContainer = document.getElementById('sliderDots');
    const cards         = document.querySelectorAll('.testimonial-card');

    if (!dotsContainer) return;

    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentSlide = index;
            slideTestimonials(0);
        });
        dotsContainer.appendChild(dot);
    });
}

// Auto slide testimonials every 5 seconds
let autoSlide = setInterval(() => slideTestimonials(1), 5000);

// Pause auto slide on hover
document.getElementById('testimonialsSlider')?.addEventListener('mouseenter', () => {
    clearInterval(autoSlide);
});

document.getElementById('testimonialsSlider')?.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => slideTestimonials(1), 5000);
});


// ------------------------------------------------
// STATS COUNTER ANIMATION
// ------------------------------------------------
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target   = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step     = target / (duration / 16);
        let current    = 0;

        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Trigger stats animation when portfolio section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.3 });

const portfolioSection = document.getElementById('portfolio');
if (portfolioSection) statsObserver.observe(portfolioSection);


// ------------------------------------------------
// BACK TO TOP BUTTON
// ------------------------------------------------
window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.addEventListener('contextmenu', e => e.preventDefault());  // kills right-click
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || (e.ctrlKey && e.key === 'U')) {
    e.preventDefault();
  }
});