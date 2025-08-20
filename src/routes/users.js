const { Router } = require('express');
const usersDB = require('../database/users');
const logsDB = require('../database/logs');
const verifyJWT = require('../middlewares/verify-jwt');
const validateUserData = require('../middlewares/validate-user');
const { removePassword } = require('../utils/user-utils');

const usersRoutes = Router();

usersRoutes.use(verifyJWT);

const logOperation = async (operation, userData, fieldChanged = null, oldValue = null, newValue = null, executedBy) => {
  try {
    await logsDB.addLog({
      operation,
      userId: userData.id,
      userName: userData.name,
      userEmail: userData.email,
      fieldChanged,
      oldValue,
      newValue,
      executedById: executedBy.id,
      executedByName: executedBy.name,
      executedByEmail: executedBy.email
    });
  } catch (error) {
    console.error('Erro ao registrar log:', error);
  }
};

usersRoutes.get('/', async (req, res) => {
  try {
    const users = await usersDB.getAllUsers();
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

usersRoutes.post('/', validateUserData, async (req, res) => {
  try {
    const { name, email, type, password } = req.body;

    const newUser = await usersDB.createUser({ name, email, type, password });
    const userWithoutPassword = removePassword(newUser);
    
    await logOperation('CREATE', newUser, null, null, null, req.user);
    
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

usersRoutes.put('/:id', validateUserData, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, type, password } = req.body;

    const currentUser = await usersDB.getUserById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await usersDB.updateUser(userId, { name, email, type, password });
    const userWithoutPassword = removePassword(updatedUser);
    
    const fieldsToCheck = { name, email, type, password };
    for (const [field, newValue] of Object.entries(fieldsToCheck)) {
      if (newValue !== undefined && newValue !== currentUser[field]) {
        await logOperation(
          'UPDATE', 
          updatedUser, 
          field, 
          currentUser[field], 
          newValue, 
          req.user
        );
      }
    }
    
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

usersRoutes.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const deletedUser = await usersDB.deleteUser(userId);
    const userWithoutPassword = removePassword(deletedUser);
    
    await logOperation('DELETE', deletedUser, null, null, null, req.user);
    
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
