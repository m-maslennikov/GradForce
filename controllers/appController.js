// Models
const User = require('../models/user');
const Skill = require('../models/skill');

// Utils
const codility = require('../utils/codility');


exports.getRoot = (req, res) => {
  res.redirect('/auth/register');
};


exports.getStudents = (req, res) => {
  User.find({ role: 'student' }).then((users) => {
    res.render('students', {
      users,
      pageTitle: 'All students',
      sidebarPos: 'students',
    });
  });
};

exports.getAddUser = (req, res) => {
  res.render('addUser', {
    pageTitle: 'Add new user',
  });
};


// ==========
// SHOW PAGES
// ==========


// SHOW DASHBOARD PAGE
exports.getDashboard = async (req, res) => {
  console.log(`Viewing dashboard: ${req.session.user.email}`);

  try {
    const accountStatus = await codility.getAccountStatus();
    return res.render('dashboard', {
      pageTitle: 'Dashboard',
      navbarTitle: 'Dashboard',
      sidebarPos: 'dashboard',
      accountStatus,
    });
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// SHOW MY PROFILE PAGE
exports.getMyProfile = async (req, res) => {
  console.log(`Viewing profile: ${req.session.user.email}`);

  try {
    const user = await User.findById(req.session.user._id);
    const skills = await Skill.find({});
    if (!user) {
      throw new Error('User not found');
    }

    return res.render('myprofile', {
      pageTitle: 'My Profile',
      navbarTitle: 'My Profile',
      sidebarPos: 'myprofile',
      user,
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


// SHOW SKILLS PAGE
exports.getSkills = async (req, res) => {
  console.log(`Viewing skills page: ${req.session.user.email}`);

  try {
    const skills = await Skill.find({});
    if (!skills) {
      throw new Error('Skills not found');
    }

    return res.render('skills', {
      pageTitle: 'Skills',
      navbarTitle: 'Skills',
      sidebarPos: 'skills',
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


// ===============
// SAVE MY PROFILE
// ===============
exports.saveMyProfile = async (req, res) => {
  console.log(`Saving profile: ${req.session.user.email}`);
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      throw new Error('User not found');
    }
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phone = req.body.phone;
    await user.save();
    return res.redirect('/profile');
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// ==================
// GENERATE TEST LINK
// ==================
exports.generateTestLink = async (req, res) => {
  const skillId = req.body.skill_id;
  console.log(`Generating a ${skillId} test link for: ${req.session.user.email}`);
  try {
    await codility.generateTestLink(req.session.user.email, skillId);
    return res.redirect('/profile');
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// ====================
// SYNC CODILITY SKILLS
// ====================
exports.syncCodilitySkills = async (req, res) => {
  try {
    await codility.syncSkills();
    console.log('Codility skills synced');
    return res.redirect('/skills');
  } catch (error) {
    console.log(`Something wrong while syncin Codility skills: \n${error}`);
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};
