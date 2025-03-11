import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../../config';
import { Profile, City } from '../../types';
import ProfileEditor from '../../components/admin/ProfileEditor';

const ProfilesPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEditor, setOpenEditor] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles();
    fetchCities();
  }, []);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/profiles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Ошибка при загрузке анкет');
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/cities`);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleOpenEditor = (profile?: Profile) => {
    if (profile) {
      setSelectedProfile(profile);
    } else {
      setSelectedProfile(null);
    }
    setOpenEditor(true);
  };

  const handleCloseEditor = () => {
    setOpenEditor(false);
    setSelectedProfile(null);
  };

  const handleSaveProfile = async (profileData: Profile) => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Sending profile data:', profileData);
      if (selectedProfile) {
        const response = await axios.put(
          `${API_URL}/admin/profiles/${selectedProfile.id}`,
          profileData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Update response:', response.data);
      } else {
        const response = await axios.post(
          `${API_URL}/admin/profiles`,
          profileData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Create response:', response.data);
      }
      fetchProfiles();
      handleCloseEditor();
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      setError('Ошибка при сохранении анкеты');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту анкету?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/admin/profiles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('Ошибка при удалении анкеты');
    }
  };

  const handleToggleStatus = async (profile: Profile) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/admin/profiles/${profile.id}`,
        { isActive: !profile.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProfiles();
    } catch (error) {
      console.error('Error toggling profile status:', error);
      setError('Ошибка при изменении статуса анкеты');
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Управление анкетами</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenEditor()}
        >
          Добавить анкету
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {profile.name}, {profile.age} лет
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Город: {cities.find(c => c.id === profile.cityId)?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Телефон: {profile.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Статус: {profile.isActive ? 'Активна' : 'Неактивна'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenEditor(profile)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(profile.id)} size="small" color="error">
                  <DeleteIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleToggleStatus(profile)} 
                  size="small"
                  color={profile.isActive ? "success" : "warning"}
                >
                  {profile.isActive ? <CheckIcon /> : <BlockIcon />}
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ProfileEditor
        profile={selectedProfile || undefined}
        open={openEditor}
        onClose={handleCloseEditor}
        onSave={handleSaveProfile}
      />
    </Container>
  );
};

export default ProfilesPage; 