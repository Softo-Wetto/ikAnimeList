// src/models/index.ts
import { Sequelize } from 'sequelize';
import config from '../config/config';
import User from './user';

const sequelize = new Sequelize(config.development);

// Export sequelize instance and User model
export { sequelize, User };
