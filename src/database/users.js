const { db } = require('./sqlite');

async function getAllUsers() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function getUserById(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function createUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, type, password } = userData;
      
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        reject(new Error('Email already exists'));
        return;
      }

      const query = `
        INSERT INTO users (name, email, type, password) 
        VALUES (?, ?, ?, ?)
      `;
      
      db.run(query, [name, email, type, password], function(err) {
        if (err) {
          reject(err);
        } else {
          const newUser = {
            id: this.lastID,
            name,
            email,
            type,
            password,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          resolve(newUser);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function updateUser(id, userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, type, password } = userData;
      
      const existingUser = await getUserById(id);
      if (!existingUser) {
        reject(new Error('User not found'));
        return;
      }

      if (email && email !== existingUser.email) {
        const emailExists = await getUserByEmail(email);
        if (emailExists) {
          reject(new Error('Email already exists'));
          return;
        }
      }

      const updateFields = [];
      const values = [];
      
      if (name !== undefined) {
        updateFields.push('name = ?');
        values.push(name);
      }
      if (email !== undefined) {
        updateFields.push('email = ?');
        values.push(email);
      }
      if (type !== undefined) {
        updateFields.push('type = ?');
        values.push(type);
      }
      if (password !== undefined) {
        updateFields.push('password = ?');
        values.push(password);
      }
      
      updateFields.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const query = `
        UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = ?
      `;

      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          const updatedUser = {
            ...existingUser,
            ...userData,
            updated_at: new Date().toISOString()
          };
          resolve(updatedUser);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function deleteUser(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const existingUser = await getUserById(id);
      if (!existingUser) {
        reject(new Error('User not found'));
        return;
      }

      if (existingUser.type === 'admin') {
        reject(new Error('Cannot delete admin user'));
        return;
      }

      const query = 'DELETE FROM users WHERE id = ?';
      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(existingUser);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function authenticateUser(email, password) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.get(query, [email, password], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser
};
