import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  title: string;
  fileUrl: string;
  summary: string;
  skillsOverview?: string[];
  experienceSummary?: string;
  educationSummary?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    title: { type: String, default: 'Joyice Neelavathy - Resume' },
    fileUrl: { type: String, default: '/resume.pdf' },
    summary: {
      type: String,
      default:
        'Passionate Information Technology student with hands-on expertise in full-stack web engineering, React, TypeScript, Node.js, and MongoDB. Proven track record of developing functional applications and seeking software engineering roles.',
    },
    skillsOverview: { type: [String], default: ['Full-Stack Development', 'React & TypeScript', 'Node.js & Express', 'MongoDB & Mongoose', 'REST API Design'] },
    experienceSummary: { type: String, default: 'Software engineering enthusiast with multiple full-stack project implementations.' },
    educationSummary: { type: String, default: 'B.Tech in Information Technology' },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
export default Resume;
