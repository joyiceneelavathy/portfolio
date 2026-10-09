import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Education from '../models/Education.js';
import { initialEducation } from '../config/seedData.js';

export const getAllEducation = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let educationList = await Education.find().sort({ order: 1, startYear: -1 });
      if (educationList.length === 0) {
        await Education.insertMany(initialEducation);
        educationList = await Education.find().sort({ order: 1, startYear: -1 });
      }
      return res.status(200).json({
        success: true,
        data: educationList,
        count: educationList.length,
        source: 'mongodb',
      });
    }

    return res.status(200).json({
      success: true,
      data: initialEducation,
      count: initialEducation.length,
      source: 'fallback_mock',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch education records',
      error: error.message,
    });
  }
};

export const getEducationById = async (req: Request, res: Response) => {
  try {
    const item = await Education.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Education record not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch education record', error: error.message });
  }
};

export const createEducation = async (req: Request, res: Response) => {
  try {
    const item = await Education.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Education record created successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create education record',
      error: error.message,
    });
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Education record not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Education record updated successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update education record',
      error: error.message,
    });
  }
};

export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const item = await Education.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Education record not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Education record deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete education record',
      error: error.message,
    });
  }
};
