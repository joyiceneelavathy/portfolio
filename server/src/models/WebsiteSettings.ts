import mongoose, { Schema, Document } from 'mongoose';

export interface ISectionsVisibility {
  about: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  certificates: boolean;
  experience: boolean;
  services: boolean;
  resume: boolean;
  contact: boolean;
}

export interface IWebsiteSettings extends Document {
  websiteTitle: string;
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
  contactEmail: string;
  theme: string;
  sectionsVisibility: ISectionsVisibility;
  createdAt?: Date;
  updatedAt?: Date;
}

const WebsiteSettingsSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

export const WebsiteSettings = mongoose.model<IWebsiteSettings>('WebsiteSettings', WebsiteSettingsSchema);
export default WebsiteSettings;
