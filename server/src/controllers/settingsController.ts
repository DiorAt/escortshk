import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await prisma.settings.findFirst();
    
    if (!settings) {
      // Если настройки не найдены, создаем их с дефолтными значениями
      settings = await prisma.settings.create({
        data: {}  // Используются дефолтные значения из схемы
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.settings.findFirst();
    
    if (!settings) {
      const newSettings = await prisma.settings.create({
        data: req.body
      });
      return res.json(newSettings);
    }

    const updatedSettings = await prisma.settings.update({
      where: { id: settings.id },
      data: req.body
    });

    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

// Публичный endpoint для получения только публичных настроек
export const getPublicSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.settings.findFirst();
    
    if (!settings) {
      return res.json({
        telegramUsername: 'your_admin_username',
        maintenanceMode: false
      });
    }

    // Возвращаем только публичные настройки
    res.json({
      telegramUsername: settings.telegramUsername,
      maintenanceMode: settings.maintenanceMode
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ error: 'Failed to fetch public settings' });
  }
}; 