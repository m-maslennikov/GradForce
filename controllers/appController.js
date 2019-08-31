// Models
const User = require('../models/user');
const Skill = require('../models/skill');

// Utils
const codility = require('../utils/codility');


exports.getRoot = (req, res) => {
  res.redirect('/auth/register');
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


// SHOW ALL STUDENTS PAGE
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.render('students', {
      students,
      pageTitle: 'All students',
      sidebarPos: 'allStudents',
    });
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// SHOW INTERVIEWED STUDENTS PAGE
exports.getInterviewedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isInterviewed: true });
    res.render('students', {
      students,
      pageTitle: 'Interviewed students',
      sidebarPos: 'interviewedStudents',
    });
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// SHOW APPROVED STUDENTS PAGE
exports.getApprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isApproved: true });
    res.render('students', {
      students,
      pageTitle: 'Approved students',
      sidebarPos: 'approvedStudents',
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


// SHOW PROFILE BT ID PAGE
exports.getProfileById = async (req, res) => {
  console.log(`Viewing profile ID: ${req.params.id} - ${req.session.user.email}`);

  try {
    const user = await User.findById(req.params.id);
    const skills = await Skill.find({});
    if (!user) {
      throw new Error('User not found');
    }

    return res.render('myprofile', {
      pageTitle: 'Edit Profile',
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

// ===============
// SAVE MY EDUCATION
// ===============
exports.saveMyEducation = async (req, res) => {
  console.log(`Saving profile: ${req.session.user.email}`);
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.education.push({
      level: req.body.level,
      schoolName: req.body.schoolName,
      courseName: req.body.courseName,
      startDate: req.body.educationStartDate,
      endDate: req.body.educationEndDate,
    });
    await user.save();
    return res.redirect('/profile');
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/profile');
  }
};

// ===============
// EDIT MY EDUCATION
// ===============
exports.editMyEducation = async (req, res) => {
  console.log(`Saving profile: ${req.session.user.email}`);
  try {
    await User.update({ 'education._id': req.body.educationId }, {
      $set: {
        'education.$.level': req.body.level,
        'education.$.schoolName': req.body.schoolName,
        'education.$.courseName': req.body.courseName,
        'education.$.startDate': req.body.educationStartDate,
        'education.$.endDate': req.body.educationEndDate,
      },
    });
    // await user.save();
    return res.redirect('/profile');
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/profile');
  }
};

// ===============
// DELETE MY EDUCATION
// ===============
exports.deleteMyEducation = async (req, res) => {
  console.log(`Saving profile: ${req.session.user.email}`);
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.education.pull({ _id: req.body.educationId });
    await user.save();
    return res.redirect('/profile');
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/profile');
  }
};


// ===============
// SAVE MY WORK
// ===============
exports.saveMyWork = async (req, res) => {
  console.log(`Saving profile: ${req.session.user.email}`);
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.work.push({
      companyName: req.body.companyName,
      jobRole: req.body.jobRole,
      jobDescription: req.body.jobDescription,
      startDate: req.body.wstartDate,
      endDate: req.body.wendDate,
      country: req.body.country,
      city: req.body.city,
    });
    await user.save();
    return res.redirect('/profile');
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/profile');
  }
};

// ===============
// EDIT MY WORK
// ===============
exports.editMyWork = async (req, res) => {
  console.log(`Saving profile: ${req.session.user.email}`);
  try {
    await User.update({ 'work._id': req.body.workId }, {
      $set: {
        'work.$.companyName': req.body.companyName,
        'work.$.jobRole': req.body.jobRole,
        'work.$.jobDescription': req.body.jobDescription,
        'work.$.startDate': req.body.wstartDate,
        'work.$.endDate': req.body.wendDate,
        'work.$.country': req.body.country,
        'work.$.city': req.body.city,
      },
    });
    // await user.save();
    return res.redirect('/profile');
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/profile');
  }
};

// ===============
// DELETE MY WORK
// ===============
exports.deleteMyWork = async (req, res) => {
  console.log(`Saving profile: ${req.session.user.email}`);
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.work.pull({ _id: req.body.workId });
    await user.save();
    return res.redirect('/profile');
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/profile');
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
