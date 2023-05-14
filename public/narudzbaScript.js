
function sendOrderToServer(order) {
    return fetch('/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Greška prilikom slanja narudžbe.');
      }
      return response.text();
    });
  }
  
  function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date}, ${time}`;
  }
  
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const razredInput = document.querySelector('#razred');
    const razred = razredInput.value;
  
    const order = {
      cart: cart,
      total: calculateTotal(),
      razred: razred,
      vreme_narudzbe: getCurrentDateTime()
    };
  
    sendOrderToServer(order)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Greška prilikom slanja narudžbe:', error);
      });
  
    // obrisi korpu
    orderForm.reset();
    cart = [];
    renderCart();
  });
  