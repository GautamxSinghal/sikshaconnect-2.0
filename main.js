// SikshaConnect 2.0 - Main JavaScript Functions

// Global state
let currentSlide = 0;
let slideInterval;

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Navigation
function toggleMobileMenu() {
    document.querySelector('.nav-menu').classList.toggle('show');
}

// Course Slider
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!slides.length || !dotsContainer) return;
    
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
}

function startSlider() {
    stopSlider();
    slideInterval = setInterval(nextSlide, 4000);
}

function stopSlider() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function updateSlider() {
    const container = document.getElementById('courseSlider');
    const dots = document.querySelectorAll('.dot');
    
    if (container) {
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.impact-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Course Filtering
function initCourseFiltering() {
    const searchInput = document.getElementById('courseSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!searchInput || !filterButtons.length) return;

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterCourses(searchTerm, getActiveFilter());
    });

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter courses
            const category = button.getAttribute('data-filter');
            const searchTerm = searchInput.value.toLowerCase();
            filterCourses(searchTerm, category);
        });
    });
}

function getActiveFilter() {
    const activeButton = document.querySelector('.filter-btn.active');
    return activeButton ? activeButton.getAttribute('data-filter') : 'all';
}

function filterCourses(searchTerm, category) {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const title = card.querySelector('.course-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.course-description')?.textContent.toLowerCase() || '';
        const cardCategory = card.getAttribute('data-category');
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = category === 'all' || cardCategory === category;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Simulate form submission
            showSuccess('formSuccess');
            form.reset();
        }
    });
}

function validateForm() {
    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';
    
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.error').forEach(error => {
        error.classList.add('hidden');
    });
    
    // Validate name
    if (!name) {
        showError('nameError');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showError('emailError');
        isValid = false;
    }
    
    // Validate message
    if (!message) {
        showError('messageError');
        isValid = false;
    }
    
    return isValid;
}

function showError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

function showSuccess(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.add('hidden');
        }, 5000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu && mobileToggle && 
            !navMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('show');
        }
    });
    
    // Smooth scrolling for internal links
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
});

// Performance optimizations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for performance
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize performance optimizations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
} else {
    lazyLoadImages();
}

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        // This is commented out as we don't have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}