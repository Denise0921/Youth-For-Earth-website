// Youth For Earth - Main JavaScript File
// This file contains all the interactive functionality for our website

// DOM Content Loaded Event
// This runs when the HTML page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when the page loads
    initNavigation();    // Set up navigation menu (mobile menu, scroll effects)
    initScrollEffects(); // Set up scroll animations and effects
    initAnimations();    // Set up hover effects and other animations
});

// Navigation functionality - handles the top navigation bar
function initNavigation() {
    // Get references to HTML elements by their IDs
    const navbar = document.getElementById('navbar');           // The navigation bar
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');  // Hamburger menu button
    const navMenu = document.getElementById('nav-menu');        // The navigation menu list

    // Navbar scroll effect - changes appearance when user scrolls down
    window.addEventListener('scroll', function() {
        // Check if user has scrolled more than 50 pixels down
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');    // Add 'scrolled' class for smaller navbar
        } else {
            navbar.classList.remove('scrolled'); // Remove 'scrolled' class for normal navbar
        }
    });

    // Mobile menu toggle - handles the hamburger menu for mobile devices
    if (mobileMenuToggle && navMenu) {
        // When user clicks the hamburger menu button
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');  // Toggle hamburger animation
            navMenu.classList.toggle('active');           // Show/hide the menu
        });

        // Close mobile menu when clicking on a navigation link
        const navLinks = navMenu.querySelectorAll('a');  // Get all navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');  // Close hamburger menu
                navMenu.classList.remove('active');           // Hide navigation menu
            });
        });

        // Close mobile menu when clicking outside the navigation area
        document.addEventListener('click', function(event) {
            // Check if the click was outside the navbar
            if (!navbar.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');  // Close hamburger menu
                navMenu.classList.remove('active');           // Hide navigation menu
            }
        });
    }
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations
function initAnimations() {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add pulse animation to important elements
    const pulseElements = document.querySelectorAll('.fact-number');
    pulseElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });
}

// Utility functions
function showMessage(message, type = 'success') {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
        messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 5000);
    }
}

function showLoading(button, show = true) {
    const submitText = button.querySelector('#submitText');
    const submitLoading = button.querySelector('#submitLoading');
    
    if (show) {
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline-block';
        button.disabled = true;
    } else {
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
        button.disabled = false;
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize smooth scrolling when DOM is loaded
document.addEventListener('DOMContentLoaded', initSmoothScrolling);

// Add some interactive elements
function addInteractiveElements() {
    // Add click effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Initialize interactive elements
document.addEventListener('DOMContentLoaded', addInteractiveElements);

// Export functions for use in other files
window.YouthForEarth = {
    showMessage,
    showLoading,
    initScrollEffects
};
