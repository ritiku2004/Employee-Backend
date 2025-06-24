const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { isNew, email, otp } = await authService.registerOrResendOtp(req.body);
    res
      .status(isNew ? 201 : 200)
      .json({
        message: isNew ? 'Account created, OTP sent' : 'New OTP sent',
        email,
        otp 
      });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, otp } = await authService.loginSendOtp(req.body);
    res.json({ message: 'OTP sent', email, otp });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { accessToken, rememberToken } = await authService.verifyOtp(req.body);
    res.json({ message: 'OTP verified', accessToken, rememberToken });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.autoLogin = async (req, res) => {
  try {
    const token = await authService.autoLogin(req.header('remembertoken'));
    res.json({ accessToken: token });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    await authService.logout(token);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};
