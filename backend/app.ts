// app.ts
import express from 'express';
import authRoutes from './routes/authRoutes';
import initializeDatabase from './utils/databaseInit';
import setupDatabase from './utils/dbSetup';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Run setupDatabase before initializing Sequelize and starting the server
setupDatabase()
.then(() => {
    // Initialize database tables if the database exists
    return initializeDatabase();
})
.then(() => {
    // Routes
    app.use('/api/auth', authRoutes);

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
