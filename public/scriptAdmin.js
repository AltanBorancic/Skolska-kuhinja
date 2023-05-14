fetch('/razredi')
  .then(response => response.json())
  .then(data => {
    data.forEach(a => {
      $('.Content').append(`
        <div class="boxa">
          <p>${a.naziv_razreda}</p>

          <div class="dropdown">
            <span class="options-icon">&#x2022;&#x2022;&#x2022;</span>
            <div class="dropdown-content">
              <button style='cursor: pointer;' onclick="obrisiRazred('${a.id}')">Obrisi razred</button>
            </div>
          </div>
        </div>
      `);
    });
  })
  .catch(error => {
    console.error('Došlo je do pogreške prilikom dohvaćanja liste razreda:', error);
  });


  function obrisiRazred(id) {
      const data = { id: id };
      fetch('/obrisiRazred', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        console.log(result.message);
        location.reload();
        // Ovdje možete izvršiti odgovarajuće radnje nakon brisanja razreda
      })
      .catch(error => {
        console.error('Došlo je do pogreške prilikom slanja zahtjeva:', error);
      });
    }