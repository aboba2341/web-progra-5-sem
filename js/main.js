// ========== Состояние ==========
const cart = [];


// ========== Элементы страницы ==========
const catalogList = document.querySelector('.catalog__list');
const cartList = document.querySelector('.cart__list');
const cartEmpty = document.querySelector('.cart__empty');
const cartTotal = document.querySelector('.cart__total');
const cartTotalSum = document.querySelector('.cart__total-sum');
const cartCount = document.querySelector('.header__cart-count');
const checkoutButton = document.querySelector('.cart__checkout');


// ========== Вспомогательные функции ==========

// 1290 → "1 290 ₽"
function formatPrice(value) {
  return value.toLocaleString('ru-RU') + ' ₽';
}

// Собирает данные о товаре из data-атрибутов карточки
function getProductFromCard(card) {
  return {
    id: card.dataset.id,
    name: card.dataset.name,
    price: Number(card.dataset.price),
    image: card.querySelector('.card__image').getAttribute('src'),
  };
}


// ========== Действия с корзиной ==========

function addToCart(product) {
  const item = cart.find((cartItem) => cartItem.id === product.id);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(id, delta) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    renderCart();
  }
}

function removeFromCart(id) {
  const index = cart.findIndex((cartItem) => cartItem.id === id);
  if (index !== -1) cart.splice(index, 1);
  renderCart();
}


// ========== Отрисовка ==========

function renderCart() {
  cartList.innerHTML = cart.map((item) => `
    <li class="cart-item" data-id="${item.id}">
      <img class="cart-item__image" src="${item.image}" alt="">
      <h3 class="cart-item__title">${item.name}</h3>
      <div class="cart-item__quantity">
        <button class="cart-item__decrease" type="button" aria-label="Уменьшить количество">−</button>
        <span>${item.quantity}</span>
        <button class="cart-item__increase" type="button" aria-label="Увеличить количество">+</button>
      </div>
      <p class="cart-item__price">${formatPrice(item.price * item.quantity)}</p>
      <button class="cart-item__remove" type="button" aria-label="Удалить из корзины">×</button>
    </li>
  `).join('');

  const totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = cart.reduce((count, item) => count + item.quantity, 0);

  cartTotalSum.textContent = totalSum.toLocaleString('ru-RU');
  cartCount.textContent = totalCount;

  const isEmpty = cart.length === 0;
  cartEmpty.hidden = !isEmpty;
  cartTotal.hidden = isEmpty;
  checkoutButton.disabled = isEmpty;
}


// ========== Обработчики событий ==========

cartList.addEventListener('click', (event) => {
  const cartItem = event.target.closest('.cart-item');
  if (!cartItem) return;

  const id = cartItem.dataset.id;

  if (event.target.closest('.cart-item__increase')) {
    changeQuantity(id, 1);
  } else if (event.target.closest('.cart-item__decrease')) {
    changeQuantity(id, -1);
  } else if (event.target.closest('.cart-item__remove')) {
    removeFromCart(id);
  }
});

// Один обработчик на весь каталог вместо отдельного на каждую кнопку
catalogList.addEventListener('click', (event) => {
  const addButton = event.target.closest('.card__add');
  if (!addButton) return;

  const card = addButton.closest('.card');
  addToCart(getProductFromCard(card));
});


// ========== Старт ==========
renderCart();
