const express = require('express');
const isAuth = require('../middleware/isAuth');
const controller = require('../controllers/appController');

const router = express.Router();

// ==============================
// ALLOWED TO ALL LOGGED IN USERS
// ==============================
router.get('/', isAuth, controller.getRoot);
router.get('/dashboard', isAuth, controller.getDashboard);
router.get('/profile', isAuth, controller.getMyProfile);
router.post('/profile/my/save', isAuth, controller.saveMyProfile);
router.post('/profile/skill/test', isAuth, controller.generateTestLink);

router.get('/skills', isAuth, controller.getSkills);
router.post('/skills/sync', isAuth, controller.syncCodilitySkills);

router.get('/students', isAuth, controller.getStudents);
router.get('/adduser', isAuth, controller.getAddUser);

module.exports = router;
