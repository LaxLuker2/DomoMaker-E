// check if we attached an account to their session
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    // redirect to homepg if not
    return res.redirect('/');
  }
  return next();
};

// check if user is already logged in
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    // redirect to /maker if so
    return res.redirect('/maker');
  }
  return next();
};

// check if on https
// on heroku check the x-forward-proto
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// check which environment
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
