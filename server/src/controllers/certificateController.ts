import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Certificate from '../models/Certificate.js';
import { initialCertificates } from '../config/seedData.js';

export const getCertificates = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let certs = await Certificate.find().sort({ createdAt: -1 });
      if (certs.length === 0) {
        await Certificate.insertMany(initialCertificates);
        certs = await Certificate.find().sort({ createdAt: -1 });
      }
      return res.status(200).json({
        success: true,
        count: certs.length,
        data: certs,
        source: 'mongodb',
      });
    }

    return res.status(200).json({
      success: true,
      count: initialCertificates.length,
      data: initialCertificates,
      source: 'fallback_mock',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve certificates',
      error: error.message,
    });
  }
};

export const getCertificateById = async (req: Request, res: Response) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    return res.status(200).json({ success: true, data: cert });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to get certificate', error: error.message });
  }
};

export const createCertificate = async (req: Request, res: Response) => {
  try {
    const { name, title, issuingOrganization, issueDate, certificateId, credentialUrl, imageUrl, pdfUrl, description } = req.body;

    const certName = name || title;
    if (!certName || !issuingOrganization || !issueDate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: name/title, issuingOrganization, issueDate',
      });
    }

    const newCert = await Certificate.create({
      name: certName,
      issuingOrganization,
      issueDate,
      certificateId: certificateId || '',
      credentialUrl: credentialUrl || '#',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
      pdfUrl: pdfUrl || '',
      description: description || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      data: newCert,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create certificate',
      error: error.message,
    });
  }
};

export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const { name, title } = req.body;
    const updateData = { ...req.body };
    if (!updateData.name && title) {
      updateData.name = title;
    }

    const updated = await Certificate.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update certificate',
      error: error.message,
    });
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const deleted = await Certificate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully',
      data: deleted,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete certificate',
      error: error.message,
    });
  }
};
