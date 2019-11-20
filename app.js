const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

/**
 * MIDDLEWARES
 */

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

/**
 * ROUTES
 */
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.send('about');
});

const port = 5000;

app.listen(port, () => console.log(`App started on port ${port}`));
