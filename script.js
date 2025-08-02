// AdminHub Dashboard JavaScript

// Get all required elements
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const searchButton = document.querySelector('#content nav .form-input button');
const searchButtonIcon = document.querySelector('#content nav .form-input button .bx');
const searchForm = document.querySelector('#content nav form');
const switchMode = document.getElementById('switch-mode');

// Sidebar Menu Active State
allSideMenu.forEach(item => {
    const li = item.parentElement;
    
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all menu items
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        
        // Add active class to clicked item
        li.classList.add('active');
        
        // Update page content based on menu selection
        updatePageContent(item);
    });
});

// Toggle Sidebar
menuBar.addEventListener('click', function() {
    sidebar.classList.toggle('hide');
});

// Search Form Toggle (Mobile)
searchButton.addEventListener('click', function(e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

// Search Functionality
const searchInput = document.querySelector('#content nav .form-input input');
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    // Search in Recent Orders table
    const orderRows = document.querySelectorAll('.order table tbody tr');
    orderRows.forEach(row => {
        const userName = row.querySelector('p').textContent.toLowerCase();
        const status = row.querySelector('.status').textContent.toLowerCase();
        
        if (userName.includes(searchTerm) || status.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Search in Todo list
    const todoItems = document.querySelectorAll('.todo-list li');
    todoItems.forEach(item => {
        const todoText = item.querySelector('p').textContent.toLowerCase();
        
        if (todoText.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

// Dark Mode Toggle
if (switchMode) {
    switchMode.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Load saved theme preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        switchMode.checked = true;
    }
}

// Todo List Functionality
const todoList = document.querySelector('.todo-list');
const addTodoBtn = document.querySelector('.todo .head .bx-plus');

// Add new todo item
addTodoBtn.addEventListener('click', function() {
    const todoText = prompt('Enter a new todo item:');
    if (todoText && todoText.trim() !== '') {
        addTodoItem(todoText.trim());
    }
});

// Toggle todo completion
todoList.addEventListener('click', function(e) {
    const li = e.target.closest('li');
    if (li && e.target.classList.contains('bx-dots-vertical-rounded')) {
        // Show context menu options
        showTodoContextMenu(e, li);
    } else if (li) {
        // Toggle completion status
        li.classList.toggle('completed');
        li.classList.toggle('not-completed');
    }
});

// Add todo item function
function addTodoItem(text) {
    const li = document.createElement('li');
    li.className = 'not-completed';
    li.innerHTML = `
        <p>${text}</p>
        <i class='bx bx-dots-vertical-rounded'></i>
    `;
    todoList.appendChild(li);
}

// Show todo context menu
function showTodoContextMenu(e, todoItem) {
    e.stopPropagation();
    
    // Remove existing context menu
    const existingMenu = document.querySelector('.todo-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create context menu
    const contextMenu = document.createElement('div');
    contextMenu.className = 'todo-context-menu';
    contextMenu.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        background: var(--light);
        border: 1px solid var(--grey);
        border-radius: 8px;
        padding: 8px 0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        min-width: 120px;
    `;
    
    const editOption = document.createElement('div');
    editOption.textContent = 'Edit';
    editOption.style.cssText = 'padding: 8px 16px; cursor: pointer; color: var(--dark);';
    editOption.addEventListener('click', () => editTodoItem(todoItem));
    
    const deleteOption = document.createElement('div');
    deleteOption.textContent = 'Delete';
    deleteOption.style.cssText = 'padding: 8px 16px; cursor: pointer; color: var(--red);';
    deleteOption.addEventListener('click', () => deleteTodoItem(todoItem));
    
    contextMenu.appendChild(editOption);
    contextMenu.appendChild(deleteOption);
    document.body.appendChild(contextMenu);
    
    // Close context menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeContextMenu() {
            contextMenu.remove();
            document.removeEventListener('click', closeContextMenu);
        });
    }, 0);
}

// Edit todo item
function editTodoItem(todoItem) {
    const currentText = todoItem.querySelector('p').textContent;
    const newText = prompt('Edit todo item:', currentText);
    if (newText !== null && newText.trim() !== '') {
        todoItem.querySelector('p').textContent = newText.trim();
    }
}

// Delete todo item
function deleteTodoItem(todoItem) {
    if (confirm('Are you sure you want to delete this todo item?')) {
        todoItem.remove();
    }
}

// Filter functionality for orders table
const orderFilterBtn = document.querySelector('.order .head .bx-filter');
orderFilterBtn.addEventListener('click', function() {
    showFilterMenu('order');
});

// Filter functionality for todo list
const todoFilterBtn = document.querySelector('.todo .head .bx-filter');
todoFilterBtn.addEventListener('click', function() {
    showFilterMenu('todo');
});

// Show filter menu
function showFilterMenu(type) {
    // Remove existing filter menu
    const existingMenu = document.querySelector('.filter-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const filterMenu = document.createElement('div');
    filterMenu.className = 'filter-menu';
    filterMenu.style.cssText = `
        position: absolute;
        background: var(--light);
        border: 1px solid var(--grey);
        border-radius: 8px;
        padding: 8px 0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        min-width: 120px;
        top: 40px;
        right: 0;
    `;
    
    if (type === 'order') {
        const statuses = ['All', 'Completed', 'Pending', 'Process'];
        statuses.forEach(status => {
            const option = document.createElement('div');
            option.textContent = status;
            option.style.cssText = 'padding: 8px 16px; cursor: pointer; color: var(--dark);';
            option.addEventListener('click', () => filterOrders(status));
            filterMenu.appendChild(option);
        });
    } else if (type === 'todo') {
        const options = ['All', 'Completed', 'Not Completed'];
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.textContent = option;
            optionElement.style.cssText = 'padding: 8px 16px; cursor: pointer; color: var(--dark);';
            optionElement.addEventListener('click', () => filterTodos(option));
            filterMenu.appendChild(optionElement);
        });
    }
    
    // Position the menu relative to the filter button
    const filterBtn = type === 'order' ? orderFilterBtn : todoFilterBtn;
    const parentContainer = filterBtn.closest('.head');
    parentContainer.style.position = 'relative';
    parentContainer.appendChild(filterMenu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeFilterMenu(e) {
            if (!filterMenu.contains(e.target) && e.target !== filterBtn) {
                filterMenu.remove();
                document.removeEventListener('click', closeFilterMenu);
            }
        });
    }, 0);
}

// Filter orders by status
function filterOrders(status) {
    const orderRows = document.querySelectorAll('.order table tbody tr');
    orderRows.forEach(row => {
        if (status === 'All') {
            row.style.display = '';
        } else {
            const orderStatus = row.querySelector('.status').textContent;
            if (orderStatus.toLowerCase() === status.toLowerCase()) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
    document.querySelector('.filter-menu').remove();
}

// Filter todos by completion status
function filterTodos(status) {
    const todoItems = document.querySelectorAll('.todo-list li');
    todoItems.forEach(item => {
        if (status === 'All') {
            item.style.display = '';
        } else if (status === 'Completed' && item.classList.contains('completed')) {
            item.style.display = '';
        } else if (status === 'Not Completed' && item.classList.contains('not-completed')) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
    document.querySelector('.filter-menu').remove();
}

// Update page content based on menu selection
function updatePageContent(menuItem) {
    const pageTitle = menuItem.querySelector('.text').textContent;
    const breadcrumbActive = document.querySelector('.breadcrumb .active');
    const mainTitle = document.querySelector('.head-title h1');
    
    // Update page title and breadcrumb
    mainTitle.textContent = pageTitle;
    breadcrumbActive.textContent = pageTitle;
    
    // You can add more specific content updates here based on the selected menu
    console.log(`Navigated to: ${pageTitle}`);
}

// Notification click handler
const notification = document.querySelector('.notification');
notification.addEventListener('click', function(e) {
    e.preventDefault();
    alert('You have 8 new notifications!');
});

// Profile click handler
const profile = document.querySelector('.profile');
profile.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Profile menu clicked!');
});

// Download PDF button handler
const downloadBtn = document.querySelector('.btn-download');
downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    alert('PDF download started!');
});

// Logout handler
const logoutBtn = document.querySelector('.logout');
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        alert('Logged out successfully!');
        // You can add actual logout logic here
    }
});

// Responsive handling
window.addEventListener('resize', function() {
    if (window.innerWidth > 576) {
        searchForm.classList.remove('show');
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
    }
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('hide');
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('AdminHub Dashboard loaded successfully!');
    
    // Auto-hide sidebar on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.add('hide');
    }
    
    // Add hover effects to interactive elements
    addHoverEffects();
});

// Add hover effects
function addHoverEffects() {
    // Add hover effect to box-info items
    const boxInfoItems = document.querySelectorAll('.box-info li');
    boxInfoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effect to table rows
    const tableRows = document.querySelectorAll('.order table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove active class from other rows
            tableRows.forEach(r => r.classList.remove('active-row'));
            // Add active class to clicked row
            this.classList.add('active-row');
        });
    });
}

// Add custom styles for dynamic elements
const style = document.createElement('style');
style.textContent = `
    .active-row {
        background: var(--light-blue) !important;
    }
    
    .filter-menu div:hover,
    .todo-context-menu div:hover {
        background: var(--grey);
    }
    
    .todo-list li:hover {
        transform: translateX(5px);
        transition: transform 0.2s ease;
    }
    
    @media screen and (max-width: 768px) {
        .filter-menu {
            right: -50px;
        }
    }
`;
document.head.appendChild(style);