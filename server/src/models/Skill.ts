import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  level: string;
  percentage: number;
  icon: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const SkillSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      default: 'Frontend',
      enum: ['Frontend', 'Backend', 'Programming Languages', 'Databases', 'Tools & Platforms', 'Other'],
    },
    level: {
      type: String,
      default: 'Intermediate',
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    },
    percentage: { type: Number, default: 80, min: 0, max: 100 },
    icon: { type: String, default: 'bi-code-slash' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
export default Skill;
