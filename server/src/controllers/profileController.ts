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
    console.log('Received profile data:', req.body);
    
    // Проверяем обязательные поля
    const requiredFields = [
      'name',
      'age',
      'height',
      'weight',
      'breastSize',
      'phone',
      'description',
      'photos',
      'price1Hour',
      'price2Hours',
      'priceNight',
      'cityId'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
    }

    interface NumericRange {
      min: number;
      max?: number;
    }

    // Проверяем валидность числовых полей
    const numericFields: Record<string, NumericRange> = {
      age: { min: 18, max: 70 },
      height: { min: 140, max: 195 },
      weight: { min: 40, max: 110 },
      breastSize: { min: 1, max: 10 },
      price1Hour: { min: 0 },
      price2Hours: { min: 0 },
      priceNight: { min: 0 },
      priceExpress: { min: 0 }
    };

    for (const [field, range] of Object.entries(numericFields)) {
      const value = Number(req.body[field]);
      if (isNaN(value) || value < range.min || (range.max !== undefined && value > range.max)) {
        console.log('Invalid numeric field:', field, 'value:', value, 'range:', range);
        return res.status(400).json({
          error: `Invalid value for ${field}`,
          field,
          range
        });
      }
    }

    // Создаем профиль с валидными данными
    const profileData = {
      name: req.body.name,
      age: Number(req.body.age),
      height: Number(req.body.height),
      weight: Number(req.body.weight),
      breastSize: Number(req.body.breastSize),
      phone: req.body.phone,
      description: req.body.description,
      photos: req.body.photos,
      price1Hour: Number(req.body.price1Hour),
      price2Hours: Number(req.body.price2Hours),
      priceNight: Number(req.body.priceNight),
      priceExpress: Number(req.body.priceExpress || 0),
      cityId: Number(req.body.cityId),
      district: req.body.district,
      services: req.body.services || [],
      
      // Appearance
      nationality: req.body.nationality,
      hairColor: req.body.hairColor,
      bikiniZone: req.body.bikiniZone,
      gender: req.body.gender || 'female',
      orientation: req.body.orientation || 'hetero',
      
      // Verification
      isVerified: req.body.isVerified || false,
      hasVideo: req.body.hasVideo || false,
      hasReviews: req.body.hasReviews || false,
      
      // Location
      inCall: req.body.inCall ?? true,
      outCall: req.body.outCall ?? false,
      
      // Additional filters
      isNonSmoking: req.body.isNonSmoking || false,
      isNew: req.body.isNew ?? true,
      isWaitingCall: req.body.isWaitingCall || false,
      is24Hours: req.body.is24Hours || false,
      
      // Neighbors
      isAlone: req.body.isAlone ?? true,
      withFriend: req.body.withFriend || false,
      withFriends: req.body.withFriends || false,
    };

    console.log('Creating profile with data:', profileData);

    const profile = await prisma.profile.create({
      data: profileData,
      include: {
        city: true,
      },
    });

    console.log('Created profile:', profile);
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({
      error: 'Failed to create profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
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

export const verifyProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.update({
      where: { id: Number(id) },
      data: {
        isVerified: true,
      },
      include: {
        city: true,
      },
    });
    res.json(profile);
  } catch (error) {
    console.error('Error verifying profile:', error);
    res.status(500).json({ error: 'Failed to verify profile' });
  }
}; 