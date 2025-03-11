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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../../config';
import { City } from '../../types';

interface CityWithCount extends City {
  _count?: {
    profiles: number;
  };
}

const CitiesPage: React.FC = () => {
  const [cities, setCities] = useState<CityWithCount[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<Partial<City> | null>(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('adminToken');

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/cities`);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setError('Ошибка при загрузке городов');
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleOpen = (city?: City) => {
    setEditingCity(city || { name: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setEditingCity(null);
    setOpen(false);
    setError('');
  };

  const handleSave = async () => {
    if (!editingCity?.name) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (editingCity.id) {
        await axios.put(
          `${API_URL}/admin/cities/${editingCity.id}`,
          editingCity,
          { headers }
        );
      } else {
        await axios.post(`${API_URL}/admin/cities`, editingCity, { headers });
      }

      fetchCities();
      handleClose();
    } catch (error) {
      console.error('Error saving city:', error);
      setError('Ошибка при сохранении города');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот город?')) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_URL}/admin/cities/${id}`, { headers });
      fetchCities();
    } catch (error) {
      console.error('Error deleting city:', error);
      setError('Ошибка при удалении города');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Управление городами</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Добавить город
        </Button>
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
              <TableCell>Название</TableCell>
              <TableCell>Кол-во анкет</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city.id}>
                <TableCell>{city.id}</TableCell>
                <TableCell>{city.name}</TableCell>
                <TableCell>{city._count?.profiles || 0}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(city)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(city.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingCity?.id ? 'Редактировать город' : 'Добавить город'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название города"
            fullWidth
            value={editingCity?.name || ''}
            onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CitiesPage; 