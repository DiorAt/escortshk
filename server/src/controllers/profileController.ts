import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfiles = async (req: Request, res: Response) => {
  try {
    const {
      cityId,
      district,
      services,
      priceRange,
      age,
      height,
      weight,
      breastSize,
      isVerified,
    } = req.query;

    // Проверяем наличие токена администратора в заголовках
    const isAdminRequest = req.headers.authorization?.startsWith('Bearer ');

    console.log('Request path:', req.path);
    console.log('Is admin request:', isAdminRequest);
    console.log('Authorization header:', req.headers.authorization);

    const filters: any = {
      isActive: isAdminRequest ? undefined : true,
      cityId: cityId ? Number(cityId) : undefined,
    };

    if (district) filters.district = district as string;
    if (breastSize) filters.breastSize = Number(breastSize);
    if (isVerified) filters.isVerified = isVerified === 'true';

    if (services) {
      filters.services = {
        hasEvery: Array.isArray(services) ? services : [services],
      };
    }

    if (priceRange) {
      const { min, max } = JSON.parse(priceRange as string);
      if (min) filters.price1Hour = { gte: Number(min) };
      if (max) filters.price1Hour = { ...filters.price1Hour, lte: Number(max) };
    }

    // Удаляем undefined значения из фильтров
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    console.log('Applied filters:', filters);

    const profiles = await prisma.profile.findMany({
      where: filters,
      include: {
        city: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${profiles.length} profiles`);
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profiles',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({
      where: { id: Number(id) },
      include: {
        city: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.create({
      data: req.body,
    });
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.profile.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
}; 