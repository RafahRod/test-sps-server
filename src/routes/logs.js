const { Router } = require('express');
const logsDB = require('../database/logs');
const verifyJWT = require('../middlewares/verify-jwt');

const logsRoutes = Router();

logsRoutes.use(verifyJWT);

logsRoutes.get('/', async (req, res) => {
  try {
    const logs = await logsDB.getAllLogs();
    res.json({
      message: 'Logs retrieved successfully',
      logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

logsRoutes.get('/operation/:operation', async (req, res) => {
  try {
    const { operation } = req.params;
    const logs = await logsDB.getLogsByOperation(operation);
    res.json({
      message: `Logs for operation '${operation}' retrieved successfully`,
      logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Get logs by operation error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

logsRoutes.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const logs = await logsDB.getLogsByUser(userId);
    res.json({
      message: `Logs for user ${userId} retrieved successfully`,
      logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Get logs by user error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

module.exports = logsRoutes;
