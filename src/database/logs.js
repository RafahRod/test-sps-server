const { db } = require('./sqlite');

async function addLog(logData) {
  return new Promise((resolve, reject) => {
    const {
      operation,
      userId,
      userName,
      userEmail,
      fieldChanged,
      oldValue,
      newValue,
      executedById,
      executedByName,
      executedByEmail
    } = logData;

    const query = `
      INSERT INTO user_logs (
        operation, user_id, user_name, user_email, 
        field_changed, old_value, new_value,
        executed_by_id, executed_by_name, executed_by_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      operation, userId, userName, userEmail,
      fieldChanged, oldValue, newValue,
      executedById, executedByName, executedByEmail
    ];

    db.run(query, values, function(err) {
      if (err) {
        reject(err);
      } else {
        const newLog = {
          id: this.lastID,
          ...logData,
          timestamp: new Date().toISOString()
        };
        resolve(newLog);
      }
    });
  });
}

async function getAllLogs() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM user_logs 
      ORDER BY timestamp DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function getLogsByOperation(operation) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM user_logs 
      WHERE operation = ? 
      ORDER BY timestamp DESC
    `;
    
    db.all(query, [operation], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function getLogsByUser(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM user_logs 
      WHERE user_id = ? 
      ORDER BY timestamp DESC
    `;
    
    db.all(query, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function cleanOldLogs(daysToKeep = 30) {
  return new Promise((resolve, reject) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const query = `
      DELETE FROM user_logs 
      WHERE timestamp < ?
    `;
    
    db.run(query, [cutoffDate.toISOString()], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ deletedCount: this.changes });
      }
    });
  });
}

module.exports = {
  addLog,
  getAllLogs,
  getLogsByOperation,
  getLogsByUser,
  cleanOldLogs
};
