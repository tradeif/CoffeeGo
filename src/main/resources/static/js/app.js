// Coffee Go - Interactive Full-Stack Client (INR ₹ Pricing)
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    initNewsletter();
    initCustomPizzaBuilder();
    initDailyZoneMenu();
    initSmoothScroll();
});

// State
let cartState = {
    items: [],
    subtotal: 0.0,
    discount: 0.0,
    deliveryFee: 0.0,
    total: 0.0,
    discountCode: null,
    totalItemCount: 0
};

let allMenuItems = [];
let activeCategory = 'ALL';

// Toast notification helper
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const icon = type === 'success' ? '✓' : '!';
    const bgColor = type === 'success' ? 'bg-[#181E21]' : 'bg-[#B33012]';

    toast.className = `fixed bottom-6 right-6 ${bgColor} text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 transform translate-y-0 opacity-100 transition-all duration-300`;
    toast.innerHTML = `
        <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">${icon}</span>
        <span class="font-medium text-sm">${message}</span>
    `;

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.className = 'fixed bottom-6 right-6 opacity-0 pointer-events-none transform translate-y-8 transition-all duration-300 z-50';
    }, 3500);
}

// ---------------- CART MANAGEMENT ----------------
function initCart() {
    fetchCart();

    const cartBtn = document.getElementById('header-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartBtn) cartBtn.addEventListener('click', toggleCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCartDrawer);

    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', () => {
            const codeInput = document.getElementById('coupon-input');
            const code = codeInput ? codeInput.value.trim() : '';
            if (!code) {
                showToast('Please enter a coupon code', 'error');
                return;
            }
            applyCoupon(code);
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckoutModal);
    }

    // Attach Add to Cart to statically rendered buttons (Best sellers & Promos)
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const itemId = btn.getAttribute('data-item-id');
            const itemName = btn.getAttribute('data-item-name');
            const size = btn.getAttribute('data-item-size') || 'Regular';
            addToCart(itemId, itemName, size);
        });
    });
}

function toggleCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (!drawer || !overlay) return;

    const isOpen = !drawer.classList.contains('translate-x-full');
    if (isOpen) {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    } else {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

async function fetchCart() {
    try {
        const res = await fetch('/api/cart');
        if (res.ok) {
            cartState = await res.json();
            updateCartUI();
        }
    } catch (err) {
        console.error('Error fetching cart:', err);
    }
}

async function addToCart(menuItemId, itemName = 'Item', size = 'Regular') {
    try {
        const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ menuItemId, quantity: 1, size })
        });
        if (res.ok) {
            cartState = await res.json();
            updateCartUI();
            showToast(`${itemName} (${size}) added to your order!`);
        }
    } catch (err) {
        showToast('Unable to add item to cart', 'error');
    }
}

async function updateQuantity(cartItemId, qty) {
    try {
        const res = await fetch(`/api/cart/item/${cartItemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: qty })
        });
        if (res.ok) {
            cartState = await res.json();
            updateCartUI();
        }
    } catch (err) {
        console.error('Error updating cart item quantity:', err);
    }
}

async function removeItem(cartItemId) {
    try {
        const res = await fetch(`/api/cart/item/${cartItemId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            cartState = await res.json();
            updateCartUI();
            showToast('Item removed from order');
        }
    } catch (err) {
        console.error('Error removing item:', err);
    }
}

async function applyCoupon(code) {
    try {
        const res = await fetch('/api/cart/coupon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        if (res.ok) {
            cartState = await res.json();
            updateCartUI();
            if (cartState.discount > 0) {
                showToast(`10% discount applied! You saved ₹${cartState.discount.toFixed(2)}`);
            } else {
                showToast('Invalid coupon code. Try COFFEEGO10', 'error');
            }
        }
    } catch (err) {
        showToast('Could not validate coupon', 'error');
    }
}

function updateCartUI() {
    // Header updates with Indian Rupee (₹)
    const badge = document.getElementById('cart-badge');
    const headerPrice = document.getElementById('header-cart-price');
    if (badge) badge.textContent = cartState.totalItemCount || '0';
    if (headerPrice) headerPrice.textContent = `₹ ${(cartState.total || 0).toFixed(2)}`;

    // Drawer list
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyState = document.getElementById('cart-empty-state');
    const cartFooter = document.getElementById('cart-footer-info');

    if (!cartItemsList) return;

    if (!cartState.items || cartState.items.length === 0) {
        cartItemsList.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (cartFooter) cartFooter.classList.add('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (cartFooter) cartFooter.classList.remove('hidden');

    cartItemsList.innerHTML = cartState.items.map(item => `
        <div class="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <img src="${item.imageUrl ? item.imageUrl + '?v=6' : '/images/hero_pizza.jpg'}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl shadow-sm" />
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-stone-900 text-sm truncate">${item.name}</h4>
                <p class="text-xs text-stone-500 font-medium">${item.size} · ₹${item.unitPrice.toFixed(2)}</p>
                ${item.customizations && item.customizations.length > 0 ? `
                    <p class="text-[10px] text-amber-700 truncate mt-0.5">${item.customizations.join(' · ')}</p>
                ` : ''}
            </div>
            <div class="flex items-center gap-2">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" class="w-7 h-7 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center justify-center font-bold text-sm">-</button>
                <span class="text-sm font-bold w-4 text-center">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" class="w-7 h-7 rounded-full bg-[#F5A623] hover:bg-[#E09419] text-stone-950 flex items-center justify-center font-bold text-sm">+</button>
                <button onclick="removeItem('${item.id}')" class="text-stone-400 hover:text-red-500 ml-1 text-xs">✕</button>
            </div>
        </div>
    `).join('');

    // Summary calculations in INR (₹)
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const discountRow = document.getElementById('cart-discount-row');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `₹ ${cartState.subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-₹ ${cartState.discount.toFixed(2)}`;
    if (discountRow) {
        if (cartState.discount > 0) discountRow.classList.remove('hidden');
        else discountRow.classList.add('hidden');
    }
    if (totalEl) totalEl.textContent = `₹ ${cartState.total.toFixed(2)}`;
}

// ---------------- DAILY ZONE MENU & CATEGORY FILTERING ----------------
async function initDailyZoneMenu() {
    try {
        const res = await fetch('/api/menu');
        if (res.ok) {
            allMenuItems = await res.json();
            renderDailyZoneItems();
        }
    } catch (err) {
        console.error('Failed to load menu items:', err);
    }

    // Category button filters
    const catButtons = document.querySelectorAll('.category-card');
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            catButtons.forEach(b => {
                b.classList.remove('bg-[#7F2417]', 'text-white', 'shadow-lg');
                b.classList.add('bg-white/80', 'text-stone-800');
            });
            btn.classList.remove('bg-white/80', 'text-stone-800');
            btn.classList.add('bg-[#7F2417]', 'text-white', 'shadow-lg');

            activeCategory = btn.getAttribute('data-category') || 'ALL';
            renderDailyZoneItems();
        });
    });

    // Search filter input
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderDailyZoneItems(e.target.value.trim().toLowerCase());
        });
    }
}

function renderDailyZoneItems(searchTerm = '') {
    const container = document.getElementById('daily-zone-items-grid');
    if (!container) return;

    let filtered = allMenuItems;
    if (activeCategory && activeCategory !== 'ALL') {
        filtered = filtered.filter(item => item.category.toUpperCase() === activeCategory.toUpperCase());
    }

    if (searchTerm) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-12 text-center text-stone-500">
                <p class="font-display text-xl uppercase mb-1">No items found</p>
                <p class="text-xs">Try selecting a different category or search term.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(item => {
        const hasSizes = item.sizePrices && Object.keys(item.sizePrices).length > 0;
        const sizeOptionsHtml = hasSizes ? `
            <div class="mt-2 mb-3 flex items-center justify-center gap-1.5 flex-wrap">
                ${Object.entries(item.sizePrices).map(([sName, sPrice], idx) => `
                    <button type="button" onclick="selectItemSize('${item.id}', '${sName}', ${sPrice}, this)" class="size-pill-btn px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${idx === 0 ? 'bg-stone-900 text-white border-stone-900 active-size' : 'bg-stone-100 text-stone-700 border-stone-200'} transition hover:bg-stone-800 hover:text-white" data-size="${sName}" data-price="${sPrice}">
                        ${sName}: ₹${sPrice}
                    </button>
                `).join('')}
            </div>
        ` : '';

        return `
            <div class="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1" id="card-${item.id}">
                <div>
                    <div class="relative overflow-hidden rounded-2xl mb-4 h-40 bg-stone-100">
                        <img src="${item.imageUrl ? item.imageUrl + '?v=6' : '/images/hero_pizza.jpg'}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <span class="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                            ${item.category}
                        </span>
                        ${item.badge ? `
                            <span class="absolute top-2.5 right-2.5 bg-[#B33012] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider shadow">
                                ${item.badge}
                            </span>
                        ` : ''}
                    </div>
                    <h4 class="font-display text-lg text-stone-900 uppercase tracking-wide leading-tight mb-1 truncate" title="${item.name}">
                        ${item.name}
                    </h4>
                    <p class="text-xs text-stone-500 font-medium leading-relaxed line-clamp-2 mb-2">
                        ${item.description}
                    </p>
                </div>

                <div>
                    ${sizeOptionsHtml}
                    <div class="pt-2 border-t border-stone-100 flex items-center justify-between mt-1">
                        <div>
                            <span class="text-[10px] text-stone-400 font-bold block uppercase">Price</span>
                            <span class="font-display text-base text-[#B33012] price-label" id="price-label-${item.id}">
                                ${item.priceDisplay || '₹' + item.price}
                            </span>
                        </div>
                        <button type="button" onclick="handleCardAddToCart('${item.id}', '${item.name}')" class="bg-[#F5A623] hover:bg-[#E09419] text-stone-950 font-bold text-xs uppercase px-4 py-2 rounded-full shadow-sm hover:shadow transition transform hover:scale-105 flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5 text-stone-900" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            ADD
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function selectItemSize(itemId, sizeName, sizePrice, btn) {
    const card = document.getElementById(`card-${itemId}`);
    if (!card) return;

    card.querySelectorAll('.size-pill-btn').forEach(b => {
        b.classList.remove('bg-stone-900', 'text-white', 'border-stone-900', 'active-size');
        b.classList.add('bg-stone-100', 'text-stone-700', 'border-stone-200');
    });

    btn.classList.remove('bg-stone-100', 'text-stone-700', 'border-stone-200');
    btn.classList.add('bg-stone-900', 'text-white', 'border-stone-900', 'active-size');

    const priceLabel = document.getElementById(`price-label-${itemId}`);
    if (priceLabel) {
        priceLabel.textContent = `₹${sizePrice}`;
    }
}

function handleCardAddToCart(itemId, itemName) {
    const card = document.getElementById(`card-${itemId}`);
    let selectedSize = 'Regular';
    if (card) {
        const activePill = card.querySelector('.size-pill-btn.active-size');
        if (activePill) {
            selectedSize = activePill.getAttribute('data-size');
        }
    }
    addToCart(itemId, itemName, selectedSize);
}

// ---------------- CHECKOUT MODAL ----------------
function openCheckoutModal() {
    if (!cartState.items || cartState.items.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('hidden');
        const checkoutTotal = document.getElementById('checkout-modal-total');
        if (checkoutTotal) checkoutTotal.textContent = `₹ ${cartState.total.toFixed(2)}`;
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('hidden');
}

async function submitOrder(e) {
    e.preventDefault();
    const form = document.getElementById('checkout-form');
    if (!form) return;

    const data = {
        customerName: form.customerName.value.trim(),
        phone: form.phone.value.trim(),
        address: form.address.value.trim(),
        paymentMethod: form.paymentMethod.value,
        notes: form.notes ? form.notes.value.trim() : ''
    };

    if (!data.customerName || !data.phone || !data.address) {
        showToast('Please fill in all delivery details', 'error');
        return;
    }

    try {
        const res = await fetch('/api/orders/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok && result.success) {
            closeCheckoutModal();
            toggleCartDrawer();
            fetchCart();
            openOrderSuccessModal(result);
        } else {
            showToast(result.message || 'Checkout failed', 'error');
        }
    } catch (err) {
        showToast('Server communication error', 'error');
    }
}

function openOrderSuccessModal(orderData) {
    const modal = document.getElementById('order-success-modal');
    if (!modal) return;

    document.getElementById('success-order-id').textContent = orderData.orderId;
    document.getElementById('success-order-total').textContent = `₹ ${orderData.total.toFixed(2)}`;
    document.getElementById('success-order-time').textContent = `${orderData.estimatedDeliveryMinutes} Minutes`;

    modal.classList.remove('hidden');
}

function closeOrderSuccessModal() {
    const modal = document.getElementById('order-success-modal');
    if (!modal) return;
    modal.classList.add('hidden');
}

// ---------------- NEWSLETTER SUBSCRIPTION ----------------
function initNewsletter() {
    const form = document.getElementById('subscribe-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('subscribe-email');
            const email = input ? input.value.trim() : '';

            if (!email || !email.includes('@')) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            try {
                const res = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const result = await res.json();
                if (res.ok && result.success) {
                    showToast(result.message);
                    input.value = '';
                    const couponInput = document.getElementById('coupon-input');
                    if (couponInput) couponInput.value = result.promoCode;
                } else {
                    showToast(result.message || 'Could not subscribe', 'error');
                }
            } catch (err) {
                showToast('Subscription server error', 'error');
            }
        });
    }

    const footerForm = document.getElementById('footer-subscribe-form');
    if (footerForm) {
        footerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('footer-subscribe-email');
            const email = input ? input.value.trim() : '';
            if (email && email.includes('@')) {
                showToast('Thanks for subscribing! Use coupon COFFEEGO10 for 10% off.');
                input.value = '';
            } else {
                showToast('Please enter a valid email', 'error');
            }
        });
    }
}

// ---------------- CUSTOM PIZZA BUILDER IN INR (₹) ----------------
function initCustomPizzaBuilder() {
    const triggerBtn = document.getElementById('open-pizza-builder-btn');
    const modal = document.getElementById('custom-pizza-modal');
    const closeBtn = document.getElementById('close-pizza-modal-btn');
    const form = document.getElementById('custom-pizza-form');

    if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
            if (modal) modal.classList.remove('hidden');
            recalculateCustomPizzaPrice();
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    if (form) {
        form.addEventListener('change', recalculateCustomPizzaPrice);
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const crust = form.crust.value;
            const base = form.base.value;
            const selectedIngredients = Array.from(form.querySelectorAll('input[name="ingredients"]:checked')).map(cb => cb.value);

            if (selectedIngredients.length === 0) {
                showToast('Please select at least one topping', 'error');
                return;
            }

            try {
                const res = await fetch('/api/custom-pizza/build', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        crust,
                        base,
                        ingredients: selectedIngredients,
                        size: form.size ? form.size.value : 'Medium'
                    })
                });

                if (res.ok) {
                    cartState = await res.json();
                    updateCartUI();
                    if (modal) modal.classList.add('hidden');
                    toggleCartDrawer();
                    showToast('Custom Pizza added to your order!');
                }
            } catch (err) {
                showToast('Error creating custom pizza', 'error');
            }
        });
    }
}

function recalculateCustomPizzaPrice() {
    const form = document.getElementById('custom-pizza-form');
    if (!form) return;

    let total = 80.00; // Base crust in INR (₹)
    const crust = form.crust ? form.crust.value : 'Thin Crust';
    if (crust === 'Stuffed Crust') total += 30.00;
    if (crust === 'Gluten Free') total += 40.00;
    if (crust === 'Deep Dish Pan') total += 30.00;

    const base = form.base ? form.base.value : 'Classic Tomato';
    if (base === 'Basil Pesto') total += 25.00;
    if (base === 'Creamy Garlic Parmesan' || base === 'Smoky BBQ') total += 20.00;

    const toppings = form.querySelectorAll('input[name="ingredients"]:checked').length;
    total += toppings * 25.00;

    const priceEl = document.getElementById('custom-pizza-live-price');
    if (priceEl) priceEl.textContent = `₹ ${total.toFixed(2)}`;
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
