"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSkill = exports.updateSkill = exports.createSkill = exports.getSkillById = exports.getAllSkills = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Skill_js_1 = __importDefault(require("../models/Skill.js"));
const seedData_js_1 = require("../config/seedData.js");
const getAllSkills = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let skills = await Skill_js_1.default.find().sort({ order: 1, name: 1 });
            if (skills.length === 0) {
                await Skill_js_1.default.insertMany(seedData_js_1.initialSkills);
                skills = await Skill_js_1.default.find().sort({ order: 1, name: 1 });
            }
            return res.status(200).json({
                success: true,
                data: skills,
                count: skills.length,
                source: 'mongodb',
            });
        }
        return res.status(200).json({
            success: true,
            data: seedData_js_1.initialSkills,
            count: seedData_js_1.initialSkills.length,
            source: 'fallback_mock',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch skills',
            error: error.message,
        });
    }
};
exports.getAllSkills = getAllSkills;
const getSkillById = async (req, res) => {
    try {
        const item = await Skill_js_1.default.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }
        return res.status(200).json({ success: true, data: item });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch skill', error: error.message });
    }
};
exports.getSkillById = getSkillById;
const createSkill = async (req, res) => {
    try {
        const item = await Skill_js_1.default.create(req.body);
        return res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to create skill',
            error: error.message,
        });
    }
};
exports.createSkill = createSkill;
const updateSkill = async (req, res) => {
    try {
        const item = await Skill_js_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Skill updated successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update skill',
            error: error.message,
        });
    }
};
exports.updateSkill = updateSkill;
const deleteSkill = async (req, res) => {
    try {
        const item = await Skill_js_1.default.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Skill deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete skill',
            error: error.message,
        });
    }
};
exports.deleteSkill = deleteSkill;
