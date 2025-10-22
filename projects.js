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
        grid.innerHTML = '<div class="no-projects"><p>No projects found matching your criteria.</p></div>';
        return;
    }

    grid.innerHTML = projectsToShow.map(project => `
        <div class="project-card fade-in" onclick="openProjectDetail('${project.id}')">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-category">${getCategoryDisplayName(project.category)}</p>
                <p class="project-description">${project.description.substring(0, 150)}...</p>
                <div class="project-meta">
                    <span class="project-date">Created: ${new Date(project.createdAt.toDate()).toLocaleDateString()}</span>
                    ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
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

// Load Dummy Projects (for when Firebase is not configured)
function loadDummyProjects() {
    const dummyProjects = [
        {
            id: '1',
            title: 'E-Commerce Platform',
            category: 'web',
            description: 'A modern e-commerce platform built with React and Node.js, featuring real-time inventory management and secure payment processing. This project showcases advanced web development techniques including state management, API integration, and responsive design.',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
            featured: true,
            createdAt: { toDate: () => new Date('2024-01-15') }
        },
        {
            id: '2',
            title: 'Mobile Banking App',
            category: 'mobile',
            description: 'A secure mobile banking application with biometric authentication and real-time transaction monitoring. Built with React Native and integrated with banking APIs for secure financial transactions.',
            image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
            featured: true,
            createdAt: { toDate: () => new Date('2024-02-20') }
        },
        {
            id: '3',
            title: 'Portfolio Website Design',
            category: 'design',
            description: 'A clean and modern portfolio website design with smooth animations and responsive layout. Created using Figma and implemented with modern CSS techniques and JavaScript interactions.',
            image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
            featured: true,
            createdAt: { toDate: () => new Date('2024-03-10') }
        },
        {
            id: '4',
            title: 'Task Management System',
            category: 'fullstack',
            description: 'A comprehensive task management system with team collaboration features and project tracking. Built with MERN stack featuring real-time updates, file sharing, and team communication tools.',
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
            featured: false,
            createdAt: { toDate: () => new Date('2024-04-05') }
        },
        {
            id: '5',
            title: 'Restaurant Ordering App',
            category: 'mobile',
            description: 'A mobile app for restaurant ordering with real-time order tracking and payment integration. Features include menu browsing, custom orders, delivery tracking, and multiple payment options.',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
            featured: false,
            createdAt: { toDate: () => new Date('2024-05-12') }
        },
        {
            id: '6',
            title: 'Analytics Dashboard',
            category: 'web',
            description: 'A data visualization dashboard with interactive charts and real-time analytics. Built with D3.js and Chart.js for comprehensive data analysis and business intelligence reporting.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
            featured: false,
            createdAt: { toDate: () => new Date('2024-06-18') }
        },
        {
            id: '7',
            title: 'Social Media App',
            category: 'mobile',
            description: 'A social media application with photo sharing, stories, and messaging features. Built with React Native and Firebase for real-time communication and content sharing.',
            image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop',
            featured: false,
            createdAt: { toDate: () => new Date('2024-07-22') }
        },
        {
            id: '8',
            title: 'E-Learning Platform',
            category: 'web',
            description: 'An online learning platform with video streaming, quizzes, and progress tracking. Features include course management, student dashboards, and instructor tools.',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
            featured: false,
            createdAt: { toDate: () => new Date('2024-08-15') }
        }
    ];
    
    projects = dummyProjects;
    displayAllProjects(dummyProjects);
}

// Add CSS for no projects message
const style = document.createElement('style');
style.textContent = `
    .no-projects {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #6b7280;
    }
    
    .no-projects p {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);