/* =====================================================
   SITTA - JavaScript Main Script
   Tugas Praktik 1 - Pemrograman Web
   ===================================================== */

// Global Variables
let currentUser = null;
let booksData = [];
let cart = [];
let orders = [];
let shippingData = [];
let allBooks = [];
let userAddresses = []; // New: user shipping addresses
let editingAddressIndex = -1; // New: for editing address
let users = []; // Users array

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage
    loadFromLocalStorage();
    
    // Initialize users from initialUsers (from data.js) if not already in localStorage
    if (!localStorage.getItem('users') || localStorage.getItem('users') === '[]') {
        users = JSON.parse(JSON.stringify(initialUsers)); // Deep copy
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        users = JSON.parse(localStorage.getItem('users'));
    }
    
    // Initialize books from UTBooks (from data.js)
    if (!localStorage.getItem('booksData') || localStorage.getItem('booksData') === '[]') {
        booksData = JSON.parse(JSON.stringify(UTBooks)); // Deep copy
        localStorage.setItem('booksData', JSON.stringify(booksData));
    } else {
        booksData = JSON.parse(localStorage.getItem('booksData'));
    }
    
    // Check if user is logged in
    if (currentUser) {
        showMainApp();
    } else {
        showAuthPage();
    }
    
    // Initialize books data
    allBooks = [...UTBooks];
    booksData = [...allBooks];
});

// =====================================================
// LOCAL STORAGE FUNCTIONS
// =====================================================
function loadFromLocalStorage() {
    const storedUser = localStorage.getItem('currentUser');
    const storedCart = localStorage.getItem('cart');
    const storedOrders = localStorage.getItem('orders');
    const storedShipping = localStorage.getItem('shippingData');
    const storedAddresses = localStorage.getItem('userAddresses');
    
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
    
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
    }
    
    if (storedShipping) {
        shippingData = JSON.parse(storedShipping);
    }
    
    if (storedAddresses) {
        userAddresses = JSON.parse(storedAddresses);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('shippingData', JSON.stringify(shippingData));
    localStorage.setItem('booksData', JSON.stringify(booksData));
    localStorage.setItem('userAddresses', JSON.stringify(userAddresses));
}

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================
function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        tabs[1].classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const emailError = document.getElementById('loginEmail-error');
    const passwordError = document.getElementById('loginPassword-error');
    
    // Clear previous errors
    emailError.textContent = '';
    passwordError.textContent = '';
    
    // Validation
    if (!email) {
        emailError.textContent = 'Email harus diisi';
        return false;
    }
    
    if (!validateEmail(email)) {
        emailError.textContent = 'Format email tidak valid';
        return false;
    }
    
    if (!password) {
        passwordError.textContent = 'Password harus diisi';
        return false;
    }
    
    if (password.length < 6) {
        passwordError.textContent = 'Password minimal 6 karakter';
        return false;
    }
    
    // Check for admin login
    if (email === 'admin@sitta.ac.id' && password === 'admin123') {
        currentUser = {
            nama: 'Administrator',
            email: email,
            nim: 'ADMIN',
            role: 'admin',
            telepon: '081234567890'
        };
        saveToLocalStorage();
        showSuccessAlert('Login sebagai Admin berhasil! Selamat datang Administrator');
        showMainApp();
        return false;
    }
    
    // Check if user exists in localStorage
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = {
            nama: user.nama,
            email: user.email,
            nim: user.nim,
            telepon: user.telepon || '',
            role: 'user'
        };
        saveToLocalStorage();
        showSuccessAlert('Login berhasil! Selamat datang ' + user.nama);
        showMainApp();
    } else {
        // Check if email exists but password wrong
        const emailExists = users.find(u => u.email === email);
        if (emailExists) {
            passwordError.textContent = 'Password salah!';
        } else {
            emailError.textContent = 'Email belum terdaftar. Silakan register terlebih dahulu';
        }
    }
    
    return false;
}

function handleRegister(event) {
    event.preventDefault();
    
    const nama = document.getElementById('regNama').value.trim();
    const nim = document.getElementById('regNIM').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const telepon = document.getElementById('regTelepon').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Clear previous errors
    ['regNama', 'regNIM', 'regEmail', 'regTelepon', 'regPassword', 'regConfirmPassword'].forEach(id => {
        const errorElement = document.getElementById(id + '-error');
        if (errorElement) errorElement.textContent = '';
    });
    
    // Validation
    let isValid = true;
    
    if (!nama) {
        document.getElementById('regNama-error').textContent = 'Nama harus diisi';
        isValid = false;
    } else if (nama.length < 3) {
        document.getElementById('regNama-error').textContent = 'Nama minimal 3 karakter';
        isValid = false;
    }
    
    if (!nim) {
        document.getElementById('regNIM-error').textContent = 'NIM harus diisi';
        isValid = false;
    } else if (!validateNIM(nim)) {
        document.getElementById('regNIM-error').textContent = 'NIM harus 9 digit angka';
        isValid = false;
    }
    
    if (!email) {
        document.getElementById('regEmail-error').textContent = 'Email harus diisi';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('regEmail-error').textContent = 'Format email tidak valid';
        isValid = false;
    }
    
    if (!telepon) {
        document.getElementById('regTelepon-error').textContent = 'Nomor telepon harus diisi';
        isValid = false;
    } else if (!validatePhone(telepon)) {
        document.getElementById('regTelepon-error').textContent = 'Nomor telepon tidak valid (gunakan format 08xxxxxxxxxx)';
        isValid = false;
    }
    
    if (!password) {
        document.getElementById('regPassword-error').textContent = 'Password harus diisi';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('regPassword-error').textContent = 'Password minimal 6 karakter';
        isValid = false;
    }
    
    if (!confirmPassword) {
        document.getElementById('regConfirmPassword-error').textContent = 'Konfirmasi password harus diisi';
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById('regConfirmPassword-error').textContent = 'Password tidak cocok';
        isValid = false;
    }
    
    if (!isValid) {
        return false;
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        document.getElementById('regEmail-error').textContent = 'Email sudah terdaftar. Silakan gunakan email lain atau login';
        return false;
    }
    
    // Check if NIM already exists
    if (users.find(u => u.nim === nim)) {
        document.getElementById('regNIM-error').textContent = 'NIM sudah terdaftar';
        return false;
    }
    
    // Save user
    const newUser = {
        nama: nama,
        nim: nim,
        email: email,
        telepon: telepon,
        password: password,
        role: 'user'
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showSuccessAlert('Registrasi berhasil! Silakan login dengan email dan password Anda');
    
    // Clear form
    document.getElementById('registerForm').reset();
    
    // Switch to login tab
    switchAuthTab('login');
    
    // Pre-fill email in login form
    document.getElementById('loginEmail').value = email;
    
    return false;
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showAuthPage();
        showSuccessAlert('Anda telah keluar dari sistem');
    }
}

// =====================================================
// VALIDATION FUNCTIONS
// =====================================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateNIM(nim) {
    return /^\d{9}$/.test(nim);
}

function validatePhone(phone) {
    return /^08\d{8,11}$/.test(phone);
}

// =====================================================
// PAGE NAVIGATION
// =====================================================
function showAuthPage() {
    document.getElementById('authPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Update user info
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    userName.textContent = currentUser.nama;
    userAvatar.textContent = currentUser.nama.charAt(0).toUpperCase();
    
    // Show/hide admin menu based on role
    const adminMenuLink = document.getElementById('adminMenuLink');
    if (currentUser.role === 'admin') {
        adminMenuLink.style.display = 'block';
    } else {
        adminMenuLink.style.display = 'none';
    }
    
    // Load initial data
    displayBooks();
    updateCartCount();
    displayHistory();
}

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    const pageMap = {
        'catalog': 'catalogPage',
        'cart': 'cartPage',
        'history': 'historyPage',
        'shipping': 'shippingPage',
        'profile': 'profilePage',
        'admin': 'adminPage'
    };
    
    const pageId = pageMap[pageName];
    if (pageId) {
        document.getElementById(pageId).style.display = 'block';
    }
    
    // Add active class to clicked link if event exists
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }
    
    // Load page-specific data
    if (pageName === 'catalog') {
        displayBooks(); // Show all books in catalog
    } else if (pageName === 'cart') {
        displayCart();
    } else if (pageName === 'history') {
        displayHistory();
    } else if (pageName === 'shipping') {
        displayShipping();
    } else if (pageName === 'profile') {
        showProfile();
    } else if (pageName === 'admin') {
        loadAdminBooks(); // Load admin dashboard
    }
}

// =====================================================
// BOOKS DISPLAY & FILTER
// =====================================================
function displayBooks() {
    const grid = document.getElementById('booksGrid');
    
    if (!grid) {
        console.error('booksGrid element not found! Waiting for page to load...');
        // Try again after a short delay
        setTimeout(displayBooks, 100);
        return;
    }
    
    grid.innerHTML = '';
    
    if (!booksData || booksData.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">Tidak ada buku yang tersedia</p>';
        return;
    }
    
    booksData.forEach(book => {
        const card = createBookCard(book);
        grid.appendChild(card);
    });
    
    console.log(`Displayed ${booksData.length} books`);
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    // Determine stock status and color
    let stockClass = 'stock-available';
    let stockText = `Stok: ${book.stock}`;
    
    if (book.stock === 0) {
        stockClass = 'stock-empty';
        stockText = 'Habis';
    } else if (book.stock > 0 && book.stock <= 5) {
        stockClass = 'stock-low';
    }
    
    card.innerHTML = `
        <img src="${book.image}" alt="${book.title}" class="book-image" onerror="this.style.display='none'">
        <div class="book-content">
            <div class="book-code">${book.code}</div>
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">Penulis: ${book.author}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 0.5rem 0;">
                <span class="book-prodi">${book.prodi}</span>
                <span class="stock-badge ${stockClass}">${stockText}</span>
            </div>
            <p class="book-semester">Semester ${book.semester}</p>
            <p class="book-description">${book.description}</p>
            <div class="book-price">Rp ${book.price.toLocaleString('id-ID')}</div>
            <div class="book-actions">
                <button class="btn btn-secondary btn-sm" onclick="showBookDetail('${book.code}')">Detail</button>
                <button class="btn btn-primary btn-sm" onclick="addToCart('${book.code}')" ${book.stock === 0 ? 'disabled' : ''}>
                    ${book.stock === 0 ? 'Habis' : '+ Keranjang'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function filterBooks() {
    const searchInput = document.getElementById('searchBooks');
    const prodiSelect = document.getElementById('prodiFilter');
    const semesterSelect = document.getElementById('semesterFilter');
    
    // Check if elements exist (they might not be loaded yet)
    if (!searchInput || !prodiSelect || !semesterSelect) {
        console.log('Filter elements not found, displaying all books');
        displayBooks();
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    const prodiFilter = prodiSelect.value;
    const semesterFilter = semesterSelect.value;
    
    // Filter from booksData (which includes stock info)
    let filteredBooks = [...booksData]; // Create a copy
    
    if (searchTerm || prodiFilter || semesterFilter) {
        filteredBooks = booksData.filter(book => {
            const matchSearch = book.title.toLowerCase().includes(searchTerm) || 
                              book.code.toLowerCase().includes(searchTerm) ||
                              (book.author && book.author.toLowerCase().includes(searchTerm));
            const matchProdi = !prodiFilter || book.prodi === prodiFilter;
            const matchSemester = !semesterFilter || book.semester == semesterFilter;
            
            return matchSearch && matchProdi && matchSemester;
        });
    }
    
    // Display filtered books
    displayFilteredBooks(filteredBooks);
}

// New function to display filtered books without modifying booksData
function displayFilteredBooks(books) {
    const grid = document.getElementById('booksGrid');
    if (!grid) {
        console.error('booksGrid element not found');
        return;
    }
    
    grid.innerHTML = '';
    
    if (books.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">Tidak ada buku yang ditemukan</p>';
        return;
    }
    
    books.forEach(book => {
        const card = createBookCard(book);
        grid.appendChild(card);
    });
}

// =====================================================
// BOOK DETAIL MODAL
// =====================================================
function showBookDetail(bookCode) {
    const book = booksData.find(b => b.code === bookCode);
    if (!book) return;
    
    const modal = document.getElementById('bookModal');
    const content = document.getElementById('bookModalContent');
    
    let stockClass = 'stock-available';
    let stockText = `Stok: ${book.stock} buku`;
    
    if (book.stock === 0) {
        stockClass = 'stock-empty';
        stockText = 'Stok Habis';
    } else if (book.stock > 0 && book.stock <= 5) {
        stockClass = 'stock-low';
    }
    
    content.innerHTML = `
        <h2 style="color: var(--primary-color); margin-bottom: 1rem;">${book.title}</h2>
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; margin-bottom: 2rem;">
            <img src="${book.image}" alt="${book.title}" style="width: 100%; border-radius: 10px;" onerror="this.style.display='none'">
            <div>
                <p><strong>Kode:</strong> ${book.code}</p>
                <p><strong>Penulis:</strong> ${book.author}</p>
                <p><strong>Program Studi:</strong> ${book.prodi}</p>
                <p><strong>Semester:</strong> ${book.semester}</p>
                <p><strong>Ketersediaan:</strong> <span class="stock-badge ${stockClass}">${stockText}</span></p>
                <p style="margin-top: 1rem;"><strong>Deskripsi:</strong></p>
                <p>${book.description}</p>
                <div style="margin-top: 1.5rem;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #28a745; margin-bottom: 1rem;">
                        Rp ${book.price.toLocaleString('id-ID')}
                    </div>
                    <button class="btn btn-primary" onclick="addToCart('${book.code}'); closeBookModal();" style="width: 100%;" ${book.stock === 0 ? 'disabled' : ''}>
                        ${book.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function closeBookModal() {
    document.getElementById('bookModal').classList.remove('show');
}

// =====================================================
// CART FUNCTIONS
// =====================================================
function addToCart(bookCode) {
    const book = booksData.find(b => b.code === bookCode);
    if (!book) return;
    
    // Check stock availability
    if (book.stock === 0) {
        showErrorAlert('Stok buku habis!');
        return;
    }
    
    const existingItem = cart.find(item => item.code === bookCode);
    
    if (existingItem) {
        // Check if adding more would exceed stock
        if (existingItem.quantity >= book.stock) {
            showErrorAlert(`Stok tersisa hanya ${book.stock} buku`);
            return;
        }
        existingItem.quantity += 1;
        showSuccessAlert(`Jumlah "${book.title}" ditambahkan`);
    } else {
        cart.push({
            ...book,
            quantity: 1
        });
        showSuccessAlert(`"${book.title}" ditambahkan ke keranjang`);
    }
    
    updateCartCount();
    saveToLocalStorage();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Update different cart count elements if they exist
    const cartCountElem = document.getElementById('cartCount');
    const cartBadge = document.getElementById('cartBadge');
    const cartCountMobile = document.getElementById('cartCountMobile');

    if (cartCountElem) {
        cartCountElem.textContent = totalItems;
    }

    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }

    if (cartCountMobile) {
        cartCountMobile.textContent = totalItems;
        cartCountMobile.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (!cartItems) {
        console.error('cartItems element not found');
        return;
    }
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px; background: white; border-radius: 10px;">
                <p style="color: #666; font-size: 18px;">🛒 Keranjang kosong</p>
                <p style="color: #999;">Silakan tambahkan buku ke keranjang</p>
                <button class="btn btn-primary" onclick="loadPage('catalog')">Belanja Sekarang</button>
            </div>
        `;
        
        // Hide checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        
        // Reset summary
        updateCartSummary(0, 0);
        return;
    }
    
    // Show checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.style.display = 'block';
    
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.style.cssText = 'background: white; padding: 20px; border-radius: 10px; margin-bottom: 15px; display: flex; gap: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);';
        
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width: 100px; height: 140px; object-fit: cover; border-radius: 5px;" onerror="this.style.display='none'">
            <div style="flex: 1;">
                <h3 style="margin: 0 0 5px 0; color: #2c3e50;">${item.title}</h3>
                <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">${item.code}</p>
                <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">${item.prodi} - Semester ${item.semester}</p>
                <div style="font-size: 20px; color: #003d82; font-weight: bold; margin-top: 10px;">Rp ${item.price.toLocaleString('id-ID')}</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-end;">
                <div style="display: flex; align-items: center; gap: 5px; background: #f0f0f0; padding: 5px 10px; border-radius: 5px;">
                    <button class="btn btn-sm" style="padding: 5px 10px;" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" value="${item.quantity}" readonly style="width: 50px; text-align: center; border: none; background: transparent; font-weight: bold;">
                    <button class="btn btn-sm" style="padding: 5px 10px;" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">🗑️ Hapus</button>
                <div style="font-size: 14px; color: #666;">Subtotal: <strong>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</strong></div>
            </div>
        `;
        
        cartItems.appendChild(itemDiv);
    });
    
    // Update summary
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    updateCartSummary(totalItems, totalPrice);
}

function updateCartSummary(totalItems, subtotal) {
    const shipping = 15000;
    const total = subtotal + shipping;
    
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartSubtotal) cartSubtotal.textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
    if (cartTotal) cartTotal.textContent = 'Rp ' + total.toLocaleString('id-ID');
}

function updateQuantity(index, change) {
    const item = cart[index];
    const book = booksData.find(b => b.code === item.code);
    
    if (change > 0 && book) {
        // Check stock when increasing quantity
        if (item.quantity >= book.stock) {
            showErrorAlert(`Stok tersisa hanya ${book.stock} buku`);
            return;
        }
    }
    
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        displayCart();
        updateCartCount();
        saveToLocalStorage();
    }
}

function removeFromCart(index) {
    if (confirm('Hapus buku ini dari keranjang?')) {
        cart.splice(index, 1);
        displayCart();
        updateCartCount();
        saveToLocalStorage();
        showSuccessAlert('Buku dihapus dari keranjang');
    }
}

// =====================================================
// CHECKOUT PROSES
// =====================================================
function proceedToCheckout() {
    if (cart.length === 0) {
        showErrorAlert('Keranjang kosong!');
        return;
    }
    
    // Show checkout modal
    showCheckoutModal();
}

function showCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const addressSelector = document.getElementById('addressSelector');
    
    if (userAddresses.length === 0) {
        addressSelector.innerHTML = `
            <div style="padding: 1rem; background: #fff3cd; border-radius: 8px; margin-bottom: 1rem;">
                <p style="margin: 0; color: #856404;">⚠️ Belum ada alamat pengiriman.</p>
                <button class="btn btn-sm btn-primary" onclick="closeCheckoutModal(); loadPage('profile')" style="margin-top: 0.5rem;">
                    Tambah Alamat
                </button>
            </div>
        `;
    } else {
        let addressesHTML = '';
        userAddresses.forEach((address, index) => {
            const checked = address.isDefault ? 'checked' : '';
            addressesHTML += `
                <div class="address-option" style="border: 2px solid #e0e0e0; border-radius: 8px; padding: 1rem; margin-bottom: 0.5rem;">
                    <label style="display: flex; gap: 1rem; cursor: pointer;">
                        <input type="radio" name="selectedAddress" value="${index}" ${checked} required>
                        <div style="flex: 1;">
                            <strong>${address.label}</strong>
                            ${address.isDefault ? '<span style="background: #003d82; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 0.5rem;">Default</span>' : ''}
                            <p style="margin: 0.25rem 0; font-size: 0.9rem;">${address.recipient} - ${address.phone}</p>
                            <p style="margin: 0; color: #666; font-size: 0.85rem;">${address.street}, ${address.city}, ${address.province} ${address.postalCode}</p>
                        </div>
                    </label>
                </div>
            `;
        });
        addressSelector.innerHTML = addressesHTML;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15000;
    const total = subtotal + shipping;
    
    document.getElementById('checkoutSubtotal').textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
    document.getElementById('checkoutTotal').textContent = 'Rp ' + total.toLocaleString('id-ID');
    
    modal.classList.add('show');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('show');
}

function processCheckout(event) {
    event.preventDefault();
    
    if (userAddresses.length === 0) {
        showErrorAlert('Tambahkan alamat pengiriman terlebih dahulu!');
        return;
    }
    
    const selectedAddressInput = document.querySelector('input[name="selectedAddress"]:checked');
    if (!selectedAddressInput) {
        showErrorAlert('Pilih alamat pengiriman!');
        return;
    }
    
    const addressIndex = parseInt(selectedAddressInput.value);
    const selectedAddress = userAddresses[addressIndex];
    const orderNotes = document.getElementById('orderNotes').value;
    
    // Close checkout modal
    closeCheckoutModal();
    
    // Create order
    checkout(selectedAddress, orderNotes);
}

function checkout(selectedAddress, orderNotes) {
    if (cart.length === 0) {
        showErrorAlert('Keranjang kosong!');
        return;
    }
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15000;
    const totalPrice = subtotal + shipping;
    
    const orderCode = 'ORD' + Date.now();
    const order = {
        code: orderCode,
        date: new Date().toLocaleString('id-ID'),
        user: currentUser.nama,
        userEmail: currentUser.email,
        items: [...cart],
        totalItems: totalItems,
        subtotal: subtotal,
        shipping: shipping,
        totalPrice: totalPrice,
        status: 'pending',
        paymentStatus: 'unpaid',
        shippingAddress: selectedAddress || userAddresses.find(a => a.isDefault) || userAddresses[0],
        notes: orderNotes || '',
        shippingStatus: null
    };
    
    orders.push(order);
    const orderIndex = orders.length - 1;
    
    // Clear cart but don't save yet - wait for payment
    const tempCart = [...cart];
    cart = [];
    
    saveToLocalStorage();
    updateCartCount();
    
    // Show payment modal with QR Code
    showPaymentModal(order, orderIndex, tempCart);
}

// =====================================================
// PAYMENT MODAL WITH QR CODE
// =====================================================
function showPaymentModal(order, orderIndex, originalCart) {
    const modal = document.getElementById('paymentModal');
    const content = document.getElementById('paymentModalContent');
    
    // Payment data for QR Code
    const paymentData = {
        orderCode: order.code,
        amount: order.totalPrice,
        merchant: "SITTA - UT",
        account: "BCA 1234567890"
    };
    
    const qrData = JSON.stringify(paymentData);
    
    content.innerHTML = `
        <div class="payment-info">
            <h3 style="margin-bottom: 1rem; text-align: center;">Informasi Pembayaran</h3>
            <p><strong>Kode Pesanan:</strong> <span>${order.code}</span></p>
            <p><strong>Total Item:</strong> <span>${order.totalItems} buku</span></p>
            <p><strong>Total Pembayaran:</strong> <span style="color: #28a745; font-weight: 700;">Rp ${order.totalPrice.toLocaleString('id-ID')}</span></p>
        </div>
        
        <div class="countdown-timer" id="paymentTimer">
            ⏱️ Selesaikan pembayaran dalam <strong id="timerDisplay">15:00</strong>
        </div>
        
        <div class="qr-container">
            <p style="margin-bottom: 1rem; color: #666;">Scan QR Code untuk melakukan pembayaran</p>
            <div id="qrcode" class="qr-code"></div>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">atau transfer manual ke:</p>
            <p style="font-weight: 600;">BCA 1234567890 a.n. SITTA - UT</p>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button class="btn btn-secondary" onclick="cancelPayment(${orderIndex}, ${JSON.stringify(originalCart).replace(/"/g, '&quot;')})" style="flex: 1;">
                Batal
            </button>
            <button class="btn btn-success" onclick="confirmPayment(${orderIndex})" style="flex: 1;">
                ✓ Saya Sudah Bayar
            </button>
        </div>
    `;
    
    modal.classList.add('show');
    
    // Generate QR Code
    setTimeout(() => {
        new QRCode(document.getElementById("qrcode"), {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: "#003d82",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }, 100);
    
    // Start countdown timer (15 minutes)
    startPaymentTimer(900, orderIndex, originalCart);
}

function startPaymentTimer(duration, orderIndex, originalCart) {
    let timer = duration;
    const display = document.getElementById('timerDisplay');
    
    const interval = setInterval(function () {
        const minutes = parseInt(timer / 60, 10);
        const seconds = parseInt(timer % 60, 10);
        
        const minutesStr = minutes < 10 ? "0" + minutes : minutes;
        const secondsStr = seconds < 10 ? "0" + seconds : seconds;
        
        if (display) {
            display.textContent = minutesStr + ":" + secondsStr;
        }
        
        if (--timer < 0) {
            clearInterval(interval);
            if (orders[orderIndex].paymentStatus === 'unpaid') {
                cancelPayment(orderIndex, originalCart);
                showErrorAlert('Waktu pembayaran habis!');
            }
        }
    }, 1000);
}

function confirmPayment(orderIndex) {
    if (confirm('Apakah Anda yakin sudah melakukan pembayaran?')) {
        const order = orders[orderIndex];
        
        // Reduce stock for each item in the order
        order.items.forEach(item => {
            const book = booksData.find(b => b.code === item.code);
            if (book) {
                book.stock -= item.quantity;
                // Ensure stock doesn't go negative
                if (book.stock < 0) book.stock = 0;
            }
        });
        
        orders[orderIndex].status = 'processing';
        orders[orderIndex].paymentStatus = 'paid';
        orders[orderIndex].paidDate = new Date().toLocaleString('id-ID');
        
        // Create shipping data
        const resiNumber = 'RESI' + Date.now();
        const shippingDate = new Date();
        const estimatedArrival = new Date(shippingDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        
        const shipping = {
            orderCode: orders[orderIndex].code,
            resiNumber: resiNumber,
            shippingDate: shippingDate.toLocaleString('id-ID'),
            estimatedArrival: estimatedArrival.toLocaleString('id-ID'),
            status: 'processing',
            tracking: [
                {
                    status: 'Pesanan Diterima',
                    date: new Date().toLocaleString('id-ID'),
                    location: 'Warehouse UT Jakarta',
                    description: 'Pesanan Anda telah diterima dan sedang diproses'
                },
                {
                    status: 'Sedang Dikemas',
                    date: null,
                    location: 'Warehouse UT Jakarta',
                    description: 'Pesanan sedang dikemas'
                },
                {
                    status: 'Dikirim',
                    date: null,
                    location: 'JNE Hub Jakarta',
                    description: 'Paket dalam perjalanan'
                },
                {
                    status: 'Tiba di Kota Tujuan',
                    date: null,
                    location: 'JNE Hub Kota Tujuan',
                    description: 'Paket sudah tiba di kota tujuan'
                },
                {
                    status: 'Sedang Diantar',
                    date: null,
                    location: 'Kurir JNE',
                    description: 'Paket sedang dalam pengantaran'
                },
                {
                    status: 'Terkirim',
                    date: null,
                    location: 'Alamat Penerima',
                    description: 'Paket telah diterima'
                }
            ]
        };
        
        shippingData.push(shipping);
        saveToLocalStorage();
        
        closePaymentModal();
        showSuccessAlert(`Pembayaran berhasil dikonfirmasi!\nNomor Resi: ${resiNumber}\nEstimasi tiba: ${estimatedArrival.toLocaleDateString('id-ID')}`);
        
        // Refresh books display to show updated stock
        displayBooks();
        showPage('history');
    }
}

function cancelPayment(orderIndex, originalCart) {
    // Restore cart
    cart = JSON.parse(JSON.stringify(originalCart));
    
    // Remove order
    orders.splice(orderIndex, 1);
    
    saveToLocalStorage();
    updateCartCount();
    closePaymentModal();
    showPage('cart');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('show');
}

// Pay for unpaid order from history
function payUnpaidOrder(orderIndex) {
    const order = orders[orderIndex];
    
    if (!order) {
        showErrorAlert('Pesanan tidak ditemukan!');
        return;
    }
    
    if (order.paymentStatus === 'paid') {
        showErrorAlert('Pesanan ini sudah dibayar!');
        return;
    }
    
    // Show payment modal for this order
    showPaymentModal(order, orderIndex, []);
}

// =====================================================
// ORDER HISTORY
// =====================================================
function displayHistory() {
    const container = document.getElementById('ordersContainer');
    const searchBox = document.getElementById('historySearch');
    const searchResult = document.getElementById('orderSearchResult');
    
    if (!container) {
        console.error('ordersContainer not found');
        return;
    }
    
    // If user is not logged in, show only search box (centered)
    if (!currentUser) {
        if (searchBox) {
            searchBox.style.display = 'block';
        }
        if (searchResult) {
            searchResult.style.display = 'none';
        }
        container.innerHTML = '';
        return;
    }
    
    // Hide search box for logged in users
    if (searchBox) {
        searchBox.style.display = 'none';
    }
    
    // Determine if user is admin
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    // Filter orders based on user role
    let displayOrders = orders;
    if (!isAdmin) {
        // User only sees their own orders
        displayOrders = orders.filter(order => order.userEmail === currentUser.email);
    }
    
    if (displayOrders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; background: white; border-radius: 10px;">
                <p style="color: #666; font-size: 18px;">📋 Belum ada riwayat pemesanan</p>
                <p style="color: #999;">Silakan lakukan pemesanan terlebih dahulu</p>
            </div>
        `;
        return;
    }
    
    // Create orders list
    let html = '';
    displayOrders.forEach((order, index) => {
        const paymentStatusClass = order.paymentStatus === 'paid' ? 'status-paid' : 'status-unpaid';
        const paymentStatusText = order.paymentStatus === 'paid' ? '✓ Lunas' : '⏳ Belum Bayar';
        
        // Admin sees user email, User doesn't
        const userInfo = isAdmin ? `<p><strong>Email:</strong> ${order.userEmail || 'N/A'}</p>` : '';
        
        // Add payment button for unpaid orders (user only, not admin)
        const paymentButton = (!isAdmin && order.paymentStatus === 'unpaid') 
            ? `<button class="btn btn-success btn-sm" onclick="payUnpaidOrder(${orders.indexOf(order)})" style="margin-left: 10px;">💳 Bayar Sekarang</button>` 
            : '';
        
        html += `
            <div class="order-card" style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="margin: 0; color: #2c3e50;">📦 ${order.code}</h3>
                        <p style="margin: 5px 0; color: #7f8c8d;">${order.date}</p>
                        ${userInfo}
                    </div>
                    <span class="status-badge ${paymentStatusClass}">${paymentStatusText}</span>
                </div>
                <div style="border-top: 1px solid #e0e0e0; padding-top: 15px;">
                    <p><strong>Total Item:</strong> ${order.totalItems} buku</p>
                    <p><strong>Total Harga:</strong> <span style="font-size: 20px; color: #003d82; font-weight: bold;">Rp ${order.totalPrice.toLocaleString('id-ID')}</span></p>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                        <button class="btn btn-primary btn-sm" onclick="showOrderDetail(${orders.indexOf(order)})">Lihat Detail</button>
                        ${paymentButton}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Search Order Function (Public - No Login Required)
function searchOrder(event) {
    event.preventDefault();
    
    const orderCode = document.getElementById('orderCodeInput').value.trim().toUpperCase();
    const resultDiv = document.getElementById('orderSearchResult');
    
    if (!orderCode) {
        showErrorAlert('Silakan masukkan kode pesanan');
        return;
    }
    
    // Find order by code
    const order = orders.find(o => o.code.toUpperCase() === orderCode);
    
    if (!order) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div class="search-card" style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; text-align: center;">
                <h3 style="color: #e74c3c; margin-bottom: 15px;">❌ Pesanan Tidak Ditemukan</h3>
                <p style="color: #666;">Kode pesanan <strong>${orderCode}</strong> tidak ditemukan dalam sistem.</p>
                <p style="color: #999; margin-top: 10px; font-size: 14px;">Pastikan Anda memasukkan kode pesanan dengan benar.</p>
            </div>
        `;
        return;
    }
    
    // Status mapping
    const statusMap = {
        'pending': 'Menunggu Pembayaran',
        'paid': 'Sudah Dibayar',
        'processing': 'Diproses',
        'shipped': 'Dikirim',
        'delivered': 'Selesai'
    };
    
    const status = statusMap[order.status] || order.status || 'Pending';
    const paymentStatusClass = order.paymentStatus === 'paid' ? 'status-paid' : 'status-unpaid';
    const paymentStatusText = order.paymentStatus === 'paid' ? '✓ Lunas' : '⏳ Belum Bayar';
    
    // Display order details
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="search-card" style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h3 style="color: #27ae60; margin-bottom: 10px;">✓ Pesanan Ditemukan</h3>
                <h2 style="color: #003d82; margin: 0;">📦 ${order.code}</h2>
            </div>
            
            <div style="border: 2px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap;">
                    <div>
                        <p style="margin: 5px 0; color: #666;"><strong>Tanggal:</strong> ${order.date}</p>
                        <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: #003d82; font-weight: bold;">${status}</span></p>
                    </div>
                    <span class="status-badge ${paymentStatusClass}" style="margin-top: 10px;">${paymentStatusText}</span>
                </div>
                
                <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 15px;">
                    <h4 style="margin-bottom: 15px; color: #2c3e50;">📚 Item Pesanan:</h4>
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${order.items.map(item => `
                            <div style="display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px;">
                                <div>
                                    <p style="margin: 0; font-weight: bold; color: #2c3e50;">${item.title}</p>
                                    <p style="margin: 5px 0; color: #666; font-size: 14px;">${item.code}</p>
                                </div>
                                <div style="text-align: right;">
                                    <p style="margin: 0; color: #666;">${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}</p>
                                    <p style="margin: 5px 0; font-weight: bold; color: #003d82;">Rp ${(item.quantity * item.price).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="border-top: 2px solid #e0e0e0; padding-top: 15px; margin-top: 15px; text-align: right;">
                    <p style="margin: 5px 0; color: #666;"><strong>Total Item:</strong> ${order.totalItems} buku</p>
                    <p style="margin: 5px 0; font-size: 24px; color: #003d82; font-weight: bold;">Total: Rp ${order.totalPrice.toLocaleString('id-ID')}</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="clearOrderSearch()" style="padding: 12px 30px;">
                    Cari Pesanan Lain
                </button>
            </div>
        </div>
    `;
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Clear search and reset form
function clearOrderSearch() {
    document.getElementById('orderCodeInput').value = '';
    document.getElementById('orderSearchResult').style.display = 'none';
    document.getElementById('orderCodeInput').focus();
}

// =====================================================
// SHIPPING TRACKING
// =====================================================
function displayShipping() {
    const container = document.getElementById('shippingContainer');
    const searchBox = document.getElementById('shippingSearch');
    const searchResult = document.getElementById('searchResult');
    
    if (!container) {
        console.error('shippingContainer not found');
        return;
    }
    
    // If user is not logged in, show only search box
    if (!currentUser) {
        if (searchBox) searchBox.style.display = 'block';
        if (searchResult) searchResult.style.display = 'none';
        container.innerHTML = '';
        return;
    }
    
    // If user is logged in, show search box and their shipments
    if (searchBox) searchBox.style.display = 'block';
    if (searchResult) searchResult.style.display = 'none';
    
    // Determine if user is admin
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    // Filter shipping based on user role
    let displayShipping = shippingData;
    if (!isAdmin) {
        // User only sees their own shipments
        displayShipping = shippingData.filter(ship => {
            // Find matching order
            const order = orders.find(o => o.code === ship.orderCode);
            return order && order.userEmail === currentUser.email;
        });
    }
    
    if (displayShipping.length === 0) {
        container.innerHTML = `
            <div style="margin-top: 2rem;">
                <h3 style="color: #003d82; margin-bottom: 1rem;">Pengiriman Saya</h3>
                <div style="text-align: center; padding: 40px; background: white; border-radius: 10px;">
                    <p style="color: #666; font-size: 18px;">🚚 Belum ada pengiriman</p>
                    <p style="color: #999;">Lakukan pemesanan dan pembayaran terlebih dahulu</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Create shipping list
    let html = '<div style="margin-top: 2rem;"><h3 style="color: #003d82; margin-bottom: 1rem;">Pengiriman Saya</h3>';
    displayShipping.forEach((shipping, index) => {
        const statusClass = shipping.status === 'delivered' ? 'status-delivered' : 
                          shipping.status === 'shipped' ? 'status-shipped' : 'status-processing';
        const statusText = shipping.status === 'delivered' ? '✓ Terkirim' : 
                          shipping.status === 'shipped' ? '🚛 Dalam Pengiriman' : '📦 Diproses';
        
        // Find order for user info
        const order = orders.find(o => o.code === shipping.orderCode);
        const userInfo = isAdmin && order ? `<p><strong>Email:</strong> ${order.userEmail || 'N/A'}</p>` : '';
        
        html += `
            <div class="shipping-card" style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <h3 style="margin: 0; color: #2c3e50;">📦 ${shipping.orderCode}</h3>
                        <p style="margin: 5px 0;"><strong>No. Resi:</strong> <span style="color: #003d82; font-weight: bold;">${shipping.resiNumber}</span></p>
                        ${userInfo}
                    </div>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div style="border-top: 1px solid #e0e0e0; padding-top: 15px;">
                    <p><strong>Tanggal Kirim:</strong> ${shipping.shippingDate}</p>
                    <p><strong>Estimasi Tiba:</strong> ${shipping.estimatedArrival}</p>
                    <button class="btn btn-primary btn-sm" onclick="showTrackingDetail(${shippingData.indexOf(shipping)})">🔍 Lacak Paket</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function searchShipping(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('shippingSearchInput');
    const searchResult = document.getElementById('searchResult');
    const orderCode = searchInput.value.trim().toUpperCase();
    
    if (!orderCode) {
        showErrorAlert('Masukkan kode pesanan!');
        return;
    }
    
    // Find shipping by order code
    const shipping = shippingData.find(s => s.orderCode.toUpperCase() === orderCode);
    
    if (!shipping) {
        searchResult.style.display = 'block';
        searchResult.innerHTML = `
            <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 10px; padding: 2rem; text-align: center;">
                <h3 style="color: #856404;">❌ Tidak Ditemukan</h3>
                <p style="color: #856404;">Kode pesanan <strong>${orderCode}</strong> tidak ditemukan.</p>
                <p style="color: #856404; font-size: 0.9rem;">Pastikan kode pesanan yang Anda masukkan benar.</p>
            </div>
        `;
        return;
    }
    
    // Display shipping info with censored data
    const statusClass = shipping.status === 'delivered' ? 'status-delivered' : 
                      shipping.status === 'shipped' ? 'status-shipped' : 'status-processing';
    const statusText = shipping.status === 'delivered' ? '✓ Terkirim' : 
                      shipping.status === 'shipped' ? '🚛 Dalam Pengiriman' : '📦 Diproses';
    
    // Build tracking timeline
    let trackingHTML = '<div class="tracking-timeline">';
    shipping.tracking.forEach((track, i) => {
        const isCompleted = track.date !== null;
        const markerClass = isCompleted ? '' : 'pending';
        
        trackingHTML += `
            <div class="timeline-item">
                <div class="timeline-marker ${markerClass}"></div>
                <div class="timeline-content">
                    <h4>${track.status}</h4>
                    <p><strong>${track.location}</strong></p>
                    <p>${track.description}</p>
                    ${track.date ? `<p style="color: #666; font-size: 0.85rem;">📅 ${track.date}</p>` : '<p style="color: #999; font-size: 0.85rem;">Belum diproses</p>'}
                </div>
            </div>
        `;
    });
    trackingHTML += '</div>';
    
    searchResult.style.display = 'block';
    searchResult.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
                <div>
                    <h3 style="margin: 0; color: #2c3e50;">📦 ${shipping.orderCode}</h3>
                    <p style="margin: 5px 0;"><strong>No. Resi:</strong> <span style="color: #003d82; font-weight: bold;">${shipping.resiNumber}</span></p>
                </div>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; margin-bottom: 1.5rem;">
                <p><strong>Tanggal Kirim:</strong> ${shipping.shippingDate}</p>
                <p><strong>Estimasi Tiba:</strong> ${shipping.estimatedArrival}</p>
            </div>
            
            <h3 style="margin-bottom: 1rem; color: #003d82;">📍 Tracking Pengiriman</h3>
            ${trackingHTML}
            
            <div style="margin-top: 1.5rem; padding: 1rem; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #003d82;">
                <p style="margin: 0; color: #666; font-size: 0.9rem;">
                    <em>ℹ️ Untuk informasi lebih detail, silakan login ke akun Anda.</em>
                </p>
            </div>
        </div>
    `;
    
    // Scroll to result
    searchResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function showTrackingDetail(index) {
    const shipping = shippingData[index];
    const modal = document.getElementById('trackingModal');
    const content = document.getElementById('trackingModalContent');
    
    // Check if current user is admin
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    let trackingHTML = `
        <div class="payment-info" style="margin-bottom: 2rem;">
            <p><strong>Kode Pesanan:</strong> ${shipping.orderCode}</p>
            <p><strong>Nomor Resi:</strong> <span style="color: #003d82; font-weight: 700;">${shipping.resiNumber}</span></p>
            <p><strong>Tanggal Kirim:</strong> ${shipping.shippingDate}</p>
            <p><strong>Estimasi Tiba:</strong> ${shipping.estimatedArrival}</p>
        </div>
        
        <h3 style="margin-bottom: 1.5rem;">Tracking Pengiriman</h3>
        <div class="tracking-timeline">
    `;
    
    shipping.tracking.forEach((track, i) => {
        const isCompleted = track.date !== null;
        const markerClass = isCompleted ? '' : 'pending';
        
        trackingHTML += `
            <div class="timeline-item">
                <div class="timeline-marker ${markerClass}"></div>
                <div class="timeline-content">
                    <h4>${track.status}</h4>
                    <p><strong>${track.location}</strong></p>
                    <p>${track.description}</p>
                    ${track.date ? `<p style="color: #666; font-size: 0.85rem;">📅 ${track.date}</p>` : '<p style="color: #999; font-size: 0.85rem;">Belum diproses</p>'}
                </div>
            </div>
        `;
    });
    
    trackingHTML += `</div>`;
    
    // Only show Update Status button for admin
    if (isAdmin) {
        trackingHTML += `
            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn btn-secondary" onclick="updateShippingStatus(${index})">Update Status (Demo)</button>
            </div>
        `;
    }
    
    content.innerHTML = trackingHTML;
    modal.classList.add('show');
}

function updateShippingStatus(index) {
    // Demo function to update shipping status
    const shipping = shippingData[index];
    const tracking = shipping.tracking;
    
    // Find next uncompleted status
    for (let i = 0; i < tracking.length; i++) {
        if (!tracking[i].date) {
            tracking[i].date = new Date().toLocaleString('id-ID');
            
            if (i === tracking.length - 1) {
                shipping.status = 'delivered';
            } else if (i >= 2) {
                shipping.status = 'shipped';
            }
            
            saveToLocalStorage();
            showSuccessAlert('Status pengiriman diperbarui!');
            closeTrackingModal();
            displayShipping();
            return;
        }
    }
    
    showSuccessAlert('Paket sudah terkirim!');
}

function closeTrackingModal() {
    document.getElementById('trackingModal').classList.remove('show');
}

function showOrderDetail(index) {
    const order = orders[index];
    const modal = document.getElementById('orderModal');
    const content = document.getElementById('orderModalContent');
    
    // Map status to Indonesian
    const statusMap = {
        'pending': 'Menunggu Pembayaran',
        'paid': 'Sudah Dibayar',
        'processing': 'Sedang Diproses',
        'shipped': 'Dalam Pengiriman',
        'delivered': 'Terkirim',
        'cancelled': 'Dibatalkan'
    };
    
    const statusLabel = statusMap[order.status] || order.status || 'Menunggu Pembayaran';
    
    let itemsList = '';
    order.items.forEach(item => {
        itemsList += `
            <tr>
                <td>${item.code}</td>
                <td>${item.title}</td>
                <td>${item.quantity}</td>
                <td>Rp ${item.price.toLocaleString('id-ID')}</td>
                <td>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</td>
            </tr>
        `;
    });
    
    content.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <p><strong>Kode Pesanan:</strong> ${order.code}</p>
            <p><strong>Tanggal:</strong> ${order.date}</p>
            <p><strong>Pemesan:</strong> ${order.user}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${order.status || 'pending'}">${statusLabel}</span></p>
        </div>
        
        <h3 style="margin-bottom: 1rem;">Detail Item</h3>
        <div class="table-container" style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin-bottom: 1.5rem;">
            <table class="order-table">
                <thead>
                    <tr>
                        <th>Kode</th>
                        <th>Judul</th>
                        <th>Jumlah</th>
                        <th>Harga</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsList}
                </tbody>
            </table>
        </div>
        
        <div style="text-align: right; font-size: 1.2rem; font-weight: 700; color: #28a745;">
            Total: Rp ${order.totalPrice.toLocaleString('id-ID')}
        </div>
    `;

    
    modal.classList.add('show');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('show');
}

// =====================================================
// ALERT FUNCTIONS
// =====================================================
function showSuccessAlert(message) {
    alert('✅ ' + message);
}

function showErrorAlert(message) {
    alert('❌ ' + message);
}

// =====================================================
// CLOSE MODALS ON OUTSIDE CLICK
// =====================================================
window.onclick = function(event) {
    const bookModal = document.getElementById('bookModal');
    const orderModal = document.getElementById('orderModal');
    const paymentModal = document.getElementById('paymentModal');
    const trackingModal = document.getElementById('trackingModal');
    const addressModal = document.getElementById('addressModal');
    
    if (event.target === bookModal) {
        closeBookModal();
    }
    
    if (event.target === orderModal) {
        closeOrderModal();
    }
    
    if (event.target === paymentModal) {
        // Don't close payment modal on outside click
        // closePaymentModal();
    }
    
    if (event.target === trackingModal) {
        closeTrackingModal();
    }
    
    if (event.target === addressModal) {
        closeAddressModal();
    }
}

// =====================================================
// PUBLIC TRACKING FUNCTIONS (NO LOGIN REQUIRED)
// =====================================================
function showPublicTracking() {
    // Switch view from auth to public tracking. Use the IDs present in index.html
    const authPage = document.getElementById('authPage');
    const publicPage = document.getElementById('publicTrackingPage');
    const trackingInput = document.getElementById('trackingSearchInput');
    const trackingResult = document.getElementById('trackingResult');

    if (authPage) authPage.style.display = 'none';
    if (publicPage) publicPage.style.display = 'block';
    if (trackingInput) {
        trackingInput.value = '';
        trackingInput.focus();
    }
    if (trackingResult) trackingResult.innerHTML = '';
}

function backToAuth() {
    document.getElementById('publicTrackingPage').style.display = 'none';
    document.getElementById('authPage').style.display = 'flex';
}

function maskName(name) {
    if (!name || name.length < 3) return '***';
    const first = name.charAt(0);
    const last = name.charAt(name.length - 1);
    const middle = '*'.repeat(name.length - 2);
    return first + middle + last;
}

function maskAddress(address) {
    if (!address) return '***************';
    const words = address.split(' ');
    if (words.length <= 2) return '***************';
    return words[0] + ' ************* ' + words[words.length - 1];
}

function searchPublicTracking() {
    const input = document.getElementById('trackingSearchInput');
    const searchValue = input ? input.value.trim().toUpperCase() : '';
    const resultDiv = document.getElementById('trackingResult');
    
    if (!searchValue) {
        resultDiv.innerHTML = '<p style="text-align: center; color: #999;">Masukkan nomor pesanan atau resi</p>';
        return;
    }
    
    // Search in shippingData by orderCode or resiNumber
    const found = shippingData.find(s => 
        s.orderCode === searchValue || s.resiNumber === searchValue
    );
    
    if (!found) {
        if (resultDiv) resultDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #fff3cd; border-radius: 10px; border: 2px solid #ffc107;">
                <h3 style="color: #856404;">❌ Pesanan Tidak Ditemukan</h3>
                <p style="color: #856404;">Nomor pesanan atau resi tidak ditemukan dalam sistem.</p>
                <p style="color: #856404; font-size: 0.9rem;">Pastikan nomor yang Anda masukkan benar.</p>
            </div>
        `;
        return;
    }
    
    // Find order details
    const order = orders.find(o => o.code === found.orderCode);
    
    // Build tracking timeline
    let trackingHTML = '<div class="tracking-timeline" style="margin-top: 2rem;">';
    found.tracking.forEach((track, i) => {
        const isCompleted = track.date !== null;
        const markerClass = isCompleted ? '' : 'pending';
        
        trackingHTML += `
            <div class="timeline-item">
                <div class="timeline-marker ${markerClass}"></div>
                <div class="timeline-content">
                    <h4>${track.status}</h4>
                    <p><strong>${track.location}</strong></p>
                    <p>${track.description}</p>
                    ${track.date ? `<p style="color: #666; font-size: 0.85rem;">📅 ${track.date}</p>` : '<p style="color: #999; font-size: 0.85rem;">Belum diproses</p>'}
                </div>
            </div>
        `;
    });
    trackingHTML += '</div>';
    
    // Display result with masked information
    resultDiv.innerHTML = `
        <div style="background: #e7f3ff; border: 2px solid #003d82; border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem;">
            <h3 style="color: #003d82; margin-bottom: 1rem;">✅ Pesanan Ditemukan</h3>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1rem; font-size: 0.95rem;">
                <strong>Kode Pesanan:</strong> <span>${found.orderCode}</span>
                <strong>Nomor Resi:</strong> <span style="color: #003d82; font-weight: 700;">${found.resiNumber}</span>
                <strong>Nama Penerima:</strong> <span>${maskName(order ? order.user : 'User')}</span>
                <strong>Alamat:</strong> <span style="color: #999; font-style: italic;">${maskAddress('Alamat Pengiriman')}</span>
                <strong>Tanggal Kirim:</strong> <span>${found.shippingDate}</span>
                <strong>Estimasi Tiba:</strong> <span>${found.estimatedArrival}</span>
            </div>
            <p style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #003d82; color: #666; font-size: 0.9rem;">
                <em>ℹ️ Nama dan alamat disembunyikan untuk privasi. Login untuk melihat detail lengkap.</em>
            </p>
        </div>
        
        <h3 style="margin-bottom: 1rem; color: #003d82;">📍 Tracking Pengiriman</h3>
        ${trackingHTML}
    `;
}

// =====================================================
// MY PROFILE FUNCTIONS
// =====================================================
function displayProfile() {
    showProfile();
}

function showProfile() {
    if (!currentUser) return;
    
    // Populate profile form
    const profileNama = document.getElementById('profileNama');
    const profileNIM = document.getElementById('profileNIM');
    const profileEmail = document.getElementById('profileEmail');
    const profileTelepon = document.getElementById('profileTelepon');
    
    if (profileNama) profileNama.value = currentUser.nama || '';
    if (profileNIM) profileNIM.value = currentUser.nim || '';
    if (profileEmail) profileEmail.value = currentUser.email || '';
    if (profileTelepon) profileTelepon.value = currentUser.telepon || '';
    
    // Display addresses
    displayAddresses();
}

function updateProfile(event) {
    event.preventDefault();
    
    const nama = document.getElementById('profileNama').value;
    const telepon = document.getElementById('profileTelepon').value;
    
    // Clear errors if elements exist
    const namaError = document.getElementById('profileNama-error');
    const teleponError = document.getElementById('profileTelepon-error');
    if (namaError) namaError.textContent = '';
    if (teleponError) teleponError.textContent = '';
    
    // Validation
    if (nama.length < 3) {
        if (namaError) {
            namaError.textContent = 'Nama minimal 3 karakter';
        } else {
            showErrorAlert('Nama minimal 3 karakter');
        }
        return false;
    }
    
    if (telepon && !validatePhone(telepon)) {
        if (teleponError) {
            teleponError.textContent = 'Nomor telepon tidak valid (gunakan format 08xxxxxxxxxx)';
        } else {
            showErrorAlert('Nomor telepon tidak valid (gunakan format 08xxxxxxxxxx)');
        }
        return false;
    }
    
    // Update current user
    currentUser.nama = nama;
    currentUser.telepon = telepon;
    
    // Update in users array
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex >= 0) {
        users[userIndex] = currentUser;
    }
    
    saveToLocalStorage();
    
    // Update UI
    const userNameElement = document.getElementById('userName');
    const userAvatarElement = document.getElementById('userAvatar');
    if (userNameElement) userNameElement.textContent = nama;
    if (userAvatarElement) userAvatarElement.textContent = nama.charAt(0).toUpperCase();
    
    showSuccessAlert('Profil berhasil diperbarui!');
    return false;
}

function displayAddresses() {
    const addressList = document.getElementById('addressList');
    
    if (!addressList) return;
    
    if (userAddresses.length === 0) {
        addressList.innerHTML = `
            <p style="text-align: center; color: #999; padding: 2rem; background: #f9f9f9; border-radius: 10px;">
                Belum ada alamat pengiriman.<br>
                Klik tombol "Tambah Alamat" untuk menambahkan.
            </p>
        `;
        return;
    }
    
    addressList.innerHTML = '';
    
    userAddresses.forEach((address, index) => {
        const addressCard = document.createElement('div');
        addressCard.className = 'address-card';
        addressCard.style.cssText = 'border: 2px solid #e0e0e0; border-radius: 10px; padding: 1rem; margin-bottom: 1rem; position: relative;';
        
        if (address.isDefault) {
            addressCard.style.borderColor = '#003d82';
            addressCard.style.background = '#f0f7ff';
        }
        
        // Sensor phone number - show only last 4 digits
        const censoredPhone = address.phone ? address.phone.substring(0, 4) + '****' + address.phone.substring(address.phone.length - 4) : '****';
        
        // Sensor street address - show only first 20 chars
        const censoredStreet = address.street.length > 20 ? address.street.substring(0, 20) + '...' : address.street;
        
        addressCard.innerHTML = `
            ${address.isDefault ? '<span style="position: absolute; top: 10px; right: 10px; background: #003d82; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem;">Default</span>' : ''}
            <h4 style="color: #003d82; margin-bottom: 0.5rem;">📍 ${address.label}</h4>
            <p style="margin: 0.25rem 0;"><strong>${address.recipient}</strong></p>
            <p style="margin: 0.25rem 0;" title="${address.phone}">📞 ${censoredPhone}</p>
            <p style="margin: 0.25rem 0; color: #666;" title="${address.street}">
                📍 ${censoredStreet}<br>
                ${address.city}, ${address.province} ${address.postalCode}
            </p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                ${!address.isDefault ? `<button class="btn btn-sm btn-primary" onclick="setDefaultAddress(${index})">Set Default</button>` : ''}
                <button class="btn btn-sm btn-secondary" onclick="editAddress(${index})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteAddress(${index})">Hapus</button>
            </div>
        `;
        
        addressList.appendChild(addressCard);
    });
}

function showAddAddressForm() {
    editingAddressIndex = -1;
    document.getElementById('addressModalTitle').textContent = 'Tambah Alamat Pengiriman';
    document.getElementById('addressForm').reset();
    
    // Clear errors
    ['addressLabel', 'addressRecipient', 'addressPhone', 'addressStreet', 'addressCity', 'addressProvince', 'addressPostalCode'].forEach(id => {
        document.getElementById(id + '-error').textContent = '';
    });
    
    document.getElementById('addressModal').classList.add('show');
}

function editAddress(index) {
    editingAddressIndex = index;
    const address = userAddresses[index];
    
    document.getElementById('addressModalTitle').textContent = 'Edit Alamat Pengiriman';
    document.getElementById('addressLabel').value = address.label;
    document.getElementById('addressRecipient').value = address.recipient;
    document.getElementById('addressPhone').value = address.phone;
    document.getElementById('addressStreet').value = address.street;
    document.getElementById('addressCity').value = address.city;
    document.getElementById('addressProvince').value = address.province;
    document.getElementById('addressPostalCode').value = address.postalCode;
    
    document.getElementById('addressModal').classList.add('show');
}

function saveAddress(event) {
    event.preventDefault();
    
    const label = document.getElementById('addressLabel').value;
    const recipient = document.getElementById('addressRecipient').value;
    const phone = document.getElementById('addressPhone').value;
    const street = document.getElementById('addressStreet').value;
    const city = document.getElementById('addressCity').value;
    const province = document.getElementById('addressProvince').value;
    const postalCode = document.getElementById('addressPostalCode').value;
    
    // Clear errors
    ['addressLabel', 'addressRecipient', 'addressPhone', 'addressStreet', 'addressCity', 'addressProvince', 'addressPostalCode'].forEach(id => {
        document.getElementById(id + '-error').textContent = '';
    });
    
    // Validation
    if (!validatePhone(phone)) {
        document.getElementById('addressPhone-error').textContent = 'Nomor telepon tidak valid';
        return false;
    }
    
    if (postalCode.length !== 5 || !/^\d+$/.test(postalCode)) {
        document.getElementById('addressPostalCode-error').textContent = 'Kode pos harus 5 digit angka';
        return false;
    }
    
    const addressData = {
        label,
        recipient,
        phone,
        street,
        city,
        province,
        postalCode,
        isDefault: userAddresses.length === 0 // First address is default
    };
    
    if (editingAddressIndex >= 0) {
        // Edit existing
        addressData.isDefault = userAddresses[editingAddressIndex].isDefault;
        userAddresses[editingAddressIndex] = addressData;
        showSuccessAlert('Alamat berhasil diperbarui!');
    } else {
        // Add new
        userAddresses.push(addressData);
        showSuccessAlert('Alamat berhasil ditambahkan!');
    }
    
    saveToLocalStorage();
    displayAddresses();
    closeAddressModal();
    
    return false;
}

function setDefaultAddress(index) {
    // Remove default from all
    userAddresses.forEach(addr => addr.isDefault = false);
    // Set new default
    userAddresses[index].isDefault = true;
    
    saveToLocalStorage();
    displayAddresses();
    showSuccessAlert('Alamat default berhasil diubah!');
}

function deleteAddress(index) {
    if (confirm('Hapus alamat ini?')) {
        const wasDefault = userAddresses[index].isDefault;
        userAddresses.splice(index, 1);
        
        // If deleted was default and there are still addresses, make first one default
        if (wasDefault && userAddresses.length > 0) {
            userAddresses[0].isDefault = true;
        }
        
        saveToLocalStorage();
        displayAddresses();
        showSuccessAlert('Alamat berhasil dihapus!');
    }
}

function closeAddressModal() {
    document.getElementById('addressModal').classList.remove('show');
}

// Toggle inline address form in profile page
function toggleAddressForm() {
    const form = document.getElementById('addAddressForm');
    const isVisible = form.style.display !== 'none';
    
    if (isVisible) {
        form.style.display = 'none';
    } else {
        form.style.display = 'block';
        // Clear form
        document.getElementById('newAddressLabel').value = '';
        document.getElementById('newAddressRecipient').value = '';
        document.getElementById('newAddressPhone').value = '';
        document.getElementById('newAddressStreet').value = '';
        document.getElementById('newAddressCity').value = '';
        document.getElementById('newAddressProvince').value = '';
        document.getElementById('newAddressPostalCode').value = '';
        
        // Clear errors
        ['newAddressLabel', 'newAddressRecipient', 'newAddressPhone', 'newAddressStreet', 'newAddressCity', 'newAddressProvince', 'newAddressPostalCode'].forEach(id => {
            const errorEl = document.getElementById(id + '-error');
            if (errorEl) errorEl.textContent = '';
        });
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function cancelAddressForm() {
    document.getElementById('addAddressForm').style.display = 'none';
}

function saveAddressInline(event) {
    event.preventDefault();
    
    const label = document.getElementById('newAddressLabel').value.trim();
    const recipient = document.getElementById('newAddressRecipient').value.trim();
    const phone = document.getElementById('newAddressPhone').value.trim();
    const street = document.getElementById('newAddressStreet').value.trim();
    const city = document.getElementById('newAddressCity').value.trim();
    const province = document.getElementById('newAddressProvince').value.trim();
    const postalCode = document.getElementById('newAddressPostalCode').value.trim();
    
    // Clear errors
    ['newAddressLabel', 'newAddressRecipient', 'newAddressPhone', 'newAddressStreet', 'newAddressCity', 'newAddressProvince', 'newAddressPostalCode'].forEach(id => {
        const errorEl = document.getElementById(id + '-error');
        if (errorEl) errorEl.textContent = '';
    });
    
    // Validation
    let isValid = true;
    
    if (!label) {
        document.getElementById('newAddressLabel-error').textContent = 'Label alamat harus diisi';
        isValid = false;
    }
    
    if (!recipient) {
        document.getElementById('newAddressRecipient-error').textContent = 'Nama penerima harus diisi';
        isValid = false;
    }
    
    if (!phone) {
        document.getElementById('newAddressPhone-error').textContent = 'Nomor telepon harus diisi';
        isValid = false;
    } else if (!validatePhone(phone)) {
        document.getElementById('newAddressPhone-error').textContent = 'Nomor telepon tidak valid (gunakan format 08xxxxxxxxxx)';
        isValid = false;
    }
    
    if (!street) {
        document.getElementById('newAddressStreet-error').textContent = 'Alamat lengkap harus diisi';
        isValid = false;
    }
    
    if (!city) {
        document.getElementById('newAddressCity-error').textContent = 'Kota/Kabupaten harus diisi';
        isValid = false;
    }
    
    if (!province) {
        document.getElementById('newAddressProvince-error').textContent = 'Provinsi harus diisi';
        isValid = false;
    }
    
    if (!postalCode) {
        document.getElementById('newAddressPostalCode-error').textContent = 'Kode pos harus diisi';
        isValid = false;
    } else if (postalCode.length !== 5 || !/^\d+$/.test(postalCode)) {
        document.getElementById('newAddressPostalCode-error').textContent = 'Kode pos harus 5 digit angka';
        isValid = false;
    }
    
    if (!isValid) {
        return false;
    }
    
    // Create address object
    const addressData = {
        label,
        recipient,
        phone,
        street,
        city,
        province,
        postalCode,
        isDefault: userAddresses.length === 0 // First address is default
    };
    
    // Add to addresses array
    userAddresses.push(addressData);
    
    // Save and refresh
    saveToLocalStorage();
    displayAddresses();
    
    // Hide form and show success message
    cancelAddressForm();
    showSuccessAlert('✓ Alamat berhasil ditambahkan!');
    
    return false;
}

// =====================================================
// ADMIN FUNCTIONS
// =====================================================

let editingBookIndex = -1; // Track which book is being edited

function showAdminTab(tab) {
    // Update tab buttons
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide tab content
    if (tab === 'books') {
        document.getElementById('adminBooksTab').style.display = 'block';
        document.getElementById('adminOrdersTab').style.display = 'none';
        loadAdminBooks();
    } else if (tab === 'orders') {
        document.getElementById('adminBooksTab').style.display = 'none';
        document.getElementById('adminOrdersTab').style.display = 'block';
        loadAdminOrders();
    }
}

function loadAdminBooks() {
    const tbody = document.getElementById('adminBooksList');
    
    if (!booksData || booksData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Belum ada buku</td></tr>';
        return;
    }
    
    tbody.innerHTML = booksData.map((book, index) => `
        <tr>
            <td><strong>${book.code}</strong></td>
            <td>${book.title}</td>
            <td>Semester ${book.semester}</td>
            <td>Rp ${book.price.toLocaleString('id-ID')}</td>
            <td>${book.stock}</td>
            <td>
                <button class="btn btn-sm" onclick="editBook(${index})">✏️ Edit</button>
                <button class="btn btn-sm" onclick="deleteBook(${index})" style="background: #f44336;">🗑️ Hapus</button>
            </td>
        </tr>
    `).join('');
}

function loadAdminOrders() {
    const tbody = document.getElementById('adminOrdersList');
    
    if (!shippingData || shippingData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Belum ada pesanan</td></tr>';
        return;
    }
    
    tbody.innerHTML = shippingData.map(order => {
        const statusClass = order.status || 'pending';
        const statusText = {
            'pending': 'Menunggu Pembayaran',
            'processing': 'Diproses',
            'shipped': 'Dalam Pengiriman',
            'delivered': 'Terkirim'
        }[statusClass] || 'Pending';
        
        return `
            <tr>
                <td><strong>${order.orderCode}</strong></td>
                <td>${order.name}</td>
                <td>${order.resi || '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${new Date(order.orderDate).toLocaleDateString('id-ID')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="showUpdateStatusModal('${order.orderCode}')">📝 Update Status</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter Admin Books
function filterAdminBooks() {
    const searchValue = document.getElementById('adminBookSearch')?.value.toLowerCase() || '';
    const semesterFilter = document.getElementById('adminSemesterFilter')?.value || '';
    const prodiFilter = document.getElementById('adminProdiFilter')?.value || '';
    
    const tbody = document.getElementById('adminBooksList');
    
    if (!booksData || booksData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Belum ada buku</td></tr>';
        return;
    }
    
    // Filter books
    let filteredBooks = booksData.filter(book => {
        const matchSearch = !searchValue || 
            book.code.toLowerCase().includes(searchValue) ||
            book.title.toLowerCase().includes(searchValue) ||
            book.prodi.toLowerCase().includes(searchValue) ||
            book.author.toLowerCase().includes(searchValue);
        
        const matchSemester = !semesterFilter || book.semester.toString() === semesterFilter;
        const matchProdi = !prodiFilter || book.prodi === prodiFilter;
        
        return matchSearch && matchSemester && matchProdi;
    });
    
    // Display filtered books
    if (filteredBooks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Tidak ada buku yang sesuai dengan filter</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredBooks.map((book, index) => {
        const originalIndex = booksData.indexOf(book);
        return `
            <tr>
                <td><strong>${book.code}</strong></td>
                <td>${book.title}</td>
                <td>Semester ${book.semester}</td>
                <td>Rp ${book.price.toLocaleString('id-ID')}</td>
                <td>${book.stock}</td>
                <td>
                    <button class="btn btn-sm" onclick="editBook(${originalIndex})">✏️ Edit</button>
                    <button class="btn btn-sm" onclick="deleteBook(${originalIndex})" style="background: #f44336;">🗑️ Hapus</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter Admin Orders
function filterAdminOrders() {
    const searchValue = document.getElementById('adminOrderSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('adminStatusFilter')?.value || '';
    const paymentFilter = document.getElementById('adminPaymentFilter')?.value || '';
    
    const tbody = document.getElementById('adminOrdersList');
    
    if (!shippingData || shippingData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Belum ada pesanan</td></tr>';
        return;
    }
    
    // Filter orders
    let filteredOrders = shippingData.filter(order => {
        const matchSearch = !searchValue || 
            order.orderCode.toLowerCase().includes(searchValue) ||
            (order.name && order.name.toLowerCase().includes(searchValue)) ||
            (order.resi && order.resi.toLowerCase().includes(searchValue));
        
        const matchStatus = !statusFilter || order.status === statusFilter;
        
        // Get payment status from orders array
        const orderData = orders.find(o => o.code === order.orderCode);
        const paymentStatus = orderData?.paymentStatus || 'unpaid';
        const matchPayment = !paymentFilter || paymentStatus === paymentFilter;
        
        return matchSearch && matchStatus && matchPayment;
    });
    
    // Display filtered orders
    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Tidak ada pesanan yang sesuai dengan filter</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredOrders.map(order => {
        const statusClass = order.status || 'pending';
        const statusText = {
            'pending': 'Menunggu Pembayaran',
            'processing': 'Diproses',
            'shipped': 'Dalam Pengiriman',
            'delivered': 'Terkirim'
        }[statusClass] || 'Pending';
        
        return `
            <tr>
                <td><strong>${order.orderCode}</strong></td>
                <td>${order.name}</td>
                <td>${order.resi || '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${new Date(order.orderDate).toLocaleDateString('id-ID')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="showUpdateStatusModal('${order.orderCode}')">📝 Update Status</button>
                </td>
            </tr>
        `;
    }).join('');
}

function showAddBookForm() {
    editingBookIndex = -1;
    document.getElementById('bookFormTitle').textContent = 'Tambah Buku Baru';
    document.getElementById('bookForm').reset();
    document.getElementById('bookCode').disabled = false;
    document.getElementById('bookFormModal').classList.add('show');
}

function editBook(index) {
    editingBookIndex = index;
    const book = booksData[index];
    
    document.getElementById('bookFormTitle').textContent = 'Edit Buku';
    document.getElementById('bookCode').value = book.code;
    document.getElementById('bookCode').disabled = true; // Can't change code
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookProdi').value = book.prodi;
    document.getElementById('bookSemester').value = book.semester;
    document.getElementById('bookPrice').value = book.price;
    document.getElementById('bookStock').value = book.stock;
    document.getElementById('bookImage').value = book.image;
    document.getElementById('bookDescription').value = book.description || '';
    
    document.getElementById('bookFormModal').classList.add('show');
}

function saveBook(event) {
    event.preventDefault();
    
    const bookData = {
        code: document.getElementById('bookCode').value.toUpperCase(),
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        prodi: document.getElementById('bookProdi').value,
        semester: parseInt(document.getElementById('bookSemester').value),
        price: parseInt(document.getElementById('bookPrice').value),
        stock: parseInt(document.getElementById('bookStock').value),
        image: document.getElementById('bookImage').value,
        description: document.getElementById('bookDescription').value || ''
    };
    
    if (editingBookIndex === -1) {
        // Add new book
        // Check if code already exists
        if (booksData.some(b => b.code === bookData.code)) {
            alert('Kode buku sudah ada! Gunakan kode yang berbeda.');
            return;
        }
        booksData.push(bookData);
    } else {
        // Update existing book
        booksData[editingBookIndex] = { ...booksData[editingBookIndex], ...bookData };
    }
    
    saveToLocalStorage();
    loadAdminBooks();
    closeBookFormModal();
    showSuccessAlert(editingBookIndex === -1 ? 'Buku berhasil ditambahkan!' : 'Buku berhasil diupdate!');
    
    // Refresh catalog if visible
    if (document.getElementById('catalogPage').style.display !== 'none') {
        displayBooks(booksData);
    }
}

function deleteBook(index) {
    if (!confirm('Yakin ingin menghapus buku ini?')) return;
    
    booksData.splice(index, 1);
    saveToLocalStorage();
    loadAdminBooks();
    showSuccessAlert('Buku berhasil dihapus!');
    
    // Refresh catalog if visible
    if (document.getElementById('catalogPage').style.display !== 'none') {
        displayBooks(booksData);
    }
}

function closeBookFormModal() {
    document.getElementById('bookFormModal').classList.remove('show');
}

function showUpdateStatusModal(orderCode) {
    const order = shippingData.find(o => o.orderCode === orderCode);
    if (!order) return;
    
    document.getElementById('orderStatusCode').value = orderCode;
    document.getElementById('orderStatusDisplay').value = orderCode;
    document.getElementById('orderStatus').value = order.status || 'pending';
    document.getElementById('orderStatusNote').value = '';
    
    document.getElementById('orderStatusModal').classList.add('show');
}

function updateOrderStatus(event) {
    event.preventDefault();
    
    const orderCode = document.getElementById('orderStatusCode').value;
    const newStatus = document.getElementById('orderStatus').value;
    const note = document.getElementById('orderStatusNote').value;
    
    const order = shippingData.find(o => o.orderCode === orderCode);
    if (!order) return;
    
    // Update status
    order.status = newStatus;
    
    // Add to timeline
    if (!order.timeline) {
        order.timeline = [];
    }
    
    const statusLabels = {
        'pending': 'Menunggu Pembayaran',
        'processing': 'Sedang Diproses',
        'shipped': 'Dalam Pengiriman',
        'delivered': 'Pesanan Terkirim'
    };
    
    order.timeline.push({
        date: new Date().toISOString(),
        status: statusLabels[newStatus],
        note: note || 'Status diupdate oleh admin'
    });
    
    saveToLocalStorage();
    loadAdminOrders();
    closeOrderStatusModal();
    showSuccessAlert('Status pengiriman berhasil diupdate!');
}

function closeOrderStatusModal() {
    document.getElementById('orderStatusModal').classList.remove('show');
}

// =====================================================
// ALERT FUNCTIONS (Custom Alert)
// =====================================================
function showSuccessAlert(message) {
    showCustomAlert(message, 'success');
}

function showErrorAlert(message) {
    showCustomAlert(message, 'error');
}

function showCustomAlert(message, type = 'success') {
    // Remove existing alert if any
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert custom-alert-${type}`;
    
    const icon = type === 'success' ? '✓' : '✕';
    const bgColor = type === 'success' ? '#28a745' : '#dc3545';
    
    alert.innerHTML = `
        <div class="custom-alert-content">
            <span class="custom-alert-icon" style="background: ${bgColor};">${icon}</span>
            <span class="custom-alert-message">${message}</span>
            <button class="custom-alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Animate in
    setTimeout(() => alert.classList.add('show'), 10);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}
