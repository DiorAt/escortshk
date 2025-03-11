import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Telegram } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

interface PublicSettings {
  telegramUsername: string;
  maintenanceMode: boolean;
}

const ContactAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<PublicSettings>({
    telegramUsername: '',
    maintenanceMode: false
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_URL}/settings/public`);
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Ошибка при загрузке контактных данных');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (settings.maintenanceMode) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Сайт находится на техническом обслуживании. Пожалуйста, попробуйте позже.
        </Alert>
      </Container>
    );
  }

  const telegramLink = `https://t.me/${settings.telegramUsername}`;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Назад
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Добавление анкеты
        </Typography>

        <Typography variant="body1" paragraph>
          Для размещения анкеты на сайте, пожалуйста, свяжитесь с администратором через Telegram.
        </Typography>

        <Typography variant="body1" paragraph>
          Администратор поможет вам создать привлекательную анкету и разместить её на сайте.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Telegram />}
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Написать в Telegram
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Обработка заявок производится в течение 24 часов
        </Typography>
      </Paper>
    </Container>
  );
};

export default ContactAdminPage; 