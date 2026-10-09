"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAbout = exports.getAbout = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const About_js_1 = __importDefault(require("../models/About.js"));
const seedData_js_1 = require("../config/seedData.js");
const getAbout = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let about = await About_js_1.default.findOne();
            if (!about) {
                about = await About_js_1.default.create(seedData_js_1.initialAbout);
            }
            return res.status(200).json({
                success: true,
                data: about,
                source: 'mongodb',
            });
        }
        return res.status(200).json({
            success: true,
            data: seedData_js_1.initialAbout,
            source: 'fallback_mock',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch about information',
            error: error.message,
            data: seedData_js_1.initialAbout,
        });
    }
};
exports.getAbout = getAbout;
const updateAbout = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database is disconnected.',
            });
        }
        let about = await About_js_1.default.findOne();
        if (!about) {
            about = await About_js_1.default.create({ ...seedData_js_1.initialAbout, ...req.body });
        }
        else {
            Object.assign(about, req.body);
            await about.save();
        }
        return res.status(200).json({
            success: true,
            message: 'About information updated successfully',
            data: about,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update about information',
            error: error.message,
        });
    }
};
exports.updateAbout = updateAbout;
