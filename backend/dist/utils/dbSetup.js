"use strict";
// backend/utils/dbSetup.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, } = process.env;
async function setupDatabase() {
    try {
        // Connect to MySQL using the specified user credentials
        const connection = await promise_1.default.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
        });
        // Check if the database exists; if not, create it
        const [databases] = await connection.query(`SHOW DATABASES LIKE '${DB_NAME}'`);
        if (databases.length === 0) {
            await connection.query(`CREATE DATABASE ${DB_NAME}`);
            console.log(`Database ${DB_NAME} created successfully.`);
        }
        else {
            console.log(`Database ${DB_NAME} already exists.`);
        }
        // Close the connection
        await connection.end();
    }
    catch (error) { // Explicitly typing error as any for TypeScript compatibility
        console.error("Error setting up database:", error);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error("Access denied. Please ensure the user in .env has sufficient privileges to create databases.");
        }
        throw error; // Rethrow the error to prevent server startup
    }
}
exports.default = setupDatabase;
