"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDBStatus = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let isConnected = false;
const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/joyice_portfolio';
    try {
        const conn = await mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host} (Database: ${conn.connection.name})`);
        return true;
    }
    catch (error) {
        isConnected = false;
        console.warn(`⚠️ [MongoDB] Connection Warning: Could not connect to MongoDB at ${mongoURI}`);
        console.warn(`⚠️ [MongoDB] Reason: ${error.message}`);
        console.warn(`ℹ️ [MongoDB] If local MongoDB is not running, the server will continue running and provide fallback mock data so the app stays functional. To connect MongoDB, make sure MongoDB Service is running or update MONGODB_URI in server/.env`);
        return false;
    }
};
exports.connectDB = connectDB;
mongoose_1.default.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('⚠️ [MongoDB] Connection lost. Attempting reconnection...');
});
mongoose_1.default.connection.on('reconnected', () => {
    isConnected = true;
    console.log('✅ [MongoDB] Reconnected successfully.');
});
const getDBStatus = () => ({
    connected: mongoose_1.default.connection.readyState === 1,
    readyState: mongoose_1.default.connection.readyState,
    host: mongoose_1.default.connection.host || null,
    name: mongoose_1.default.connection.name || null,
});
exports.getDBStatus = getDBStatus;
