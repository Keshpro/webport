// About Page JavaScript

// Initialize About Page
function initializeAboutPage() {
    initializeSkillAnimations();
    initializeTimelineAnimations();
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
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Initialize Timeline Animations
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => observer.observe(item));
}

// Initialize Achievement Animations
function initializeAchievementAnimations() {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.3 });
    
    achievementCards.forEach(card => observer.observe(card));
}

// Initialize Video Introduction
function initializeVideoIntroduction() {
    const videoButton = document.querySelector('.video-intro .btn');
    if (videoButton) {
        videoButton.addEventListener('click', () => {
            // This would typically open a video modal or redirect to a video
            showNotification('Video feature coming soon!', 'info');
        });
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .timeline-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .timeline-item.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .achievement-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .achievement-card.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-progress {
        transition: width 1.5s ease-in-out;
    }
`;
document.head.appendChild(style);
