const ordersContainer = document.getElementById('orders-container');
const socket = new WebSocket('ws://skolska-kuhinja.onrender.com');

socket.onmessage = (event) => {
  const order = JSON.parse(event.data);
  const orderBox = document.createElement('div');
  orderBox.className = 'order-box';

  const orderContent = document.createElement('p');
  orderContent.textContent = `Nova narudzba, Razred/Korisnik: ${order.razred}`;

  const ukupanIznos = document.createElement('p');
  ukupanIznos.innerHTML = `<strong>Ukupno:</strong> ${order.total}KM`;

  const vrijemeNarudzbe = document.createElement('p');
  vrijemeNarudzbe.innerHTML = `<strong>Vrijeme:</strong> ${order.vreme_narudzbe}`;

  const napomena = document.createElement('p');
  napomena.innerHTML = `<strong>Napomena:</strong> ${order.napomena}`;

  const oznaciKaoZavrsenoButton = document.createElement('button');
  oznaciKaoZavrsenoButton.textContent = 'Označi kao završeno';
  oznaciKaoZavrsenoButton.className = 'oznaci-kao-zavrseno-button';
  oznaciKaoZavrsenoButton.addEventListener('click', () => {
    oznaciNarudzbuKaoZavrsenu(order.id);
  });

  orderBox.appendChild(orderContent);
  orderBox.appendChild(ukupanIznos);
  orderBox.appendChild(vrijemeNarudzbe);
  orderBox.appendChild(napomena);
  orderBox.appendChild(oznaciKaoZavrsenoButton);

  ordersContainer.appendChild(orderBox);

  prikaziDetaljeNarudzbe(order, orderBox);
};

socket.onopen = () => {
  console.log('WebSocket veza uspostavljena');
};

socket.onclose = () => {
  console.log('WebSocket veza zatvorena');
};

function prikaziDetaljeNarudzbe(narudzba, orderBox) {
  const detaljiNarudzbeContainer = document.createElement('div');
  detaljiNarudzbeContainer.className = 'detalji-narudzbe-container';

  const naslovNarudzbe = document.createElement('h2');
  naslovNarudzbe.textContent = `Detalji narudzbe:`;

  const listaHrane = document.createElement('ul');
  narudzba.cart.forEach((stavka) => {
    const stavkaHrane = document.createElement('li');
    stavkaHrane.textContent = `${stavka.name} - Količina: ${stavka.quantity}`;
    listaHrane.appendChild(stavkaHrane);
  });

  const posiljalac = document.createElement('a');
  posiljalac.innerHTML = `<strong>Razred:</strong> ${narudzba.razred}`;

  detaljiNarudzbeContainer.appendChild(naslovNarudzbe);
  detaljiNarudzbeContainer.appendChild(listaHrane);
  detaljiNarudzbeContainer.appendChild(posiljalac);

  orderBox.appendChild(detaljiNarudzbeContainer);
}
