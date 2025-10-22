// Projects Page JavaScript

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

// Load Dummy Projects (fallback when Firebase is not configured)
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
        },
        {
            id: '7',
            title: 'Social Media Platform',
            category: 'fullstack',
            description: 'A social media platform with real-time messaging, content sharing, and user engagement features.',
            image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop',
            featured: false,
            createdAt: new Date('2024-07-25')
        },
        {
            id: '8',
            title: 'Fitness Tracking App',
            category: 'mobile',
            description: 'A comprehensive fitness tracking app with workout plans, progress monitoring, and social features.',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            featured: false,
            createdAt: new Date('2024-08-30')
        }
    ];
    
    projects = dummyProjects;
    displayAllProjects(dummyProjects);
}
