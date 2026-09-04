/**
 * Smart Waste Collection Management System - Production Security Middleware Suite
 * Includes:
 * 1. Security Headers (Helmet equivalent)
 * 2. Strict / Configurable CORS
 * 3. IP-based Sliding Window Rate Limiting (General & Auth-specific)
 * 4. Input Sanitization & Anti-XSS Protection
 * 5. Sensitive Environment Protection
 */

// In-memory rate limiting stores
const generalRateLimits = new Map();
const authRateLimits = new Map();

// Periodic cleanup of expired rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of generalRateLimits.entries()) {
    if (now > data.resetTime) generalRateLimits.delete(ip);
  }
  for (const [ip, data] of authRateLimits.entries()) {
    if (now > data.resetTime) authRateLimits.delete(ip);
  }
}, 5 * 60 * 1000);

/**
 * 1. Helmet-grade Security Headers Middleware
 */
const helmetSecurityHeaders = (req, res, next) => {
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.removeHeader('X-Powered-By');
  next();
};

/**
 * 2. Production CORS Configuration
 */
const createCorsOptions = () => {
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Check against allowed origins or allow during non-production
      const isAllowed = allowedOrigins.some(allowed => 
        allowed === '*' || origin === allowed || origin.endsWith('.amplifyapp.com') || origin.endsWith('.amazonaws.com')
      );

      if (isAllowed || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} is not allowed.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    maxAge: 86400
  };
};

/**
 * 3. Production Rate Limiting
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Max requests allowed per window
 * @param {string} type - 'general' or 'auth'
 */
const rateLimiter = (windowMs = 60 * 1000, max = 200, type = 'general') => {
  const store = type === 'auth' ? authRateLimits : generalRateLimits;

  return (req, res, next) => {
    // Whitelist localhost during automated testing if enabled
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let clientData = store.get(ip);
    if (!clientData || now > clientData.resetTime) {
      clientData = {
        count: 1,
        resetTime: now + windowMs
      };
      store.set(ip, clientData);
    } else {
      clientData.count++;
    }

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - clientData.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000));

    if (clientData.count > max) {
      return res.status(429).json({
        success: false,
        message: `Too many requests from this IP. Please try again after ${Math.ceil((clientData.resetTime - now) / 1000)} seconds.`,
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }

    next();
  };
};

/**
 * 4. Input Sanitization Middleware (Anti-XSS & Prototype Pollution)
 */
const sanitizeInputMiddleware = (req, res, next) => {
  const cleanString = (val) => {
    if (typeof val !== 'string') return val;
    // Strip null bytes and dangerous script tags
    return val
      .replace(/\0/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        delete obj[key];
        continue;
      }
      if (typeof obj[key] === 'string') {
        obj[key] = cleanString(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

/**
 * 5. Environment Variable Sanitizer (for safety in health/status responses)
 */
const sanitizeEnv = (envObj = process.env) => {
  const sensitiveKeys = ['SECRET', 'KEY', 'PASSWORD', 'TOKEN', 'CREDENTIAL', 'AUTH', 'DATABASE_URL'];
  const sanitized = {};

  for (const [k, v] of Object.entries(envObj)) {
    const isSensitive = sensitiveKeys.some(sk => k.toUpperCase().includes(sk));
    if (isSensitive) {
      sanitized[k] = v ? '***REDACTED***' : undefined;
    } else {
      sanitized[k] = v;
    }
  }

  return sanitized;
};

module.exports = {
  helmetSecurityHeaders,
  createCorsOptions,
  rateLimiter,
  sanitizeInputMiddleware,
  sanitizeEnv
};
