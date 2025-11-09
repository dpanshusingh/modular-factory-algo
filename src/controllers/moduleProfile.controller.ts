import { Request, Response } from 'express';
import {
  createModuleProfile,
  getAllModuleProfiles,
  getModuleProfileById,
  updateModuleProfile,
  deleteModuleProfile,
} from '../queries/moduleProfile.query';

const generateId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const createModuleProfileController = async (req: Request, res: Response) => {
  try {
    const input = req.body;

    const id = generateId();

    const profile = await createModuleProfile({
      ...input,
      id,
    });
    res.status(201).json(profile);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllModuleProfilesController = async (_req: Request, res: Response) => {
  try {
    const profiles = await getAllModuleProfiles();
    res.json(profiles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getModuleProfileByIdController = async (req: Request, res: Response) => {
  try {
    const profile = await getModuleProfileById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Not found' });
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateModuleProfileController = async (req: Request, res: Response) => {
  try {
    const profile = await updateModuleProfile(req.params.id, req.body);
    res.json(profile);
    console.log("module profile update hit");
    
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteModuleProfileController = async (req: Request, res: Response) => {
  try {
    await deleteModuleProfile(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
