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

// Contact card click interactions
function setupContactInteractions() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        const contactPhoto = card.querySelector('.contact-photo');
        const callButton = card.querySelector('.call-button');
        const callingOverlay = card.querySelector('.calling-overlay');
        const contactName = card.getAttribute('data-contact');
        
        // Click on photo to show call button
        contactPhoto.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Hide all other call buttons and overlays
            contactCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('selected');
                    otherCard.querySelector('.call-button').style.display = 'none';
                    otherCard.querySelector('.calling-overlay').style.display = 'none';
                }
            });
            
            // Toggle call button for this card
            if (callButton.style.display === 'none') {
                card.classList.add('selected');
                callButton.style.display = 'flex';
            } else {
                card.classList.remove('selected');
                callButton.style.display = 'none';
            }
        });
        
        // Click on call button to show calling state
        callButton.addEventListener('click', function(e) {
            e.stopPropagation();
            callingOverlay.style.display = 'flex';
            
            // Update calling text with contact name
            const callingText = callingOverlay.querySelector('.calling-text');
            callingText.textContent = `Calling ${contactName}...`;
            
            // After 3 seconds, reset (for demo purposes)
            setTimeout(() => {
                callingOverlay.style.display = 'none';
                callButton.style.display = 'none';
                card.classList.remove('selected');
            }, 3000);
        });
        
        // Click on calling overlay to close
        callingOverlay.addEventListener('click', function(e) {
            e.stopPropagation();
            callingOverlay.style.display = 'none';
            callButton.style.display = 'none';
            card.classList.remove('selected');
        });
    });
    
    // Click outside to close all
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.contact-card')) {
            contactCards.forEach(card => {
                card.classList.remove('selected');
                card.querySelector('.call-button').style.display = 'none';
                card.querySelector('.calling-overlay').style.display = 'none';
            });
        }
    });
}

// Initialize contact interactions when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadContactImages();
    hideInitialsOnImageLoad();
    setupContactInteractions();
});

