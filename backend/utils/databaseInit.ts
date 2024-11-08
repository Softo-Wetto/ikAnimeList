// src/utils/databaseInit.ts
import { sequelize } from '../models'; // Use named import for sequelize

const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced');
  } catch (error) {
    console.error('Database sync failed:', error);
  }
};

export default initializeDatabase;
