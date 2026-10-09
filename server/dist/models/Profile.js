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
exports.Profile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProfileSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    title: { type: String, required: true, default: 'Full-Stack Developer & Software Engineer' },
    subtitle: { type: String, default: 'B.Tech Information Technology Student' },
    shortIntro: { type: String, default: 'Passionate software developer building modern, scalable web applications with React, Node.js, and MongoDB.' },
    aboutDescription: { type: String, default: 'I am a passionate software developer focused on modern web architectures, cloud applications, and responsive design.' },
    bio: { type: String, default: 'Passionate software developer' },
    email: { type: String, required: true },
    phone: { type: String, default: '+91 98765 43210' },
    location: { type: String, default: 'Chennai, India' },
    resumeUrl: { type: String, default: '/resume.pdf' },
    isVisible: { type: Boolean, default: true },
    linkedinUrl: { type: String, default: 'https://linkedin.com' },
    githubUrl: { type: String, default: 'https://github.com' },
    skills: { type: [String], default: [] },
    careerInterests: { type: [String], default: [] },
}, { timestamps: true });
exports.Profile = mongoose_1.default.model('Profile', ProfileSchema);
exports.default = exports.Profile;
