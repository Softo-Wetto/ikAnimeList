// config/config.ts
import dotenv from 'dotenv';
import { Dialect } from 'sequelize'; // Import Dialect type
dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ikAnimeList',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql' as Dialect,  // Explicitly cast to Dialect
  },
};

export default config;
