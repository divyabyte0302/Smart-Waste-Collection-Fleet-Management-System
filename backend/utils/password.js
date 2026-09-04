/**
 * Bcrypt Password Hashing & Comparison Utility
 */
const bcrypt = require('bcryptjs');

module.exports = {
  hashPassword: async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
  },

  comparePassword: async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};
