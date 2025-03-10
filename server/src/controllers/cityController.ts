import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCities = async (_req: Request, res: Response) => {
  try {
    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: { profiles: true }
        }
      }
    });

    // Преобразуем данные для совместимости с фронтендом
    const formattedCities = cities.map(city => ({
      id: city.id,
      name: city.name,
      profiles: { length: city._count.profiles }
    }));

    res.json(formattedCities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

export const createCity = async (req: Request, res: Response) => {
  try {
    const city = await prisma.city.create({
      data: req.body,
    });
    res.status(201).json(city);
  } catch (error) {
    console.error('Error creating city:', error);
    res.status(500).json({ error: 'Failed to create city' });
  }
};

export const updateCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const city = await prisma.city.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(city);
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({ error: 'Failed to update city' });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.city.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ error: 'Failed to delete city' });
  }
}; 