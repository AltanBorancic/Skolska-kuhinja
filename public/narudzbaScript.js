// Slanje narudžbe na server koristeći Fetch API
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
  
  // Dohvaćanje trenutnog datuma i vremena
  function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date}, ${time}`;
  }
  
  // Slanje narudžbe
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
  
    // Slanje narudžbe na server
    sendOrderToServer(order)
      .then((response) => {
        console.log(response);
        // Ovdje možete dodati logiku za prikazivanje potvrde narudžbe korisniku
        // i ažuriranje UI-a (praznjenje košarice, prikazivanje poruke itd.).
      })
      .catch((error) => {
        console.error('Greška prilikom slanja narudžbe:', error);
        // Ovdje možete dodati logiku za prikazivanje greške korisniku.
      });
  
    // Resetiranje forme
    orderForm.reset();
    cart = [];
    renderCart();
  });
  