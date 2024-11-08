"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/user.ts
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("./index"); // Import sequelize instance as named import
class User extends sequelize_1.Model {
}
// Initialize the User model
User.init({
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: index_1.sequelize,
    modelName: 'User',
    tableName: 'users', // Optional: specify table name
});
// Add password hashing before creating a user
User.beforeCreate(async (user) => {
    user.password = await bcryptjs_1.default.hash(user.password, 10);
});
exports.default = User;
