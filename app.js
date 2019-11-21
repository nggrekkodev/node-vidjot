const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const Idea = require('./models/Idea');
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
const passportConfig = require('./config/passport')(passport);

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
// Static folder : sets the public folder to be the express static folder
app.use(express.static(path.join(__dirname, 'public')));

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

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

/**
 * ROUTES
 */

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.port || 5000;

app.listen(port, () => console.log(`App started on port ${port}`));
