const { Router } = require('express');
const usersDB = require('../database/users');
const verifyJWT = require('../middlewares/verify-jwt');
const validateUserData = require('../middlewares/validate-user');
const { removePassword } = require('../utils/user-utils');

const usersRoutes = Router();

usersRoutes.use(verifyJWT);

usersRoutes.get('/', (req, res) => {
  try {
    const users = usersDB.getAllUsers();
    res.json({
      message: 'Users retrieved successfully',
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

usersRoutes.post('/', validateUserData, (req, res) => {
  try {
    const { name, email, type, password } = req.body;

    const newUser = usersDB.createUser({ name, email, type, password });
    const userWithoutPassword = removePassword(newUser);
    
    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.message === 'Email already exists') {
      return res.status(409).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

usersRoutes.put('/:id', validateUserData, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, type, password } = req.body;

    const updatedUser = usersDB.updateUser(userId, { name, email, type, password });
    const userWithoutPassword = removePassword(updatedUser);
    
    res.json({
      message: 'User updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ 
        message: error.message 
      });
    }
    
    if (error.message === 'Email already exists') {
      return res.status(409).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

usersRoutes.delete('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const deletedUser = usersDB.deleteUser(userId);
    const userWithoutPassword = removePassword(deletedUser);
    
    res.json({
      message: 'User deleted successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ 
        message: error.message 
      });
    }
    
    if (error.message === 'Cannot delete admin user') {
      return res.status(403).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

module.exports = usersRoutes;
