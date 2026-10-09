import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  fullDescription?: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  liveDemoUrl: string;
  startDate?: string;
  endDate?: string;
  category: string;
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80' },
    githubUrl: { type: String, default: '#' },
    liveDemoUrl: { type: String, default: '#' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    category: { type: String, default: 'Web Application' },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
