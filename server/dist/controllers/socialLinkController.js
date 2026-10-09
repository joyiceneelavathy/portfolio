"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSocialLink = exports.updateSocialLink = exports.createSocialLink = exports.getSocialLinkById = exports.getAllSocialLinks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SocialLink_js_1 = __importDefault(require("../models/SocialLink.js"));
const seedData_js_1 = require("../config/seedData.js");
const getAllSocialLinks = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let items = await SocialLink_js_1.default.find().sort({ order: 1 });
            if (items.length === 0) {
                await SocialLink_js_1.default.insertMany(seedData_js_1.initialSocialLinks);
                items = await SocialLink_js_1.default.find().sort({ order: 1 });
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
            data: seedData_js_1.initialSocialLinks,
            count: seedData_js_1.initialSocialLinks.length,
            source: 'fallback_mock',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch social links',
            error: error.message,
        });
    }
};
exports.getAllSocialLinks = getAllSocialLinks;
const getSocialLinkById = async (req, res) => {
    try {
        const item = await SocialLink_js_1.default.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Social link not found' });
        }
        return res.status(200).json({ success: true, data: item });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch social link', error: error.message });
    }
};
exports.getSocialLinkById = getSocialLinkById;
const createSocialLink = async (req, res) => {
    try {
        const item = await SocialLink_js_1.default.create(req.body);
        return res.status(201).json({
            success: true,
            message: 'Social link created successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to create social link',
            error: error.message,
        });
    }
};
exports.createSocialLink = createSocialLink;
const updateSocialLink = async (req, res) => {
    try {
        const item = await SocialLink_js_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Social link not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Social link updated successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update social link',
            error: error.message,
        });
    }
};
exports.updateSocialLink = updateSocialLink;
const deleteSocialLink = async (req, res) => {
    try {
        const item = await SocialLink_js_1.default.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Social link not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Social link deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete social link',
            error: error.message,
        });
    }
};
exports.deleteSocialLink = deleteSocialLink;
