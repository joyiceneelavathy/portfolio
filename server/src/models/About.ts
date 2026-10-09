import mongoose, { Schema, Document } from 'mongoose';

export interface IAbout extends Document {
  title: string;
  description: string;
  careerGoal: string;
  professionalSummary: string;
  personalIntroduction: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AboutSchema: Schema = new Schema(
  {
    title: { type: String, required: true, default: 'About Me' },
    description: { type: String, required: true },
    careerGoal: { type: String, required: true },
    professionalSummary: { type: String, required: true },
    personalIntroduction: { type: String, required: true },
  },
  { timestamps: true }
);

export const About = mongoose.model<IAbout>('About', AboutSchema);
export default About;
