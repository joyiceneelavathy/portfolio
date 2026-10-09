import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Experience from '../models/Experience.js';
import { initialExperience } from '../config/seedData.js';

export const getAllExperience = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let items = await Experience.find().sort({ order: 1, startDate: -1 });
      if (items.length === 0) {
        await Experience.insertMany(initialExperience);
        items = await Experience.find().sort({ order: 1, startDate: -1 });
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
      data: initialExperience,
      count: initialExperience.length,
      source: 'fallback_mock',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch experience records',
      error: error.message,
    });
  }
};

export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const item = await Experience.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Experience record not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch experience', error: error.message });
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const techArray = Array.isArray(req.body.technologies)
      ? req.body.technologies
      : req.body.technologies ? String(req.body.technologies).split(',').map((t: string) => t.trim()) : [];

    const item = await Experience.create({
      ...req.body,
      technologies: techArray,
    });

    return res.status(201).json({
      success: true,
      message: 'Experience created successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create experience',
      error: error.message,
    });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const techArray = Array.isArray(req.body.technologies)
      ? req.body.technologies
      : req.body.technologies ? String(req.body.technologies).split(',').map((t: string) => t.trim()) : undefined;

    const updatePayload = { ...req.body };
    if (techArray !== undefined) {
      updatePayload.technologies = techArray;
    }

    const item = await Experience.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Experience record not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update experience',
      error: error.message,
    });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Experience record not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Experience deleted successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete experience',
      error: error.message,
    });
  }
};
