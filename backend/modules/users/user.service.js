/**
 * User Service - Administrative User Operations
 */
const UserModel = require('./user.model');
const { hashPassword } = require('../../utils/password');

const UserService = {
  getAllUsers: async (filter) => {
    return UserModel.findAll(filter);
  },

  getUserById: async (id) => {
    const user = await UserModel.findById(id);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }
    return user;
  },

  createUserByAdmin: async ({ name, email, password, role, phone, address, city, status }) => {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      const err = new Error('User with this email already exists.');
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await hashPassword(password);
    const now = new Date().toISOString();

    const newUser = await UserModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      city: city ? city.trim() : '',
      status: status || 'Active',
      createdAt: now,
      updatedAt: now
    });

    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  updateUserStatus: async (id, status) => {
    const user = await UserModel.findById(id);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    const updated = await UserModel.update(id, { status });
    const { password, ...safeUser } = updated;
    return safeUser;
  },

  deleteUser: async (id) => {
    const ok = await UserModel.delete(id);
    if (!ok) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }
    return true;
  }
};

module.exports = UserService;
