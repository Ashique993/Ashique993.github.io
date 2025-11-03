// Modern Portfolio JavaScript with React-like patterns
// Author: Mohammed Ashiq S

class PortfolioApp {
    constructor() {
        this.state = {
            theme: 'dark',
            currentSection: 'home',
            isScrolling: false,
            animations: {
                skills: false,
                projects: false,
                experience: false
            }
        };
        
        this.components = {};
        this.observers = new Map();
        
        this.init();
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupIntersectionObservers();
        this.startAnimations();
    }

    // Setup all event listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Mobile menu
        const hamburger = document.getElementById('hamburger');
        hamburger?.addEventListener('click', () => this.toggleMobileMenu());

        // Form submission
        const contactForm = document.getElementById('contactForm');
        contactForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Real-time form validation
        const formInputs = contactForm?.querySelectorAll('.form-control');
        formInputs?.forEach(input => {
            input.addEventListener('input', (e) => this.validateField(e.target));
            input.addEventListener('blur', (e) => this.validateField(e.target));
        });

        // Scroll event for navbar
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Resize event
        window.addEventListener('resize', () => this.handleResize());
    }

    // Initialize components
    initializeComponents() {
        this.components = {
            typingAnimation: new TypingAnimation(),
            particleSystem: new ParticleSystem(),
            skillBars: new SkillBars(),
            scrollManager: new ScrollManager(),
            formValidator: new FormValidator()
        };
    }

    // Setup intersection observers for animations
    setupIntersectionObservers() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        // Skills section observer
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.state.animations.skills) {
                    this.state.animations.skills = true;
                    this.components.skillBars.animate();
                }
            });
        }, observerOptions);

        // Projects section observer
        const projectsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.state.animations.projects) {
                    this.state.animations.projects = true;
                    this.animateProjects();
                }
            });
        }, observerOptions);

        // Experience section observer
        const experienceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.state.animations.experience) {
                    this.state.animations.experience = true;
                    this.animateExperience();
                }
            });
        }, observerOptions);

        // Attach observers
        const skillsSection = document.getElementById('skills');
        const projectsSection = document.getElementById('projects');
        const experienceSection = document.getElementById('experience');

        if (skillsSection) skillsObserver.observe(skillsSection);
        if (projectsSection) projectsObserver.observe(projectsSection);
        if (experienceSection) experienceObserver.observe(experienceSection);

        this.observers.set('skills', skillsObserver);
        this.observers.set('projects', projectsObserver);
        this.observers.set('experience', experienceObserver);
    }

    // Theme toggle functionality
    toggleTheme() {
        const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.setState({ theme: newTheme });
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        }
        
        // Store theme preference
        localStorage.setItem('theme', newTheme);
    }

    // Navigation handler with smooth scroll
    handleNavigation(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('data-section');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            this.setState({ currentSection: targetId });
            this.components.scrollManager.smoothScrollTo(targetSection);
            this.updateActiveNavLink(targetId);
        }
    }

    // Update active navigation link
    updateActiveNavLink(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }

    // Mobile menu toggle
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu?.classList.toggle('mobile-open');
    }

    // Handle scroll events
    handleScroll() {
        if (this.state.isScrolling) return;
        
        this.setState({ isScrolling: true });
        
        requestAnimationFrame(() => {
            this.updateActiveSection();
            this.updateNavbarBackground();
            this.setState({ isScrolling: false });
        });
    }

    // Update active section based on scroll position
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const sectionId = section.getAttribute('id');
                if (sectionId !== this.state.currentSection) {
                    this.setState({ currentSection: sectionId });
                    this.updateActiveNavLink(sectionId);
                }
            }
        });
    }

    // Update navbar background on scroll
    updateNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }

    // Handle window resize
    handleResize() {
        this.components.particleSystem.handleResize();
    }

    // Form submission handler
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validate all fields
        const isValid = this.components.formValidator.validateAll(e.target);
        
        if (isValid) {
            await this.submitForm(data);
        }
    }

    // Simulate form submission
    async submitForm(data) {
        const submitButton = document.querySelector('.contact-form button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        this.showNotification('Message sent successfully!', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Validate form field
    validateField(field) {
        return this.components.formValidator.validateField(field);
    }

    // Animate projects
    animateProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 200);
        });
    }

    // Animate experience timeline
    animateExperience() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 300);
        });
    }

    // Start initial animations
    startAnimations() {
        this.components.typingAnimation.start();
        this.components.particleSystem.init();
    }

    // State management (React-like)
    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    // Cleanup observers
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.components.particleSystem.destroy();
    }
}

// Typing Animation Component
class TypingAnimation {
    constructor() {
        this.element = document.getElementById('typingText');
        this.texts = [
            'AI & Data Science Graduate',
            'Python Developer',
            'Machine Learning Engineer',
            'Computer Vision Specialist',
            'Google Developer Groups Salem Organizer'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.speed = 100;
    }

    start() {
        if (!this.element) return;
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Particle System Component
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.querySelector('.particles-container');
    }

    init() {
        if (!this.container) return;
        this.createParticles();
        this.animate();
    }

    createParticles() {
        const particleCount = window.innerWidth > 768 ? 20 : 10;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-dynamic';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: var(--color-primary);
                border-radius: 50%;
                pointer-events: none;
                opacity: ${Math.random() * 0.6 + 0.2};
            `;
            
            this.container.appendChild(particle);
            
            this.particles.push({
                element: particle,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 4 + 2
            });
        }
    }

    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x <= 0 || particle.x >= window.innerWidth) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= window.innerHeight) particle.vy *= -1;

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
            particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));

            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });

        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        // Update particle bounds on resize
        this.particles.forEach(particle => {
            if (particle.x > window.innerWidth) particle.x = window.innerWidth - 10;
            if (particle.y > window.innerHeight) particle.y = window.innerHeight - 10;
        });
    }

    destroy() {
        this.particles.forEach(particle => {
            particle.element.remove();
        });
        this.particles = [];
    }
}

// Skill Bars Component
class SkillBars {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
    }

    animate() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.setProperty('--progress-width', `${width}%`);
                bar.classList.add('animate');
            }, index * 100);
        });
    }
}

// Scroll Manager Component
class ScrollManager {
    smoothScrollTo(element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Form Validator Component
class FormValidator {
    constructor() {
        this.patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            name: /^[a-zA-Z\s]{2,50}$/
        };
    }

    validateField(field) {
        const { name, value, type } = field;
        const errorElement = document.getElementById(`${name}Error`);
        let isValid = true;
        let errorMessage = '';

        // Remove previous validation styles
        field.classList.remove('invalid', 'valid');

        // Check if field is required and empty
        if (field.hasAttribute('required') && !value.trim()) {
            isValid = false;
            errorMessage = `${this.capitalize(name)} is required`;
        }
        // Email validation
        else if (type === 'email' && value && !this.patterns.email.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        // Name validation
        else if (name === 'name' && value && !this.patterns.name.test(value)) {
            isValid = false;
            errorMessage = 'Name should contain only letters and spaces (2-50 characters)';
        }
        // Subject validation
        else if (name === 'subject' && value && value.length < 3) {
            isValid = false;
            errorMessage = 'Subject should be at least 3 characters long';
        }
        // Message validation
        else if (name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message should be at least 10 characters long';
        }

        // Update UI
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.toggle('show', !isValid);
        }

        field.classList.add(isValid ? 'valid' : 'invalid');
        return isValid;
    }

    validateAll(form) {
        const fields = form.querySelectorAll('.form-control');
        let allValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });

        return allValid;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Custom Hooks (React-like patterns)
const useScrollPosition = () => {
    let scrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });
    
    return () => scrollY;
};

const useIntersectionObserver = (callback, options) => {
    return new IntersectionObserver(callback, options);
};

const useLocalStorage = (key, defaultValue) => {
    const getValue = () => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    };

    const setValue = (value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [getValue, setValue];
};

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Add notification styles dynamically
const addNotificationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 2rem;
            border-radius: var(--radius-base);
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s var(--ease-standard);
            max-width: 300px;
        }
        
        .notification--success {
            background: var(--color-success);
        }
        
        .notification--error {
            background: var(--color-error);
        }
        
        .notification--info {
            background: var(--color-info);
        }
        
        .notification--warning {
            background: var(--color-warning);
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 1rem;
                left: 1rem;
                max-width: none;
                transform: translateY(-100%);
            }
        }
    `;
    document.head.appendChild(style);
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const [getTheme, setTheme] = useLocalStorage('theme', 'dark');
    const savedTheme = getTheme();
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }
    
    // Add notification styles
    addNotificationStyles();
    
    // Initialize main application
    window.portfolioApp = new PortfolioApp();
    window.portfolioApp.setState({ theme: savedTheme });
    
    // Add custom cursor effect
    const addCustomCursor = () => {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--color-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.opacity = '0.5';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '0.5';
        });
        
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        
        // Add hover effects for interactive elements
        document.querySelectorAll('a, button, .project-card, .skill-category').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.opacity = '0.8';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.opacity = '0.5';
            });
        });
    };
    
    // Add custom cursor on desktop
    if (window.innerWidth > 768) {
        addCustomCursor();
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.portfolioApp) {
        window.portfolioApp.destroy();
    }
});