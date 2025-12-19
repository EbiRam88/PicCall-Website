// Load contact images if available
function loadContactImages() {
    const contactPhotos = document.querySelectorAll('.contact-photo[data-image]');
    
    contactPhotos.forEach(photo => {
        const imagePath = photo.getAttribute('data-image');
        // Try PNG first since that's what we have
        const formats = ['png', 'jpg', 'jpeg', 'webp'];
        let imageLoaded = false;
        
        const tryLoadImage = (format) => {
            if (imageLoaded) return;
            
            const img = new Image();
            const imageUrl = `${imagePath}.${format}`;
            
            img.onload = function() {
                photo.style.backgroundImage = `url(${imageUrl})`;
                photo.classList.add('has-image');
                imageLoaded = true;
                // Hide the initial when image loads
                const initial = photo.querySelector('.contact-initial');
                if (initial) {
                    initial.style.display = 'none';
                }
            };
            
            img.onerror = function() {
                // Try next format
                const currentIndex = formats.indexOf(format);
                if (currentIndex < formats.length - 1) {
                    tryLoadImage(formats[currentIndex + 1]);
                }
            };
            
            img.src = imageUrl;
        };
        
        // Start with PNG
        tryLoadImage('png');
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hide initials when images load
function hideInitialsOnImageLoad() {
    const contactImages = document.querySelectorAll('.contact-image');
    contactImages.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
            // Image already loaded
            img.style.display = 'block';
            const initial = img.parentElement.querySelector('.contact-initial');
            if (initial) {
                initial.style.display = 'none';
            }
        } else {
            // Wait for image to load
            img.addEventListener('load', function() {
                this.style.display = 'block';
                const initial = this.parentElement.querySelector('.contact-initial');
                if (initial) {
                    initial.style.display = 'none';
                }
            });
        }
    });
}

// Load images when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadContactImages();
    hideInitialsOnImageLoad();
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and steps
document.querySelectorAll('.feature-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

