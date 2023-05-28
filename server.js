const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const axios = require('axios');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'sql7.freemysqlhosting.net',
  user: 'sql7622064',
  password: 'nFvUgn6zac',
  database: 'sql7622064',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');
});
app.use(session({
    secret: 'ahsglajsodhoghalsnvn239842734y6njdlkjvh%ljsdkj2',
    resave: false,
    saveUninitialized: false
  }));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
function requireAuthentication(req, res, next) {
    if (req.session.authenticated) {
      next();
    } else {
      res.redirect('/login');
    }
  }
function requireAuthentication2(req, res, next) {
    if (req.session.authenticated2) {
      next();
    } else {
      res.redirect('/');
    }
}
function provjeriSesijuKuhinja(req, res, next) {
  if (req.session.authenticatedKuhinja) {
    next();
  } else {
    res.redirect('/loginKuhinja')
  }
}
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/dashboard', (req, res) => {
  res.render('loginKuhinja')
  // res.render('dashboard');
});

app.get('/loginKuhinja', provjeriSesijuKuhinja, (req, res) => {
  res.render('dashboard')
})

app.post('/loginKuhinja', (req, res) => {
  const { username, password } = req.body;


  db.query('SELECT * FROM osoblje WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error retrieving user from database: ', err);
      return res.redirect('/dashboard');
    }

    if (results.length === 0) {
      return res.redirect('/dashboard');
    }

    const user = results[0];

    if (bcrypt.compareSync(password, user.password)) {
      req.session.authenticatedKuhinja = true;
      return res.redirect('/loginKuhinja');
    }

    res.redirect('/dashboard');
  });
});

app.get('/meni', requireAuthentication2, (req, res) => {
    res.render('meni');
})

app.post('/loginMenu', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM razredi WHERE naziv_razreda = ?', [username], (err, results) => {
      if (err) {
        console.error('Error retrieving user from database: ', err);
        return res.redirect('/');
      }
  
      if (results.length === 0) {
        return res.redirect('/');
      }
  
      const user = results[0];
  
      if (bcrypt.compareSync(password, user.lozinka)) {
        console.log("proso")
        req.session.username = username
        // req.session.data = naziv_razreda;
        req.session.authenticated2 = true;
        // console.log(req.session.data);
        return res.redirect('/meni');
      }
  
      res.redirect('/');
    });
  });

app.get('/login', (req, res) => {
    res.render('login');
  });
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error retrieving user from database: ', err);
        return res.redirect('/login');
      }
  
      if (results.length === 0) {
        return res.redirect('/login');
      }
  
      const user = results[0];
  
      if (bcrypt.compareSync(password, user.password)) {
        req.session.authenticated = true;
        return res.redirect('/admin');
      }
  
      res.redirect('/login');
    });
  });

app.post("/odjaviSe", (req, res) => {
    req.session.authenticated = false;
    return res.redirect('/login');
});


app.get("/sveNarudzbe", provjeriSesijuKuhinja, (req, res) => {
  res.render('sveNarudzbe');
})

app.get("/odjavaKuhinja", provjeriSesijuKuhinja, (req, res) => {
  req.session.authenticatedKuhinja = false
  return res.redirect('/dashboard');
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/obrisiRazred', (req, res) => {
    const id = req.body;
    const aa = id.id;
  
    const sql = 'DELETE FROM razredi WHERE id = ?';
    db.query(sql, [aa], (err, result) => {
      if (err) {
        console.error('Greška prilikom brisanja razreda:', err);
        res.status(500).json({ message: 'Došlo je do pogreške prilikom brisanja razreda.' });
        return;
      }
      console.log('Razred je uspješno izbrisan');
      res.json({ message: 'Razred je uspješno izbrisan.' });
    });
  });
  
app.get('/admin', requireAuthentication, (req, res) => {
    db.query('SELECT * FROM razredi', (err, results) => {
      if (err) {
        console.error('Error retrieving classes: ', err);
        return;
      }
      res.render('admin', { });
    });
});

app.post('/admin/razredi', requireAuthentication, (req, res) => {
  const { nazivRazreda, lozinka } = req.body;
  const hashedLozinka = bcrypt.hashSync(lozinka, 10);
  const razred = { naziv_razreda: nazivRazreda, lozinka: hashedLozinka };

  db.query('INSERT INTO razredi SET ?', razred, (err, result) => {
    if (err) {
      console.error('Error registering class: ', err);
      return;
    }
    console.log('Class successfully registered');
    res.redirect('/admin');
  });
});

app.get('/razredi', requireAuthentication, (req, res) => {
    db.query('SELECT * FROM razredi', (err, results) => {
      if (err) {
        console.error('Error retrieving classes: ', err);
        return;
      }
      res.json(results);
    });
  });


app.post('/order', requireAuthentication2, (req, res) => {
    req.body.razred = req.session.username
    const order = req.body;
  
    const sql = 'INSERT INTO orders (cart, total, razred, vreme_narudzbe, napomena) VALUES (?, ?, ?, ?, ?)';
    const values = [JSON.stringify(order.cart), order.total, req.session.username, order.vreme_narudzbe, order.napomena];
  
    db.query(sql, values, (error, results) => {
      if (error) {
        console.error('Greška prilikom spremanja narudžbe:', error);
        res.status(500).send('Greška prilikom spremanja narudžbe.');
        return;
      }
      console.log('Narudžba spremljena.');
      
      sendLiveOrder(order);
  
      res.status(200).send('Narudzbu izvrsio korisnik, ' + req.session.username);
    });
  });
  
  
process.on('SIGINT', () => {
    db.end((error) => {
      if (error) {
        console.error('Greška prilikom zatvaranja veze s bazom podataka:', error);
      }
      console.log('Veza s bazom podataka zatvorena.');
      process.exit();
    });
  });
  
const wss = new WebSocket.Server({ noServer: true });

function sendLiveOrder(order) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(order));
    }
  });
}

app.server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });


