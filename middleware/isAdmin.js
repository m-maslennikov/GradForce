// Middleware to check if user is logged in and is admin
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/auth/register');
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).render('./error/error', {
      pageTitle: '403',
      statusCode: '403',
      error: 'Access Denied',
    });
  }
  return next();
};
