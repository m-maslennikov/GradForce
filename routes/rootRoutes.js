const express = require('express');
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const controller = require('../controllers/appController');

const router = express.Router();

// ==============================
// ALLOWED TO ALL LOGGED IN USERS
// ==============================

// GET
router.get('/', isAuth, controller.getRoot);
router.get('/dashboard', isAdmin, controller.getDashboard);
router.get('/profile', isAuth, controller.getMyProfile);
router.get('/education', isAuth, controller.getMyEducation);
router.get('/work', isAuth, controller.getMyWork);
router.get('/profile/:id', isAdmin, controller.getProfileById);
router.get('/skills', isAdmin, controller.getSkills);
router.get('/students/all', isAdmin, controller.getAllStudents);
router.get('/students/approved', isAdmin, controller.getApprovedStudents);
router.get('/students/interviewed', isAdmin, controller.getInterviewedStudents);

// POST
router.post('/profile/save', isAuth, controller.saveMyProfile);
router.post('/profile/save/:id', isAdmin, controller.saveProfileById);

router.post('/profile/education', isAuth, controller.saveMyEducation);
router.post('/profile/education/edit', isAuth, controller.editMyEducation);
router.post('/profile/education/delete', isAuth, controller.deleteMyEducation);

router.post('/profile/work', isAuth, controller.saveMyWork);
router.post('/profile/work/edit', isAuth, controller.editMyWork);
router.post('/profile/work/delete', isAuth, controller.deleteMyWork);

router.post('/profile/skill', isAuth, controller.saveMySkill);
// router.post('/profile/skill/edit', isAuth, controller.editMySkill);
// router.post('/profile/skill/delete', isAuth, controller.deleteMySkill);

router.post('/skill/verify', isAdmin, controller.verifySkill);

router.post('/test/create', isAdmin, controller.generateTestLink);
router.post('/test/cancel', isAdmin, controller.cancelTest);
router.post('/test/report', isAdmin, controller.getEmbeddedReport);
router.post('/test/refresh', isAdmin, controller.refreshSkillInfo);

router.post('/skills/sync', isAdmin, controller.syncCodilitySkills);


module.exports = router;
