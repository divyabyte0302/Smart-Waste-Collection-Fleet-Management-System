/**
 * Smart Waste Collection Management System - Zone Model
 */
const Database = require('../database/db');

const ZoneModel = {
  findAll: () => {
    return Database.find('zones');
  },

  findById: (id) => {
    return Database.findById('zones', id);
  },

  findByCode: (code) => {
    return Database.findOne('zones', { code });
  },

  create: (data) => {
    return Database.insert('zones', data);
  },

  update: (id, updates) => {
    return Database.updateById('zones', id, updates);
  },

  delete: (id) => {
    return Database.deleteById('zones', id);
  }
};

module.exports = ZoneModel;
