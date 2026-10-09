"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEducation = exports.updateEducation = exports.createEducation = exports.getEducationById = exports.getAllEducation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Education_js_1 = __importDefault(require("../models/Education.js"));
const seedData_js_1 = require("../config/seedData.js");
const getAllEducation = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let educationList = await Education_js_1.default.find().sort({ order: 1, startYear: -1 });
            if (educationList.length === 0) {
                await Education_js_1.default.insertMany(seedData_js_1.initialEducation);
                educationList = await Education_js_1.default.find().sort({ order: 1, startYear: -1 });
            }
            return res.status(200).json({
                success: true,
                data: educationList,
                count: educationList.length,
                source: 'mongodb',
            });
        }
        return res.status(200).json({
            success: true,
            data: seedData_js_1.initialEducation,
            count: seedData_js_1.initialEducation.length,
            source: 'fallback_mock',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch education records',
            error: error.message,
        });
    }
};
exports.getAllEducation = getAllEducation;
const getEducationById = async (req, res) => {
    try {
        const item = await Education_js_1.default.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Education record not found' });
        }
        return res.status(200).json({ success: true, data: item });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch education record', error: error.message });
    }
};
exports.getEducationById = getEducationById;
const createEducation = async (req, res) => {
    try {
        const item = await Education_js_1.default.create(req.body);
        return res.status(201).json({
            success: true,
            message: 'Education record created successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to create education record',
            error: error.message,
        });
    }
};
exports.createEducation = createEducation;
const updateEducation = async (req, res) => {
    try {
        const item = await Education_js_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Education record not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Education record updated successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update education record',
            error: error.message,
        });
    }
};
exports.updateEducation = updateEducation;
const deleteEducation = async (req, res) => {
    try {
        const item = await Education_js_1.default.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Education record not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Education record deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete education record',
            error: error.message,
        });
    }
};
exports.deleteEducation = deleteEducation;
