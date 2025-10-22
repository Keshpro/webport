// Admin Dashboard JavaScript

let currentEditingProject = null;

// Initialize Admin Page
function initializeAdminPage() {
    // Check if Firebase is properly configured
    if (firebaseConfig.apiKey === "your-api-key-here") {
        // Demo mode - show login modal immediately
        showLoginModal();
        return;
    }
    
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    initializeAdminNavigation();
    initializeProjectModal();
    initializeLoginForm();
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
    
    // Initialize logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
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
        loadDummyDashboardData();
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

// Load Admin Projects
async function loadAdminProjects() {
    try {
        const snapshot = await db.collection('projects').get();
        const projects = [];
        snapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() });
        });
        
        displayAdminProjects(projects);
    } catch (error) {
        console.error('Error loading admin projects:', error);
        loadDummyAdminProjects();
    }
}

// Display Admin Projects
function displayAdminProjects(projects) {
    const tbody = document.getElementById('projects-table-body');
    if (!tbody) return;

    if (projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No projects found</td></tr>';
        return;
    }

    tbody.innerHTML = projects.map(project => `
        <tr>
            <td>${project.title}</td>
            <td>${getCategoryDisplayName(project.category)}</td>
            <td>${project.featured ? '<span class="badge badge-success">Yes</span>' : '<span class="badge badge-secondary">No</span>'}</td>
            <td>${new Date(project.createdAt.toDate()).toLocaleDateString()}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProject('${project.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load Admin Reviews
async function loadAdminReviews() {
    try {
        const snapshot = await db.collection('comments').get();
        const reviews = [];
        snapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() });
        });
        
        displayAdminReviews(reviews);
    } catch (error) {
        console.error('Error loading admin reviews:', error);
        loadDummyAdminReviews();
    }
}

// Display Admin Reviews
function displayAdminReviews(reviews) {
    const tbody = document.getElementById('reviews-table-body');
    if (!tbody) return;

    if (reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No reviews found</td></tr>';
        return;
    }

    tbody.innerHTML = reviews.map(review => `
        <tr>
            <td>${review.projectId}</td>
            <td>${review.name}</td>
            <td>${review.rating || 'N/A'}</td>
            <td>${review.text.substring(0, 50)}...</td>
            <td>${new Date(review.createdAt.toDate()).toLocaleDateString()}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-danger" onclick="deleteReview('${review.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load Admin Contacts
async function loadAdminContacts() {
    try {
        const snapshot = await db.collection('contacts').get();
        const contacts = [];
        snapshot.forEach(doc => {
            contacts.push({ id: doc.id, ...doc.data() });
        });
        
        displayAdminContacts(contacts);
    } catch (error) {
        console.error('Error loading admin contacts:', error);
        loadDummyAdminContacts();
    }
}

// Display Admin Contacts
function displayAdminContacts(contacts) {
    const tbody = document.getElementById('contacts-table-body');
    if (!tbody) return;

    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No messages found</td></tr>';
        return;
    }

    tbody.innerHTML = contacts.map(contact => `
        <tr>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.subject}</td>
            <td>${contact.message.substring(0, 50)}...</td>
            <td>${new Date(contact.createdAt.toDate()).toLocaleDateString()}</td>
            <td>${contact.read ? '<span class="badge badge-success">Read</span>' : '<span class="badge badge-warning">Unread</span>'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewContact('${contact.id}')">View</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteContact('${contact.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Initialize Project Modal
function initializeProjectModal() {
    const modal = document.getElementById('project-modal');
    const addBtn = document.getElementById('add-project-btn');
    const cancelBtn = document.getElementById('cancel-project');
    const form = document.getElementById('project-form');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            currentEditingProject = null;
            document.getElementById('modal-title').textContent = 'Add New Project';
            document.getElementById('project-form').reset();
            modal.style.display = 'block';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleProjectSubmit);
    }
}

// Handle Project Submit
async function handleProjectSubmit(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('project-title').value,
        category: document.getElementById('project-category').value,
        description: document.getElementById('project-description').value,
        image: document.getElementById('project-image').value,
        images: document.getElementById('project-images').value,
        featured: document.getElementById('project-featured').checked,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (currentEditingProject) {
            await db.collection('projects').doc(currentEditingProject).update(formData);
            showNotification('Project updated successfully!', 'success');
        } else {
            await db.collection('projects').add(formData);
            showNotification('Project added successfully!', 'success');
        }
        
        document.getElementById('project-modal').style.display = 'none';
        loadAdminProjects();
    } catch (error) {
        console.error('Error saving project:', error);
        showNotification('Error saving project', 'error');
    }
}

// Edit Project
function editProject(projectId) {
    // This would load the project data and populate the form
    showNotification('Edit functionality coming soon!', 'info');
}

// Delete Project
async function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await db.collection('projects').doc(projectId).delete();
            showNotification('Project deleted successfully!', 'success');
            loadAdminProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            showNotification('Error deleting project', 'error');
        }
    }
}

// Delete Review
async function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        try {
            await db.collection('comments').doc(reviewId).delete();
            showNotification('Review deleted successfully!', 'success');
            loadAdminReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            showNotification('Error deleting review', 'error');
        }
    }
}

// View Contact
function viewContact(contactId) {
    showNotification('View contact functionality coming soon!', 'info');
}

// Delete Contact
async function deleteContact(contactId) {
    if (confirm('Are you sure you want to delete this contact message?')) {
        try {
            await db.collection('contacts').doc(contactId).delete();
            showNotification('Contact message deleted successfully!', 'success');
            loadAdminContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
            showNotification('Error deleting contact message', 'error');
        }
    }
}

// Initialize Login Form
function initializeLoginForm() {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Demo login credentials (for testing without Firebase)
    const demoCredentials = {
        email: 'admin@demo.com',
        password: 'admin123'
    };
    
    // Check if Firebase is properly configured
    if (firebaseConfig.apiKey === "your-api-key-here") {
        // Use demo login when Firebase is not configured
        if (email === demoCredentials.email && password === demoCredentials.password) {
            // Simulate successful login
            currentUser = { email: email, uid: 'demo-user' };
            document.getElementById('login-modal').style.display = 'none';
            showNotification('Login successful! (Demo Mode)', 'success');
            
            // Initialize admin functionality
            initializeAdminNavigation();
            initializeProjectModal();
            loadDashboardData();
        } else {
            showNotification('Invalid credentials. Use: admin@demo.com / admin123', 'error');
        }
        return;
    }
    
    // Firebase login (when properly configured)
    try {
        await auth.signInWithEmailAndPassword(email, password);
        document.getElementById('login-modal').style.display = 'none';
        showNotification('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please check your credentials.', 'error');
    }
}

// Handle Logout
async function handleLogout() {
    // Check if Firebase is properly configured
    if (firebaseConfig.apiKey === "your-api-key-here") {
        // Demo mode logout
        currentUser = null;
        showNotification('Logged out successfully! (Demo Mode)', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return;
    }
    
    try {
        await auth.signOut();
        showNotification('Logged out successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Error logging out', 'error');
    }
}

// Show Login Modal
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'block';
    }
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

// Load Dummy Data Functions (for when Firebase is not configured)
function loadDummyDashboardData() {
    document.getElementById('total-projects').textContent = '6';
    document.getElementById('total-reviews').textContent = '12';
    document.getElementById('total-contacts').textContent = '8';
    document.getElementById('average-rating').textContent = '4.5';
    
    const dummyRecentProjects = [
        { title: 'E-Commerce Platform', category: 'web', createdAt: { toDate: () => new Date('2024-01-15') } },
        { title: 'Mobile Banking App', category: 'mobile', createdAt: { toDate: () => new Date('2024-02-20') } },
        { title: 'Portfolio Website', category: 'design', createdAt: { toDate: () => new Date('2024-03-10') } }
    ];
    
    displayRecentProjects(dummyRecentProjects);
    
    const dummyRecentReviews = [
        { name: 'Sarah Johnson', text: 'Amazing work! The e-commerce platform is incredibly user-friendly...', createdAt: { toDate: () => new Date('2024-01-20') } },
        { name: 'Mike Chen', text: 'Great attention to detail and excellent performance...', createdAt: { toDate: () => new Date('2024-01-25') } }
    ];
    
    displayRecentReviews(dummyRecentReviews);
}

function loadDummyAdminProjects() {
    const dummyProjects = [
        { id: '1', title: 'E-Commerce Platform', category: 'web', featured: true, createdAt: { toDate: () => new Date('2024-01-15') } },
        { id: '2', title: 'Mobile Banking App', category: 'mobile', featured: true, createdAt: { toDate: () => new Date('2024-02-20') } },
        { id: '3', title: 'Portfolio Website', category: 'design', featured: true, createdAt: { toDate: () => new Date('2024-03-10') } }
    ];
    
    displayAdminProjects(dummyProjects);
}

function loadDummyAdminReviews() {
    const dummyReviews = [
        { id: '1', projectId: 'E-Commerce Platform', name: 'Sarah Johnson', rating: 5, text: 'Amazing work! The e-commerce platform is incredibly user-friendly and has all the features I needed.', createdAt: { toDate: () => new Date('2024-01-20') } },
        { id: '2', projectId: 'Mobile Banking App', name: 'Mike Chen', rating: 4, text: 'Great attention to detail and excellent performance. Highly recommended!', createdAt: { toDate: () => new Date('2024-01-25') } }
    ];
    
    displayAdminReviews(dummyReviews);
}

function loadDummyAdminContacts() {
    const dummyContacts = [
        { id: '1', name: 'John Smith', email: 'john@example.com', subject: 'Project Inquiry', message: 'I would like to discuss a potential project with you.', createdAt: { toDate: () => new Date('2024-01-20') }, read: false },
        { id: '2', name: 'Jane Doe', email: 'jane@example.com', subject: 'Collaboration', message: 'Interested in collaborating on a new web application.', createdAt: { toDate: () => new Date('2024-01-22') }, read: true }
    ];
    
    displayAdminContacts(dummyContacts);
}

// Add CSS for admin-specific styles
const style = document.createElement('style');
style.textContent = `
    .badge {
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;
    }
    
    .badge-success {
        background-color: #d1fae5;
        color: #065f46;
    }
    
    .badge-warning {
        background-color: #fef3c7;
        color: #92400e;
    }
    
    .badge-secondary {
        background-color: #e5e7eb;
        color: #374151;
    }
    
    .text-center {
        text-align: center;
    }
`;
document.head.appendChild(style);
