// Inject these values to every view

module.exports = (req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.currentUser = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  next();
};
