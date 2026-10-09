import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'Joyice Neelavathy',
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin', 'superadmin'],
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
