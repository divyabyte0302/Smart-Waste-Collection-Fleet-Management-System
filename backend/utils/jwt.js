/**
 * JWT Token Generation and Verification Utility
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');

module.exports = {
  generateToken: (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN
    });
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
};
