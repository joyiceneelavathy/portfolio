import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Service from '../models/Service.js';
import { initialServices } from '../config/seedData.js';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let items = await Service.find().sort({ order: 1 });
      if (items.length === 0) {
        await Service.insertMany(initialServices);
        items = await Service.find().sort({ order: 1 });
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
      data: initialServices,
      count: initialServices.length,
      source: 'fallback_mock',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message,
    });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const item = await Service.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch service', error: error.message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const item = await Service.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create service',
      error: error.message,
    });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const item = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update service',
      error: error.message,
    });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const item = await Service.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message,
    });
  }
};
