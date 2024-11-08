"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const databaseInit_1 = __importDefault(require("./utils/databaseInit"));
const dbSetup_1 = __importDefault(require("./utils/dbSetup"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Run setupDatabase before initializing Sequelize and starting the server
(0, dbSetup_1.default)()
    .then(() => {
    // Initialize database tables if the database exists
    return (0, databaseInit_1.default)();
})
    .then(() => {
    // Routes
    app.use('/api/auth', authRoutes_1.default);
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Failed to set up database or initialize Sequelize:", error);
    process.exit(1); // Exit if there was a setup error
});
