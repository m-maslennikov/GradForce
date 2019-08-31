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
router.get('/profile/:id', isAuth, controller.getProfileById);
router.post('/profile/my/save', isAuth, controller.saveMyProfile);
router.post('/profile/my/education', isAuth, controller.saveMyEducation);
router.post('/profile/my/edit-education', isAuth, controller.editMyEducation);
router.post('/profile/my/delete-education', isAuth, controller.deleteMyEducation);
router.post('/profile/my/work', isAuth, controller.saveMyWork);
router.post('/profile/my/edit-work', isAuth, controller.editMyWork);
router.post('/profile/my/delete-work', isAuth, controller.deleteMyWork);
router.post('/profile/skill/test', isAuth, controller.generateTestLink);

router.get('/skills', isAuth, controller.getSkills);
router.post('/skills/sync', isAuth, controller.syncCodilitySkills);

router.get('/students/all', isAuth, controller.getAllStudents);
router.get('/students/interviewed', isAuth, controller.getInterviewedStudents);
router.get('/students/approved', isAuth, controller.getApprovedStudents);
router.get('/adduser', isAuth, controller.getAddUser);

module.exports = router;
