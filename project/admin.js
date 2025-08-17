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

    // Check if user is already logged in
    checkLoginStatus();

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout Button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Project Form
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmit);
    }

    // Add Project Button
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', showProjectForm);
    }

    // Cancel Project Button
    const cancelProjectBtn = document.getElementById('cancelProjectBtn');
    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener('click', hideProjectForm);
    }

    // Profile Form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }

    // Password Form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
});

// Utility Functions for localStorage with error handling
function safeSetItem(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error(`Error setting localStorage item ${key}:`, error);
        return false;
    }
}

function safeGetItem(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Error getting localStorage item ${key}:`, error);
        return null;
    }
}

function safeRemoveItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing localStorage item ${key}:`, error);
        return false;
    }
}

function safeParseJSON(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
}

function clearAllStorage() {
    try {
        localStorage.clear();
        console.log('All localStorage cleared successfully');
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');
    
    // Simple authentication (in a real app, this would be server-side)
    // Default credentials: admin / password123
    if (username === 'admin' && password === 'password123') {
        // Set login status in localStorage
        if (safeSetItem('isLoggedIn', 'true')) {
            // Show success message
            loginMessage.textContent = 'Login successful! Redirecting to dashboard...';
            loginMessage.className = 'login-message success';
            
            // Show dashboard after a short delay
            setTimeout(() => {
                showDashboard();
            }, 1000);
        } else {
            loginMessage.textContent = 'Login failed. Storage error occurred.';
            loginMessage.className = 'login-message error';
        }
    } else {
        // Show error message
        loginMessage.textContent = 'Invalid username or password. Please try again.';
        loginMessage.className = 'login-message error';
    }
}

function handleLogout(e) {
    e.preventDefault();
    
    // Clear login status
    safeRemoveItem('isLoggedIn');
    
    // Hide dashboard and show login form
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.querySelector('.logout-btn').style.display = 'none';
}

function checkLoginStatus() {
    const isLoggedIn = safeGetItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showDashboard();
    }
}

function showDashboard() {
    // Hide login section
    document.getElementById('login-section').style.display = 'none';
    
    // Show dashboard section
    document.getElementById('dashboard-section').style.display = 'block';
    
    // Show logout button
    document.querySelector('.logout-btn').style.display = 'block';
    
    // Load dashboard data
    loadDashboardData();
}

// Dashboard Data Functions
function loadDashboardData() {
    // Load projects
    loadProjects();
    
    // Load messages
    loadMessages();
    
    // Update stats
    updateStats();
    
    // Load profile data
    loadProfileData();
}

// Project Management Functions
function loadProjects() {
    const projectsTableBody = document.getElementById('projectsTableBody');
    const projectCount = document.getElementById('projectCount');
    
    if (!projectsTableBody) return;
    
    // Clear existing content
    projectsTableBody.innerHTML = '';
    
    // Get projects from localStorage
    let projects = [];
    const storedProjects = localStorage.getItem('portfolioProjects');
    
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
    }
    
    // Update project count
    if (projectCount) {
        projectCount.textContent = projects.length;
    }
    
    // Check if there are any projects
    if (projects.length === 0) {
        projectsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No projects found. Add your first project!</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Create table rows for each project
    projects.forEach(project => {
        const row = document.createElement('tr');
        
        // Create tags HTML
        const tagsHTML = project.tags ? project.tags.join(', ') : '';
        
        row.innerHTML = `
            <td>${project.title}</td>
            <td>${project.description}</td>
            <td>${tagsHTML}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit-btn" data-id="${project.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${project.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        projectsTableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    addProjectActionListeners();
}

function addProjectActionListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-id');
            editProject(projectId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-id');
            deleteProject(projectId);
        });
    });
}

function showProjectForm() {
    document.getElementById('projectFormContainer').style.display = 'block';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
}

function hideProjectForm() {
    document.getElementById('projectFormContainer').style.display = 'none';
}

function handleProjectSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const projectId = document.getElementById('projectId').value;
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const image = document.getElementById('projectImage').value;
    const tagsInput = document.getElementById('projectTags').value;
    const liveLink = document.getElementById('projectLiveLink').value;
    const codeLink = document.getElementById('projectCodeLink').value;
    
    // Parse tags
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    // Get existing projects
    let projects = [];
    const storedProjects = localStorage.getItem('portfolioProjects');
    
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
    }
    
    if (projectId) {
        // Edit existing project
        const index = projects.findIndex(p => p.id.toString() === projectId);
        
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                title,
                description,
                image,
                tags,
                liveLink,
                codeLink
            };
        }
    } else {
        // Add new project
        const newProject = {
            id: Date.now(),
            title,
            description,
            image,
            tags,
            liveLink,
            codeLink
        };
        
        projects.push(newProject);
    }
    
    // Save to localStorage
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    
    // Hide form
    hideProjectForm();
    
    // Reload projects
    loadProjects();
}

function editProject(projectId) {
    // Get projects from localStorage
    const storedProjects = localStorage.getItem('portfolioProjects');
    
    if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        const project = projects.find(p => p.id.toString() === projectId);
        
        if (project) {
            // Fill form with project data
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectTitle').value = project.title;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectImage').value = project.image;
            document.getElementById('projectTags').value = project.tags ? project.tags.join(', ') : '';
            document.getElementById('projectLiveLink').value = project.liveLink || '';
            document.getElementById('projectCodeLink').value = project.codeLink || '';
            
            // Show form
            document.getElementById('projectFormContainer').style.display = 'block';
        }
    }
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        // Get projects from localStorage
        const storedProjects = localStorage.getItem('portfolioProjects');
        
        if (storedProjects) {
            let projects = JSON.parse(storedProjects);
            
            // Filter out the project to delete
            projects = projects.filter(p => p.id.toString() !== projectId);
            
            // Save to localStorage
            localStorage.setItem('portfolioProjects', JSON.stringify(projects));
            
            // Reload projects
            loadProjects();
        }
    }
}

// Message Management Functions
function loadMessages() {
    const messagesTableBody = document.getElementById('messagesTableBody');
    const messageCount = document.getElementById('messageCount');
    
    if (!messagesTableBody) return;
    
    // Clear existing content
    messagesTableBody.innerHTML = '';
    
    // Get messages from localStorage
    let messages = [];
    const storedMessages = localStorage.getItem('portfolioMessages');
    
    if (storedMessages) {
        messages = JSON.parse(storedMessages);
    }
    
    // Update message count
    if (messageCount) {
        messageCount.textContent = messages.length;
    }
    
    // Check if there are any messages
    if (messages.length === 0) {
        messagesTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-envelope-open"></i>
                    <p>No messages yet. Messages from your contact form will appear here.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Create table rows for each message
    messages.forEach(message => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(message.date);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        row.innerHTML = `
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${message.message}</td>
            <td>${formattedDate}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn delete-msg-btn" data-id="${message.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        messagesTableBody.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-msg-btn').forEach(button => {
        button.addEventListener('click', () => {
            const messageId = button.getAttribute('data-id');
            deleteMessage(messageId);
        });
    });
}

function deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        // Get messages from localStorage
        const storedMessages = localStorage.getItem('portfolioMessages');
        
        if (storedMessages) {
            let messages = JSON.parse(storedMessages);
            
            // Filter out the message to delete
            messages = messages.filter(m => m.id.toString() !== messageId);
            
            // Save to localStorage
            localStorage.setItem('portfolioMessages', JSON.stringify(messages));
            
            // Reload messages
            loadMessages();
        }
    }
}

// Profile Management Functions
function loadProfileData() {
    // Get profile data from localStorage
    const storedProfile = localStorage.getItem('portfolioProfile');
    
    if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        
        // Fill form with profile data
        document.getElementById('profileName').value = profile.name || 'John Doe';
        document.getElementById('profileTitle').value = profile.title || 'Full Stack Developer & UI/UX Designer';
        document.getElementById('profileEmail').value = profile.email || 'john.doe@email.com';
        document.getElementById('profilePhone').value = profile.phone || '+1 (555) 123-4567';
        document.getElementById('profileLocation').value = profile.location || 'San Francisco, CA';
        document.getElementById('profileBio').value = profile.bio || 'I\'m a full-stack developer with 5+ years of experience in creating web applications. I specialize in JavaScript, React, Node.js, and modern web technologies.';
    }
}

function handleProfileSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('profileName').value;
    const title = document.getElementById('profileTitle').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const location = document.getElementById('profileLocation').value;
    const bio = document.getElementById('profileBio').value;
    
    // Create profile object
    const profile = {
        name,
        title,
        email,
        phone,
        location,
        bio
    };
    
    // Save to localStorage
    localStorage.setItem('portfolioProfile', JSON.stringify(profile));
    
    // Show success message
    alert('Profile updated successfully!');
}

// Password Management Functions
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordMessage = document.getElementById('passwordMessage');
    
    // Check if current password is correct (in a real app, this would be server-side)
    if (currentPassword !== 'password123') {
        passwordMessage.textContent = 'Current password is incorrect.';
        passwordMessage.className = 'password-message error';
        return;
    }
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        passwordMessage.textContent = 'New passwords do not match.';
        passwordMessage.className = 'password-message error';
        return;
    }
    
    // Check if new password is strong enough
    if (newPassword.length < 8) {
        passwordMessage.textContent = 'New password must be at least 8 characters long.';
        passwordMessage.className = 'password-message error';
        return;
    }
    
    // In a real app, this would update the password in the database
    // For this demo, we'll just show a success message
    passwordMessage.textContent = 'Password changed successfully!';
    passwordMessage.className = 'password-message success';
    
    // Reset form
    document.getElementById('passwordForm').reset();
}

// Stats Functions
function updateStats() {
    // Update project count
    const projectCount = document.getElementById('projectCount');
    const storedProjects = localStorage.getItem('portfolioProjects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];
    
    if (projectCount) {
        projectCount.textContent = projects.length;
    }
    
    // Update message count
    const messageCount = document.getElementById('messageCount');
    const storedMessages = localStorage.getItem('portfolioMessages');
    const messages = storedMessages ? JSON.parse(storedMessages) : [];
    
    if (messageCount) {
        messageCount.textContent = messages.length;
    }
    
    // Update view count (simulated)
    const viewCount = document.getElementById('viewCount');
    
    if (viewCount) {
        // Get stored view count or initialize to a random number
        let views = localStorage.getItem('portfolioViews');
        
        if (!views) {
            views = Math.floor(Math.random() * 100) + 50;
            localStorage.setItem('portfolioViews', views);
        }
        
        viewCount.textContent = views;
    }
}