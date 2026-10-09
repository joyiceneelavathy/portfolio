import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  avatarUrl: string;
  title: string;
  subtitle?: string;
  shortIntro: string;
  aboutDescription: string;
  bio?: string;
  email: string;
  phone?: string;
  location: string;
  resumeUrl?: string;
  isVisible: boolean;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string[];
  careerInterests?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ProfileSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
export default Profile;
