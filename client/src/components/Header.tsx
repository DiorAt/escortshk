import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
  styled,
  SelectChangeEvent,
} from '@mui/material';
import { Add as AddIcon, Language } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { City, Language as LanguageType } from '../types';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: 'none',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  '& .MuiSelect-icon': {
    color: 'white',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid rgba(255, 255, 255, 0.5)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid rgba(255, 255, 255, 0.7)',
  },
  minWidth: 120,
  height: 40,
}));

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.info.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.info.dark,
  },
  height: 40,
}));

interface HeaderProps {
  cities: City[];
  languages: LanguageType[];
  selectedCity: City | null;
  selectedLanguage: LanguageType;
  onCityChange: (city: City) => void;
  onLanguageChange: (language: LanguageType) => void;
}

const Header: React.FC<HeaderProps> = ({
  cities,
  languages,
  selectedCity,
  selectedLanguage,
  onCityChange,
  onLanguageChange,
}) => {
  const navigate = useNavigate();

  const handleCityChange = (event: SelectChangeEvent<number>) => {
    const city = cities.find(c => c.id === event.target.value);
    if (city) {
      onCityChange(city);
    }
  };

  const handleLanguageChange = (event: SelectChangeEvent<number>) => {
    const language = languages.find(l => l.id === event.target.value);
    if (language) {
      onLanguageChange(language);
    }
  };

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onClick={() => navigate('/')}
        >
          Проститутки {selectedCity?.name || ''}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <StyledSelect
            value={selectedCity?.id || ''}
            onChange={handleCityChange}
            displayEmpty
            renderValue={(value) => {
              if (!value) return 'Выберите город';
              const city = cities.find(c => c.id === value);
              return city?.name || '';
            }}
          >
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </StyledSelect>

          <StyledSelect
            value={selectedLanguage.id}
            onChange={handleLanguageChange}
            IconComponent={() => <Language sx={{ color: 'white', mr: 1 }} />}
          >
            {languages.map((language) => (
              <MenuItem key={language.id} value={language.id}>
                {language.name}
              </MenuItem>
            ))}
          </StyledSelect>

          <AddButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-profile')}
          >
            Добавить анкету
          </AddButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 