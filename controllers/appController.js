// Models
const User = require('../models/user');
const Skill = require('../models/skill');

// Utils
const codility = require('../utils/codility');


exports.getRoot = (req, res) => {
  if (req.kauth.grant.access_token.content.resource_access.web.roles[0] === 'student') {
    res.redirect('/profile');
  }
  if (req.kauth.grant.access_token.content.resource_access.web.roles[0] === 'admin') {
    res.redirect('/dashboard');
  }
};


// ==========
// SHOW PAGES
// ==========


// SHOW DASHBOARD PAGE
exports.getDashboard = async (req, res) => {
  try {
    const accountStatus = await codility.getAccountStatus();
    const testsCount = await codility.getTestsCount();
    const uninterviewedStudents = await User.find({ isInterviewed: false });
    const uninterviewedStudentsCount = uninterviewedStudents.length;
    const approvedStudents = await User.find({ isApproved: true });
    const approvedStudentsCount = approvedStudents.length;

    return res.render('dashboard', {
      pageTitle: 'Dashboard',
      sidebarPos: 'dashboard',
      accountStatus,
      testsCount,
      uninterviewedStudentsCount,
      approvedStudentsCount,
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
    const students = await User.find({});
    return res.render('students', {
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
    const students = await User.find({ isInterviewed: true });
    return res.render('students', {
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
    const students = await User.find({ isApproved: true });
    return res.render('students', {
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
  try {
    const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
    let skills = await Skill.find({});

    if (!user) {
      throw new Error('User not found');
    }

    skills = skills.filter((skill) => !user.skills.map((skill) => skill.skillId).includes(skill._id));

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


// SHOW MY EDUCATION PAGE
exports.getMyEducation = async (req, res) => {
  try {
    const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
    if (!user) {
      throw new Error('User not found');
    }

    return res.render('myeducation', {
      pageTitle: 'My Education',
      sidebarPos: 'myeducation',
      user,
    });
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// SHOW MY WORK PAGE
exports.getMyWork = async (req, res) => {
  try {
    const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
    if (!user) {
      throw new Error('User not found');
    }

    return res.render('mywork', {
      pageTitle: 'My Work',
      sidebarPos: 'mywork',
      user,
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
  try {
    const user = await User.findById(req.params.id);
    const skills = await Skill.find({});
    if (!user) {
      throw new Error('User not found');
    }

    return res.render('studentProfile', {
      pageTitle: 'Student Profile',
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
  try {
    const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
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
// SAVE PROFILE BY ID
// ==================
exports.saveProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error('User not found');
    }
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phone = req.body.phone;
    req.body.isInterviewed === 'true' ? user.isInterviewed = true : user.isInterviewed = false;
    req.body.isApproved === 'true' ? user.isApproved = true : user.isApproved = false;
    await user.save();
    return res.redirect(`/profile/${req.params.id}`);
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// =================
// SAVE MY EDUCATION
// =================
exports.saveMyEducation = async (req, res) => {
  try {
    const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
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
    return res.redirect('/education');
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};

// =================
// EDIT MY EDUCATION
// =================
exports.editMyEducation = async (req, res) => {
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
    return res.redirect('/education');
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};

// ===================
// DELETE MY EDUCATION
// ===================
exports.deleteMyEducation = async (req, res) => {
  try {
    const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
    if (!user) {
      throw new Error('User not found');
    }
    await user.education.pull({ _id: req.body.educationId });
    await user.save();
    return res.redirect('/education');
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// ============
// SAVE MY WORK
// ============
exports.saveMyWork = async (req, res) => {
  try {
    const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
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
    return res.redirect('/work');
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};

// ============
// EDIT MY WORK
// ============
exports.editMyWork = async (req, res) => {
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
    return res.redirect('/work');
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};

// ==============
// DELETE MY WORK
// ==============
exports.deleteMyWork = async (req, res) => {
  try {
    const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
    if (!user) {
      throw new Error('User not found');
    }
    await user.work.pull({ _id: req.body.workId });
    await user.save();
    return res.redirect('/work');
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// =============
// SAVE MY SKILL
// =============
exports.saveMySkill = async (req, res) => {
  try {
    const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
    if (!user) {
      throw new Error('User not found');
    }
    await user.skills.push({
      name: req.body.skillName,
      skillId: req.body.skillId,
    });
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
// REMOVE MY SKILL
// ==================

exports.deleteMySkill = async (req, res) => {
  try {
    const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
    if (!user) {
      throw new Error('User not found');
    }
    await user.skills.pull({ _id: req.body.skillId });
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

// ============
// VERIFY SKILL
// ============
exports.verifySkill = async (req, res) => {
  const { userId, userSkillId, skillLevel } = req.body;
  try {
    await User.update({ 'skills._id': userSkillId }, {
      $set: {
        'skills.$.skillLevel': skillLevel,
        'skills.$.isVerified': true,
      },
    });
    return res.redirect(`/profile/${userId}`);
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
  const {
    email, userSkillId, globalSkillId, userId,
  } = req.body;
  try {
    const result = await codility.generateTestLink(email, globalSkillId);
    await User.update({ 'skills._id': userSkillId }, {
      $set: {
        'skills.$.test_link': result.test_link,
        'skills.$.report_link': result.report_link,
        'skills.$.pdf_report_url': result.pdf_report_url,
        'skills.$.session_url': result.url,
        'skills.$.cancel_url': result.cancel_url,
        'skills.$.max_result': result.evaluation.max_result,
      },
    });
    return res.redirect(`/profile/${userId}`);
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// ==================
// REFRESH SKILL INFO
// ==================
exports.refreshSkillInfo = async (req, res) => {
  const {
    userSkillId, sessionUrl, userId,
  } = req.body;
  try {
    const result = await codility.get(sessionUrl);
    await User.update({ 'skills._id': userSkillId }, {
      $set: {
        'skills.$.test_link': result.test_link,
        'skills.$.report_link': result.report_link,
        'skills.$.pdf_report_url': result.pdf_report_url,
        'skills.$.session_url': result.url,
        'skills.$.cancel_url': result.cancel_url,
        'skills.$.result': result.evaluation.result,
        'skills.$.max_result': result.evaluation.max_result,
      },
    });
    return res.redirect(`/profile/${userId}`);
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// ===========
// CANCEL TEST
// ===========
exports.cancelTest = async (req, res) => {
  const {
    cancelUrl, userSkillId, userId,
  } = req.body;
  try {
    await codility.post(cancelUrl);
    await User.update({ 'skills._id': userSkillId }, {
      $set: {
        'skills.$.test_link': null,
        'skills.$.report_link': null,
        'skills.$.pdf_report_url': null,
        'skills.$.session_url': null,
        'skills.$.cancel_url': null,
        'skills.$.result': null,
        'skills.$.max_result': null,
      },
    });
    return res.redirect(`/profile/${userId}`);
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};


// ===================
// GET EMBEDDED REPORT
// ===================
exports.getEmbeddedReport = async (req, res) => {
  const { sessionUrl } = req.body;
  try {
    const result = await codility.post(`${sessionUrl}embed_report/`);
    return res.status(301).redirect(result.url);
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
    return res.redirect('/skills');
  } catch (error) {
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};
