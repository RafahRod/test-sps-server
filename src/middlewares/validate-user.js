const { validateRequiredFields, validateUserType } = require('../utils/user-utils');

function validateUserData(req, res, next) {
  try {
    const { name, email, type, password } = req.body;
    
    validateRequiredFields({ name, email, type, password });
    validateUserType(type);
    
    next();
  } catch (error) {
    return res.status(400).json({ 
      message: error.message 
    });
  }
}

module.exports = validateUserData;
