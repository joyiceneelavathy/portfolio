import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import { initialResume } from '../config/seedData.js';

export const getResume = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let item = await Resume.findOne();
      if (!item) {
        item = await Resume.create(initialResume);
      }
      return res.status(200).json({
        success: true,
        data: item,
        source: 'mongodb',
      });
    }

    return res.status(200).json({
      success: true,
      data: initialResume,
      source: 'fallback_mock',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      error: error.message,
      data: initialResume,
    });
  }
};

export const updateResume = async (req: Request, res: Response) => {
  try {
    let item = await Resume.findOne();
    if (!item) {
      item = await Resume.create({ ...initialResume, ...req.body });
    } else {
      Object.assign(item, req.body);
      await item.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Resume information updated successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update resume',
      error: error.message,
    });
  }
};
