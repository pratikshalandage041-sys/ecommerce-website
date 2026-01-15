// Sample product data (replace with real data or API)
let products = [
    { id: 1, name: 'Casual T-Shirt', category: 'men', style: 'casual', subStyle: 'casual-dresses', price: 29.99, brand: 'BrandA', size: 'M', img: 'https://via.placeholder.com/280x220?text=T-Shirt', desc: 'Comfortable cotton t-shirt.' },
    { id: 2, name: 'Elegant Dress', category: 'women', style: 'formal', subStyle: 'formal-wear', price: 79.99, brand: 'BrandB', size: 'L', img: 'https://via.placeholder.com/280x220?text=Dress', desc: 'Stylish evening dress.' },
    { id: 3, name: 'Kids Hoodie', category: 'kids', style: 'casual', subStyle: 'casual-hoodies', price: 39.99, brand: 'BrandC', size: 'S', img: 'https://via.placeholder.com/280x220?text=Hoodie', desc: 'Warm and cozy hoodie.' },
    { id: 4, name: 'Formal Shirt', category: 'men', style: 'formal', subStyle: 'formal-shirts', price: 49.99, brand: 'BrandA', size: 'L', img: 'https://via.placeholder.com/280x220?text=Shirt', desc: 'Classic formal shirt.' },
    { id: 5, name: 'Bohemian Top', category: 'women', style: 'bohemian', subStyle: 'bohemian-tops', price: 34.99, brand: 'BrandB', size: 'M', img: 'https://via.placeholder.com/280x220?text=Top', desc: 'Flowy bohemian top.' },
    { id: 6, name: 'Streetwear Pants', category: 'men', style: 'streetwear', subStyle: 'streetwear-pants', price: 59.99, brand: 'BrandC', size: 'XL', img: 'https://via.placeholder.com/280x220?text=Pants', desc: 'Trendy streetwear pants.' },
    // Add more products as needed
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentProduct = null;

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts(products);
    updateCounts();
});

// Load and display products
function loadProducts(filtered = products) {
    const container = document.getElementById('products-section');
    container.innerHTML = '';
    filtered.forEach(p => {
        const productEl = document.createElement('div');
        productEl.className = 'product';
        productEl.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <h4>${p.name}</h4>
                <p>${p.brand}</p>
                <p class="price">$${p.price}</p>
                <div class="actions">
                    <button onclick="viewProduct(${p.id})">View Details</button>
                    <button class="wishlist" onclick="toggleWishlist(${p.id})">${wishlist.includes(p.id) ? '❤️' : '🤍'}</button>
                    <button onclick="addToCart(${p.id})">Add to Cart</button>
                    <button class="buy-now" onclick="buyNow(${p.id})">Buy Now</button>
                </div>
            </div>
        `;
        container.appendChild(productEl);
    });
}

// Filter by category
function filterCategory(cat) {
    let filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
    if (cat === 'women') {
        document.getElementById('sub-styles-section').classList.add('show');
        loadSubStyles('women');
    } else {
        document.getElementById('sub-styles-section').classList.remove('show');
    }
    loadProducts(filtered);
}

// Show sub-styles for a category
function showSubStyles(style) {
    const subGrid = document.getElementById('sub-style-grid');
    subGrid.innerHTML = '';
    if (style === 'casual') {
        subGrid.innerHTML = `
            <div class="sub-style" onclick="filterBySubStyle('casual-dresses')">Casual Dresses</div>
            <div class="sub-style" onclick="filterBySubStyle('casual-hoodies')">Casual Hoodies</div>
        `;
    } else if (style === 'formal') {
        subGrid.innerHTML = `
            <div class="sub-style" onclick="filterBySubStyle('formal-wear')">Formal Wear</div>
            <div class="sub-style" onclick="filterBySubStyle('formal-shirts')">Formal Shirts</div>
        `;
    } else if (style === 'bohemian') {
        subGrid.innerHTML = `
            <div class="sub-style" onclick="filterBySubStyle('bohemian-tops')">Bohemian Tops</div>
            <div class="sub-style" onclick="filterBySubStyle('bohemian-dresses')">Bohemian Dresses</div>
        `;
    } else if (style === 'streetwear') {
        subGrid.innerHTML = `
            <div class="sub-style" onclick="filterBySubStyle('streetwear-pants')">Streetwear Pants</div>
            <div class="sub-style" onclick="filterBySubStyle('streetwear-jackets')">Streetwear Jackets</div>
        `;
    }
    document.getElementById('sub-styles-section').classList.add('show');
}

// Filter by sub-style
function filterBySubStyle(subStyle) {
    const filtered = products.filter(p => p.subStyle === subStyle);
    loadProducts(filtered);
}

// Apply filters (price, size, brand)
function applyFilters() {
    let filtered = products;
    const price = document.getElementById('price-filter').value;
    const size = document.getElementById('size-filter').value;
    const brand = document.getElementById('brand-filter').value.toLowerCase();

    if (price) {
        if (price === '0-50') filtered = filtered.filter(p => p.price <= 50);
        else if (price === '50-100') filtered = filtered.filter(p => p.price > 50 && p.price <= 100);
        else filtered = filtered.filter(p => p.price > 100);
    }
    if (size) filtered = filtered.filter(p => p.size === size);
    if (brand) filtered = filtered.filter(p => p.brand.toLowerCase().includes(brand));

    loadProducts(filtered);
}

// Search products
function searchProducts() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
    loadProducts(filtered);
}

// View product details
function viewProduct(id) {
    currentProduct = products.find(p => p.id === id);
    document.getElementById('modal-img').src = currentProduct.img;
    document.getElementById('modal-title').textContent = currentProduct.name;
    document.getElementById('modal-description').textContent = currentProduct.desc;
    document.getElementById('modal-price').textContent = `$${currentProduct.price}`;
    document.getElementById('product-modal').classList.add('show');
}

// Add to cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCounts();
    alert(`${product.name} added to cart!`);
}

// Add to cart from modal
function addToCartFromModal() {
    if (currentProduct) {
        addToCart(currentProduct.id);
        closeModal();
    }
}

// Buy now
function buyNow(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCounts();
    showCheckout();
}

// Buy now from modal
function buyNowFromModal() {
    if (currentProduct) {
        buyNow(currentProduct.id);
        closeModal();
    }
}

// Toggle wishlist
function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(w => w !== id);
    } else {
        wishlist.push(id);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateCounts();
    loadProducts(); // Refresh to update heart icons
}

// Show wishlist
function showWishlist() {
    const filtered = products.filter(p => wishlist.includes(p.id));
    loadProducts(filtered);
}

// Show cart
function showCart() {
    const cartItemsEl = document.getElementById('cart-items');
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        cartItemsEl.innerHTML += `<div class="cart-item">${item.name} - $${item.price}</div>`;
    });
    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
    document.getElementById('cart-modal').classList.add('show');
}

// Checkout
function checkout() {
    closeModal();
    showCheckout();
}

// Show checkout modal
function showCheckout() {
    document.getElementById('checkout-modal').classList.add('show');
    document.getElementById('payment-method').addEventListener('change', togglePaymentFields);
}

// Toggle payment fields based on method
function togglePaymentFields() {
    const method = document.getElementById('payment-method').value;
    document.getElementById('card-number').style.display = method === 'credit' ? 'block' : 'none';
    document.getElementById('expiry').style.display = method === 'credit' ? 'block' : 'none';
    document.getElementById('cvv').style.display = method === 'credit' ? 'block' : 'none';
    document.getElementById('paypal-email').style.display = method === 'paypal' ? 'block' : 'none';
    document.getElementById('upi-id').style.display = method === 'upi' ? 'block' : 'none';
}

// Complete purchase
function completePurchase() {
    alert('Purchase completed! Thank you for shopping with StyleHub.');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCounts();
    closeModal();
}

// Show login
function showLogin() {
    document.getElementById('login-modal').classList.add('show');
}

// Login
function login() {
    alert('Logged in successfully!');
    closeModal();
}

// Signup
function signup() {
    alert('Signed up successfully!');
    closeModal();
}

// Close modal
function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
}

// Update cart and wishlist counts
function updateCounts() {
    document.getElementById('cart-count').textContent = cart.length;
    document.getElementById('wishlist-count').textContent = wishlist.length;
}

// Scroll to products
function scrollToProducts() {
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
}