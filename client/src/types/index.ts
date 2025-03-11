export interface Profile {
  id: number;
  name: string;
  age: number;
  height: number;
  weight: number;
  breastSize: number;
  phone: string;
  description: string;
  photos: string[];
  price1Hour: number;
  price2Hours: number;
  priceNight: number;
  priceExpress: number;
  workingHours?: string;
  isVerified: boolean;
  hasVideo: boolean;
  hasReviews: boolean;
  services: string[];
  cityId: number;
  district?: string;
  isActive: boolean;
  city?: City;
  createdAt: string;
  updatedAt: string;
  
  // Appearance
  nationality?: string;
  hairColor?: string;
  bikiniZone?: string;
  
  // Location
  inCall: boolean; // у себя
  outCall: boolean; // выезд
  
  // Additional filters
  isNonSmoking: boolean;
  isNew: boolean;
  isWaitingCall: boolean;
  is24Hours: boolean;
  
  // Neighbors
  isAlone: boolean;
  withFriend: boolean;
  withFriends: boolean;
  
  // Gender and orientation
  gender: string;
  orientation: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Language {
  id: number;
  code: string;
  name: string;
}

export interface FilterParams {
  gender: string[];
  appearance: {
    age: [number, number];
    height: [number, number];
    weight: [number, number];
    breastSize: [number, number];
    nationality: string[];
    hairColor: string[];
    bikiniZone: string[];
  };
  district: string[];
  price: {
    from: number | null;
    to: number | null;
    hasExpress: boolean;
  };
  services: string[];
  verification: string[];
  other: string[];
  outcall: boolean;
}

export interface Settings {
  telegramUsername: string;
  notificationsEnabled: boolean;
  autoModeration: boolean;
  defaultCity: string;
  maintenanceMode: boolean;
  watermarkEnabled: boolean;
  watermarkText: string;
  minPhotoCount: number;
  maxPhotoCount: number;
  defaultPrices: {
    hour: number;
    twoHours: number;
    night: number;
  };
} 