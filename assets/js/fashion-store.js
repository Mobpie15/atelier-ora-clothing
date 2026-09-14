/**
 * ATELIER ORA // STORE CONTROLLER & CART DRAWER
 */

(function () {
  'use strict';

  const CART_KEY = 'atelier_ora_cart';
  let cart = [];

  const PRODUCTS = [
    {
      id: 'hoodie-01',
      title: '500 GSM Heavyweight Boxy Hoodie',
      category: 'sweats',
      price: 260,
      image: 'assets/images/garment-hoodie-oatmeal.jpg',
      colorName: 'Oatmeal Heather',
      badge: 'BESTSELLER // HEAVYWEIGHT',
      sizes: ['S (US 36)', 'M (US 38)', 'L (US 40)', 'XL (US 42)'],
      description: 'Engineered from custom 500 GSM unbrushed loopback cotton fleece. Featuring dropped shoulders, double-layer structured hood, seamless storm cuffs, and heavy kangaroo pouch.'
    },
    {
      id: 'bomber-02',
      title: 'Washed Canvas Flight Bomber Jacket',
      category: 'outerwear',
      price: 420,
      image: 'assets/images/garment-bomber-olive.jpg',
      colorName: 'Vintage Olive',
      badge: 'LIMITED EDITION',
      sizes: ['M (US 38)', 'L (US 40)', 'XL (US 42)'],
      description: 'Heavyweight cotton duck canvas enzyme-washed for a supple, broken-in patina. Solid brushed silver two-way zipper, ribbed hem, and quilted cupro lining.'
    },
    {
      id: 'trench-03',
      title: 'Double-Breasted Heavy Wool Overcoat',
      category: 'outerwear',
      price: 780,
      image: 'assets/images/garment-trench-camel.jpg',
      colorName: 'Warm Camel',
      badge: 'ITALIAN VIRGIN WOOL',
      sizes: ['48 / M', '50 / L', '52 / XL'],
      description: '850 GSM Italian virgin wool melton with architectural wide notched lapels, self-fabric belt with horn buckle, and deep slanted welt pockets.'
    },
    {
      id: 'tee-04',
      title: '280 GSM Boxy Drop-Shoulder Tee',
      category: 'tees',
      price: 110,
      image: 'assets/images/garment-tee-charcoal.jpg',
      colorName: 'Vintage Washed Black',
      badge: 'EVERYDAY UNIFORM',
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Custom heavyweight 280 GSM single jersey with sun-faded vintage pigment wash. Relaxed boxy silhouette with reinforced 32mm ribbed collar.'
    },
    {
      id: 'trouser-05',
      title: 'Wide-Leg Pleated Tailored Trouser',
      category: 'trousers',
      price: 320,
      image: 'assets/images/garment-trouser-espresso.jpg',
      colorName: 'Deep Espresso',
      badge: 'RAW ARCHITECTURE',
      sizes: ['30 (S)', '32 (M)', '34 (L)', '36 (XL)'],
      description: 'Tailored in heavyweight high-twist tropical wool. Deep forward double pleats, concealed hook-and-bar closure, and a generous straight-drape silhouette.'
    },
    {
      id: 'boots-06',
      title: 'Hand-Burnished Suede Chelsea Boots',
      category: 'footwear',
      price: 450,
      image: 'assets/images/garment-boots-suede.jpg',
      colorName: 'Sand Almond',
      badge: 'HANDCRAFTED IN ITALY',
      sizes: ['EU 41 / US 8', 'EU 42 / US 9', 'EU 43 / US 10', 'EU 44 / US 11'],
      description: 'Water-repellent Italian calf suede with natural plantation crepe soles, double pull-tabs, and tonally matched elastic side gussets.'
    }
  ];

  // DOM Elements
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const checkoutBtn = document.getElementById('btn-checkout');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutModalClose = document.getElementById('checkout-modal-close');

  // Load Saved Cart
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {}
    updateCartUI();
  }

  function updateCartUI() {
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    cartCountBadges.forEach(b => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = '$' + subtotal.toLocaleString('en-US');
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state font-mono">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p>YOUR APPAREL BAG IS EMPTY</p>
          <span>Select garments from the collection or configure in 3D studio.</span>
        </div>
      `;
      return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item-row" data-id="${item.id}" data-size="${item.size}">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-head">
            <h4 class="cart-item-title font-display">${item.title}</h4>
            <span class="cart-item-price font-mono">$${(item.price * item.quantity).toLocaleString('en-US')}</span>
          </div>
          <div class="cart-item-meta font-mono">
            <span>SIZE: ${item.size}</span>
            <span>&bull;</span>
            <span>COLOR: ${item.colorName || 'ORIGINAL'}</span>
          </div>
          <div class="cart-item-actions font-mono">
            <div class="qty-stepper">
              <button type="button" class="btn-qty-dec" data-id="${item.id}" data-size="${item.size}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="btn-qty-inc" data-id="${item.id}" data-size="${item.size}">+</button>
            </div>
            <button type="button" class="btn-remove-item" data-id="${item.id}" data-size="${item.size}">REMOVE</button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach qty listeners
    cartItemsContainer.querySelectorAll('.btn-qty-dec').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        const item = cart.find(i => i.id === id && i.size === size);
        if (item) {
          if (item.quantity > 1) {
            item.quantity--;
          } else {
            cart = cart.filter(i => !(i.id === id && i.size === size));
          }
          saveCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.btn-qty-inc').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        const item = cart.find(i => i.id === id && i.size === size);
        if (item) {
          item.quantity++;
          saveCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        cart = cart.filter(i => !(i.id === id && i.size === size));
        saveCart();
      });
    });
  }

  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartToggleBtns.forEach(b => b.addEventListener('click', openCart));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Add Product from Catalog Card
  window.addToCart = function (productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const sizeSelect = document.getElementById(`size-${productId}`);
    const chosenSize = sizeSelect ? sizeSelect.value : (product.sizes[0] || 'M');

    const existing = cart.find(item => item.id === productId && item.size === chosenSize);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        colorName: product.colorName,
        size: chosenSize,
        quantity: 1
      });
    }

    saveCart();
    openCart();
  };

  // Add Configured 3D Garment from 3D Studio
  window.addConfigured3DGarment = function () {
    const ctaBtn = document.getElementById('btn-add-3d-garment');
    const color = (ctaBtn ? ctaBtn.getAttribute('data-color') : 'oatmeal') || 'oatmeal';
    const sizeSelect = document.getElementById('select-3d-size');
    const chosenSize = sizeSelect ? sizeSelect.value : 'L (US 40)';

    const colorLabels = {
      oatmeal: 'Oatmeal Heather',
      olive: 'Vintage Washed Olive',
      espresso: 'Deep Espresso Noir',
      terracotta: 'Terracotta Clay',
      camel: 'Warm Camel Wool'
    };

    const configId = `3d-hoodie-${color}`;
    const existing = cart.find(item => item.id === configId && item.size === chosenSize);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: configId,
        title: `3D Custom 500 GSM Hoodie (${colorLabels[color] || color})`,
        price: 260,
        image: 'assets/images/garment-hoodie-oatmeal.jpg',
        colorName: colorLabels[color] || color,
        size: chosenSize,
        quantity: 1
      });
    }

    saveCart();
    openCart();
  };

  // Filter Catalog
  const filterBtns = document.querySelectorAll('.cat-filter-btn');
  const productCards = document.querySelectorAll('.garment-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');

      productCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      closeCart();
      if (checkoutModal) {
        checkoutModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (checkoutModalClose) {
    checkoutModalClose.addEventListener('click', () => {
      if (checkoutModal) checkoutModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Checkout via WhatsApp Action
  const btnCheckoutWA = document.getElementById('btn-checkout-wa');
  if (btnCheckoutWA) {
    btnCheckoutWA.addEventListener('click', () => {
      const orderSummary = cart.map(i => `• ${i.title} (${i.size}) x${i.quantity} = $${(i.price * i.quantity).toLocaleString('en-US')}`).join('\n');
      const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
      const text = encodeURIComponent(
        `Hello Atelier Ora Concierge! I would like to order:\n\n${orderSummary}\n\nSubtotal: $${subtotal.toLocaleString('en-US')} USD\n\nPlease confirm delivery routing.`
      );
      window.open(`https://wa.me/918957420306?text=${text}`, '_blank');
    });
  }

  updateCartUI();
})();
