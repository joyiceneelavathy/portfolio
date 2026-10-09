import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Profile from '../models/Profile.js';
import About from '../models/About.js';
import Education from '../models/Education.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Certificate from '../models/Certificate.js';
import Experience from '../models/Experience.js';
import Service from '../models/Service.js';
import Resume from '../models/Resume.js';
import SocialLink from '../models/SocialLink.js';
import WebsiteSettings from '../models/WebsiteSettings.js';
import {
  initialAdmin,
  initialProfile,
  initialAbout,
  initialEducation,
  initialSkills,
  initialProjects,
  initialCertificates,
  initialExperience,
  initialServices,
  initialResume,
  initialSocialLinks,
  initialSettings,
} from './seedData.js';

export const seedDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log('ℹ️ [DB Seed] MongoDB not connected; skipping DB collection seed.');
    return;
  }

  try {
    // 0. Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(initialAdmin.password, salt);
      await Admin.create({
        ...initialAdmin,
        password: hashedPassword,
      });
      console.log(`✅ [DB Seed] Admin user seeded: ${initialAdmin.email} / ${initialAdmin.password}`);
    }

    // 1. Seed Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create(initialProfile);
      console.log('✅ [DB Seed] Profile seeded.');
    }

    // 2. Seed About
    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
      await About.create(initialAbout);
      console.log('✅ [DB Seed] About section seeded.');
    }

    // 3. Seed Education
    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      await Education.insertMany(initialEducation);
      console.log('✅ [DB Seed] Education records seeded.');
    }

    // 4. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(initialSkills);
      console.log('✅ [DB Seed] Skills seeded.');
    }

    // 5. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(initialProjects);
      console.log('✅ [DB Seed] Projects seeded.');
    }

    // 6. Seed Certificates
    const certificateCount = await Certificate.countDocuments();
    if (certificateCount === 0) {
      await Certificate.insertMany(initialCertificates);
      console.log('✅ [DB Seed] Certificates seeded.');
    }

    // 7. Seed Experience
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      await Experience.insertMany(initialExperience);
      console.log('✅ [DB Seed] Experience seeded.');
    }

    // 8. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(initialServices);
      console.log('✅ [DB Seed] Services seeded.');
    }

    // 9. Seed Resume
    const resumeCount = await Resume.countDocuments();
    if (resumeCount === 0) {
      await Resume.create(initialResume);
      console.log('✅ [DB Seed] Resume seeded.');
    }

    // 10. Seed Social Links
    const socialCount = await SocialLink.countDocuments();
    if (socialCount === 0) {
      await SocialLink.insertMany(initialSocialLinks);
      console.log('✅ [DB Seed] Social links seeded.');
    }

    // 11. Seed Settings
    const settingsCount = await WebsiteSettings.countDocuments();
    if (settingsCount === 0) {
      await WebsiteSettings.create(initialSettings);
      console.log('✅ [DB Seed] Website settings seeded.');
    }

    console.log('🎉 [DB Seed] Full-stack CMS data synchronization complete.');
  } catch (err: any) {
    console.error('❌ [DB Seed] Error during database seeding:', err.message);
  }
};
