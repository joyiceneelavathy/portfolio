"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResume = exports.getResume = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Resume_js_1 = __importDefault(require("../models/Resume.js"));
const seedData_js_1 = require("../config/seedData.js");
const getResume = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let item = await Resume_js_1.default.findOne();
            if (!item) {
                item = await Resume_js_1.default.create(seedData_js_1.initialResume);
            }
            return res.status(200).json({
                success: true,
                data: item,
                source: 'mongodb',
            });
        }
        return res.status(200).json({
            success: true,
            data: seedData_js_1.initialResume,
            source: 'fallback_mock',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch resume',
            error: error.message,
            data: seedData_js_1.initialResume,
        });
    }
};
exports.getResume = getResume;
const updateResume = async (req, res) => {
    try {
        let item = await Resume_js_1.default.findOne();
        if (!item) {
            item = await Resume_js_1.default.create({ ...seedData_js_1.initialResume, ...req.body });
        }
        else {
            Object.assign(item, req.body);
            await item.save();
        }
        return res.status(200).json({
            success: true,
            message: 'Resume information updated successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update resume',
            error: error.message,
        });
    }
};
exports.updateResume = updateResume;
