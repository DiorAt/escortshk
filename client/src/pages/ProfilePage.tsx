import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
  styled,
  Divider,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Home as HomeIcon,
  VerifiedUser as VerifiedIcon,
  AccessTime as TimeIcon,
  SmokingRooms as SmokingIcon,
  SmokeFree as NoSmokingIcon,
  Star as StarIcon,
  Group as GroupIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { Profile } from '../types';
import { api } from '../utils/api';
import { serviceTranslations } from '../utils/serviceTranslations';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const IconChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const ProfileImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/profiles/${id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Ошибка при загрузке анкеты');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Анкета не найдена'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Основная информация */}
        <Grid item xs={12}>
          <StyledPaper>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                {profile.name}, {profile.age}
              </Typography>
              <Chip
                icon={<VerifiedIcon />}
                label={profile.isVerified ? "Проверено" : "Не проверено"}
                color={profile.isVerified ? "success" : "warning"}
                sx={{ ml: 2 }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {profile.city?.name && <Chip label={profile.city.name} />}
              {profile.district && <Chip label={profile.district} />}
              {profile.inCall && <IconChip icon={<HomeIcon />} label="Принимает у себя" />}
              {profile.outCall && <IconChip icon={<CarIcon />} label="Выезжает" />}
            </Box>
          </StyledPaper>
        </Grid>

        {/* Фотографии */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Фотографии
            </Typography>
            <ImageList cols={2} gap={16}>
              {profile.photos.map((photo, index) => (
                <ImageListItem key={index}>
                  <ProfileImage
                    src={photo}
                    alt={`${profile.name} фото ${index + 1}`}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </StyledPaper>
        </Grid>

        {/* Параметры и цены */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Параметры
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>Рост: {profile.height} см</Typography>
              <Typography>Вес: {profile.weight} кг</Typography>
              <Typography>Грудь: {profile.breastSize}</Typography>
              {profile.nationality && <Typography>Национальность: {profile.nationality}</Typography>}
              {profile.hairColor && <Typography>Цвет волос: {profile.hairColor}</Typography>}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Цены
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {profile.priceExpress > 0 && (
                <Typography>Экспресс: {profile.priceExpress}₽</Typography>
              )}
              <Typography>1 час: {profile.price1Hour}₽</Typography>
              <Typography>2 часа: {profile.price2Hours}₽</Typography>
              <Typography>Ночь: {profile.priceNight}₽</Typography>
            </Box>
          </StyledPaper>

          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Дополнительно
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.isNonSmoking ? (
                <IconChip icon={<NoSmokingIcon />} label="Не курит" />
              ) : (
                <IconChip icon={<SmokingIcon />} label="Курит" />
              )}
              {profile.is24Hours && <IconChip icon={<TimeIcon />} label="24 часа" />}
              {profile.isNew && <IconChip icon={<StarIcon />} label="Новенькая" />}
              {profile.isAlone ? (
                <IconChip icon={<PersonIcon />} label="Одна" />
              ) : (
                <IconChip icon={<GroupIcon />} label="С подругами" />
              )}
            </Box>
          </StyledPaper>
        </Grid>

        {/* Описание */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Описание
            </Typography>
            <Typography variant="body1">
              {profile.description}
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Услуги */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Услуги
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.services.map((service, index) => (
                <Chip key={index} label={serviceTranslations[service] || service} />
              ))}
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage; 