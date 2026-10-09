import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Skill from '../models/Skill.js';
import { initialSkills } from '../config/seedData.js';

export const getAllSkills = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let skills = await Skill.find().sort({ order: 1, name: 1 });
      if (skills.length === 0) {
        await Skill.insertMany(initialSkills);
        skills = await Skill.find().sort({ order: 1, name: 1 });
      }
      return res.status(200).json({
        success: true,
        data: skills,
        count: skills.length,
        source: 'mongodb',
      });
    }

    return res.status(200).json({
      success: true,
      data: initialSkills,
      count: initialSkills.length,
      source: 'fallback_mock',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch skills',
      error: error.message,
    });
  }
};

export const getSkillById = async (req: Request, res: Response) => {
  try {
    const item = await Skill.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch skill', error: error.message });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const item = await Skill.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create skill',
      error: error.message,
    });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const item = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update skill',
      error: error.message,
    });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const item = await Skill.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete skill',
      error: error.message,
    });
  }
};
