// MODULES
require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const bodyParser = require('body-parser');
const Keycloak = require('keycloak-connect');
const rootDir = require('./utils/path');


// MIDDLEWARES
const setViews = require('./middleware/setViews');
const createUser = require('./middleware/createUser');


// CONTROLLERS
const errorController = require('./controllers/error');
const controller = require('./controllers/appController');


// APP CONFIGURATION
const app = express();
const port = process.env.PORT;
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'sessions',
});
const keycloak = new Keycloak({ store });
const csrfProtection = csrf();

app.set('view engine', 'ejs');
// app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store,
}));
app.use(keycloak.middleware({ logout: '/logout', admin: '/callbacks' }));
app.use(csrfProtection);
app.use(createUser);
app.use(setViews);


// ======
// ROUTES
// ======

// GET
app.get('/', keycloak.protect(), controller.getRoot);
app.get('/dashboard', keycloak.protect('admin'), controller.getDashboard);
app.get('/profile', keycloak.protect('student'), controller.getMyProfile);
app.get('/education', keycloak.protect('student'), controller.getMyEducation);
app.get('/work', keycloak.protect('student'), controller.getMyWork);
app.get('/profile/:id', keycloak.protect('admin'), controller.getProfileById);
app.get('/skills', keycloak.protect('admin'), controller.getSkills);
app.get('/students/all', keycloak.protect('admin'), controller.getAllStudents);
app.get('/students/approved', keycloak.protect('admin'), controller.getApprovedStudents);
app.get('/students/interviewed', keycloak.protect('admin'), controller.getInterviewedStudents);


// POST
app.post('/profile/save', keycloak.protect('student'), controller.saveMyProfile);
app.post('/profile/save/:id', keycloak.protect('admin'), controller.saveProfileById);
app.post('/profile/education', keycloak.protect('student'), controller.saveMyEducation);
app.post('/profile/education/edit', keycloak.protect('student'), controller.editMyEducation);
app.post('/profile/education/delete', keycloak.protect('student'), controller.deleteMyEducation);
app.post('/profile/work', keycloak.protect('student'), controller.saveMyWork);
app.post('/profile/work/edit', keycloak.protect('student'), controller.editMyWork);
app.post('/profile/work/delete', keycloak.protect('student'), controller.deleteMyWork);
app.post('/profile/skill', keycloak.protect('student'), controller.saveMySkill);
// app.post('/profile/skill/edit', keycloak.protect('student'), controller.editMySkill);
app.post('/profile/skill/delete', keycloak.protect('student'), controller.deleteMySkill);
app.post('/skill/verify', keycloak.protect('admin'), controller.verifySkill);
app.post('/test/create', keycloak.protect('admin'), controller.generateTestLink);
app.post('/test/cancel', keycloak.protect('admin'), controller.cancelTest);
app.post('/test/report', keycloak.protect('admin'), controller.getEmbeddedReport);
app.post('/test/refresh', keycloak.protect('admin'), controller.refreshSkillInfo);
app.post('/skills/sync', keycloak.protect('admin'), controller.syncCodilitySkills);


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
