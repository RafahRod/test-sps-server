const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco SQLite:', err.message);
  } else {
    console.log('Conectado ao banco SQLite.');
    initDatabase();
  }
});

function initDatabase() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL DEFAULT 'user',
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createLogsTable = `
    CREATE TABLE IF NOT EXISTS user_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      operation TEXT NOT NULL,
      user_id INTEGER,
      user_name TEXT,
      user_email TEXT,
      field_changed TEXT,
      old_value TEXT,
      new_value TEXT,
      executed_by_id INTEGER,
      executed_by_name TEXT,
      executed_by_email TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (executed_by_id) REFERENCES users (id)
    )
  `;

  db.run(createUsersTable, (err) => {
    if (err) {
      console.error('Erro ao criar tabela users:', err.message);
    } else {
      console.log('Tabela users criada ou já existe.');
      db.run(createLogsTable, (err) => {
        if (err) {
          console.error('Erro ao criar tabela user_logs:', err.message);
        } else {
          console.log('Tabela user_logs criada ou já existe.');
          insertDefaultAdmin();
        }
      });
    }
  });
}

function insertDefaultAdmin() {
  const checkAdmin = 'SELECT * FROM users WHERE email = ?';
  db.get(checkAdmin, ['admin@sps.com'], (err, row) => {
    if (err) {
      console.error('Erro ao verificar admin:', err.message);
    } else if (!row) {
      const insertAdmin = `
        INSERT INTO users (name, email, type, password) 
        VALUES (?, ?, ?, ?)
      `;
      db.run(insertAdmin, ['admin', 'admin@sps.com', 'admin', 'admin123'], (err) => {
        if (err) {
          console.error('Erro ao inserir admin:', err.message);
        } else {
          console.log('Usuário admin criado com sucesso.');
        }
      });
    } else {
      console.log('Usuário admin já existe.');
    }
  });
}

function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco:', err.message);
    } else {
      console.log('Conexão com banco fechada.');
    }
  });
}

module.exports = {
  db,
  closeDatabase
};
