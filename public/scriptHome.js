
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const totalLabel = document.querySelector('.total-label');
const totalPrice = document.querySelector('.total-price');
const orderForm = document.querySelector('#order-form');

let cart = [];

addToCartButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    addToCart(index);
  });
});

function addToCart(index) {
  const selectedItem = {
    name: menuItems[index].name,
    price: menuItems[index].price,
    quantity: 1
  };

  const existingItem = cart.find(item => item.name === selectedItem.name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push(selectedItem);
  }

  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}
function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCart() {
  cartItemsContainer.innerHTML = '';

  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price.toFixed(2)}KM</td>
      <td>${item.quantity}</td>
      <td><button class="btn btn-sm btn-danger btn-cart-action" onclick="removeFromCart(${index})">X</button></td>
    `;

    cartItemsContainer.appendChild(row);
  });

  const total = cart.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);
  totalPrice.textContent = `${total.toFixed(2)}KM`;

  if (cart.length > 0) {
    totalLabel.style.display = 'inline';
    totalPrice.style.display = 'inline';
  } else {
    totalLabel.style.display = 'none';
    totalPrice.style.display = 'none';
  }
}
const menuItems = [
  { name: 'Hamburger', price: 5.00 },
  { name: 'Pizza', price: 8.00 },
  { name: 'Sendvič', price: 4.50 }
];

renderCart();
