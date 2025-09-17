// Youth For Earth - Facts Page Interactive Effects

document.addEventListener('DOMContentLoaded', function() {
    initFactsAnimations();
    initCounterAnimations();
});

// Initialize facts page animations
function initFactsAnimations() {
    const factItems = document.querySelectorAll('.fact-item');
    
    // Intersection Observer for fact items
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const factObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation delay
                const index = Array.from(factItems).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.2}s`;
            }
        });
    }, observerOptions);

    // Observe all fact items
    factItems.forEach(item => {
        factObserver.observe(item);
    });
}

// Counter animation for numbers
function initCounterAnimations() {
    const counters = document.querySelectorAll('.fact-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate counter numbers
function animateCounter(element) {
    const text = element.textContent;
    const number = parseFloat(text.replace(/[^\d.]/g, ''));
    const suffix = text.replace(/[\d.]/g, '');
    
    if (isNaN(number)) return;
    
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentNumber = number * easeOutQuart;
        
        // Format the number based on its size
        let displayNumber;
        if (number >= 1000000000) {
            displayNumber = (currentNumber / 1000000000).toFixed(1) + 'B';
        } else if (number >= 1000000) {
            displayNumber = (currentNumber / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            displayNumber = (currentNumber / 1000).toFixed(1) + 'K';
        } else if (number % 1 !== 0) {
            displayNumber = currentNumber.toFixed(1);
        } else {
            displayNumber = Math.round(currentNumber);
        }
        
        element.textContent = displayNumber + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = text; // Ensure final value is exact
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Add hover effects to fact items
document.addEventListener('DOMContentLoaded', function() {
    const factItems = document.querySelectorAll('.fact-item');
    
    factItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 10px 30px rgba(45, 90, 39, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
});

// Add parallax effect to hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${parallax}px)`;
        }
    });
}

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', initParallaxEffect);

// Add typing effect to hero text
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = function() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// Initialize typing effect only on facts page
if (window.location.pathname.includes('facts.html')) {
    document.addEventListener('DOMContentLoaded', initTypingEffect);
}
