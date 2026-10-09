"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Profile_js_1 = __importDefault(require("../models/Profile.js"));
const seedData_js_1 = require("../config/seedData.js");
const getProfile = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let profile = await Profile_js_1.default.findOne();
            if (!profile) {
                profile = await Profile_js_1.default.create(seedData_js_1.initialProfile);
            }
            return res.status(200).json({
                success: true,
                data: profile,
                source: 'mongodb',
            });
        }
        return res.status(200).json({
            success: true,
            data: seedData_js_1.initialProfile,
            source: 'fallback_mock',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message,
            data: seedData_js_1.initialProfile,
        });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database is disconnected. Cannot update profile in offline mode.',
            });
        }
        let profile = await Profile_js_1.default.findOne();
        if (!profile) {
            profile = await Profile_js_1.default.create({ ...seedData_js_1.initialProfile, ...req.body });
        }
        else {
            Object.assign(profile, req.body);
            await profile.save();
        }
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profile,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message,
        });
    }
};
exports.updateProfile = updateProfile;
