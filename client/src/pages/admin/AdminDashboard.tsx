import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { Profile } from '../../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/admin/profiles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setError('Ошибка при загрузке анкет');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [token, navigate]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту анкету?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/profiles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfiles(profiles.filter(profile => profile.id !== id));
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('Ошибка при удалении анкеты');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Управление анкетами
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/profiles/new')}
            sx={{ mr: 2 }}
          >
            Добавить анкету
          </Button>
          <Button
            variant="outlined"
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Город</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Нет анкет для отображения
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.id}</TableCell>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.cityId}</TableCell>
                  <TableCell>{profile.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={profile.isActive ? 'Активна' : 'Неактивна'}
                      color={profile.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/admin/profiles/${profile.id}/edit`)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(profile.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard; 