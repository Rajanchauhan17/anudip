const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but user not found'
        });
      }
      
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }
      
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts'
        });
      }
      
      // Add user to request object
      req.user = user;
      next();
      
    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      } else if (tokenError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      } else {
        throw tokenError;
      }
    }
    
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive && !user.isLocked) {
          req.user = user;
        }
      } catch (tokenError) {
        // Silently ignore token errors in optional auth
        logger.warn('Optional auth token error:', tokenError.message);
      }
    }
    
    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    
    next();
  };
};

// Admin only access
const adminOnly = authorize('admin', 'super_admin');

// Super admin only access
const superAdminOnly = authorize('super_admin');

// Customer or higher access
const customerOrHigher = authorize('customer', 'admin', 'super_admin');

// Check if user owns the resource
const checkOwnership = (resourceUserField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Admin and super admin can access any resource
    if (['admin', 'super_admin'].includes(req.user.role)) {
      return next();
    }
    
    // For customers, check ownership
    const resourceUserId = req.params.userId || req.body[resourceUserField] || req.query.userId;
    
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources'
      });
    }
    
    next();
  };
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (req, res, next) => {
  // This would typically integrate with Redis for distributed rate limiting
  // For now, we'll use in-memory tracking (not suitable for production)
  const userOperations = global.userOperations || new Map();
  const userId = req.user._id.toString();
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxOperations = 5;
  
  if (!userOperations.has(userId)) {
    userOperations.set(userId, []);
  }
  
  const operations = userOperations.get(userId);
  
  // Remove old operations outside the window
  const recentOperations = operations.filter(time => now - time < windowMs);
  
  if (recentOperations.length >= maxOperations) {
    return res.status(429).json({
      success: false,
      message: 'Too many sensitive operations. Please try again later',
      retryAfter: Math.ceil((recentOperations[0] + windowMs - now) / 1000)
    });
  }
  
  // Add current operation
  recentOperations.push(now);
  userOperations.set(userId, recentOperations);
  global.userOperations = userOperations;
  
  next();
};

// Email verification required
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }
  
  next();
};

// Account status checks
const requireActiveAccount = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated. Please contact support',
      code: 'ACCOUNT_DEACTIVATED'
    });
  }
  
  if (req.user.isLocked) {
    return res.status(423).json({
      success: false,
      message: 'Account is temporarily locked. Please try again later',
      code: 'ACCOUNT_LOCKED'
    });
  }
  
  next();
};

// Two-factor authentication check
const require2FA = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.user.twoFactorAuth.isEnabled && !req.session.twoFactorVerified) {
    return res.status(403).json({
      success: false,
      message: 'Two-factor authentication required',
      code: 'TWO_FACTOR_REQUIRED'
    });
  }
  
  next();
};

// Combine multiple middleware
const requireAuth = [verifyToken, requireActiveAccount];
const requireVerifiedAuth = [verifyToken, requireActiveAccount, requireEmailVerification];
const requireAdminAuth = [verifyToken, requireActiveAccount, adminOnly];
const requireSuperAdminAuth = [verifyToken, requireActiveAccount, superAdminOnly];

module.exports = {
  verifyToken,
  optionalAuth,
  authorize,
  adminOnly,
  superAdminOnly,
  customerOrHigher,
  checkOwnership,
  sensitiveOperationLimit,
  requireEmailVerification,
  requireActiveAccount,
  require2FA,
  requireAuth,
  requireVerifiedAuth,
  requireAdminAuth,
  requireSuperAdminAuth
};