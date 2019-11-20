const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const Idea = require('./models/Idea');

const app = express();

/**
 * DATABASE CONNECTION
 */
mongoose
  .connect(
    `mongodb+srv://admin:sNc2KK8TWkSDgmxJ@cluster0-ervbx.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('Mongo db connected');
  })
  .catch(err => console.log(err));

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
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

const port = 5000;

app.listen(port, () => console.log(`App started on port ${port}`));
