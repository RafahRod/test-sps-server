const { Router } = require('express');
const jwt = require('jsonwebtoken');
const usersDB = require('../database/users');
const config = require('../config/env');

const authRoutes = Router();

authRoutes.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    const user = usersDB.authenticateUser(email, password);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        type: user.type 
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

module.exports = authRoutes;
