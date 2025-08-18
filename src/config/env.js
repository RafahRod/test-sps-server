require('dotenv').config();

const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN 
};

if (!config.PORT || !config.JWT_SECRET || !config.JWT_EXPIRES_IN) {
  throw new Error('Missings environment variables.');
}

module.exports = config;