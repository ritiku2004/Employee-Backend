const authService = require('../services/EmployeeAuthService');

exports.login = async (req, res) => {
  try {
    const result = await authService.login({
      emailAddress: req.body.emailAddress,
      password:     req.body.password,
      rememberMe:   req.body.rememberMe || false
    });
    res.json(result);
  } catch (err) {
    console.error('login error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.autoLogin = (req, res) => {
  try {
    const result = authService.autoLogin(req.headers.authorization);
    res.json(result);
  } catch (err) {
    console.error('autoLogin error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.logout = (req, res) => {
  // no async errors here
  const result = authService.logout();
  res.json(result);
};
