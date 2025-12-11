let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

function updateCartCounter() {
  const counters = document.querySelectorAll('.cart-count');
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  counters.forEach(el => el.textContent = total);
}

function saveCart() {
  localStorage.setItem('coffeeCart', JSON.stringify(cart));
  updateCartCounter();
}

function addToCartSimple(id) {
  const coffee = coffeeData.find(c => c.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...coffee, quantity: 1 });
  }
  saveCart();
  alert(`${coffee.name} добавлен в корзину!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartModal();
}

function renderCartModal() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('totalPrice');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:2rem;color:#888;">Корзина пуста</p>';
    totalEl.textContent = '0 ₽';
    return;
  }

  container.innerHTML = cart.map((item, idx) => 
    `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.8rem 0;border-bottom:1px solid #eee;">
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.price} ₽ × ${item.quantity}</small>
      </div>
      <div>
        <strong>${item.price * item.quantity} ₽</strong>
        <button onclick="removeFromCart(index)" style="margin-left:10px;background:#b85c5c;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">✕</button>
      </div>
    </div>`
  ).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalEl.textContent = total + ' ₽';
}

function renderCoffee(items = coffeeData) {
  const grid = document.getElementById('coffeeGrid');
  if (!grid) return;

  grid.innerHTML = items.map(coffee => 
    `<article class="coffee-card">
      <img src="${coffee.img}" alt="${coffee.name}">
      <h3>${coffee.name}</h3>
      <p class="price">${coffee.price} ₽</p>
      <button class="add-btn" onclick="addToCartSimple(${coffee.id})">В корзину</button>
    </article>`
  ).join('');
}

document.querySelectorAll('[data-category]').forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();

    const selectedCategory = this.dataset.category;

    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.classList.remove('active');
    });
    this.classList.add('active');

    let filtered;
    if (selectedCategory === 'all') {
      filtered = coffeeData;
    } else {
      filtered = coffeeData.filter(coffee =>
        Array.isArray(coffee.category)
          ? coffee.category.includes(selectedCategory)
          : coffee.category === selectedCategory
      );
    }

    renderCoffee(filtered);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  renderCoffee();
  updateCartCounter();
  renderCartModal();
  document.querySelector('[data-category="all"]')?.classList.add('active');
});

const searchInput = document.getElementById('searchInput');

if (searchInput) {
  searchInput.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();

    if (query === '') {
      const activeBtn = document.querySelector('[data-category].active');
      const activeCat = activeBtn ? activeBtn.dataset.category : 'all';

      if (activeCat === 'all') {
        renderCoffee(coffeeData);
      } else {
        const filtered = coffeeData.filter(coffee =>
          Array.isArray(coffee.category)
            ? coffee.category.includes(activeCat)
            : coffee.category === activeCat
        );
        renderCoffee(filtered);
      }
      return;
    }

    const found = coffeeData.filter(coffee =>
      coffee.name.toLowerCase().includes(query)
    );

    renderCoffee(found);
  });
}

document.querySelectorAll('[data-category]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
    }
  });
});

document.querySelectorAll('.cart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('cartModal').classList.add('active');
    renderCartModal();
  });
});

document.querySelector('.close-cart')?.addEventListener('click', () => {
  document.getElementById('cartModal').classList.remove('active');
});

document.getElementById('cartModal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    e.currentTarget.classList.remove('active');
  }
});