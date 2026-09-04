/**
 * User Model - Data layer for User Management
 */
const db = require('../../config/database');

const UserModel = {
  findAll: async (filter = {}) => {
    const users = await db.find('users', (u) => {
      if (filter.role && u.role !== filter.role) return false;
      if (filter.status && u.status !== filter.status) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        const matches = (
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.city && u.city.toLowerCase().includes(q)) ||
          (u.phone && u.phone.toLowerCase().includes(q))
        );
        if (!matches) return false;
      }
      return true;
    });

    return users.map(u => {
      const { password, ...safeUser } = u;
      return safeUser;
    });
  },

  findById: async (id) => {
    const user = await db.findById('users', id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  findByEmail: async (email) => {
    return db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
  },

  create: async (data) => {
    return db.insert('users', data);
  },

  update: async (id, updates) => {
    return db.update('users', id, updates);
  },

  delete: async (id) => {
    return db.delete('users', id);
  }
};

module.exports = UserModel;
