'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TripInput, TripPlan, Destination, Flight, Hotel, BudgetBreakdown, ItineraryDay, Activity } from './types';

interface TripContextType {
  loading: boolean;
  error: string | null;
  step: number;
  tripInput: TripInput;
  destinations: Destination[];
  selectedDestination: Destination | null;
  flights: { outbound: Flight, return: Flight } | null;
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  budget: BudgetBreakdown | null;
  itinerary: ItineraryDay[];
  activities: Activity[];
  tripPlan: TripPlan | null;
  
  setStep: (step: number) => void;
  updateTripInput: (input: Partial<TripInput>) => void;
  
  findDestinations: () => Promise<void>;
  selectDestination: (destination: Destination) => void;
  findFlights: () => Promise<void>;
  findHotels: () => Promise<void>;
  selectHotel: (hotel: Hotel) => void;
  optimizeBudget: () => Promise<void>;
  generateItinerary: () => Promise<void>;
  recommendActivities: () => Promise<void>;
  createTripPlan: () => Promise<TripPlan | null>;
  
  resetPlanning: () => void;
}

const defaultTripInput: TripInput = {
  origin: '',
  budget: 50000,
  startDate: '',
  endDate: '',
  tripType: 'adventure',
  activities: [],
  interests: '',
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  const [tripInput, setTripInput] = useState<TripInput>(defaultTripInput);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [flights, setFlights] = useState<{ outbound: Flight, return: Flight } | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [budget, setBudget] = useState<BudgetBreakdown | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  
  const updateTripInput = (input: Partial<TripInput>) => {
    setTripInput(prev => ({ ...prev, ...input }));
  };
  
  const findDestinations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripInput),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      
      const data = await response.json();
      // console.log("HERE IS THE DATA OF DESTINATIONS: ", data);
      setDestinations(data.destinations);
      
      // Auto-select the first destination if available
      if (data.destinations && data.destinations.length > 0) {
        setSelectedDestination(data.destinations[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error finding destinations:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const selectDestination = (destination: Destination) => {
    setSelectedDestination(destination);
  };
  
  const findFlights = async () => {
    if (!selectedDestination) {
      setError('No destination selected');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripInput,
          destination: selectedDestination,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }
      
      const data = await response.json();
      setFlights(data.flights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error finding flights:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const findHotels = async () => {
    if (!selectedDestination) {
      setError('No destination selected');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripInput,
          destination: selectedDestination,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }
      
      const data = await response.json();
      setHotels(data.hotels);
      
      // Auto-select the first hotel if available
      if (data.hotels && data.hotels.length > 0) {
        setSelectedHotel(data.hotels[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error finding hotels:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const selectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
  };
  
  const optimizeBudget = async () => {
    if (!selectedDestination || !flights || !selectedHotel) {
      setError('Missing required trip details');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripInput,
          destination: selectedDestination,
          flights,
          hotel: selectedHotel,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to optimize budget');
      }
      
      const data = await response.json();
      setBudget(data.budget);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error optimizing budget:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const generateItinerary = async () => {
    if (!selectedDestination || !selectedHotel || !budget) {
      setError('Missing required trip details');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripInput,
          destination: selectedDestination,
          hotel: selectedHotel,
          budget,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }
      
      const data = await response.json();
      setItinerary(data.itinerary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error generating itinerary:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const recommendActivities = async () => {
    if (!selectedDestination || !budget) {
      setError('Missing required trip details');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripInput,
          destination: selectedDestination,
          budget,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to recommend activities');
      }
      
      const data = await response.json();
      setActivities(data.activities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error recommending activities:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const createTripPlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripInput),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Failed to create trip plan';
        throw new Error(errorMessage);
      }
      
      if (!data.tripPlan || !data.tripPlan.destination) {
        throw new Error('Invalid trip plan data received');
      }
      
      // Update all state with the complete trip plan
      console.log("RECEIVED PLAN DATA:", data.tripPlan);
      
      // First set destinations data to make sure it's available immediately
      setDestinations(data.tripPlan.destination ? [data.tripPlan.destination] : []);
      setHotels(data.tripPlan.hotels ? data.tripPlan.hotels : []);
      
      // Then update the rest of the state
      setTripPlan(data.tripPlan);
      setSelectedDestination(data.tripPlan.destination);
      setFlights(data.tripPlan.flights);
      setSelectedHotel(data.tripPlan.hotels[0]);
      setBudget(data.tripPlan.budget);
      setItinerary(data.tripPlan.itinerary);
      setActivities(data.tripPlan.activities);
      
      // Make sure state is updated before changing step
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Move to the next step
      setStep(2); // Now set to step 2 instead of 3, to show the planning results first
      
      // Return the trip plan data
      console.log("TRIP PLAN DATA PROCESSED AND AVAILABLE");
      return data.tripPlan;
    
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to plan trip. Please try again.';
      setError(errorMessage);
      console.error('Error creating trip plan:', err);
      
      // Stay on step 1 so user can modify inputs and try again
      setStep(1);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const resetPlanning = () => {
    setStep(1);
    setTripInput(defaultTripInput);
    setDestinations([]);
    setSelectedDestination(null);
    setFlights(null);
    setHotels([]);
    setSelectedHotel(null);
    setBudget(null);
    setItinerary([]);
    setActivities([]);
    setTripPlan(null);
    setError(null);
  };
  
  return (
    <TripContext.Provider
      value={{
        loading,
        error,
        step,
        tripInput,
        destinations,
        selectedDestination,
        flights,
        hotels,
        selectedHotel,
        budget,
        itinerary,
        activities,
        tripPlan,
        
        setStep,
        updateTripInput,
        
        findDestinations,
        selectDestination,
        findFlights,
        findHotels,
        selectHotel,
        optimizeBudget,
        generateItinerary,
        recommendActivities,
        createTripPlan,
        
        resetPlanning,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
}