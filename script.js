// Firebase Configuration - Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Global Variables
let currentUser = null;
let projects = [];
let reviews = [];
let contacts = [];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Check authentication status
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        if (user) {
            console.log('User is signed in:', user.email);
        } else {
            console.log('User is signed out');
            // Redirect to login if on admin page
            if (window.location.pathname.includes('admin.html')) {
                showLoginModal();
            }
        }
    });

    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'projects':
            initializeProjectsPage();
            break;
        case 'project-detail':
            initializeProjectDetailPage();
            break;
        case 'about':
            initializeAboutPage();
            break;
        case 'contact':
            initializeContactPage();
            break;
        case 'admin':
            initializeAdminPage();
            break;
    }

    // Initialize common functionality
    initializeNavigation();
    initializeModals();
}

// Get Current Page
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('admin.html')) return 'admin';
    if (path.includes('projects.html')) return 'projects';
    if (path.includes('project-detail.html')) return 'project-detail';
    if (path.includes('about.html')) return 'about';
    if (path.includes('contact.html')) return 'contact';
    return 'index';
}

// Initialize Navigation
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
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
}

// Initialize Modals
function initializeModals() {
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal with close button
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
}

// Initialize Home Page
function initializeHomePage() {
    loadFeaturedProjects();
}

// Load Featured Projects
async function loadFeaturedProjects() {
    try {
        const snapshot = await db.collection('projects')
            .where('featured', '==', true)
            .limit(3)
            .get();
        
        const featuredProjects = [];
        snapshot.forEach(doc => {
            featuredProjects.push({ id: doc.id, ...doc.data() });
        });

        displayFeaturedProjects(featuredProjects);
    } catch (error) {
        console.error('Error loading featured projects:', error);
        // Load dummy data if Firebase fails
        loadDummyFeaturedProjects();
    }
}

// Display Featured Projects
function displayFeaturedProjects(projects) {
    const grid = document.getElementById('featured-projects-grid');
    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = '<p>No featured projects available.</p>';
        return;
    }

    grid.innerHTML = projects.map(project => `
        <div class="project-card fade-in" onclick="openProjectDetail('${project.id}')">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-category">${getCategoryDisplayName(project.category)}</p>
                <p class="project-description">${project.description.substring(0, 100)}...</p>
            </div>
        </div>
    `).join('');
}

// Get Category Display Name
function getCategoryDisplayName(category) {
    const categories = {
        'web': 'Web Development',
        'mobile': 'Mobile Apps',
        'design': 'UI/UX Design',
        'fullstack': 'Full Stack'
    };
    return categories[category] || category;
}

// Open Project Detail
function openProjectDetail(projectId) {
    window.location.href = `project-detail.html?id=${projectId}`;
}

// Initialize Projects Page
function initializeProjectsPage() {
    loadAllProjects();
    initializeProjectFilters();
}

// Load All Projects
async function loadAllProjects() {
    try {
        const snapshot = await db.collection('projects').get();
        projects = [];
        snapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() });
        });

        displayAllProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        loadDummyProjects();
    }
}

// Display All Projects
function displayAllProjects(projectsToShow) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    if (projectsToShow.length === 0) {
        grid.innerHTML = '<p>No projects available.</p>';
        return;
    }

    grid.innerHTML = projectsToShow.map(project => `
        <div class="project-card fade-in" onclick="openProjectDetail('${project.id}')">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-category">${getCategoryDisplayName(project.category)}</p>
                <p class="project-description">${project.description.substring(0, 100)}...</p>
            </div>
        </div>
    `).join('');
}

// Initialize Project Filters
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter projects
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

// Filter Projects
function filterProjects(filter) {
    let filteredProjects = projects;
    
    if (filter !== 'all') {
        filteredProjects = projects.filter(project => project.category === filter);
    }
    
    displayAllProjects(filteredProjects);
}

// Initialize Project Detail Page
function initializeProjectDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (projectId) {
        loadProjectDetail(projectId);
        loadProjectReviews(projectId);
        initializeRatingSystem(projectId);
        initializeCommentSystem(projectId);
    } else {
        // Redirect to projects page if no ID
        window.location.href = 'projects.html';
    }
}

// Load Project Detail
async function loadProjectDetail(projectId) {
    try {
        const doc = await db.collection('projects').doc(projectId).get();
        
        if (doc.exists) {
            const project = { id: doc.id, ...doc.data() };
            displayProjectDetail(project);
        } else {
            console.error('Project not found');
            window.location.href = 'projects.html';
        }
    } catch (error) {
        console.error('Error loading project detail:', error);
        loadDummyProjectDetail(projectId);
    }
}

// Display Project Detail
function displayProjectDetail(project) {
    const header = document.getElementById('project-header');
    if (!header) return;

    header.innerHTML = `
        <div class="project-header-content">
            <h1>${project.title}</h1>
            <p class="project-category">${getCategoryDisplayName(project.category)}</p>
            <div class="project-meta">
                <span class="project-date">Created: ${new Date(project.createdAt.toDate()).toLocaleDateString()}</span>
                ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
            </div>
        </div>
    `;

    const description = document.getElementById('project-description');
    if (description) {
        description.innerHTML = `
            <h3>About This Project</h3>
            <p>${project.description}</p>
        `;
    }

    const gallery = document.getElementById('project-gallery');
    if (gallery && project.images) {
        const images = project.images.split(',').map(img => img.trim()).filter(img => img);
        if (images.length > 0) {
            gallery.innerHTML = `
                <h3>Project Gallery</h3>
                <div class="gallery-grid">
                    ${images.map(img => `
                        <div class="gallery-item">
                            <img src="${img}" alt="${project.title}" onclick="openImageModal('${img}')">
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

// Initialize Rating System
function initializeRatingSystem(projectId) {
    const stars = document.querySelectorAll('#rating-stars i');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            submitRating(projectId, rating);
        });
        
        star.addEventListener('mouseenter', () => {
            highlightStars(index);
        });
    });
    
    document.getElementById('rating-stars').addEventListener('mouseleave', () => {
        loadProjectRating(projectId);
    });
}

// Highlight Stars
function highlightStars(index) {
    const stars = document.querySelectorAll('#rating-stars i');
    stars.forEach((star, i) => {
        if (i <= index) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

// Submit Rating
async function submitRating(projectId, rating) {
    try {
        await db.collection('ratings').add({
            projectId: projectId,
            rating: rating,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent
        });
        
        loadProjectRating(projectId);
        showNotification('Rating submitted successfully!', 'success');
    } catch (error) {
        console.error('Error submitting rating:', error);
        showNotification('Error submitting rating', 'error');
    }
}

// Load Project Rating
async function loadProjectRating(projectId) {
    try {
        const snapshot = await db.collection('ratings')
            .where('projectId', '==', projectId)
            .get();
        
        const ratings = [];
        snapshot.forEach(doc => {
            ratings.push(doc.data().rating);
        });
        
        const averageRating = ratings.length > 0 
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
            : 0;
        
        displayRatingSummary(averageRating, ratings.length);
    } catch (error) {
        console.error('Error loading rating:', error);
    }
}

// Display Rating Summary
function displayRatingSummary(averageRating, totalRatings) {
    const summary = document.getElementById('rating-summary');
    if (!summary) return;

    summary.innerHTML = `
        <div class="rating-summary-content">
            <div class="average-rating">
                <span class="rating-number">${averageRating.toFixed(1)}</span>
                <div class="rating-stars-display">
                    ${generateStarDisplay(averageRating)}
                </div>
            </div>
            <p class="rating-count">Based on ${totalRatings} rating${totalRatings !== 1 ? 's' : ''}</p>
        </div>
    `;
}

// Generate Star Display
function generateStarDisplay(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Initialize Comment System
function initializeCommentSystem(projectId) {
    const form = document.getElementById('comment-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            submitComment(projectId);
        });
    }
    
    loadProjectComments(projectId);
}

// Submit Comment
async function submitComment(projectId) {
    const name = document.getElementById('commenter-name').value;
    const text = document.getElementById('comment-text').value;
    
    if (!name || !text) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    try {
        await db.collection('comments').add({
            projectId: projectId,
            name: name,
            text: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        document.getElementById('comment-form').reset();
        loadProjectComments(projectId);
        showNotification('Comment submitted successfully!', 'success');
    } catch (error) {
        console.error('Error submitting comment:', error);
        showNotification('Error submitting comment', 'error');
    }
}

// Load Project Comments
async function loadProjectComments(projectId) {
    try {
        const snapshot = await db.collection('comments')
            .where('projectId', '==', projectId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const comments = [];
        snapshot.forEach(doc => {
            comments.push({ id: doc.id, ...doc.data() });
        });
        
        displayProjectComments(comments);
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Display Project Comments
function displayProjectComments(comments) {
    const container = document.getElementById('comments-list');
    if (!container) return;

    if (comments.length === 0) {
        container.innerHTML = '<p>No comments yet. Be the first to review this project!</p>';
        return;
    }

    container.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <h4>${comment.name}</h4>
                <span class="comment-date">${new Date(comment.createdAt.toDate()).toLocaleDateString()}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
        </div>
    `).join('');
}

// Initialize About Page
function initializeAboutPage() {
    initializeSkillAnimations();
}

// Initialize Skill Animations
function initializeSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
            }
        });
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Initialize Contact Page
function initializeContactPage() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleContactForm);
    }
    
    initializeFAQ();
}

// Handle Contact Form
async function handleContactForm(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        read: false
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    
    try {
        await db.collection('contacts').add(formData);
        
        // Show success message
        document.getElementById('success-message').classList.remove('hidden');
        form.reset();
        
        showNotification('Message sent successfully!', 'success');
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Error sending message', 'error');
    } finally {
        // Hide loading state
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
}

// Initialize FAQ
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Initialize Admin Page
function initializeAdminPage() {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    initializeAdminNavigation();
    loadDashboardData();
}

// Initialize Admin Navigation
function initializeAdminNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            showAdminSection(section);
            
            // Update active menu item
            menuItems.forEach(menuItem => menuItem.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// Show Admin Section
function showAdminSection(sectionName) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'projects':
            loadAdminProjects();
            break;
        case 'reviews':
            loadAdminReviews();
            break;
        case 'contacts':
            loadAdminContacts();
            break;
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load projects count
        const projectsSnapshot = await db.collection('projects').get();
        document.getElementById('total-projects').textContent = projectsSnapshot.size;
        
        // Load reviews count
        const reviewsSnapshot = await db.collection('comments').get();
        document.getElementById('total-reviews').textContent = reviewsSnapshot.size;
        
        // Load contacts count
        const contactsSnapshot = await db.collection('contacts').get();
        document.getElementById('total-contacts').textContent = contactsSnapshot.size;
        
        // Calculate average rating
        const ratingsSnapshot = await db.collection('ratings').get();
        const ratings = [];
        ratingsSnapshot.forEach(doc => {
            ratings.push(doc.data().rating);
        });
        
        const averageRating = ratings.length > 0 
            ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
            : '0.0';
        document.getElementById('average-rating').textContent = averageRating;
        
        // Load recent projects
        loadRecentProjects();
        loadRecentReviews();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load Recent Projects
async function loadRecentProjects() {
    try {
        const snapshot = await db.collection('projects')
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get();
        
        const recentProjects = [];
        snapshot.forEach(doc => {
            recentProjects.push({ id: doc.id, ...doc.data() });
        });
        
        displayRecentProjects(recentProjects);
    } catch (error) {
        console.error('Error loading recent projects:', error);
    }
}

// Display Recent Projects
function displayRecentProjects(projects) {
    const container = document.getElementById('recent-projects');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = '<p>No projects yet.</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="recent-item">
            <div class="recent-item-content">
                <h4>${project.title}</h4>
                <p>${getCategoryDisplayName(project.category)}</p>
                <span class="recent-date">${new Date(project.createdAt.toDate()).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

// Load Recent Reviews
async function loadRecentReviews() {
    try {
        const snapshot = await db.collection('comments')
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get();
        
        const recentReviews = [];
        snapshot.forEach(doc => {
            recentReviews.push({ id: doc.id, ...doc.data() });
        });
        
        displayRecentReviews(recentReviews);
    } catch (error) {
        console.error('Error loading recent reviews:', error);
    }
}

// Display Recent Reviews
function displayRecentReviews(reviews) {
    const container = document.getElementById('recent-reviews');
    if (!container) return;

    if (reviews.length === 0) {
        container.innerHTML = '<p>No reviews yet.</p>';
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="recent-item">
            <div class="recent-item-content">
                <h4>${review.name}</h4>
                <p>${review.text.substring(0, 50)}...</p>
                <span class="recent-date">${new Date(review.createdAt.toDate()).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

// Show Login Modal
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'block';
        
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', handleLogin);
        }
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        document.getElementById('login-modal').style.display = 'none';
        showNotification('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please check your credentials.', 'error');
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

// Hide Notification
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Load Dummy Data Functions (for when Firebase is not configured)
function loadDummyFeaturedProjects() {
    const dummyProjects = [
        {
            id: '1',
            title: 'E-Commerce Platform',
            category: 'web',
            description: 'A modern e-commerce platform built with React and Node.js, featuring real-time inventory management and secure payment processing.',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
        },
        {
            id: '2',
            title: 'Mobile Banking App',
            category: 'mobile',
            description: 'A secure mobile banking application with biometric authentication and real-time transaction monitoring.',
            image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop'
        },
        {
            id: '3',
            title: 'Portfolio Website Design',
            category: 'design',
            description: 'A clean and modern portfolio website design with smooth animations and responsive layout.',
            image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop'
        }
    ];
    
    displayFeaturedProjects(dummyProjects);
}

function loadDummyProjects() {
    const dummyProjects = [
        {
            id: '1',
            title: 'E-Commerce Platform',
            category: 'web',
            description: 'A modern e-commerce platform built with React and Node.js, featuring real-time inventory management and secure payment processing.',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
            featured: true,
            createdAt: new Date('2024-01-15')
        },
        {
            id: '2',
            title: 'Mobile Banking App',
            category: 'mobile',
            description: 'A secure mobile banking application with biometric authentication and real-time transaction monitoring.',
            image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
            featured: true,
            createdAt: new Date('2024-02-20')
        },
        {
            id: '3',
            title: 'Portfolio Website Design',
            category: 'design',
            description: 'A clean and modern portfolio website design with smooth animations and responsive layout.',
            image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
            featured: true,
            createdAt: new Date('2024-03-10')
        },
        {
            id: '4',
            title: 'Task Management System',
            category: 'fullstack',
            description: 'A comprehensive task management system with team collaboration features and project tracking.',
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
            featured: false,
            createdAt: new Date('2024-04-05')
        },
        {
            id: '5',
            title: 'Restaurant Ordering App',
            category: 'mobile',
            description: 'A mobile app for restaurant ordering with real-time order tracking and payment integration.',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
            featured: false,
            createdAt: new Date('2024-05-12')
        },
        {
            id: '6',
            title: 'Analytics Dashboard',
            category: 'web',
            description: 'A data visualization dashboard with interactive charts and real-time analytics.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
            featured: false,
            createdAt: new Date('2024-06-18')
        }
    ];
    
    projects = dummyProjects;
    displayAllProjects(dummyProjects);
}

function loadDummyProjectDetail(projectId) {
    const dummyProject = {
        id: projectId,
        title: 'E-Commerce Platform',
        category: 'web',
        description: 'A modern e-commerce platform built with React and Node.js, featuring real-time inventory management and secure payment processing. This project showcases advanced web development techniques including state management, API integration, and responsive design.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        images: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        featured: true,
        createdAt: { toDate: () => new Date('2024-01-15') }
    };
    
    displayProjectDetail(dummyProject);
    
    // Load dummy reviews
    const dummyReviews = [
        {
            id: '1',
            name: 'Sarah Johnson',
            text: 'Amazing work! The e-commerce platform is incredibly user-friendly and has all the features I needed.',
            createdAt: { toDate: () => new Date('2024-01-20') }
        },
        {
            id: '2',
            name: 'Mike Chen',
            text: 'Great attention to detail and excellent performance. Highly recommended!',
            createdAt: { toDate: () => new Date('2024-01-25') }
        }
    ];
    
    displayProjectComments(dummyReviews);
    
    // Load dummy rating
    displayRatingSummary(4.5, 12);
}

// Export functions for use in other files
window.openProjectDetail = openProjectDetail;
window.openImageModal = function(imageUrl) {
    // Simple image modal implementation
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="image-modal-close">&times;</span>
            <img src="${imageUrl}" alt="Project Image">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.image-modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
};