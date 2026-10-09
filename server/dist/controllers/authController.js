"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_js_1 = __importDefault(require("../models/Admin.js"));
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide both email and password.',
            });
            return;
        }
        const admin = await Admin_js_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
            return;
        }
        const secret = process.env.JWT_SECRET || 'supersecret_jwt_key_joyice_portfolio_2026';
        const token = jsonwebtoken_1.default.sign({
            id: admin._id,
            email: admin.email,
            role: admin.role,
            name: admin.name,
        }, secret, { expiresIn: '7d' });
        res.status(200).json({
            success: true,
            message: 'Logged in successfully.',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error logging in.',
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const admin = await Admin_js_1.default.findById(req.user.id).select('-password');
        if (!admin) {
            res.status(404).json({ success: false, message: 'Admin account not found.' });
            return;
        }
        res.status(200).json({
            success: true,
            admin,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving admin profile.',
        });
    }
};
exports.getMe = getMe;
const changePassword = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ success: false, message: 'Both current and new password are required.' });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
            return;
        }
        const admin = await Admin_js_1.default.findById(req.user.id);
        if (!admin) {
            res.status(404).json({ success: false, message: 'Admin not found.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(currentPassword, admin.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Incorrect current password.' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        admin.password = await bcryptjs_1.default.hash(newPassword, salt);
        await admin.save();
        res.status(200).json({
            success: true,
            message: 'Password changed successfully.',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error changing password.',
        });
    }
};
exports.changePassword = changePassword;
