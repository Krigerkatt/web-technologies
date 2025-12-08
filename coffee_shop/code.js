function renderCoffee(items = coffeeData) {
  const grid = document.getElementById('coffeeGrid');
  if (!grid) return;

  grid.innerHTML = items.map(coffee => 
    `<article class="coffee-card">
      <img src="${coffee.img}" alt="${coffee.name}">
      <h3>${coffee.name}</h3>
      <p class="price">${coffee.price} ₽</p>
      <button class="add-btn" data-id="${coffee.id}">Добавить</button>
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

  document.querySelector('[data-category="all"]')?.classList.add('active');
});