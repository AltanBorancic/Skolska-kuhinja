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
  })
  .then((responseText) => {
    Swal.fire({
      title: 'Narudžba uspješno poslana!',
      text: responseText,
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      // Obrisi korpu
      orderForm.reset();
      cart = [];
      renderCart();
    });
  })
  .catch((error) => {
    console.error('Greška prilikom slanja narudžbe:', error);
    Swal.fire({
      title: 'Greška!',
      text: 'Došlo je do greške prilikom slanja narudžbe.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
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

  // Provjera da li je korpa prazna
  if (cart.length === 0) {
    Swal.fire({
      title: 'Greška!',
      text: 'Vaša korpa je prazna. Dodajte stavke prije nego što pošaljete narudžbu.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  const napomenaInput = document.querySelector('#napomena');
  const napomena = napomenaInput.value;

  const order = {
    cart: cart,
    total: calculateTotal(),
    napomena: napomena,
    vreme_narudzbe: getCurrentDateTime()
  };

  sendOrderToServer(order)
    .then((response) => {
      Swal.fire({
        title: 'Narudžba uspješno poslana!',
        text: response,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Obrisi korpu
        orderForm.reset();
        cart = [];
        renderCart();
      });
    })
    .catch((error) => {
      console.error('Greška prilikom slanja narudžbe:', error);
      Swal.fire({
        title: 'Greška!',
        text: 'Došlo je do greške prilikom slanja narudžbe.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
});

  