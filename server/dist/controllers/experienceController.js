"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExperience = exports.updateExperience = exports.createExperience = exports.getExperienceById = exports.getAllExperience = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Experience_js_1 = __importDefault(require("../models/Experience.js"));
const seedData_js_1 = require("../config/seedData.js");
const getAllExperience = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let items = await Experience_js_1.default.find().sort({ order: 1, startDate: -1 });
            if (items.length === 0) {
                await Experience_js_1.default.insertMany(seedData_js_1.initialExperience);
                items = await Experience_js_1.default.find().sort({ order: 1, startDate: -1 });
            }
            return res.status(200).json({
                success: true,
                data: items,
                count: items.length,
                source: 'mongodb',
            });
        }
        return res.status(200).json({
            success: true,
            data: seedData_js_1.initialExperience,
            count: seedData_js_1.initialExperience.length,
            source: 'fallback_mock',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch experience records',
            error: error.message,
        });
    }
};
exports.getAllExperience = getAllExperience;
const getExperienceById = async (req, res) => {
    try {
        const item = await Experience_js_1.default.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Experience record not found' });
        }
        return res.status(200).json({ success: true, data: item });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch experience', error: error.message });
    }
};
exports.getExperienceById = getExperienceById;
const createExperience = async (req, res) => {
    try {
        const techArray = Array.isArray(req.body.technologies)
            ? req.body.technologies
            : req.body.technologies ? String(req.body.technologies).split(',').map((t) => t.trim()) : [];
        const item = await Experience_js_1.default.create({
            ...req.body,
            technologies: techArray,
        });
        return res.status(201).json({
            success: true,
            message: 'Experience created successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to create experience',
            error: error.message,
        });
    }
};
exports.createExperience = createExperience;
const updateExperience = async (req, res) => {
    try {
        const techArray = Array.isArray(req.body.technologies)
            ? req.body.technologies
            : req.body.technologies ? String(req.body.technologies).split(',').map((t) => t.trim()) : undefined;
        const updatePayload = { ...req.body };
        if (techArray !== undefined) {
            updatePayload.technologies = techArray;
        }
        const item = await Experience_js_1.default.findByIdAndUpdate(req.params.id, updatePayload, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Experience record not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Experience updated successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update experience',
            error: error.message,
        });
    }
};
exports.updateExperience = updateExperience;
const deleteExperience = async (req, res) => {
    try {
        const item = await Experience_js_1.default.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Experience record not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Experience deleted successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete experience',
            error: error.message,
        });
    }
};
exports.deleteExperience = deleteExperience;
