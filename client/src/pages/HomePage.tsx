import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  CircularProgress,
  Box,
  Alert,
  Typography,
  Paper,
  styled,
} from '@mui/material';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import ProfileCard from '../components/ProfileCard';
import { Profile, City, Language, FilterParams } from '../types';
import axios from 'axios';
import { API_URL } from '../config';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  paddingBottom: theme.spacing(4),
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const initialFilters: FilterParams = {
  gender: [],
  appearance: {
    age: [18, 70],
    height: [140, 195],
    weight: [40, 110],
    breastSize: [1, 10],
    nationality: [],
    hairColor: [],
    bikiniZone: [],
  },
  district: [],
  price: '',
  services: '',
  verification: '',
  other: '',
};

const HomePage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [languages] = useState<Language[]>([
    { id: 1, code: 'ru', name: 'Русский' },
    { id: 2, code: 'en', name: 'English' }
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [districts, setDistricts] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    // Загрузка городов
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_URL}/cities`);
        setCities(response.data);
        if (response.data.length > 0) {
          setSelectedCity(response.data[0]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке городов:', error);
        setError('Ошибка при загрузке городов');
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    // Загрузка анкет
    const fetchProfiles = async () => {
      setLoading(true);
      setError('');
      
      try {
        const params = {
          ...(selectedCity && { cityId: selectedCity.id }),
          ...filters
        };

        const response = await axios.get(`${API_URL}/profiles`, { params });
        setProfiles(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке анкет:', error);
        setError('Ошибка при загрузке анкет');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [selectedCity, filters]);

  useEffect(() => {
    // Загрузка справочников для фильтров
    const fetchFilterData = async () => {
      if (!selectedCity) return;
      
      try {
        const [districtsResponse, servicesResponse] = await Promise.all([
          axios.get(`${API_URL}/districts/${selectedCity.id}`),
          axios.get(`${API_URL}/services`)
        ]);
        
        setDistricts(districtsResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных для фильтров:', error);
      }
    };

    fetchFilterData();
  }, [selectedCity]);

  const renderContent = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Загрузка анкет...
          </Typography>
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <StyledAlert severity="error">
          {error}
        </StyledAlert>
      );
    }

    if (profiles.length === 0) {
      return (
        <StyledAlert severity="info">
          По вашему запросу ничего не найдено
        </StyledAlert>
      );
    }

    return (
      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <ProfileCard profile={profile} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <PageContainer>
      <Header
        cities={cities}
        languages={languages}
        selectedCity={selectedCity}
        selectedLanguage={selectedLanguage}
        onCityChange={setSelectedCity}
        onLanguageChange={setSelectedLanguage}
      />
      <ContentContainer maxWidth="lg">
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          districts={districts}
        />
        {renderContent()}
      </ContentContainer>
    </PageContainer>
  );
};

export default HomePage; 