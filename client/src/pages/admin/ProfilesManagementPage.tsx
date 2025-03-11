import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';
import { Profile } from '../../types';
import { api } from '../../utils/api';
import ProfileEditor from '../../components/admin/ProfileEditor';

const ProfilesManagementPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await api.get('/profiles');
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleVerify = async (profileId: number, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/profiles/${profileId}/verify`, {
        isVerified: !currentStatus
      });
      fetchProfiles();
    } catch (error) {
      console.error('Error verifying profile:', error);
    }
  };

  const handleDelete = async (profileId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту анкету?')) {
      try {
        await api.delete(`/profiles/${profileId}`);
        fetchProfiles();
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setIsEditorOpen(true);
  };

  const handleSaveEdit = async (updatedProfile: Profile) => {
    try {
      await api.put(`/profiles/${updatedProfile.id}`, updatedProfile);
      setIsEditorOpen(false);
      setEditingProfile(null);
      fetchProfiles();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleToggleActive = async (profileId: number, currentStatus: boolean) => {
    try {
      await api.patch(`/profiles/${profileId}/toggle-active`, {
        isActive: !currentStatus
      });
      fetchProfiles();
    } catch (error) {
      console.error('Error toggling profile status:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Управление анкетами
      </Typography>

      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} key={profile.id}>
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      {profile.name}, {profile.age} лет
                    </Typography>
                    <Typography color="text.secondary">
                      Город: {profile.city?.name || 'все города'}
                    </Typography>
                    <Typography color="text.secondary">
                      Телефон: {profile.phone}
                    </Typography>
                    <Typography color="text.secondary">
                      Статус: {profile.isActive ? 'Активна' : 'Отключена'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleEdit(profile)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(profile.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleToggleActive(profile.id, profile.isActive)}
                      color={profile.isActive ? "success" : "inherit"}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleVerify(profile.id, profile.isVerified)}
                      color={profile.isVerified ? "success" : "inherit"}
                    >
                      <VerifiedIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isEditorOpen && editingProfile && (
        <ProfileEditor
          profile={editingProfile}
          open={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingProfile(null);
          }}
          onSave={handleSaveEdit}
        />
      )}
    </Box>
  );
};

export default ProfilesManagementPage; 