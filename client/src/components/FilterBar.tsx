import React from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Popover,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Slider,
  TextField,
} from '@mui/material';
import {
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';

const FilterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 0,
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& > *': {
    flex: 1,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  '& .MuiSelect-select': {
    padding: '8px 32px 8px 12px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.text.primary,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiMenu-paper': {
    backgroundColor: theme.palette.background.paper,
  },
  width: '100%',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  textTransform: 'none',
  boxShadow: 'none',
  width: '100%',
  height: '40px',
}));

const ButtonContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  flex: 2,
  '& > *': {
    flex: 1,
  },
});

const FilterPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    backgroundColor: theme.palette.background.paper,
    marginTop: '8px',
    minWidth: '300px',
    maxHeight: '80vh',
    padding: theme.spacing(2),
  },
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  marginTop: theme.spacing(2),
  width: '100%',
}));

const CollapseButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },
  padding: 0,
  marginTop: theme.spacing(1),
}));

const RangeContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  '& .MuiTypography-caption': {
    color: theme.palette.text.secondary,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.default,
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& input': {
    padding: '8px 12px',
    width: '100px',
  },
}));

interface FilterBarProps {
  filters: FilterParams;
  districts: string[];
  onFilterChange: (filters: FilterParams) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, districts = [], onFilterChange }) => {
  const [localFilters, setLocalFilters] = React.useState(filters);

  const [genderAnchorEl, setGenderAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tempGenderFilters, setTempGenderFilters] = React.useState<string[]>([]);

  const handleGenderClick = (event: React.MouseEvent<HTMLElement>) => {
    setGenderAnchorEl(event.currentTarget);
    setTempGenderFilters([...filters.gender]);
  };

  const handleGenderClose = () => {
    setGenderAnchorEl(null);
  };

  const handleGenderChange = (value: string) => {
    const currentIndex = tempGenderFilters.indexOf(value);
    const newChecked = [...tempGenderFilters];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setTempGenderFilters(newChecked);
  };

  const handleGenderApply = () => {
    const newFilters = {
      ...filters,
      gender: tempGenderFilters,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
    handleGenderClose();
  };

  const handleFilterChange = (field: string) => (event: SelectChangeEvent) => {
    const newFilters = {
      ...filters,
      [field]: event.target.value,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
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
      price: {
        from: null,
        to: null,
        hasExpress: false,
      },
      services: [],
      verification: [],
      other: [],
      outcall: false,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const IconComponent = () => <ArrowDownIcon />;

  const genderOpen = Boolean(genderAnchorEl);

  const [appearanceAnchorEl, setAppearanceAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tempAppearanceFilters, setTempAppearanceFilters] = React.useState(filters.appearance);

  const handleAppearanceClick = (event: React.MouseEvent<HTMLElement>) => {
    setAppearanceAnchorEl(event.currentTarget);
    setTempAppearanceFilters({...filters.appearance});
  };

  const handleAppearanceClose = () => {
    setAppearanceAnchorEl(null);
  };

  const handleAppearanceApply = () => {
    const newFilters = {
      ...filters,
      appearance: tempAppearanceFilters,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
    handleAppearanceClose();
  };

  const handleRangeChange = (field: keyof typeof tempAppearanceFilters) => 
    (event: Event, newValue: number | number[]) => {
      setTempAppearanceFilters({
        ...tempAppearanceFilters,
        [field]: newValue,
      });
  };

  const handleCheckboxChange = (field: keyof typeof tempAppearanceFilters, value: string) => {
    const currentArray = tempAppearanceFilters[field] as string[];
    const currentIndex = currentArray.indexOf(value);
    const newArray = [...currentArray];

    if (currentIndex === -1) {
      newArray.push(value);
    } else {
      newArray.splice(currentIndex, 1);
    }

    setTempAppearanceFilters({
      ...tempAppearanceFilters,
      [field]: newArray,
    });
  };

  const appearanceOpen = Boolean(appearanceAnchorEl);

  const [districtAnchorEl, setDistrictAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tempDistrictFilters, setTempDistrictFilters] = React.useState<string[]>([]);

  const handleDistrictClick = (event: React.MouseEvent<HTMLElement>) => {
    setDistrictAnchorEl(event.currentTarget);
    setTempDistrictFilters([...filters.district]);
  };

  const handleDistrictClose = () => {
    setDistrictAnchorEl(null);
  };

  const handleDistrictChange = (value: string) => {
    const currentIndex = tempDistrictFilters.indexOf(value);
    const newChecked = [...tempDistrictFilters];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setTempDistrictFilters(newChecked);
  };

  const handleDistrictApply = () => {
    const newFilters = {
      ...filters,
      district: tempDistrictFilters,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
    handleDistrictClose();
  };

  const districtOpen = Boolean(districtAnchorEl);

  const [servicesAnchorEl, setServicesAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tempServicesFilters, setTempServicesFilters] = React.useState<string[]>([]);

  const handleServicesClick = (event: React.MouseEvent<HTMLElement>) => {
    setServicesAnchorEl(event.currentTarget);
    setTempServicesFilters([...filters.services.split(',').filter(Boolean)]);
  };

  const handleServicesClose = () => {
    setServicesAnchorEl(null);
  };

  const handleServicesChange = (value: string) => {
    const currentIndex = tempServicesFilters.indexOf(value);
    const newChecked = [...tempServicesFilters];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setTempServicesFilters(newChecked);
  };

  const handleServicesApply = () => {
    const newFilters = {
      ...filters,
      services: tempServicesFilters.join(','),
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
    handleServicesClose();
  };

  const servicesOpen = Boolean(servicesAnchorEl);

  const [verificationAnchorEl, setVerificationAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tempVerificationFilters, setTempVerificationFilters] = React.useState<string[]>([]);

  const handleVerificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setVerificationAnchorEl(event.currentTarget);
    setTempVerificationFilters([...filters.verification.split(',').filter(Boolean)]);
  };

  const handleVerificationClose = () => {
    setVerificationAnchorEl(null);
  };

  const handleVerificationChange = (value: string) => {
    const currentIndex = tempVerificationFilters.indexOf(value);
    const newChecked = [...tempVerificationFilters];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setTempVerificationFilters(newChecked);
  };

  const handleVerificationApply = () => {
    const newFilters = {
      ...filters,
      verification: tempVerificationFilters.join(','),
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
    handleVerificationClose();
  };

  const verificationOpen = Boolean(verificationAnchorEl);

  const [otherAnchorEl, setOtherAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tempOtherFilters, setTempOtherFilters] = React.useState<string[]>([]);

  const handleOtherClick = (event: React.MouseEvent<HTMLElement>) => {
    setOtherAnchorEl(event.currentTarget);
    setTempOtherFilters([...filters.other.split(',').filter(Boolean)]);
  };

  const handleOtherClose = () => {
    setOtherAnchorEl(null);
  };

  const handleOtherChange = (value: string) => {
    const currentIndex = tempOtherFilters.indexOf(value);
    const newChecked = [...tempOtherFilters];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setTempOtherFilters(newChecked);
  };

  const handleOtherApply = () => {
    const newFilters = {
      ...filters,
      other: tempOtherFilters.join(','),
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
    handleOtherClose();
  };

  const otherOpen = Boolean(otherAnchorEl);

  const handleOutcallChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      outcall: event.target.checked,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const [priceAnchorEl, setPriceAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tempPriceFilters, setTempPriceFilters] = React.useState(filters.price);

  const handlePriceClick = (event: React.MouseEvent<HTMLElement>) => {
    setPriceAnchorEl(event.currentTarget);
    setTempPriceFilters({...filters.price});
  };

  const handlePriceClose = () => {
    setPriceAnchorEl(null);
  };

  const handlePriceFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? null : Number(event.target.value);
    setTempPriceFilters({
      ...tempPriceFilters,
      from: value,
    });
  };

  const handlePriceToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? null : Number(event.target.value);
    setTempPriceFilters({
      ...tempPriceFilters,
      to: value,
    });
  };

  const handleExpressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempPriceFilters({
      ...tempPriceFilters,
      hasExpress: event.target.checked,
    });
  };

  const handlePriceApply = () => {
    const newFilters = {
      ...filters,
      price: tempPriceFilters,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
    handlePriceClose();
  };

  const priceOpen = Boolean(priceAnchorEl);

  return (
    <FilterContainer>
      <StyledSelect
        value={filters.gender.length ? filters.gender.join(', ') : ''}
        onClick={handleGenderClick}
        displayEmpty
        IconComponent={IconComponent}
        renderValue={(value) => value || 'Пол'}
        open={false}
      >
      </StyledSelect>

      <FilterPopover
        open={genderOpen}
        anchorEl={genderAnchorEl}
        onClose={handleGenderClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Пол
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempGenderFilters.includes('female')}
                onChange={() => handleGenderChange('female')}
              />
            }
            label="Девушка"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempGenderFilters.includes('trans')}
                onChange={() => handleGenderChange('trans')}
              />
            }
            label="Транс"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempGenderFilters.includes('male')}
                onChange={() => handleGenderChange('male')}
              />
            }
            label="Парень"
          />
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Ориентация
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempGenderFilters.includes('hetero')}
                onChange={() => handleGenderChange('hetero')}
              />
            }
            label="Гетеро"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempGenderFilters.includes('homo')}
                onChange={() => handleGenderChange('homo')}
              />
            }
            label="Гомо"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempGenderFilters.includes('bi')}
                onChange={() => handleGenderChange('bi')}
              />
            }
            label="Би"
          />
        </Box>
        <ApplyButton onClick={handleGenderApply}>
          Применить
        </ApplyButton>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CollapseButton onClick={handleGenderClose}>
            Свернуть
          </CollapseButton>
        </Box>
      </FilterPopover>

      <StyledSelect
        value=""
        onClick={handleAppearanceClick}
        displayEmpty
        IconComponent={IconComponent}
        renderValue={() => 'Внешность'}
        open={false}
      >
      </StyledSelect>

      <FilterPopover
        open={appearanceOpen}
        anchorEl={appearanceAnchorEl}
        onClose={handleAppearanceClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Возраст
        </Typography>
        <RangeContainer>
          <Slider
            value={tempAppearanceFilters.age}
            onChange={handleRangeChange('age')}
            min={18}
            max={70}
            valueLabelDisplay="auto"
          />
          <Typography variant="caption">
            От {tempAppearanceFilters.age[0]} до {tempAppearanceFilters.age[1]} лет
          </Typography>
        </RangeContainer>

        <Typography variant="subtitle1" gutterBottom>
          Рост
        </Typography>
        <RangeContainer>
          <Slider
            value={tempAppearanceFilters.height}
            onChange={handleRangeChange('height')}
            min={140}
            max={195}
            valueLabelDisplay="auto"
          />
          <Typography variant="caption">
            От {tempAppearanceFilters.height[0]} до {tempAppearanceFilters.height[1]} см
          </Typography>
        </RangeContainer>

        <Typography variant="subtitle1" gutterBottom>
          Вес
        </Typography>
        <RangeContainer>
          <Slider
            value={tempAppearanceFilters.weight}
            onChange={handleRangeChange('weight')}
            min={40}
            max={110}
            valueLabelDisplay="auto"
          />
          <Typography variant="caption">
            От {tempAppearanceFilters.weight[0]} до {tempAppearanceFilters.weight[1]} кг
          </Typography>
        </RangeContainer>

        <Typography variant="subtitle1" gutterBottom>
          Грудь
        </Typography>
        <RangeContainer>
          <Slider
            value={tempAppearanceFilters.breastSize}
            onChange={handleRangeChange('breastSize')}
            min={1}
            max={10}
            valueLabelDisplay="auto"
          />
          <Typography variant="caption">
            От {tempAppearanceFilters.breastSize[0]} до {tempAppearanceFilters.breastSize[1]} размера
          </Typography>
        </RangeContainer>

        <Divider sx={{ my: 1 }} />

        <Typography variant="subtitle1" gutterBottom>
          Национальность
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.nationality.includes('slavic')}
                onChange={() => handleCheckboxChange('nationality', 'slavic')}
              />
            }
            label="Славянка"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.nationality.includes('caucasian')}
                onChange={() => handleCheckboxChange('nationality', 'caucasian')}
              />
            }
            label="Кавказская"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.nationality.includes('african')}
                onChange={() => handleCheckboxChange('nationality', 'african')}
              />
            }
            label="Африканка"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.nationality.includes('asian')}
                onChange={() => handleCheckboxChange('nationality', 'asian')}
              />
            }
            label="Азиатка"
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Цвет волос
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.hairColor.includes('blonde')}
                onChange={() => handleCheckboxChange('hairColor', 'blonde')}
              />
            }
            label="Блондинка"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.hairColor.includes('brunette')}
                onChange={() => handleCheckboxChange('hairColor', 'brunette')}
              />
            }
            label="Брюнетка"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.hairColor.includes('brown')}
                onChange={() => handleCheckboxChange('hairColor', 'brown')}
              />
            }
            label="Шатенка"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.hairColor.includes('red')}
                onChange={() => handleCheckboxChange('hairColor', 'red')}
              />
            }
            label="Рыжая"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.hairColor.includes('other')}
                onChange={() => handleCheckboxChange('hairColor', 'other')}
              />
            }
            label="Другой"
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Зона бикини
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.bikiniZone.includes('smooth')}
                onChange={() => handleCheckboxChange('bikiniZone', 'smooth')}
              />
            }
            label="гладкая"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.bikiniZone.includes('strip')}
                onChange={() => handleCheckboxChange('bikiniZone', 'strip')}
              />
            }
            label="интимная стрижка"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempAppearanceFilters.bikiniZone.includes('natural')}
                onChange={() => handleCheckboxChange('bikiniZone', 'natural')}
              />
            }
            label="мохнатка"
          />
        </Box>

        <ApplyButton onClick={handleAppearanceApply}>
          Применить
        </ApplyButton>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CollapseButton onClick={handleAppearanceClose}>
            Свернуть
          </CollapseButton>
        </Box>
      </FilterPopover>

      <StyledSelect
        value={filters.district.length ? filters.district.join(', ') : ''}
        onClick={handleDistrictClick}
        displayEmpty
        IconComponent={IconComponent}
        renderValue={(value) => value || 'Район'}
        open={false}
      >
      </StyledSelect>

      <FilterPopover
        open={districtOpen}
        anchorEl={districtAnchorEl}
        onClose={handleDistrictClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Район
        </Typography>
        {districts.map((district) => (
          <Box key={district}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempDistrictFilters.includes(district)}
                  onChange={() => handleDistrictChange(district)}
                />
              }
              label={district}
            />
          </Box>
        ))}
        <ApplyButton onClick={handleDistrictApply}>
          Применить
        </ApplyButton>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CollapseButton onClick={handleDistrictClose}>
            Свернуть
          </CollapseButton>
        </Box>
      </FilterPopover>

      <StyledSelect
        value={filters.price.from ? `${filters.price.from}₽ - ${filters.price.to || '∞'}₽` : ''}
        onClick={handlePriceClick}
        displayEmpty
        IconComponent={IconComponent}
        renderValue={(value) => value || 'Цена'}
        open={false}
      >
      </StyledSelect>

      <FilterPopover
        open={priceOpen}
        anchorEl={priceAnchorEl}
        onClose={handlePriceClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Цена за час
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography>От</Typography>
          <StyledTextField
            type="number"
            value={tempPriceFilters.from || ''}
            onChange={handlePriceFromChange}
            inputProps={{ min: 0 }}
          />
          <Typography>до</Typography>
          <StyledTextField
            type="number"
            value={tempPriceFilters.to || ''}
            onChange={handlePriceToChange}
            inputProps={{ min: 0 }}
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempPriceFilters.hasExpress}
                onChange={handleExpressChange}
              />
            }
            label="Есть экспресс"
          />
        </Box>
        <ApplyButton onClick={handlePriceApply}>
          Применить
        </ApplyButton>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CollapseButton onClick={handlePriceClose}>
            Свернуть
          </CollapseButton>
        </Box>
      </FilterPopover>

      <StyledSelect
        value={filters.services}
        onClick={handleServicesClick}
        displayEmpty
        IconComponent={IconComponent}
        renderValue={(value) => value || 'Услуги'}
        open={false}
      >
      </StyledSelect>

      <FilterPopover
        open={servicesOpen}
        anchorEl={servicesAnchorEl}
        onClose={handleServicesClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Секс
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('classic')}
                onChange={() => handleServicesChange('classic')}
              />
            }
            label="Классический"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('anal')}
                onChange={() => handleServicesChange('anal')}
              />
            }
            label="Анальный"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('lesbian')}
                onChange={() => handleServicesChange('lesbian')}
              />
            }
            label="Лесбийский"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('group_mmf')}
                onChange={() => handleServicesChange('group_mmf')}
              />
            }
            label="Групповой (МЖМ)"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('group_ffm')}
                onChange={() => handleServicesChange('group_ffm')}
              />
            }
            label="Групповой (ЖМЖ)"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('with_toys')}
                onChange={() => handleServicesChange('with_toys')}
              />
            }
            label="С игрушками"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('in_car')}
                onChange={() => handleServicesChange('in_car')}
              />
            }
            label="В авто"
          />
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Ласки клиенту
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('blowjob_with_condom')}
                onChange={() => handleServicesChange('blowjob_with_condom')}
              />
            }
            label="Минет в презервативе"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('blowjob_without_condom')}
                onChange={() => handleServicesChange('blowjob_without_condom')}
              />
            }
            label="Минет без презерватива"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('deep_blowjob')}
                onChange={() => handleServicesChange('deep_blowjob')}
              />
            }
            label="Глубокий минет"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('car_blowjob')}
                onChange={() => handleServicesChange('car_blowjob')}
              />
            }
            label="Минет в авто"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('anilingus_to_client')}
                onChange={() => handleServicesChange('anilingus_to_client')}
              />
            }
            label="Анилингус"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('fisting_to_client')}
                onChange={() => handleServicesChange('fisting_to_client')}
              />
            }
            label="Фистинг"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('kisses')}
                onChange={() => handleServicesChange('kisses')}
              />
            }
            label="Поцелуи"
          />
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          BDSM и фетиш
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('light_domination')}
                onChange={() => handleServicesChange('light_domination')}
              />
            }
            label="Лёгкая доминация"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('mistress')}
                onChange={() => handleServicesChange('mistress')}
              />
            }
            label="Госпожа"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('flogging')}
                onChange={() => handleServicesChange('flogging')}
              />
            }
            label="Порка"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('trampling')}
                onChange={() => handleServicesChange('trampling')}
              />
            }
            label="Трамплинг"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('face_sitting')}
                onChange={() => handleServicesChange('face_sitting')}
              />
            }
            label="Фейсситтинг"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('strapon')}
                onChange={() => handleServicesChange('strapon')}
              />
            }
            label="Страпон"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('bondage')}
                onChange={() => handleServicesChange('bondage')}
              />
            }
            label="Бондаж"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('slave')}
                onChange={() => handleServicesChange('slave')}
              />
            }
            label="Рабыня"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('role_play')}
                onChange={() => handleServicesChange('role_play')}
              />
            }
            label="Ролевые игры"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('foot_fetish')}
                onChange={() => handleServicesChange('foot_fetish')}
              />
            }
            label="Фут-фетиш"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('golden_rain_out')}
                onChange={() => handleServicesChange('golden_rain_out')}
              />
            }
            label="Зол. дождь выдача"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('golden_rain_in')}
                onChange={() => handleServicesChange('golden_rain_in')}
              />
            }
            label="Зол. дождь прием"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('copro_out')}
                onChange={() => handleServicesChange('copro_out')}
              />
            }
            label="Копро выдача"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('copro_in')}
                onChange={() => handleServicesChange('copro_in')}
              />
            }
            label="Копро прием"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('enema')}
                onChange={() => handleServicesChange('enema')}
              />
            }
            label="Клизма"
          />
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Эротический массаж
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('relaxing')}
                onChange={() => handleServicesChange('relaxing')}
              />
            }
            label="Расслабляющий"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('professional')}
                onChange={() => handleServicesChange('professional')}
              />
            }
            label="Профессиональный"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('body_massage')}
                onChange={() => handleServicesChange('body_massage')}
              />
            }
            label="Массаж телом"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('lingam_massage')}
                onChange={() => handleServicesChange('lingam_massage')}
              />
            }
            label="Массаж лингама (члена)"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('four_hands')}
                onChange={() => handleServicesChange('four_hands')}
              />
            }
            label="В четыре руки"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('urological')}
                onChange={() => handleServicesChange('urological')}
              />
            }
            label="Урологический"
          />
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Шоу
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('strip_pro')}
                onChange={() => handleServicesChange('strip_pro')}
              />
            }
            label="Стриптиз профи"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('strip_amateur')}
                onChange={() => handleServicesChange('strip_amateur')}
              />
            }
            label="Стриптиз любительский"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('belly_dance')}
                onChange={() => handleServicesChange('belly_dance')}
              />
            }
            label="Танец живота"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('twerk')}
                onChange={() => handleServicesChange('twerk')}
              />
            }
            label="Тверк"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('lesbian_show')}
                onChange={() => handleServicesChange('lesbian_show')}
              />
            }
            label="Лесби-шоу"
          />
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Виртуальные услуги
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('sex_chat')}
                onChange={() => handleServicesChange('sex_chat')}
              />
            }
            label="Секс чат"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('phone_sex')}
                onChange={() => handleServicesChange('phone_sex')}
              />
            }
            label="Секс по телефону"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('video_sex')}
                onChange={() => handleServicesChange('video_sex')}
              />
            }
            label="Секс по видео"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('photo_video')}
                onChange={() => handleServicesChange('photo_video')}
              />
            }
            label="Отправка фото/видео"
          />
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Могу позвать
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('invite_girlfriend')}
                onChange={() => handleServicesChange('invite_girlfriend')}
              />
            }
            label="Подругу"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('invite_friend')}
                onChange={() => handleServicesChange('invite_friend')}
              />
            }
            label="Друга"
          />
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Дополнительно
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('escort')}
                onChange={() => handleServicesChange('escort')}
              />
            }
            label="Эскорт"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('photoshoot')}
                onChange={() => handleServicesChange('photoshoot')}
              />
            }
            label="Фотосъёмка"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempServicesFilters.includes('skirt')}
                onChange={() => handleServicesChange('skirt')}
              />
            }
            label="Сквирт"
          />
        </Box>

        <ApplyButton onClick={handleServicesApply}>
          Применить
        </ApplyButton>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CollapseButton onClick={handleServicesClose}>
            Свернуть
          </CollapseButton>
        </Box>
      </FilterPopover>

      <StyledSelect
        value={filters.verification}
        onClick={handleVerificationClick}
        displayEmpty
        IconComponent={IconComponent}
        renderValue={(value) => value || 'Проверка'}
        open={false}
      >
      </StyledSelect>

      <FilterPopover
        open={verificationOpen}
        anchorEl={verificationAnchorEl}
        onClose={handleVerificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Проверка
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempVerificationFilters.includes('verified')}
                onChange={() => handleVerificationChange('verified')}
              />
            }
            label="Проверенные анкеты"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempVerificationFilters.includes('verified_photos')}
                onChange={() => handleVerificationChange('verified_photos')}
              />
            }
            label="С проверенными фото"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempVerificationFilters.includes('with_video')}
                onChange={() => handleVerificationChange('with_video')}
              />
            }
            label="С видео"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempVerificationFilters.includes('with_reviews')}
                onChange={() => handleVerificationChange('with_reviews')}
              />
            }
            label="С отзывами"
          />
        </Box>
        <ApplyButton onClick={handleVerificationApply}>
          Применить
        </ApplyButton>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CollapseButton onClick={handleVerificationClose}>
            Свернуть
          </CollapseButton>
        </Box>
      </FilterPopover>

      <StyledSelect
        value={filters.other}
        onClick={handleOtherClick}
        displayEmpty
        IconComponent={IconComponent}
        renderValue={(value) => value || 'Прочее'}
        open={false}
      >
      </StyledSelect>

      <FilterPopover
        open={otherOpen}
        anchorEl={otherAnchorEl}
        onClose={handleOtherClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Прочее
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempOtherFilters.includes('non_smoking')}
                onChange={() => handleOtherChange('non_smoking')}
              />
            }
            label="Только не курящие"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempOtherFilters.includes('new')}
                onChange={() => handleOtherChange('new')}
              />
            }
            label="Новые"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempOtherFilters.includes('waiting_call')}
                onChange={() => handleOtherChange('waiting_call')}
              />
            }
            label="Ждут звонка"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempOtherFilters.includes('24_hours')}
                onChange={() => handleOtherChange('24_hours')}
              />
            }
            label="Круглосуточно"
          />
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Соседи
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempOtherFilters.includes('alone')}
                onChange={() => handleOtherChange('alone')}
              />
            }
            label="я одна"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempOtherFilters.includes('with_friend')}
                onChange={() => handleOtherChange('with_friend')}
              />
            }
            label="я и подруга"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempOtherFilters.includes('with_friends')}
                onChange={() => handleOtherChange('with_friends')}
              />
            }
            label="я и несколько подруг"
          />
        </Box>
        <ApplyButton onClick={handleOtherApply}>
          Применить
        </ApplyButton>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CollapseButton onClick={handleOtherClose}>
            Свернуть
          </CollapseButton>
        </Box>
      </FilterPopover>

      <ButtonContainer>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.outcall || false}
              onChange={handleOutcallChange}
            />
          }
          label="Выезд"
          sx={{ 
            margin: 0,
            '& .MuiFormControlLabel-label': {
              color: theme => theme.palette.text.primary
            }
          }}
        />

        <ActionButton onClick={handleReset}>
          Сброс
        </ActionButton>
      </ButtonContainer>
    </FilterContainer>
  );
};

export default FilterBar; 