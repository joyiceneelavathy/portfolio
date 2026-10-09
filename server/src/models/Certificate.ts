import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  certificateId?: string;
  imageUrl?: string;
  pdfUrl?: string;
  credentialUrl?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CertificateSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    issuingOrganization: { type: String, required: true },
    issueDate: { type: String, required: true },
    certificateId: { type: String, default: '' },
    imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80' },
    pdfUrl: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
export default Certificate;
