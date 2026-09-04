/**
 * Smart Waste Collection Management System - User Model & Auth Logic
 */
const Database = require('../database/db');

const UserModel = {
  findAll: (role) => {
    if (role) {
      return Database.find('users', { role }).map(u => {
        const { password, ...safeUser } = u;
        return safeUser;
      });
    }
    return Database.find('users').map(u => {
      const { password, ...safeUser } = u;
      return safeUser;
    });
  },

  findById: (id) => {
    const user = Database.findById('users', id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  findByEmail: (email) => {
    return Database.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
  },

  authenticate: (email, password) => {
    const user = UserModel.findByEmail(email);
    if (!user) return null;
    
    // In production, bcrypt.compareSync; here checking against configured credential password
    if (user.password && user.password === password) {
      const { password: _, ...safeUser } = user;
      return safeUser;
    }
    return null;
  },

  createCitizen: (data) => {
    const existing = UserModel.findByEmail(data.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newRecord = {
      id: `usr_cit_${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password || 'citizen123',
      role: 'CITIZEN',
      phone: data.phone || '',
      address: data.address || '',
      avatar_url: data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };

    const saved = Database.insert('users', newRecord);
    const { password, ...safeUser } = saved;
    return safeUser;
  },

  create: (data) => {
    return Database.insert('users', data);
  },

  update: (id, updates) => {
    return Database.updateById('users', id, updates);
  },

  delete: (id) => {
    return Database.deleteById('users', id);
  }
};

module.exports = UserModel;
