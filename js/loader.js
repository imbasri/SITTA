/* =====================================================
   PAGE & COMPONENT LOADER
   Loads HTML pages and components dynamically
   ===================================================== */

// Load header and footer components when app starts
async function loadComponents() {
    try {
        // Load sidebar
        const sidebarResponse = await fetch('components/header.html');
        const sidebarHTML = await sidebarResponse.text();
        document.getElementById('sidebarContainer').innerHTML = sidebarHTML;
        
        // Load top header (for mobile)
        const headerHTML = sidebarHTML; // Same file contains both
        document.getElementById('headerContainer').innerHTML = ''; // Header is in sidebar
        
        // Load footer
        const footerResponse = await fetch('components/footer.html');
        const footerHTML = await footerResponse.text();
        document.getElementById('footerContainer').innerHTML = footerHTML;
        
        // Initialize sidebar functionality
        initializeSidebar();
        
        // Update user info in sidebar
        updateSidebarUserInfo();
        
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Load page content dynamically
async function loadPage(pageName) {
    try {
        // Show loading state
        const contentWrapper = document.getElementById('pageContent');
        contentWrapper.innerHTML = '<div style="text-align: center; padding: 50px;"><div class="loading-spinner" style="display: inline-block;"></div><p>Loading...</p></div>';
        
        // Fetch page content
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) {
            throw new Error(`Page not found: ${pageName}`);
        }
        
        const pageHTML = await response.text();
        contentWrapper.innerHTML = pageHTML;
        
        // Update active nav item
        updateActiveNav(pageName);
        
        // Load page-specific data
        loadPageData(pageName);
        
        // Close mobile sidebar if open
        closeMobileSidebar();
        
        // Scroll to top
        window.scrollTo(0, 0);
        
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('pageContent').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>❌ Error</h2>
                <p>Gagal memuat halaman. Silakan coba lagi.</p>
                <button class="btn btn-primary" onclick="loadPage('catalog')">Kembali ke Katalog</button>
            </div>
        `;
    }
}

// Load page-specific data
function loadPageData(pageName) {
    // Make sure displayBooks function exists
    if (typeof displayBooks !== 'function') {
        console.error('displayBooks function not found!');
        return;
    }
    
    switch(pageName) {
        case 'catalog':
            // Reset filters and display all books
            if (typeof filterBooks === 'function') {
                filterBooks();
            } else {
                displayBooks();
            }
            break;
        case 'cart':
            if (typeof displayCart === 'function') {
                displayCart();
            }
            break;
        case 'history':
            if (typeof displayHistory === 'function') {
                displayHistory();
            }
            break;
        case 'shipping':
            if (typeof displayShipping === 'function') {
                displayShipping();
            }
            break;
        case 'profile':
            if (typeof showProfile === 'function') {
                showProfile();
            }
            break;
        case 'admin':
            if (currentUser && currentUser.role === 'admin') {
                if (typeof loadAdminBooks === 'function') {
                    loadAdminBooks();
                }
            } else {
                document.getElementById('pageContent').innerHTML = `
                    <div style="text-align: center; padding: 50px;">
                        <h2>⛔ Access Denied</h2>
                        <p>Anda tidak memiliki akses ke halaman ini.</p>
                    </div>
                `;
            }
            break;
    }
}

// Update active navigation item
function updateActiveNav(pageName) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current page
    const activeNav = document.querySelector(`[data-page="${pageName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// Initialize sidebar functionality
function initializeSidebar() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle sidebar active state
            if (sidebar) sidebar.classList.toggle('active');
            
            // Toggle hamburger animation
            mobileMenuBtn.classList.toggle('active');

            // Add overlay (create only once)
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.addEventListener('click', closeMobileSidebar);
                document.body.appendChild(overlay);
            }

            if (overlay) overlay.classList.toggle('active');
        });
    }
    
    // Close sidebar when nav item clicked on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
    
    // Update cart badge
    updateCartBadge();
}

// Close mobile sidebar
function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
    }
}

// Update sidebar user info
function updateSidebarUserInfo() {
    if (!currentUser) return;
    
    const userNameSidebar = document.getElementById('userNameSidebar');
    const userAvatarSidebar = document.getElementById('userAvatarSidebar');
    const userRole = document.getElementById('userRole');
    
    if (userNameSidebar) {
        userNameSidebar.textContent = currentUser.nama || 'User';
    }
    
    if (userAvatarSidebar) {
        userAvatarSidebar.textContent = (currentUser.nama || 'U').charAt(0).toUpperCase();
    }
    
    if (userRole) {
        userRole.textContent = currentUser.role === 'admin' ? 'Administrator' : 'Mahasiswa';
    }
    
    // Show/hide menus based on role
    const isAdmin = currentUser.role === 'admin';
    
    // Admin menu - only for admin
    const adminNavLink = document.getElementById('adminNavLink');
    if (adminNavLink) {
        adminNavLink.style.display = isAdmin ? 'flex' : 'none';
    }
    
    // User-only menus - hide for admin (cart, history, profile)
    const userOnlyMenus = document.querySelectorAll('.user-only');
    userOnlyMenus.forEach(menu => {
        menu.style.display = isAdmin ? 'none' : 'flex';
    });
    
    // Also hide cart in mobile header for admin
    const headerCart = document.querySelector('.header-cart');
    if (headerCart) {
        headerCart.style.display = isAdmin ? 'none' : 'block';
    }
}

// Update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    const cartCountMobile = document.getElementById('cartCountMobile');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
    
    if (cartCountMobile) {
        cartCountMobile.textContent = totalItems;
        cartCountMobile.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Override showMainApp to load components first
const originalShowMainApp = window.showMainApp;
window.showMainApp = async function() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    
    // Load components
    await loadComponents();
    
    // Load default page
    await loadPage('catalog');
};

// Override showPage to use new loader
window.showPage = function(pageName) {
    loadPage(pageName);
};

// Override updateCartCount to update badge
const originalUpdateCartCount = window.updateCartCount;
window.updateCartCount = function() {
    if (originalUpdateCartCount) {
        originalUpdateCartCount();
    }
    updateCartBadge();
};

// Add CSS for loading spinner
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #003d82;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

console.log('📦 Loader initialized - Pages will be loaded dynamically');
