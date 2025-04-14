export interface TripInput {
  origin: string;
  budget: number;
  startDate: string;
  endDate: string;
  tripType: string;
  activities: string[];
  interests?: string;
}

export interface Destination {
  name: string;
  country: string;
  description: string;
  matchPercentage: number;
  language?: string,
  currency?: string,
  imageUrl?: string;
  highlights?: string[];
}

export interface Flight {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    code: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    code: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  aircraft?: string;
  class?: string;
}

export interface Hotel {
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  stars: number;
  reviews: number;
  amenities: string[];
  imageUrls?: string[];
}

export interface Activity {
  name: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  imageUrl?: string;
  recommended?: boolean;
}

export interface BudgetBreakdown {
  mainPlan: {
    flights: number;
    accommodation: number;
    activities: number;
    food: number;
    transportation: number;
    miscellaneous: number;
    total: number;
    originalBudget: number;
  };

  alternativePlans?: {
    name: string;
    total: number;
    breakdown: {
      flights?: number;
      accommodation?: number;
      activities?: number;
      food?: number;
      transportation?: number;
      miscellaneous?: number;
    };
  }[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  activities: {
    time?: string;
    description: string;
    cost?: number;
    location?: string;
    notes?: string;
  }[];
}

export interface TripPlan {
  destination: Destination;
  flights: {
    outbound: Flight;
    return: Flight;
  };
  hotels: Hotel[];
  itinerary: ItineraryDay[];
  budget: BudgetBreakdown;
  activities: Activity[];
  tripInput?: TripInput;
} 