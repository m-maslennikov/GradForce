// Middleware to check if user is logged in
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/auth/register');
  }
  return next();
};
