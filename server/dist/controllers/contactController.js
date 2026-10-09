"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.markAsRead = exports.getContacts = exports.submitContact = void 0;
const Contact_js_1 = __importDefault(require("../models/Contact.js"));
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Name is required and must be at least 2 characters long',
            });
        }
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!email || !emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: 'A valid email address is required',
            });
        }
        if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Subject is required and must be at least 3 characters long',
            });
        }
        if (!message || typeof message !== 'string' || message.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Message is required and must be at least 5 characters long',
            });
        }
        const trimmedData = {
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            isRead: false,
        };
        const contactDoc = await Contact_js_1.default.create(trimmedData);
        return res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been received successfully.',
            data: contactDoc,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while submitting your message',
            error: error.message,
        });
    }
};
exports.submitContact = submitContact;
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact_js_1.default.find().sort({ createdAt: -1 });
        const unreadCount = await Contact_js_1.default.countDocuments({ isRead: false });
        return res.status(200).json({
            success: true,
            count: contacts.length,
            unreadCount,
            data: contacts,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve messages',
            error: error.message,
        });
    }
};
exports.getContacts = getContacts;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { isRead } = req.body;
        const contact = await Contact_js_1.default.findByIdAndUpdate(id, { isRead: isRead !== undefined ? isRead : true }, { new: true });
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Message status updated',
            data: contact,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update message status',
            error: error.message,
        });
    }
};
exports.markAsRead = markAsRead;
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact_js_1.default.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Message deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: error.message,
        });
    }
};
exports.deleteContact = deleteContact;
