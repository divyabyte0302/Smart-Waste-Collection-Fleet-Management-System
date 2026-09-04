/**
 * Auth Model - Interacts with persistence layer for Auth Domain
 */
const db = require('../../config/database');

const AuthModel = {
  findUserByEmail: async (email) => {
    return db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById: async (id) => {
    return db.findById('users', id);
  },

  createUser: async (userData) => {
    return db.insert('users', userData);
  },

  updateUser: async (id, updateData) => {
    return db.update('users', id, updateData);
  }
};

module.exports = AuthModel;
