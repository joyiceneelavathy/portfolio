import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  icon: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'bi-code-square' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);
export default Service;
