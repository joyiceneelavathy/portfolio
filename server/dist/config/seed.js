"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_js_1 = __importDefault(require("../models/Admin.js"));
const Profile_js_1 = __importDefault(require("../models/Profile.js"));
const About_js_1 = __importDefault(require("../models/About.js"));
const Education_js_1 = __importDefault(require("../models/Education.js"));
const Skill_js_1 = __importDefault(require("../models/Skill.js"));
const Project_js_1 = __importDefault(require("../models/Project.js"));
const Certificate_js_1 = __importDefault(require("../models/Certificate.js"));
const Experience_js_1 = __importDefault(require("../models/Experience.js"));
const Service_js_1 = __importDefault(require("../models/Service.js"));
const Resume_js_1 = __importDefault(require("../models/Resume.js"));
const SocialLink_js_1 = __importDefault(require("../models/SocialLink.js"));
const WebsiteSettings_js_1 = __importDefault(require("../models/WebsiteSettings.js"));
const seedData_js_1 = require("./seedData.js");
const seedDatabase = async () => {
    if (mongoose_1.default.connection.readyState !== 1) {
        console.log('ℹ️ [DB Seed] MongoDB not connected; skipping DB collection seed.');
        return;
    }
    try {
        // 0. Seed Admin
        const adminCount = await Admin_js_1.default.countDocuments();
        if (adminCount === 0) {
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(seedData_js_1.initialAdmin.password, salt);
            await Admin_js_1.default.create({
                ...seedData_js_1.initialAdmin,
                password: hashedPassword,
            });
            console.log(`✅ [DB Seed] Admin user seeded: ${seedData_js_1.initialAdmin.email} / ${seedData_js_1.initialAdmin.password}`);
        }
        // 1. Seed Profile
        const profileCount = await Profile_js_1.default.countDocuments();
        if (profileCount === 0) {
            await Profile_js_1.default.create(seedData_js_1.initialProfile);
            console.log('✅ [DB Seed] Profile seeded.');
        }
        // 2. Seed About
        const aboutCount = await About_js_1.default.countDocuments();
        if (aboutCount === 0) {
            await About_js_1.default.create(seedData_js_1.initialAbout);
            console.log('✅ [DB Seed] About section seeded.');
        }
        // 3. Seed Education
        const educationCount = await Education_js_1.default.countDocuments();
        if (educationCount === 0) {
            await Education_js_1.default.insertMany(seedData_js_1.initialEducation);
            console.log('✅ [DB Seed] Education records seeded.');
        }
        // 4. Seed Skills
        const skillCount = await Skill_js_1.default.countDocuments();
        if (skillCount === 0) {
            await Skill_js_1.default.insertMany(seedData_js_1.initialSkills);
            console.log('✅ [DB Seed] Skills seeded.');
        }
        // 5. Seed Projects
        const projectCount = await Project_js_1.default.countDocuments();
        if (projectCount === 0) {
            await Project_js_1.default.insertMany(seedData_js_1.initialProjects);
            console.log('✅ [DB Seed] Projects seeded.');
        }
        // 6. Seed Certificates
        const certificateCount = await Certificate_js_1.default.countDocuments();
        if (certificateCount === 0) {
            await Certificate_js_1.default.insertMany(seedData_js_1.initialCertificates);
            console.log('✅ [DB Seed] Certificates seeded.');
        }
        // 7. Seed Experience
        const experienceCount = await Experience_js_1.default.countDocuments();
        if (experienceCount === 0) {
            await Experience_js_1.default.insertMany(seedData_js_1.initialExperience);
            console.log('✅ [DB Seed] Experience seeded.');
        }
        // 8. Seed Services
        const serviceCount = await Service_js_1.default.countDocuments();
        if (serviceCount === 0) {
            await Service_js_1.default.insertMany(seedData_js_1.initialServices);
            console.log('✅ [DB Seed] Services seeded.');
        }
        // 9. Seed Resume
        const resumeCount = await Resume_js_1.default.countDocuments();
        if (resumeCount === 0) {
            await Resume_js_1.default.create(seedData_js_1.initialResume);
            console.log('✅ [DB Seed] Resume seeded.');
        }
        // 10. Seed Social Links
        const socialCount = await SocialLink_js_1.default.countDocuments();
        if (socialCount === 0) {
            await SocialLink_js_1.default.insertMany(seedData_js_1.initialSocialLinks);
            console.log('✅ [DB Seed] Social links seeded.');
        }
        // 11. Seed Settings
        const settingsCount = await WebsiteSettings_js_1.default.countDocuments();
        if (settingsCount === 0) {
            await WebsiteSettings_js_1.default.create(seedData_js_1.initialSettings);
            console.log('✅ [DB Seed] Website settings seeded.');
        }
        console.log('🎉 [DB Seed] Full-stack CMS data synchronization complete.');
    }
    catch (err) {
        console.error('❌ [DB Seed] Error during database seeding:', err.message);
    }
};
exports.seedDatabase = seedDatabase;
