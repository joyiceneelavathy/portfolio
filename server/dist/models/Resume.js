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
exports.Resume = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ResumeSchema = new mongoose_1.Schema({
    title: { type: String, default: 'Joyice Neelavathy - Resume' },
    fileUrl: { type: String, default: '/resume.pdf' },
    summary: {
        type: String,
        default: 'Passionate Information Technology student with hands-on expertise in full-stack web engineering, React, TypeScript, Node.js, and MongoDB. Proven track record of developing functional applications and seeking software engineering roles.',
    },
    skillsOverview: { type: [String], default: ['Full-Stack Development', 'React & TypeScript', 'Node.js & Express', 'MongoDB & Mongoose', 'REST API Design'] },
    experienceSummary: { type: String, default: 'Software engineering enthusiast with multiple full-stack project implementations.' },
    educationSummary: { type: String, default: 'B.Tech in Information Technology' },
}, { timestamps: true });
exports.Resume = mongoose_1.default.model('Resume', ResumeSchema);
exports.default = exports.Resume;
