/**
 * Auth Service - Core Business Logic for Authentication & Profile Management
 */
const AuthModel = require('./auth.model');
const { hashPassword, comparePassword } = require('../../utils/password');
const { generateToken } = require('../../utils/jwt');
const { ROLES, USER_STATUS } = require('../../config/constants');

const AuthService = {
  registerCitizen: async ({ name, email, password, phone, address, city }) => {
    const existing = await AuthModel.findUserByEmail(email);
    if (existing) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await hashPassword(password);
    const now = new Date().toISOString();

    const newUser = await AuthModel.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      password: hashedPassword,
      role: ROLES.CITIZEN,
      address: address ? address.trim() : '',
      city: city ? city.trim() : '',
      status: USER_STATUS.ACTIVE,
      createdAt: now,
      updatedAt: now
    });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    const { password: _, ...safeUser } = newUser;
    return { user: safeUser, token };
  },

  login: async ({ email, password }) => {
    const user = await AuthModel.findUserByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    if (user.status === USER_STATUS.INACTIVE) {
      const err = new Error('Your account is currently inactive. Please contact your system administrator.');
      err.statusCode = 403;
      throw err;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  },

  getProfile: async (userId) => {
    const user = await AuthModel.findUserById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  updateProfile: async (userId, updateFields) => {
    const allowed = ['name', 'phone', 'address', 'city'];
    const safeUpdates = {};
    for (const key of allowed) {
      if (updateFields[key] !== undefined) {
        safeUpdates[key] = updateFields[key];
      }
    }

    const updated = await AuthModel.updateUser(userId, safeUpdates);
    if (!updated) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    const { password: _, ...safeUser } = updated;
    return safeUser;
  },

  changePassword: async (userId, { currentPassword, newPassword }) => {
    const user = await AuthModel.findUserById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      const err = new Error('Current password does not match our records.');
      err.statusCode = 400;
      throw err;
    }

    const hashedPassword = await hashPassword(newPassword);
    await AuthModel.updateUser(userId, { password: hashedPassword });
    return true;
  }
};

module.exports = AuthService;
