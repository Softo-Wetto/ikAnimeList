"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/utils/databaseInit.ts
const models_1 = require("../models"); // Use named import for sequelize
const initializeDatabase = async () => {
    try {
        await models_1.sequelize.sync({ force: false });
        console.log('Database synced');
    }
    catch (error) {
        console.error('Database sync failed:', error);
    }
};
exports.default = initializeDatabase;
