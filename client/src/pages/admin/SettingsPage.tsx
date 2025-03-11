import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Security,
  Language,
  Notifications,
  Telegram,
  AttachMoney,
  Photo,
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../../config';

interface Settings {
  id?: number;
  telegramUsername: string;
  notificationsEnabled: boolean;
  autoModeration: boolean;
  defaultCity: string | null;
  maintenanceMode: boolean;
  watermarkEnabled: boolean;
  watermarkText: string;
  minPhotoCount: number;
  maxPhotoCount: number;
  defaultPriceHour: number;
  defaultPriceTwoHours: number;
  defaultPriceNight: number;
}

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    telegramUsername: '',
    notificationsEnabled: true,
    autoModeration: false,
    defaultCity: '',
    maintenanceMode: false,
    watermarkEnabled: true,
    watermarkText: '',
    minPhotoCount: 3,
    maxPhotoCount: 10,
    defaultPriceHour: 5000,
    defaultPriceTwoHours: 10000,
    defaultPriceNight: 30000,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${API_URL}/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Ошибка при загрузке настроек');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${API_URL}/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Настройки сайта
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Telegram sx={{ mr: 1 }} />
                <Typography variant="h6">Контакты</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Telegram для связи"
                value={settings.telegramUsername}
                onChange={(e) => setSettings({ ...settings, telegramUsername: e.target.value })}
                margin="normal"
                helperText="Укажите username без @"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notificationsEnabled}
                    onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                  />
                }
                label="Включить уведомления в Telegram"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1 }} />
                <Typography variant="h6">Безопасность</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoModeration}
                    onChange={(e) => setSettings({ ...settings, autoModeration: e.target.checked })}
                  />
                }
                label="Автомодерация анкет"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  />
                }
                label="Режим обслуживания"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Photo sx={{ mr: 1 }} />
                <Typography variant="h6">Настройки фотографий</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.watermarkEnabled}
                    onChange={(e) => setSettings({ ...settings, watermarkEnabled: e.target.checked })}
                  />
                }
                label="Добавлять водяной знак"
              />

              <TextField
                fullWidth
                label="Текст водяного знака"
                value={settings.watermarkText}
                onChange={(e) => setSettings({ ...settings, watermarkText: e.target.value })}
                margin="normal"
                disabled={!settings.watermarkEnabled}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Мин. кол-во фото"
                    value={settings.minPhotoCount}
                    onChange={(e) => setSettings({ ...settings, minPhotoCount: Number(e.target.value) })}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Макс. кол-во фото"
                    value={settings.maxPhotoCount}
                    onChange={(e) => setSettings({ ...settings, maxPhotoCount: Number(e.target.value) })}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 1 }} />
                <Typography variant="h6">Цены по умолчанию</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <TextField
                fullWidth
                type="number"
                label="Цена за 1 час"
                value={settings.defaultPriceHour}
                onChange={(e) => setSettings({ ...settings, defaultPriceHour: Number(e.target.value) })}
                margin="normal"
              />

              <TextField
                fullWidth
                type="number"
                label="Цена за 2 часа"
                value={settings.defaultPriceTwoHours}
                onChange={(e) => setSettings({ ...settings, defaultPriceTwoHours: Number(e.target.value) })}
                margin="normal"
              />

              <TextField
                fullWidth
                type="number"
                label="Цена за ночь"
                value={settings.defaultPriceNight}
                onChange={(e) => setSettings({ ...settings, defaultPriceNight: Number(e.target.value) })}
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Сохранение...' : 'Сохранить настройки'}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Настройки успешно сохранены"
      />
    </Container>
  );
};

export default SettingsPage; 