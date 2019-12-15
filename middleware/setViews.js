// Inject these values to every view
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    if (req.kauth.grant) {
      res.locals.isLoggedIn = true;
      const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
      res.locals.userRole = req.kauth.grant.access_token.content.resource_access.web.roles[0];
      res.locals.userEmail = req.kauth.grant.access_token.content.email;
      res.locals.currentUser = user;
    } else {
      res.locals.isLoggedIn = false;
    }
    res.locals.csrfToken = req.csrfToken();
    return next();
  } catch (error) {
    // `status(500)` and `statusCode: '500'` seems like duplication
    return res.status(500).render('./error/error', {
      pageTitle: '500',
      statusCode: '500',
      error,
    });
  }
};
