require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const bodyParser = require('body-parser');
const rootDir = require('./utils/path');

// MIDDLEWARES
const getSessionFromDB = require('./middleware/getSessionFromDB');
const setViews = require('./middleware/setViews');

// CONTROLLERS
const errorController = require('./controllers/error');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const rootRoutes = require('./routes/rootRoutes');

const app = express();
const port = process.env.PORT;
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'sessions',
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
// app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store,
}));
app.use(csrfProtection);
// app.use(flash());
app.use(getSessionFromDB);
app.use(setViews);


// ======
// ROUTES
// ======
app.use('/', rootRoutes);
app.use('/auth', authRoutes);

// 404
app.use(errorController.get404);

// Connect to DB using ENV variables
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {
  // Start server
  app.listen(port, async () => {
    console.log(`Listening on port: ${port}`);
  });
}).catch((err) => {
  console.log(`Cannot connect to DB: ${err}`);
});
