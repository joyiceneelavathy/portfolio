"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Project_js_1 = require("../models/Project.js");
const seedData_js_1 = require("../config/seedData.js");
// In-memory fallback if MongoDB is not running
let memoryProjects = seedData_js_1.initialProjects.map((p, idx) => ({
    ...p,
    _id: `mem-proj-${idx + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}));
const getProjects = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let projects = await Project_js_1.Project.find().sort({ order: 1, createdAt: -1 });
            if (projects.length === 0) {
                await Project_js_1.Project.insertMany(seedData_js_1.initialProjects);
                projects = await Project_js_1.Project.find().sort({ order: 1, createdAt: -1 });
            }
            return res.status(200).json({
                success: true,
                count: projects.length,
                data: projects,
                source: 'mongodb'
            });
        }
        return res.status(200).json({
            success: true,
            count: memoryProjects.length,
            data: memoryProjects,
            source: 'memory_fallback',
            notice: 'MongoDB offline; serving in-memory project data.'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve projects',
            error: error.message,
            data: memoryProjects
        });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose_1.default.connection.readyState === 1) {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: 'Invalid project ID format' });
            }
            const project = await Project_js_1.Project.findById(id);
            if (!project) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }
            return res.status(200).json({ success: true, data: project });
        }
        const memProj = memoryProjects.find((p) => p._id === id);
        if (!memProj) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        return res.status(200).json({ success: true, data: memProj });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get project', error: error.message });
    }
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
    try {
        const { title, description, technologies, imageUrl, githubUrl, liveDemoUrl, featured, category, order } = req.body;
        if (!title || !description || !technologies || !imageUrl || !githubUrl) {
            return res.status(400).json({
                success: false,
                message: 'Required fields missing: title, description, technologies, imageUrl, githubUrl'
            });
        }
        const techArray = Array.isArray(technologies)
            ? technologies
            : String(technologies).split(',').map((t) => t.trim());
        if (mongoose_1.default.connection.readyState === 1) {
            const newProject = await Project_js_1.Project.create({
                title,
                description,
                technologies: techArray,
                imageUrl,
                githubUrl,
                liveDemoUrl: liveDemoUrl || '#',
                featured: featured ?? true,
                category: category || 'Web Development',
                order: order || 0
            });
            return res.status(201).json({
                success: true,
                message: 'Project created successfully in MongoDB',
                data: newProject
            });
        }
        const newMemProject = {
            _id: `mem-proj-${Date.now()}`,
            title,
            description,
            fullDescription: req.body.fullDescription || '',
            technologies: techArray,
            imageUrl,
            githubUrl,
            liveDemoUrl: liveDemoUrl || '#',
            featured: featured ?? true,
            category: category || 'Web Development',
            order: order || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        memoryProjects.unshift(newMemProject);
        return res.status(201).json({
            success: true,
            message: 'Project created in memory (MongoDB offline)',
            data: newMemProject
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to create project',
            error: error.message
        });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose_1.default.connection.readyState === 1) {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: 'Invalid project ID format' });
            }
            const updated = await Project_js_1.Project.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }
            return res.status(200).json({
                success: true,
                message: 'Project updated successfully in MongoDB',
                data: updated
            });
        }
        const index = memoryProjects.findIndex((p) => p._id === id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        memoryProjects[index] = { ...memoryProjects[index], ...req.body, updatedAt: new Date().toISOString() };
        return res.status(200).json({
            success: true,
            message: 'Project updated in memory (MongoDB offline)',
            data: memoryProjects[index]
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update project',
            error: error.message
        });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose_1.default.connection.readyState === 1) {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: 'Invalid project ID' });
            }
            const deleted = await Project_js_1.Project.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }
            return res.status(200).json({
                success: true,
                message: 'Project deleted successfully from MongoDB',
                data: deleted
            });
        }
        const index = memoryProjects.findIndex((p) => p._id === id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        const removed = memoryProjects.splice(index, 1)[0];
        return res.status(200).json({
            success: true,
            message: 'Project deleted from memory',
            data: removed
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete project',
            error: error.message
        });
    }
};
exports.deleteProject = deleteProject;
