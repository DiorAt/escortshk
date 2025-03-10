import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import * as profileController from './controllers/profileController';
import * as cityController from './controllers/cityController';
import * as authController from './controllers/authController';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Публичные маршруты
app.get('/api/profiles', profileController.getProfiles);
app.get('/api/profiles/:id', profileController.getProfileById);
app.get('/api/cities', cityController.getCities);

// Маршруты администратора
app.post('/api/auth/login', authController.login);

// Защищенные маршруты (требуют аутентификации)
app.use('/api/admin', authMiddleware);
app.post('/api/admin/profiles', profileController.createProfile);
app.put('/api/admin/profiles/:id', profileController.updateProfile);
app.delete('/api/admin/profiles/:id', profileController.deleteProfile);
app.post('/api/admin/cities', cityController.createCity);
app.put('/api/admin/cities/:id', cityController.updateCity);
app.delete('/api/admin/cities/:id', cityController.deleteCity);

// Обработка ошибок
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
}); 