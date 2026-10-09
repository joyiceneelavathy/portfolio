import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
  technologies: string[];
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ExperienceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    startDate: { type: String, required: true },
    endDate: { type: String, default: '' },
    currentlyWorking: { type: Boolean, default: false },
    description: { type: String, required: true },
    technologies: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);
export default Experience;
