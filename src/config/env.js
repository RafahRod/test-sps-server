require('dotenv').config();

const config = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'
};

if (!config.JWT_SECRET) {
  throw new Error('JWT_SECRET é obrigatório no arquivo .env');
}

module.exports = config;