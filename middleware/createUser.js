// Middleware to create User in DB if not yet created

const User = require('../models/user');

module.exports = async (req, res, next) => {
  if (req.kauth.grant) {
    try {
      // console.log(req.kauth.grant.access_token.content.resource_access.web.roles[0]);
      const user = await User.findOne({ kcid: req.kauth.grant.access_token.content.sub });
      if (!user) {
        const newUser = new User({
          kcid: req.kauth.grant.access_token.content.sub,
          email: req.kauth.grant.access_token.content.email,
          firstName: req.kauth.grant.access_token.content.given_name,
          lastName: req.kauth.grant.access_token.content.family_name,
        });
        await newUser.save();
      }
    } catch (error) {
      return res.status(500).render('./error/error', {
        pageTitle: '500',
        statusCode: '500',
        error,
      });
    }
  }

  return next();
};
