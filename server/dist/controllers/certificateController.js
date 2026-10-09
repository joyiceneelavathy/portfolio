"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCertificate = exports.updateCertificate = exports.createCertificate = exports.getCertificateById = exports.getCertificates = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Certificate_js_1 = __importDefault(require("../models/Certificate.js"));
const seedData_js_1 = require("../config/seedData.js");
const getCertificates = async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let certs = await Certificate_js_1.default.find().sort({ createdAt: -1 });
            if (certs.length === 0) {
                await Certificate_js_1.default.insertMany(seedData_js_1.initialCertificates);
                certs = await Certificate_js_1.default.find().sort({ createdAt: -1 });
            }
            return res.status(200).json({
                success: true,
                count: certs.length,
                data: certs,
                source: 'mongodb',
            });
        }
        return res.status(200).json({
            success: true,
            count: seedData_js_1.initialCertificates.length,
            data: seedData_js_1.initialCertificates,
            source: 'fallback_mock',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve certificates',
            error: error.message,
        });
    }
};
exports.getCertificates = getCertificates;
const getCertificateById = async (req, res) => {
    try {
        const cert = await Certificate_js_1.default.findById(req.params.id);
        if (!cert) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }
        return res.status(200).json({ success: true, data: cert });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get certificate', error: error.message });
    }
};
exports.getCertificateById = getCertificateById;
const createCertificate = async (req, res) => {
    try {
        const { name, title, issuingOrganization, issueDate, certificateId, credentialUrl, imageUrl, pdfUrl, description } = req.body;
        const certName = name || title;
        if (!certName || !issuingOrganization || !issueDate) {
            return res.status(400).json({
                success: false,
                message: 'Required fields missing: name/title, issuingOrganization, issueDate',
            });
        }
        const newCert = await Certificate_js_1.default.create({
            name: certName,
            issuingOrganization,
            issueDate,
            certificateId: certificateId || '',
            credentialUrl: credentialUrl || '#',
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
            pdfUrl: pdfUrl || '',
            description: description || '',
        });
        return res.status(201).json({
            success: true,
            message: 'Certificate created successfully',
            data: newCert,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to create certificate',
            error: error.message,
        });
    }
};
exports.createCertificate = createCertificate;
const updateCertificate = async (req, res) => {
    try {
        const { name, title } = req.body;
        const updateData = { ...req.body };
        if (!updateData.name && title) {
            updateData.name = title;
        }
        const updated = await Certificate_js_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Certificate updated successfully',
            data: updated,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update certificate',
            error: error.message,
        });
    }
};
exports.updateCertificate = updateCertificate;
const deleteCertificate = async (req, res) => {
    try {
        const deleted = await Certificate_js_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Certificate deleted successfully',
            data: deleted,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete certificate',
            error: error.message,
        });
    }
};
exports.deleteCertificate = deleteCertificate;
