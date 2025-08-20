function removePassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

function isValidUserType(type) {
  return ['admin', 'user'].includes(type);
}

function validateRequiredFields(fields) {
  const required = ['name', 'email', 'type', 'password'];
  const missing = required.filter(field => !fields[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

function validateUserType(type) {
  if (!isValidUserType(type)) {
    throw new Error('User type must be "admin" or "user"');
  }
}

module.exports = {
  removePassword,
  isValidUserType,
  validateRequiredFields,
  validateUserType
};
