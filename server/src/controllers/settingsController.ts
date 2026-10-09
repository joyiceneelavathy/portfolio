import { Request, Response } from 'express';
import mongoose from 'mongoose';
import WebsiteSettings from '../models/WebsiteSettings.js';
import { initialSettings } from '../config/seedData.js';

export const getSettings = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let settings = await WebsiteSettings.findOne();
      if (!settings) {
        settings = await WebsiteSettings.create(initialSettings);
      }
      return res.status(200).json({
        success: true,
        data: settings,
        source: 'mongodb',
      });
    }

    return res.status(200).json({
      success: true,
      data: initialSettings,
      source: 'fallback_mock',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message,
      data: initialSettings,
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create({ ...initialSettings, ...req.body });
    } else {
      if (req.body.sectionsVisibility) {
        settings.sectionsVisibility = {
          ...settings.sectionsVisibility,
          ...req.body.sectionsVisibility,
        };
        delete req.body.sectionsVisibility;
      }
      Object.assign(settings, req.body);
      await settings.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Website settings updated successfully',
      data: settings,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update website settings',
      error: error.message,
    });
  }
};
