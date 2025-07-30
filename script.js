// SHOPINDIA E-commerce Website JavaScript

// Global Variables
let cart = JSON.parse(localStorage.getItem('shopindiaCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('shopindiaWishlist')) || [];
let isLoggedIn = localStorage.getItem('shopindiaLoggedIn') === 'true';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    updateCartCount();
    updateWishlistCount();
    initializeProductCards();
    initializeNewsletterForm();
    initializeSearchFunctionality();
    initializeSmoothScrolling();
    initializeAnimations();
});

// Initialize Website
function initializeWebsite() {
    console.log('SHOPINDIA Website Initialized');
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('btn-cart')) {
                e.preventDefault();
                handleAddToCart(this);
            }
        });
    });
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize product image hover effects
    initializeProductImageEffects();
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    // Create mobile menu toggle button
    const header = document.querySelector('.header');
    const navWrapper = document.querySelector('.nav-wrapper');
    
    // Add mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.style.display = 'none';
    
    // Insert mobile menu button
    navWrapper.insertBefore(mobileMenuBtn, navWrapper.lastElementChild);
    
    // Mobile menu toggle functionality
    mobileMenuBtn.addEventListener('click', function() {
        const mainNav = document.querySelector('.main-nav');
        mainNav.classList.toggle('mobile-active');
        
        const icon = this.querySelector('i');
        if (mainNav.classList.contains('mobile-active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Show/hide mobile menu button based on screen size
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
        } else {
            mobileMenuBtn.style.display = 'none';
            document.querySelector('.main-nav').classList.remove('mobile-active');
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// Product Cards Functionality
function initializeProductCards() {
    document.querySelectorAll('.product-card').forEach(card => {
        // Add to cart functionality
        const addToCartBtn = card.querySelector('.btn-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleAddToCart(this);
            });
        }
        
        // Quick view functionality
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-cart') && !e.target.closest('.product-badges')) {
                showProductQuickView(this);
            }
        });
        
        // Wishlist functionality
        addWishlistButton(card);
    });
}

// Add to Cart Functionality
function handleAddToCart(button) {
    const productCard = button.closest('.product-card');
    const product = extractProductData(productCard);
    
    // Add loading state
    button.classList.add('loading');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    
    setTimeout(() => {
        addToCart(product);
        
        // Success state
        button.classList.remove('loading');
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = 'var(--success-color)';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = 'Add to Cart';
            button.style.background = '';
        }, 2000);
        
        // Show success notification
        showNotification('Product added to cart successfully!', 'success');
        
    }, 1000);
}

// Extract Product Data
function extractProductData(productCard) {
    const title = productCard.querySelector('h3').textContent;
    const price = productCard.querySelector('.current-price').textContent;
    const image = productCard.querySelector('img').src;
    const description = productCard.querySelector('.product-desc')?.textContent || '';
    
    return {
        id: generateProductId(title),
        title: title,
        price: price,
        image: image,
        description: description,
        quantity: 1
    };
}

// Generate Product ID
function generateProductId(title) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Add to Cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('shopindiaCart', JSON.stringify(cart));
    updateCartCount();
}

// Update Cart Count
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.user-actions .count').forEach(countElement => {
        if (countElement.closest('a[href="#cart"]')) {
            countElement.textContent = cartCount;
        }
    });
}

// Wishlist Functionality
function addWishlistButton(productCard) {
    const productImage = productCard.querySelector('.product-image');
    const wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'wishlist-btn';
    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
    
    // Style the wishlist button
    wishlistBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255,255,255,0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
    `;
    
    productImage.style.position = 'relative';
    productImage.appendChild(wishlistBtn);
    
    wishlistBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleWishlist(this, productCard);
    });
}

// Toggle Wishlist
function toggleWishlist(button, productCard) {
    const product = extractProductData(productCard);
    const existingIndex = wishlist.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.style.color = '';
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(product);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.style.color = 'var(--error-color)';
        showNotification('Added to wishlist', 'success');
    }
    
    localStorage.setItem('shopindiaWishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

// Update Wishlist Count
function updateWishlistCount() {
    const wishlistCount = wishlist.length;
    document.querySelectorAll('.user-actions .count').forEach(countElement => {
        if (countElement.closest('a[href="#wishlist"]')) {
            countElement.textContent = wishlistCount;
        }
    });
}

// Newsletter Form
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmission(this);
        });
    }
}

// Handle Newsletter Submission
function handleNewsletterSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput.value;
    
    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Add loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Success
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        emailInput.value = '';
        showNotification('Successfully subscribed to our newsletter!', 'success');
        
        // Reset button
        setTimeout(() => {
            submitBtn.innerHTML = 'Subscribe';
            submitBtn.disabled = false;
        }, 3000);
        
        // Store subscription
        localStorage.setItem('shopindiaNewsletterSubscribed', 'true');
        
    }, 2000);
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Search Functionality
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchInput && searchButton) {
        // Search on button click
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
        
        // Search suggestions (autocomplete)
        searchInput.addEventListener('input', function() {
            showSearchSuggestions(this.value);
        });
    }
}

// Perform Search
function performSearch(query) {
    if (query.trim() === '') {
        showNotification('Please enter a search term', 'warning');
        return;
    }
    
    console.log('Searching for:', query);
    showNotification(`Searching for "${query}"...`, 'info');
    
    // Here you would typically make an API call to search products
    // For demo purposes, we'll just show a notification
    setTimeout(() => {
        showNotification(`Found results for "${query}"`, 'success');
    }, 1500);
}

// Show Search Suggestions
function showSearchSuggestions(query) {
    if (query.length < 2) return;
    
    const suggestions = [
        'Banarasi Silk Saree',
        'Kashmiri Saffron',
        'Madhubani Painting',
        'Brass Diya Set',
        'Indian Spices',
        'Traditional Jewelry',
        'Handicrafts',
        'Kurta Pajama'
    ];
    
    const filteredSuggestions = suggestions.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
    );
    
    // Create suggestions dropdown (simplified)
    console.log('Suggestions:', filteredSuggestions);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.value-item, .category-card, .product-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Product Image Effects
function initializeProductImageEffects() {
    document.querySelectorAll('.product-card').forEach(card => {
        const img = card.querySelector('.product-image img');
        
        card.addEventListener('mouseenter', function() {
            img.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
        });
    });
}

// Quick View Modal
function showProductQuickView(productCard) {
    const product = extractProductData(productCard);
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="modal-info">
                        <h2>${product.title}</h2>
                        <p class="modal-price">${product.price}</p>
                        <p class="modal-description">${product.description}</p>
                        <div class="modal-actions">
                            <button class="btn btn-primary modal-add-cart">Add to Cart</button>
                            <button class="btn btn-outline modal-add-wishlist">Add to Wishlist</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Modal functionality
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    modal.querySelector('.modal-add-cart').addEventListener('click', function() {
        addToCart(product);
        showNotification('Product added to cart!', 'success');
        closeModal();
    });
    
    function closeModal() {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--white);
        color: var(--text-dark);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'primary'}-color);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Close functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.querySelector('.notification-close').click();
        }
    }, 5000);
}

// Add notification animations to CSS
const notificationStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-dark);
    cursor: pointer;
    padding: 0.5rem;
}

@media (max-width: 768px) {
    .main-nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--white);
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        transform: translateY(-10px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .main-nav.mobile-active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }
    
    .main-nav ul {
        flex-direction: column;
        padding: 1rem;
        gap: 0;
    }
    
    .main-nav li {
        border-bottom: 1px solid var(--border-color);
    }
    
    .main-nav li:last-child {
        border-bottom: none;
    }
    
    .main-nav a {
        display: block;
        padding: 1rem;
        text-align: center;
    }
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Export functions for external use
window.SHOPINDIA = {
    addToCart,
    showNotification,
    cart,
    wishlist
};