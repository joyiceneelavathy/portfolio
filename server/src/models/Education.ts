import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
  degree: string;
  department: string;
  institution: string;
  startYear: string;
  endYear: string;
  description?: string;
  percentageOrCgpa: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const EducationSchema: Schema = new Schema(
  {
    degree: { type: String, required: true },
    department: { type: String, required: true },
    institution: { type: String, required: true },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true },
    description: { type: String, default: '' },
    percentageOrCgpa: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Education = mongoose.model<IEducation>('Education', EducationSchema);
export default Education;
