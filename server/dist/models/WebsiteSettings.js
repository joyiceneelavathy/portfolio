"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteSettings = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const WebsiteSettingsSchema = new mongoose_1.Schema({
    websiteTitle: { type: String, default: 'Joyice Neelavathy | Full-Stack Developer' },
    logoText: { type: String, default: 'Joyice.dev' },
    heroTitle: { type: String, default: 'Hi, I am Joyice Neelavathy' },
    heroSubtitle: { type: String, default: 'Passionate Full-Stack Developer & Software Engineer' },
    footerText: { type: String, default: 'Crafted with passion using React, Node.js & MongoDB.' },
    contactEmail: { type: String, default: 'joyiceneelavathy06@gmail.com' },
    theme: { type: String, default: 'blue-modern' },
    sectionsVisibility: {
        about: { type: Boolean, default: true },
        education: { type: Boolean, default: true },
        skills: { type: Boolean, default: true },
        projects: { type: Boolean, default: true },
        certificates: { type: Boolean, default: true },
        experience: { type: Boolean, default: true },
        services: { type: Boolean, default: true },
        resume: { type: Boolean, default: true },
        contact: { type: Boolean, default: true },
    },
}, { timestamps: true });
exports.WebsiteSettings = mongoose_1.default.model('WebsiteSettings', WebsiteSettingsSchema);
exports.default = exports.WebsiteSettings;
