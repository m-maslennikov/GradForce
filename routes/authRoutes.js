const express = require('express');
const { check, body } = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();


// =========================
// LOCAL REGISTRATION ROUTES
// =========================

// GET REQUESTS ROUTES
router.get('/', authController.getLoginPage);
router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);
router.get('/reset', authController.getGenerateResetPasswordTokenPage);
router.get('/reset/:resetToken', authController.getSetNewPasswordPage);


// POST REQUESTS ROUTES

// LOGIN
router.post('/login',
  [
    body('email').isEmail().withMessage('Please, provide a valid email address').normalizeEmail(),
    body('password').trim(),
  ], authController.postLogin);


// REGISTER
router.post('/register',
  [
    check('email').isEmail().withMessage('Please, provide a valid email address')
      .custom((value, { req }) => {
        console.log('Returning promise');
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('User with this email already registered');
          }
        });
      })
      .normalizeEmail(),
    body('role', 'Must be either student or employer').equals('student' || 'employer').trim(),
    body('password', 'Password should be greater than 8 characters').isLength({ min: 8 }).trim(),
    body('confirmPassword').trim().custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match');
      }
      return true;
    }),
  ], authController.postRegister);


// RESET
router.post('/reset', authController.postResetRequest);


// SET NEW PASSWORD
router.post('/updatepassword', authController.postSetNewPassword);


// LOGOUT
router.post('/logout', authController.postLogout);


module.exports = router;

router.post('/register-by-admin', authController.postRegisterByAdmin);
