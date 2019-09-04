require('dotenv').config();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
const User = require('../models/user');
const Skill = require('../models/skill');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  },
}));

exports.postRegisterByAdmin = (req, res) => {};

// ==========
// SHOW PAGES
// ==========

// SHOW LOGIN PAGE
exports.getLoginPage = (req, res, next) => {
  res.render('./auth/login',
    {
      path: '/auth/login',
      pageTitle: 'Sign in',
      errorMessage: '',
      oldInput: { email: '', password: '' },
      validationErrors: [],
    });
};


// SHOW REGISTER PAGE
exports.getRegisterPage = (req, res, next) => {
  res.render('./auth/register',
    {
      path: '/auth/register',
      pageTitle: 'Register',
      oldInput: {
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      },
      validationErrors: [],
    });
};

// SHOW REGISTER WIZARD PAGE
exports.getRegisterWizardPage = async (req, res, next) => {
  try {
    const skills = await Skill.find({});
    if (!skills) {
      throw new Error('Skills not found');
    }
    return res.render('./auth/register_wizard',
      {
        path: '/auth/register_wizard',
        pageTitle: 'Register Wizard',
        oldInput: {
          email: '',
          password: '',
          confirmPassword: '',
          role: '',
        },
        validationErrors: [],
        skills,
      });
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};

// SHOW GENERATE RESET PASSWORD PAGE
exports.getGenerateResetPasswordTokenPage = (req, res, next) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('./auth/reset',
    {
      path: '/auth/reset',
      pageTitle: 'Reset password',
      errorMessage,
    });
};


// SHOW SET NEW PASSWORD PAGE
exports.getSetNewPasswordPage = (req, res, next) => {
  const { resetToken } = req.params;
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  console.log(resetToken);
  User.findOne({
    resetToken,
    resetTokenExpDate: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      req.flash('error', 'Reset link is expired');
      return res.redirect('/auth/reset');
    }
    res.render('./auth/updatePassword',
      {
        path: '/auth/updatepassword',
        pageTitle: 'Update password',
        errorMessage,
        userId: user._id.toString(),
        passwordToken: resetToken,
      });
  }).catch((err) => {
    console.log(err);
  });
};


// =============
// PROCESS FORMS
// =============

// LOGIN FORM
exports.postLogin = (req, res, next) => {
  console.log(`Login attempt: ${req.body.email}`);
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('./auth/login',
      {
        path: '/auth/login',
        pageTitle: 'Sign in',
        errorMessage: errors.array()[0],
        oldInput: {
          email,
          password,
        },
        validationErrors: errors.array(),
      });
  }

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(422).render('./auth/login',
        {
          path: '/auth/login',
          pageTitle: 'Sign in',
          errorMessage: 'Invalid email or password',
          oldInput: {
            email,
            password,
          },
          validationErrors: [],
        });
    }
    bcrypt.compare(password, user.password).then((doMatch) => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          if (err) {
            console.log(err);
          }
          return res.redirect('/profile');
        });
      }
      return res.status(422).render('./auth/login',
        {
          path: '/auth/login',
          pageTitle: 'Sign in',
          errorMessage: 'Invalid email or password',
          oldInput: {
            email,
            password,
          },
          validationErrors: [],
        });
    }).catch((err) => {
      console.log(err);
      res.redirect('/auth/login');
    });
  }).catch((err) => console.log(err));
};


// REGISTER FORM
exports.postRegister = (req, res, next) => {
  const {
    email, role, password,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('./auth/register',
      {
        path: '/auth/register',
        pageTitle: 'Register',
        oldInput: {
          email, role, password, confirmPassword: req.body.confirmPassword,
        },
        validationErrors: errors.array(),
      });
  }

  bcrypt.hash(password, 12).then((hashedPassword) => {
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });
    return newUser.save();
  }).then((result) => {
    res.redirect('/auth/login');
    return transporter.sendMail({
      to: email,
      from: 'GradForce@gradforce.com',
      subject: 'GradForce - Registration confirmation',
      html: '<h1>You have been registered with GradForce</h1>',
    }).catch((err) => {
      console.log(err);
    });
  });
};

// REGISTER WIZARD FORM
exports.postRegisterWizard = (req, res, next) => {
  const {
    email, role, password, firstName, lastName, phone,
  } = req.body;

  const {jobb} = req.

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('./auth/register_wizard',
      {
        path: '/auth/register_wizard',
        pageTitle: 'Register',
        oldInput: {
          email, role, password, confirmPassword: req.body.confirmPassword,
        },
        validationErrors: errors.array(),
      });
  }

  bcrypt.hash(password, 12).then((hashedPassword) => {
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      phone,
      skill: jobb,
    });
    return newUser.save();
  }).then((result) => {
    res.redirect('/auth/login');
    return transporter.sendMail({
      to: email,
      from: 'GradForce@gradforce.com',
      subject: 'GradForce - Registration confirmation',
      html: '<h1>You have been registered with GradForce</h1>',
    }).catch((err) => {
      console.log(err);
    });
  });
};


exports.postResetRequest = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(`Failed to generate token: ${err}`);
      return res.redirect('/auth/reset');
    }
    const token = buffer.toString('hex');
    console.log(req.body);
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        req.flash('error', 'No user with that email registered');
        return res.redirect('/auth/reset');
      }
      user.resetToken = token;
      user.resetTokenExpDate = Date.now() + 3600000;
      return user.save();
    }).then((result) => {
      res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        from: 'GradForce@gradforce.com',
        subject: 'GradForce - Reset password',
        html: `
        <h1>You requested password reset</h1>
        <p>Please click <a href="${process.env.HOSTNAME}/auth/reset/${token}">this link</a> to reset your password</p>`
        ,
      });
    }).catch((err) => {
      console.log(`Last catched error: ${err}`);
    });
  });
};


exports.postSetNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpDate: { $gt: Date.now() },
    _id: userId,
  }).then((user) => {
    resetUser = user;
    return bcrypt.hash(password, 12).then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpDate = undefined;
      return resetUser.save();
    }).then((result) => {
      res.redirect('/auth/login');
    });
  }).catch((err) => {
    console.log(err);
  });
};


// LOGOUT
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/auth/login');
  });
};
