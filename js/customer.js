// Customers of the Week Carousel - Add this to your script.js file

document.addEventListener('DOMContentLoaded', function() {
    const customersCarousel = {
        track: document.querySelector('.customers-track'),
        cards: document.querySelectorAll('.customer-card'),
        prevBtn: document.querySelector('.carousel-nav.prev'),
        nextBtn: document.querySelector('.carousel-nav.next'),
        indicators: document.querySelectorAll('.indicator'),
        
        currentIndex: 0,
        totalSlides: 0,
        cardWidth: 380, // card width + gap
        visibleCards: 3,
        isAutoPlaying: true,
        autoPlayInterval: null,
        
        init() {
            if (!this.track || !this.cards.length) return;
            
            this.totalSlides = Math.ceil(this.cards.length / this.visibleCards);
            this.setupResponsive();
            this.bindEvents();
            this.updateActiveCards();
            this.startAutoPlay();
            
            // Set initial position
            this.updateCarousel();
        },
        
        setupResponsive() {
            const updateVisibleCards = () => {
                if (window.innerWidth <= 480) {
                    this.visibleCards = 1;
                    this.cardWidth = 280;
                } else if (window.innerWidth <= 768) {
                    this.visibleCards = 2;
                    this.cardWidth = 320;
                } else {
                    this.visibleCards = 3;
                    this.cardWidth = 380;
                }
                this.totalSlides = Math.ceil(this.cards.length / this.visibleCards);
            };
            
            updateVisibleCards();
            window.addEventListener('resize', updateVisibleCards);
        },
        
        bindEvents() {
            // Navigation buttons
            this.prevBtn?.addEventListener('click', () => this.prevSlide());
            this.nextBtn?.addEventListener('click', () => this.nextSlide());
            
            // Indicators
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Pause auto-play on hover
            this.track?.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.track?.addEventListener('mouseleave', () => this.resumeAutoPlay());
            
            // Touch/swipe support
            this.setupTouchEvents();
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            });
        },
        
        setupTouchEvents() {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            this.track?.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                this.pauseAutoPlay();
            });
            
            this.track?.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                currentX = e.touches[0].clientX;
            });
            
            this.track?.addEventListener('touchend', () => {
                if (!isDragging) return;
                
                const diff = startX - currentX;
                const threshold = 50;
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                
                isDragging = false;
                this.resumeAutoPlay();
            });
        },
        
        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
            this.updateCarousel();
        },
        
        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.updateCarousel();
        },
        
        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
        },
        
        updateCarousel() {
            const translateX = -this.currentIndex * this.cardWidth * this.visibleCards;
            
            this.track.style.transform = `translateX(${translateX}px)`;
            
            // Update indicators
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentIndex);
            });
            
            // Update active cards
            this.updateActiveCards();
            
            // Add smooth animation class
            this.track.classList.add('transitioning');
            setTimeout(() => {
                this.track.classList.remove('transitioning');
            }, 600);
        },
        
        updateActiveCards() {
            this.cards.forEach((card, index) => {
                const slideIndex = Math.floor(index / this.visibleCards);
                card.classList.toggle('active', slideIndex === this.currentIndex);
            });
        },
        
        startAutoPlay() {
            if (!this.isAutoPlaying) return;
            
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, 4000);
        },
        
        pauseAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        },
        
        resumeAutoPlay() {
            if (this.isAutoPlaying && !this.autoPlayInterval) {
                this.startAutoPlay();
            }
        }
    };
    
    // Initialize the carousel
    customersCarousel.init();
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger card animations with stagger
                const cards = entry.target.querySelectorAll('.customer-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(0.9)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe the customers section
    const customersSection = document.getElementById('customers-week');
    if (customersSection) {
        observer.observe(customersSection);
    }
    
    // Add parallax effect to section background
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const customersSection = document.getElementById('customers-week');
        
        if (customersSection) {
            const rate = scrolled * -0.3;
            customersSection.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
});

// Add some CSS classes for smoother animations
const additionalStyles = `
.customers-track.transitioning {
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

.animate-in .customer-card {
    animation: slideInFromRight 0.8s ease-out forwards;
}

@keyframes slideInFromRight {
    0% {
        opacity: 0;
        transform: translateX(50px) scale(0.8);
    }
    100% {
        opacity: 1;
        transform: translateX(0) scale(0.9);
    }
}

.customer-card.active {
    animation: scaleUp 0.4s ease-out forwards;
}

@keyframes scaleUp {
    0% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);