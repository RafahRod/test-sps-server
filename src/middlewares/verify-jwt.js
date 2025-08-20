const jwt = require('jsonwebtoken');
const config = require('../config/env');
const usersDB = require('../database/users');

async function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    const user = await usersDB.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = verifyJWT;
