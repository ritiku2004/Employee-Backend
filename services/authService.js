const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const User   = require('../models/User');

const JWT_SECRET        = process.env.JWT_SECRET || 'replace-with-your-secret';
const ACCESS_TOKEN_EXP  = '15m';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateAccessToken(userId) {
  return jwt.sign({ userId }, "Secret", { expiresIn: ACCESS_TOKEN_EXP });
}

function generateRememberToken() {
  return crypto.randomBytes(32).toString('hex');
}

exports.registerOrResendOtp = async ({ username, email, password }) => {
  let user = await User.findOne({ email });
  if (user && user.isVerified) {
    throw { status: 400, message: 'Email already in use' };
  }
  const isNew = !user;
  if (isNew) {
    user = new User({ username, email, password, isVerified: false });
  } else {
    user.username = username;
    user.password = password;
  }

  user.otp        = generateOTP();
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  return { isNew, email: user.email, otp: user.otp };
};

exports.loginSendOtp = async ({ email, password }) => {
  const user = await User.findOne({ email, password });
  if (!user) throw { status: 400, message: 'Invalid credentials' };
  if (!user.isVerified) throw { status: 400, message: 'Please verify your email first' };

  user.otp        = generateOTP();
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  return { email: user.email, otp: user.otp };
};

exports.verifyOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 400, message: 'User not found' };
  if (user.otpExpires < new Date()) throw { status: 400, message: 'OTP expired' };
  if (user.otp !== otp) throw { status: 400, message: 'Invalid OTP' };

  user.isVerified    = true;
  user.otp           = undefined;
  user.otpExpires    = undefined;
  user.accessToken   = generateAccessToken(user._id);
  user.rememberToken = generateRememberToken();

  await user.save();
  return { accessToken: user.accessToken, rememberToken: user.rememberToken };
};

exports.autoLogin = async (rememberToken) => {
  if (!rememberToken) throw { status: 401, message: 'Missing rememberToken' };
  const user = await User.findOne({ rememberToken });
  if (!user) throw { status: 401, message: 'Invalid token' };

  const newAccessToken = generateAccessToken(user._id);
  user.accessToken = newAccessToken;
  await user.save();
  return newAccessToken;
};

exports.logout = async (token) => {
  if (!token) throw { status: 401, message: 'Missing access token' };
  let payload;
  try {
    payload = jwt.verify(token, "Secret");
  } catch {
    throw { status: 401, message: 'Invalid token' };
  }
  await User.findByIdAndUpdate(payload.userId, {
    accessToken: undefined,
    rememberToken: undefined
  });
};
