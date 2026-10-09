import { Request, Response } from 'express';
import mongoose from 'mongoose';
import About from '../models/About.js';
import { initialAbout } from '../config/seedData.js';

export const getAbout = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let about = await About.findOne();
      if (!about) {
        about = await About.create(initialAbout);
      }
      return res.status(200).json({
        success: true,
        data: about,
        source: 'mongodb',
      });
    }

    return res.status(200).json({
      success: true,
      data: initialAbout,
      source: 'fallback_mock',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch about information',
      error: error.message,
      data: initialAbout,
    });
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is disconnected.',
      });
    }

    let about = await About.findOne();
    if (!about) {
      about = await About.create({ ...initialAbout, ...req.body });
    } else {
      Object.assign(about, req.body);
      await about.save();
    }

    return res.status(200).json({
      success: true,
      message: 'About information updated successfully',
      data: about,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update about information',
      error: error.message,
    });
  }
};
