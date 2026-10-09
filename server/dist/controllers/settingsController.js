"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const WebsiteSettings_js_1 = __importDefault(require("../models/WebsiteSettings.js"));
const seedData_js_1 = require("../config/seedData.js");
const getSettings = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let settings = await WebsiteSettings_js_1.default.findOne();
            if (!settings) {
                settings = await WebsiteSettings_js_1.default.create(seedData_js_1.initialSettings);
            }
            return res.status(200).json({
                success: true,
                data: settings,
                source: 'mongodb',
            });
        }
        return res.status(200).json({
            success: true,
            data: seedData_js_1.initialSettings,
            source: 'fallback_mock',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch settings',
            error: error.message,
            data: seedData_js_1.initialSettings,
        });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        let settings = await WebsiteSettings_js_1.default.findOne();
        if (!settings) {
            settings = await WebsiteSettings_js_1.default.create({ ...seedData_js_1.initialSettings, ...req.body });
        }
        else {
            if (req.body.sectionsVisibility) {
                settings.sectionsVisibility = {
                    ...settings.sectionsVisibility,
                    ...req.body.sectionsVisibility,
                };
                delete req.body.sectionsVisibility;
            }
            Object.assign(settings, req.body);
            await settings.save();
        }
        return res.status(200).json({
            success: true,
            message: 'Website settings updated successfully',
            data: settings,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update website settings',
            error: error.message,
        });
    }
};
exports.updateSettings = updateSettings;
