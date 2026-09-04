/**
 * Smart Waste Collection Management System - Environment Variables Configuration
 */
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'smartwaste_jwt_secure_key_2026_x89!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // PostgreSQL Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/smartwaste_db',
  PG_HOST: process.env.PG_HOST || 'localhost',
  PG_PORT: process.env.PG_PORT || 5432,
  PG_DATABASE: process.env.PG_DATABASE || 'smartwaste_db',
  PG_USER: process.env.PG_USER || 'postgres',
  PG_PASSWORD: process.env.PG_PASSWORD || 'postgres',

  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
