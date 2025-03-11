import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Grid,
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  Card,
  CardMedia,
  CardActions,
  Alert,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import {
  AddPhotoAlternate as AddPhotoIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Profile, City } from '../../types';
import { api } from '../../utils/api';
import { serviceTranslations } from '../../utils/serviceTranslations';

interface ProfileEditorProps {
  profile?: Profile;
  onSave: (profile: Profile) => void;
  onClose: () => void;
  open: boolean;
}

interface NumericRange {
  min: number;
  max?: number;
}

const MAX_PHOTOS = 3;

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onClose, open }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>(profile || {
    name: '',
    age: 18,
    height: 165,
    weight: 55,
    breastSize: 3,
    phone: '',
    description: '',
    photos: [],
    price1Hour: 3000,
    price2Hours: 6000,
    priceNight: 15000,
    priceExpress: 2000,
    services: [],
    cityId: 1,
    district: '',
    isVerified: false,
    hasVideo: false,
    hasReviews: false,
    inCall: true,
    outCall: false,
    isNonSmoking: false,
    isNew: true,
    isWaitingCall: false,
    is24Hours: false,
    isAlone: true,
    withFriend: false,
    withFriends: false,
    gender: 'female',
    orientation: 'hetero',
    nationality: 'slavic',
    hairColor: 'blonde',
    bikiniZone: 'smooth',
  });

  const [photos, setPhotos] = useState<string[]>(profile?.photos || []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching cities in ProfileEditor...');
        console.log('API URL:', api.defaults.baseURL);
        
        const response = await api.get('/cities');
        console.log('Cities response status:', response.status);
        console.log('Cities response data:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setCities(response.data);
        } else {
          console.error('Invalid response format:', response.data);
          throw new Error('Invalid response format');
        }
      } catch (error: any) {
        console.error('Error fetching cities:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        setError('Ошибка при загрузке списка городов');
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchCities();
    }
  }, [open]);

  useEffect(() => {
    console.log('Cities state updated:', cities);
  }, [cities]);

  const handlePhotoAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && photos.length < MAX_PHOTOS) {
          setPhotos([...photos, reader.result]);
          setFormData({
            ...formData,
            photos: [...photos, reader.result],
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoDelete = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setFormData({
      ...formData,
      photos: newPhotos,
    });
  };

  const handleChange = (field: keyof Profile) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleCheckboxChange = (field: keyof Profile) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.checked,
    });
  };

  const handleSelectChange = (field: keyof Profile) => (
    event: SelectChangeEvent<string>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleServiceChange = (service: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentServices = formData.services || [];
    const newServices = event.target.checked
      ? [...currentServices, service]
      : currentServices.filter(s => s !== service);
    
    setFormData({
      ...formData,
      services: newServices,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
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

    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof Profile];
      return !value || (Array.isArray(value) && value.length === 0);
    });

    if (missingFields.length > 0) {
      setError(`Пожалуйста, заполните обязательные поля: ${missingFields.join(', ')}`);
      return;
    }

    if (photos.length === 0) {
      setError('Добавьте хотя бы одно фото');
      return;
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
      const value = Number(formData[field as keyof Profile]);
      if (isNaN(value) || value < range.min || (range.max !== undefined && value > range.max)) {
        setError(`Неверное значение для поля ${field}. Допустимый диапазон: от ${range.min}${range.max ? ` до ${range.max}` : ''}`);
        return;
      }
    }

    setError(null);
    console.log('Sending profile data:', formData);
    onSave(formData as Profile);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        {profile ? 'Редактирование анкеты' : 'Создание анкеты'}
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Фотографии */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Фотографии ({photos.length}/{MAX_PHOTOS})
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handlePhotoAdd}
                />
                <Grid container spacing={2}>
                  {photos.map((photo, index) => (
                    <Grid item xs={4} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="200"
                          image={photo}
                          alt={`Фото ${index + 1}`}
                        />
                        <CardActions>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handlePhotoDelete(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                  {photos.length < MAX_PHOTOS && (
                    <Grid item xs={4}>
                      <Card
                        sx={{
                          height: '200px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <AddPhotoIcon sx={{ fontSize: 60, color: 'action.active' }} />
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              {/* Основная информация */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Основная информация
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Имя"
                  value={formData.name}
                  onChange={handleChange('name')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Телефон"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!formData.cityId}>
                  <InputLabel>Город</InputLabel>
                  <Select
                    value={formData.cityId?.toString() || ''}
                    onChange={(e) => {
                      console.log('Selected city:', e.target.value);
                      setFormData({
                        ...formData,
                        cityId: Number(e.target.value)
                      });
                    }}
                    label="Город"
                    disabled={loading}
                  >
                    {loading ? (
                      <MenuItem disabled value="">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={20} />
                          Загрузка...
                        </Box>
                      </MenuItem>
                    ) : cities.length === 0 ? (
                      <MenuItem disabled value="">
                        Нет доступных городов
                      </MenuItem>
                    ) : (
                      cities.map((city) => (
                        <MenuItem key={city.id} value={city.id}>
                          {city.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {!formData.cityId && !loading && (
                    <FormHelperText>Выберите город</FormHelperText>
                  )}
                  {error && (
                    <FormHelperText error>
                      {error}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Район"
                  value={formData.district || ''}
                  onChange={handleChange('district')}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Описание"
                  value={formData.description}
                  onChange={handleChange('description')}
                />
              </Grid>

              {/* Внешность */}
              <Grid item xs={12}>
                <Divider />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Внешность
                </Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Возраст"
                  value={formData.age}
                  onChange={handleChange('age')}
                  InputProps={{ inputProps: { min: 18, max: 70 } }}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Рост"
                  value={formData.height}
                  onChange={handleChange('height')}
                  InputProps={{ inputProps: { min: 140, max: 195 } }}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Вес"
                  value={formData.weight}
                  onChange={handleChange('weight')}
                  InputProps={{ inputProps: { min: 40, max: 110 } }}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Размер груди"
                  value={formData.breastSize}
                  onChange={handleChange('breastSize')}
                  InputProps={{ inputProps: { min: 1, max: 10 } }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Национальность</InputLabel>
                  <Select
                    value={formData.nationality}
                    onChange={handleSelectChange('nationality')}
                    label="Национальность"
                  >
                    <MenuItem value="slavic">Славянка</MenuItem>
                    <MenuItem value="caucasian">Кавказская</MenuItem>
                    <MenuItem value="asian">Азиатка</MenuItem>
                    <MenuItem value="african">Африканка</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Цвет волос</InputLabel>
                  <Select
                    value={formData.hairColor}
                    onChange={handleSelectChange('hairColor')}
                    label="Цвет волос"
                  >
                    <MenuItem value="blonde">Блондинка</MenuItem>
                    <MenuItem value="brunette">Брюнетка</MenuItem>
                    <MenuItem value="brown">Шатенка</MenuItem>
                    <MenuItem value="red">Рыжая</MenuItem>
                    <MenuItem value="other">Другой</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Зона бикини</InputLabel>
                  <Select
                    value={formData.bikiniZone}
                    onChange={handleSelectChange('bikiniZone')}
                    label="Зона бикини"
                  >
                    <MenuItem value="smooth">Гладкая</MenuItem>
                    <MenuItem value="strip">Интимная стрижка</MenuItem>
                    <MenuItem value="natural">Мохнатка</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Услуги */}
              <Grid item xs={12}>
                <Divider />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Услуги
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Секс
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('classic')}
                        onChange={handleServiceChange('classic')}
                      />
                    }
                    label={serviceTranslations['classic']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('anal')}
                        onChange={handleServiceChange('anal')}
                      />
                    }
                    label={serviceTranslations['anal']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('lesbian')}
                        onChange={handleServiceChange('lesbian')}
                      />
                    }
                    label={serviceTranslations['lesbian']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('group_mmf')}
                        onChange={handleServiceChange('group_mmf')}
                      />
                    }
                    label={serviceTranslations['group_mmf']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('group_ffm')}
                        onChange={handleServiceChange('group_ffm')}
                      />
                    }
                    label={serviceTranslations['group_ffm']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('with_toys')}
                        onChange={handleServiceChange('with_toys')}
                      />
                    }
                    label={serviceTranslations['with_toys']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('in_car')}
                        onChange={handleServiceChange('in_car')}
                      />
                    }
                    label={serviceTranslations['in_car']}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Ласки клиенту
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('blowjob_with_condom')}
                        onChange={handleServiceChange('blowjob_with_condom')}
                      />
                    }
                    label={serviceTranslations['blowjob_with_condom']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('blowjob_without_condom')}
                        onChange={handleServiceChange('blowjob_without_condom')}
                      />
                    }
                    label={serviceTranslations['blowjob_without_condom']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('deep_blowjob')}
                        onChange={handleServiceChange('deep_blowjob')}
                      />
                    }
                    label={serviceTranslations['deep_blowjob']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('car_blowjob')}
                        onChange={handleServiceChange('car_blowjob')}
                      />
                    }
                    label={serviceTranslations['car_blowjob']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('anilingus_to_client')}
                        onChange={handleServiceChange('anilingus_to_client')}
                      />
                    }
                    label={serviceTranslations['anilingus_to_client']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('fisting_to_client')}
                        onChange={handleServiceChange('fisting_to_client')}
                      />
                    }
                    label={serviceTranslations['fisting_to_client']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('kisses')}
                        onChange={handleServiceChange('kisses')}
                      />
                    }
                    label={serviceTranslations['kisses']}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  BDSM и фетиш
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('light_domination')}
                        onChange={handleServiceChange('light_domination')}
                      />
                    }
                    label={serviceTranslations['light_domination']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('mistress')}
                        onChange={handleServiceChange('mistress')}
                      />
                    }
                    label={serviceTranslations['mistress']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('flogging')}
                        onChange={handleServiceChange('flogging')}
                      />
                    }
                    label={serviceTranslations['flogging']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('trampling')}
                        onChange={handleServiceChange('trampling')}
                      />
                    }
                    label={serviceTranslations['trampling']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('face_sitting')}
                        onChange={handleServiceChange('face_sitting')}
                      />
                    }
                    label={serviceTranslations['face_sitting']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('strapon')}
                        onChange={handleServiceChange('strapon')}
                      />
                    }
                    label={serviceTranslations['strapon']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('bondage')}
                        onChange={handleServiceChange('bondage')}
                      />
                    }
                    label={serviceTranslations['bondage']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('slave')}
                        onChange={handleServiceChange('slave')}
                      />
                    }
                    label={serviceTranslations['slave']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('role_play')}
                        onChange={handleServiceChange('role_play')}
                      />
                    }
                    label={serviceTranslations['role_play']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('foot_fetish')}
                        onChange={handleServiceChange('foot_fetish')}
                      />
                    }
                    label={serviceTranslations['foot_fetish']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('golden_rain_out')}
                        onChange={handleServiceChange('golden_rain_out')}
                      />
                    }
                    label={serviceTranslations['golden_rain_out']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('golden_rain_in')}
                        onChange={handleServiceChange('golden_rain_in')}
                      />
                    }
                    label={serviceTranslations['golden_rain_in']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('copro_out')}
                        onChange={handleServiceChange('copro_out')}
                      />
                    }
                    label={serviceTranslations['copro_out']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('copro_in')}
                        onChange={handleServiceChange('copro_in')}
                      />
                    }
                    label={serviceTranslations['copro_in']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('enema')}
                        onChange={handleServiceChange('enema')}
                      />
                    }
                    label={serviceTranslations['enema']}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Эротический массаж
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('relaxing')}
                        onChange={handleServiceChange('relaxing')}
                      />
                    }
                    label={serviceTranslations['relaxing']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('professional')}
                        onChange={handleServiceChange('professional')}
                      />
                    }
                    label={serviceTranslations['professional']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('body_massage')}
                        onChange={handleServiceChange('body_massage')}
                      />
                    }
                    label={serviceTranslations['body_massage']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('lingam_massage')}
                        onChange={handleServiceChange('lingam_massage')}
                      />
                    }
                    label={serviceTranslations['lingam_massage']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('four_hands')}
                        onChange={handleServiceChange('four_hands')}
                      />
                    }
                    label={serviceTranslations['four_hands']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('urological')}
                        onChange={handleServiceChange('urological')}
                      />
                    }
                    label={serviceTranslations['urological']}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Шоу
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('strip_pro')}
                        onChange={handleServiceChange('strip_pro')}
                      />
                    }
                    label={serviceTranslations['strip_pro']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('strip_amateur')}
                        onChange={handleServiceChange('strip_amateur')}
                      />
                    }
                    label={serviceTranslations['strip_amateur']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('belly_dance')}
                        onChange={handleServiceChange('belly_dance')}
                      />
                    }
                    label={serviceTranslations['belly_dance']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('twerk')}
                        onChange={handleServiceChange('twerk')}
                      />
                    }
                    label={serviceTranslations['twerk']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('lesbian_show')}
                        onChange={handleServiceChange('lesbian_show')}
                      />
                    }
                    label={serviceTranslations['lesbian_show']}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Виртуальные услуги
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('sex_chat')}
                        onChange={handleServiceChange('sex_chat')}
                      />
                    }
                    label={serviceTranslations['sex_chat']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('phone_sex')}
                        onChange={handleServiceChange('phone_sex')}
                      />
                    }
                    label={serviceTranslations['phone_sex']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('video_sex')}
                        onChange={handleServiceChange('video_sex')}
                      />
                    }
                    label={serviceTranslations['video_sex']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('photo_video')}
                        onChange={handleServiceChange('photo_video')}
                      />
                    }
                    label={serviceTranslations['photo_video']}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Могу позвать
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('invite_girlfriend')}
                        onChange={handleServiceChange('invite_girlfriend')}
                      />
                    }
                    label={serviceTranslations['invite_girlfriend']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('invite_friend')}
                        onChange={handleServiceChange('invite_friend')}
                      />
                    }
                    label={serviceTranslations['invite_friend']}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Дополнительно
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('escort')}
                        onChange={handleServiceChange('escort')}
                      />
                    }
                    label={serviceTranslations['escort']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('photoshoot')}
                        onChange={handleServiceChange('photoshoot')}
                      />
                    }
                    label={serviceTranslations['photoshoot']}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.services?.includes('skirt')}
                        onChange={handleServiceChange('skirt')}
                      />
                    }
                    label={serviceTranslations['skirt']}
                  />
                </FormGroup>
              </Grid>

              {/* Цены */}
              <Grid item xs={12}>
                <Divider />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Цены
                </Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Экспресс"
                  value={formData.priceExpress}
                  onChange={handleChange('priceExpress')}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="1 час"
                  value={formData.price1Hour}
                  onChange={handleChange('price1Hour')}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="2 часа"
                  value={formData.price2Hours}
                  onChange={handleChange('price2Hours')}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Ночь"
                  value={formData.priceNight}
                  onChange={handleChange('priceNight')}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              {/* Место встречи */}
              <Grid item xs={12}>
                <Divider />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Место встречи
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.inCall}
                      onChange={handleCheckboxChange('inCall')}
                    />
                  }
                  label="У себя"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.outCall}
                      onChange={handleCheckboxChange('outCall')}
                    />
                  }
                  label="Выезд"
                />
              </Grid>

              {/* Дополнительно */}
              <Grid item xs={12}>
                <Divider />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Дополнительно
                </Typography>
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isNonSmoking}
                      onChange={handleCheckboxChange('isNonSmoking')}
                    />
                  }
                  label="Не курит"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isNew}
                      onChange={handleCheckboxChange('isNew')}
                    />
                  }
                  label="Новенькая"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isWaitingCall}
                      onChange={handleCheckboxChange('isWaitingCall')}
                    />
                  }
                  label="Ждёт звонка"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is24Hours}
                      onChange={handleCheckboxChange('is24Hours')}
                    />
                  }
                  label="Круглосуточно"
                />
              </Grid>

              {/* Соседи */}
              <Grid item xs={12}>
                <Divider />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Соседи
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isAlone}
                      onChange={handleCheckboxChange('isAlone')}
                    />
                  }
                  label="Одна"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.withFriend}
                      onChange={handleCheckboxChange('withFriend')}
                    />
                  }
                  label="С подругой"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.withFriends}
                      onChange={handleCheckboxChange('withFriends')}
                    />
                  }
                  label="С несколькими подругами"
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {profile ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileEditor; 