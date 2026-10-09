import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialLink extends Document {
  platform: string;
  url: string;
  icon: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const SocialLinkSchema: Schema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: 'bi-link-45deg' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SocialLink = mongoose.model<ISocialLink>('SocialLink', SocialLinkSchema);
export default SocialLink;
