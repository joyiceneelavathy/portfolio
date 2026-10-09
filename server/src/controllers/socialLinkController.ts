import { Request, Response } from 'express';
import mongoose from 'mongoose';
import SocialLink from '../models/SocialLink.js';
import { initialSocialLinks } from '../config/seedData.js';

export const getAllSocialLinks = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let items = await SocialLink.find().sort({ order: 1 });
      if (items.length === 0) {
        await SocialLink.insertMany(initialSocialLinks);
        items = await SocialLink.find().sort({ order: 1 });
      }
      return res.status(200).json({
        success: true,
        data: items,
        count: items.length,
        source: 'mongodb',
      });
    }

    return res.status(200).json({
      success: true,
      data: initialSocialLinks,
      count: initialSocialLinks.length,
      source: 'fallback_mock',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch social links',
      error: error.message,
    });
  }
};

export const getSocialLinkById = async (req: Request, res: Response) => {
  try {
    const item = await SocialLink.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Social link not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch social link', error: error.message });
  }
};

export const createSocialLink = async (req: Request, res: Response) => {
  try {
    const item = await SocialLink.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Social link created successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create social link',
      error: error.message,
    });
  }
};

export const updateSocialLink = async (req: Request, res: Response) => {
  try {
    const item = await SocialLink.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Social link not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Social link updated successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update social link',
      error: error.message,
    });
  }
};

export const deleteSocialLink = async (req: Request, res: Response) => {
  try {
    const item = await SocialLink.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Social link not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Social link deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete social link',
      error: error.message,
    });
  }
};
