"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.getAllServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Service_js_1 = __importDefault(require("../models/Service.js"));
const seedData_js_1 = require("../config/seedData.js");
const getAllServices = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let items = await Service_js_1.default.find().sort({ order: 1 });
            if (items.length === 0) {
                await Service_js_1.default.insertMany(seedData_js_1.initialServices);
                items = await Service_js_1.default.find().sort({ order: 1 });
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
            data: seedData_js_1.initialServices,
            count: seedData_js_1.initialServices.length,
            source: 'fallback_mock',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error.message,
        });
    }
};
exports.getAllServices = getAllServices;
const getServiceById = async (req, res) => {
    try {
        const item = await Service_js_1.default.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        return res.status(200).json({ success: true, data: item });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch service', error: error.message });
    }
};
exports.getServiceById = getServiceById;
const createService = async (req, res) => {
    try {
        const item = await Service_js_1.default.create(req.body);
        return res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to create service',
            error: error.message,
        });
    }
};
exports.createService = createService;
const updateService = async (req, res) => {
    try {
        const item = await Service_js_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update service',
            error: error.message,
        });
    }
};
exports.updateService = updateService;
const deleteService = async (req, res) => {
    try {
        const item = await Service_js_1.default.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Service deleted successfully',
            data: item,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete service',
            error: error.message,
        });
    }
};
exports.deleteService = deleteService;
