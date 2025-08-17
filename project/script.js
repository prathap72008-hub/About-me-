document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#admin') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', formValues);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }

    // Load projects dynamically
    loadProjects();
});

// Sample project data (in a real application, this would come from a database)
const projectsData = [
    {
        id: 1,
        title: 'E-Commerce Website',
        description: 'A fully responsive e-commerce platform with product filtering, cart functionality, and payment integration.',
        image: 'https://via.placeholder.com/600x400/007bff/ffffff?text=E-Commerce+Project',
        tags: ['React', 'Node.js', 'MongoDB'],
        liveLink: '#',
        codeLink: '#'
    },
    {
        id: 2,
        title: 'Task Management App',
        description: 'A productivity application for managing tasks, setting deadlines, and tracking progress with team collaboration features.',
        image: 'https://via.placeholder.com/600x400/28a745/ffffff?text=Task+Management+App',
        tags: ['JavaScript', 'Express', 'MongoDB'],
        liveLink: '#',
        codeLink: '#'
    },
    {
        id: 3,
        title: 'Weather Dashboard',
        description: 'A weather application that provides real-time weather data and forecasts for locations worldwide using weather API integration.',
        image: 'https://via.placeholder.com/600x400/ffc107/ffffff?text=Weather+Dashboard',
        tags: ['HTML', 'CSS', 'JavaScript', 'API'],
        liveLink: '#',
        codeLink: '#'
    },
    {
        id: 4,
        title: 'Portfolio Website',
        description: 'A personal portfolio website showcasing projects, skills, and professional experience with a clean, modern design.',
        image: 'https://via.placeholder.com/600x400/17a2b8/ffffff?text=Portfolio+Website',
        tags: ['HTML', 'CSS', 'JavaScript'],
        liveLink: '#',
        codeLink: '#'
    }
];

// Function to load projects
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (projectsGrid) {
        // Clear existing content
        projectsGrid.innerHTML = '';
        
        // Check if there are projects in localStorage (added via admin panel)
        let allProjects = [...projectsData];
        const storedProjects = localStorage.getItem('portfolioProjects');
        
        if (storedProjects) {
            const parsedProjects = JSON.parse(storedProjects);
            allProjects = [...allProjects, ...parsedProjects];
        }
        
        // Create project cards
        allProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            
            // Create tags HTML
            const tagsHTML = project.tags.map(tag => 
                `<span class="project-tag">${tag}</span>`
            ).join('');
            
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${tagsHTML}
                    </div>
                    <div class="project-links">
                        <a href="${project.liveLink}" class="project-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                        <a href="${project.codeLink}" class="project-link" target="_blank">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
    }
}

// Check if user is logged in (for admin access)
function checkAuth() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Function to handle admin link clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.admin-link') || e.target.closest('.admin-link')) {
        e.preventDefault();
        
        // Check if user is logged in
        if (!checkAuth()) {
            // Redirect to admin login page
            window.location.href = 'admin.html';
        } else {
            // Redirect to admin dashboard
            window.location.href = 'admin-dashboard.html';
        }
    }
});