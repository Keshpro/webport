// Project Detail Page JavaScript

let currentProjectId = null;

// Initialize Project Detail Page
function initializeProjectDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    currentProjectId = urlParams.get('id');
    
    if (currentProjectId) {
        loadProjectDetail(currentProjectId);
        loadProjectReviews(currentProjectId);
        initializeRatingSystem(currentProjectId);
        initializeCommentSystem(currentProjectId);
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
    
    // Load initial rating
    loadProjectRating(projectId);
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

// Open Image Modal
function openImageModal(imageUrl) {
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
}

// Load Dummy Project Detail (fallback when Firebase is not configured)
function loadDummyProjectDetail(projectId) {
    const dummyProject = {
        id: projectId,
        title: 'E-Commerce Platform',
        category: 'web',
        description: 'A modern e-commerce platform built with React and Node.js, featuring real-time inventory management and secure payment processing. This project showcases advanced web development techniques including state management, API integration, and responsive design. The platform includes features like user authentication, product catalog, shopping cart, order management, and admin dashboard.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        images: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        featured: true,
        createdAt: { toDate: () => new Date('2024-01-15') }
    };
    
    displayProjectDetail(dummyProject);
    
    // Load dummy reviews
    const dummyReviews = [
        {
            id: '1',
            name: 'Sarah Johnson',
            text: 'Amazing work! The e-commerce platform is incredibly user-friendly and has all the features I needed. The design is clean and modern, and the performance is excellent.',
            createdAt: { toDate: () => new Date('2024-01-20') }
        },
        {
            id: '2',
            name: 'Mike Chen',
            text: 'Great attention to detail and excellent performance. The checkout process is smooth and the admin dashboard is very intuitive. Highly recommended!',
            createdAt: { toDate: () => new Date('2024-01-25') }
        },
        {
            id: '3',
            name: 'Emily Rodriguez',
            text: 'This project demonstrates excellent full-stack development skills. The code is clean, well-documented, and the user experience is outstanding.',
            createdAt: { toDate: () => new Date('2024-02-01') }
        }
    ];
    
    displayProjectComments(dummyReviews);
    
    // Load dummy rating
    displayRatingSummary(4.5, 12);
}
