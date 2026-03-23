/**
 * Admin Middleware - Additional admin-specific middleware
 */
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Check if user is super admin
 */
const requireSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Super admin access required' 
      });
    }

    // Check if user has super admin flag (you can add this to User model)
    const user = await User.findById(req.user._id);
    if (!user || !user.isSuperAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: 'Super admin access required' 
      });
    }

    next();
  } catch (error) {
    logger.error('Super admin check error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Authorization check failed' 
    });
  }
};

/**
 * Check if user can access specific resource
 */
const canAccessResource = (resourceOwnerField = 'user') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user._id;

      // Admins can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // For regular users, check ownership
      // This is a generic implementation - customize based on your models
      const Model = req.Model; // Set by route handler
      if (!Model) {
        return next();
      }

      const resource = await Model.findById(resourceId);
      if (!resource) {
        return res.status(404).json({ 
          success: false, 
          error: 'Resource not found' 
        });
      }

      const ownerId = resource[resourceOwnerField]?.toString();
      if (ownerId !== userId.toString()) {
        return res.status(403).json({ 
          success: false, 
          error: 'Access denied' 
        });
      }

      next();
    } catch (error) {
      logger.error('Resource access check error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Access check failed' 
      });
    }
  };
};

/**
 * Audit log middleware for admin actions
 */
const auditLog = (action) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    res.json = function(data) {
      // Log admin actions
      if (req.user && req.user.role === 'admin') {
        logger.info('Admin action:', {
          action,
          adminId: req.user._id,
          method: req.method,
          path: req.path,
          body: req.body,
          result: data?.success,
        });
      }
      return originalJson(data);
    };

    next();
  };
};

module.exports = {
  requireSuperAdmin,
  canAccessResource,
  auditLog,
};
