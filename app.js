const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const Idea = require('./models/Idea');

const app = express();

/**
 * DATABASE CONNECTION
 */
mongoose
  .connect(
    `mongodb+srv://admin:sNc2KK8TWkSDgmxJ@cluster0-ervbx.mongodb.net/vidjot?retryWrites=true&w=majority`,
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

// Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method-override
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Express session
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
);

// Flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  next();
});

/**
 * ROUTES
 */
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas
      });
    });
});

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({ _id: req.params.id }).then(idea => {
    console.log(idea);
    res.render('ideas/edit', { idea });
  });
});

app.post('/ideas', (req, res) => {
  console.log(req.body);
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some details' });
  }

  console.log(errors);
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser).save().then(idea => {
      req.flash('success_msg', 'Idea added');
      res.redirect('/ideas');
    });
  }
});

app.put('/ideas/:id', (req, res) => {
  Idea.findOne({ _id: req.params.id })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;
      return idea.save();
    })
    .then(idea => {
      req.flash('success_msg', 'Idea updated');
      res.redirect('/ideas');
    });
});

app.delete('/ideas/:id', (req, res) => {
  Idea.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Idea removed');
    res.redirect('/ideas');
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

const port = 5000;

app.listen(port, () => console.log(`App started on port ${port}`));
