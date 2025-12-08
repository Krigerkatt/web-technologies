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

document.addEventListener('DOMContentLoaded', () => {
  renderCoffee();
});