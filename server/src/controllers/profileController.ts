import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Profile from '../models/Profile.js';
import { initialProfile } from '../config/seedData.js';

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = await Profile.create(initialProfile);
      }
      return res.status(200).json({
        success: true,
        data: profile,
        source: 'mongodb',
      });
    }

    return res.status(200).json({
      success: true,
      data: initialProfile,
      source: 'fallback_mock',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message,
      data: initialProfile,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is disconnected. Cannot update profile in offline mode.',
      });
    }

    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({ ...initialProfile, ...req.body });
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};
