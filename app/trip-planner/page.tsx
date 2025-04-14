"use client"

import { useState, useEffect, useRef } from 'react';
import { Star, ArrowLeft, Map, Plane, Hotel, BarChart, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
// import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTripContext } from '@/lib/trip-context';
import TripPlanDisplay from '@/components/TripPlanDisplay';
import Layout from '@/components/layout/Layout';

// Removed the static popularDestinations array since we're using an API

export default function TripPlanner() {
  const router = useRouter();
  const {
    loading,
    error,
    step,
    tripInput,
    tripPlan,
    
    setStep,
    updateTripInput,
    createTripPlan,
  } = useTripContext();

  // State for origin city suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch location suggestions from API
  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);

    try {
      // Use Geoapify Places API for location suggestions with more inclusive parameters
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&filter=countrycode:in,us,gb,fr,de,es,it,au,ca,jp,sg,ae,cn&bias=countrycode:in&lang=en&limit=10&format=json&apiKey=fa40d7a1398e4eaeb59390e3609bf0a1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const locationResults = data.results.map((result: any) => {
          // Determine the best name to display
          let locationName = '';

          if (result.city) {
            locationName = result.city;
          } else if (result.municipality) {
            locationName = result.municipality;
          } else if (result.county) {
            locationName = result.county;
          } else if (result.state) {
            locationName = result.state;
          } else if (result.name) {
            locationName = result.name;
          }

          // Add state if available and different from city
          if (result.state && result.state !== locationName) {
            locationName += `, ${result.state}`;
          }

          // Always add country
          if (result.country) {
            locationName += `, ${result.country}`;
          }

          return {
            id: result.place_id,
            name: locationName,
            details: result
          };
        });

        setSuggestions(locationResults);
        setShowSuggestions(locationResults.length > 0);
      } else {
        // If no results from API, try a fallback approach
        const fallbackCities = [
          "Goa, India", "Delhi, India", "Mumbai, India", "Bangalore, India",
          "Chennai, India", "Hyderabad, India", "Kolkata, India", "Jaipur, India",
          "New York, USA", "London, UK", "Paris, France", "Tokyo, Japan"
        ];

        const filteredCities = fallbackCities
          .filter(city => city.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 8);

        if (filteredCities.length > 0) {
          setSuggestions(filteredCities.map(city => ({ id: city, name: city })));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      // Fallback to a simple filter of common cities if API fails
      const fallbackCities = [
        "Goa, India", "Delhi, India", "Mumbai, India", "Bangalore, India",
        "Chennai, India", "Hyderabad, India", "Kolkata, India", "Jaipur, India",
        "New York, USA", "London, UK", "Paris, France", "Tokyo, Japan"
      ];

      const filteredCities = fallbackCities
        .filter(city => city.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8);

      setSuggestions(filteredCities.map(city => ({ id: city, name: city })));
      setShowSuggestions(filteredCities.length > 0);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Debounced location search to prevent too many API calls
  const handleOriginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateTripInput({ origin: value });

    // Clear any existing timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timeout for 300ms
    debounceTimerRef.current = setTimeout(() => {
      fetchLocationSuggestions(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: any) => {
    updateTripInput({ origin: suggestion.name });
    setShowSuggestions(false);
  };

  // Handle click outside of suggestions to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any existing timeout on unmount
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);




  const handleNextStep = async () => {
    window.scrollTo(0, 0);
    
    if (step === 1) {
      // Step 1: Move to trip planning step
      try {
        console.log("Starting trip plan creation...");
        
        // First set loading state by moving to step 2
        // This shows the loading state to the user
        setStep(2);
        
        // Then call the API to create the trip plan
        // createTripPlan internally handles all the steps and returns the created plan
        const tripPlanResult = await createTripPlan();
        console.log("Trip plan created successfully");
        
        if (tripPlanResult) {
          console.log("TRIP PLAN DETAILS:", JSON.stringify(tripPlanResult, null, 2));
          // The createTripPlan function already sets the step to 3
          // No need to update step here
        } else {
          console.error("Trip plan creation returned null or undefined");
          // Stay on step 2 to let user retry
        }
      } catch (error) {
        console.error("Error during trip planning:", error);
      }
    } else if (step === 2) {
      // Step 2: Move to final plan
      setStep(3);
    }
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  return (
    <Layout>
      {/* Background decor */}

      {/* Main content */}
      <div className="container max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Back button and progress */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 hover:bg-[#edfcf5] transition-all"
            onClick={() => step === 1 ? window.location.href = "/" : handleBack()}
          >
            <ArrowLeft size={16} />
            {step === 1 ? "Back to Home" : "Back"}
          </Button>
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm">
            <div className={`w-4 h-4 rounded-full ${step >= 1 ? 'bg-[#34e0a1]' : 'bg-gray-200'} transition-all duration-300`}></div>
            <div className={`w-4 h-4 rounded-full ${step >= 2 ? 'bg-[#34e0a1]' : 'bg-gray-200'} transition-all duration-300`}></div>
            <div className={`w-4 h-4 rounded-full ${step >= 3 ? 'bg-[#34e0a1]' : 'bg-gray-200'} transition-all duration-300`}></div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#34e0a1] to-[#2bc889] text-transparent bg-clip-text">AI Trip Planner</h1>
          <p className="text-gray-600 text-lg">
            {step === 1 ? "Tell us about your dream trip" : 
             step === 2 ? "Our AI is crafting your perfect trip" : 
             "Your personalized trip plan"}
          </p>
        </div>

        {/* Step 1: User Input Form */}
        {step === 1 && (
          <Card className="p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl transition-all hover:shadow-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#edfcf5]/50 to-transparent opacity-50 pointer-events-none"></div>
            <CardContent className="p-0 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label className="block text-base font-medium mb-3 flex items-center gap-2 text-gray-700">
                    <div className="p-1.5 bg-[#edfcf5] rounded-full">
                      <MapPin size={18} className="text-[#34e0a1]" />
                    </div>
                    Origin City
                  </label>
                  <Input 
                    ref={inputRef}
                    placeholder="Where are you traveling from?" 
                    value={tripInput.origin}
                    onChange={handleOriginInputChange}
                    className="border-gray-300 focus:border-[#34e0a1] focus:ring-[#34e0a1] rounded-xl h-12 px-4 text-base shadow-sm"
                    autoComplete="off"
                  />

                  {/* Suggestions dropdown */}
                  {showSuggestions && (
                    <div
                      ref={suggestionRef}
                      className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-72 overflow-auto"
                    >
                      <div className="px-4 py-2 text-xs text-gray-500 border-b flex justify-between items-center">
                        <span>Global Destinations</span>
                        {isLoadingSuggestions ? (
                          <div className="flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin text-[#34e0a1]" />
                            <span>Loading...</span>
                          </div>
                        ) : (
                          <span>{suggestions.length} results</span>
                        )}
                      </div>

                      {isLoadingSuggestions && suggestions.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                          Searching for cities...
                        </div>
                      ) : suggestions.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No matching cities found. Try a different search.
                        </div>
                      ) : (
                        suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 hover:bg-[#edfcf5] cursor-pointer group transition-colors"
                            onClick={() => handleSelectSuggestion(suggestion)}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-[#34e0a1]" />
                              <span className="font-medium">{suggestion.name}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-base font-medium mb-3 flex items-center gap-2 text-gray-700">
                    <div className="p-1.5 bg-[#edfcf5] rounded-full">
                      <Map size={18} className="text-[#34e0a1]" />
                    </div>
                    Trip Type
                  </label>
                  <Select 
                    defaultValue={tripInput.tripType}
                    onValueChange={(value) => updateTripInput({ tripType: value })}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-[#34e0a1] focus:ring-[#34e0a1] rounded-xl h-12 px-4 text-base shadow-sm">
                      <SelectValue placeholder="Select trip type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl border-gray-200 shadow-md">
                      <SelectItem value="adventure" className="py-3 text-base focus:bg-[#edfcf5]">Adventure</SelectItem>
                      <SelectItem value="relaxation" className="py-3 text-base focus:bg-[#edfcf5]">Relaxation</SelectItem>
                      <SelectItem value="family" className="py-3 text-base focus:bg-[#edfcf5]">Family</SelectItem>
                      <SelectItem value="romantic" className="py-3 text-base focus:bg-[#edfcf5]">Romantic</SelectItem>
                      <SelectItem value="cultural" className="py-3 text-base focus:bg-[#edfcf5]">Cultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-base font-medium mb-3 flex items-center gap-2 text-gray-700">
                    <div className="p-1.5 bg-[#edfcf5] rounded-full">
                      <Calendar size={18} className="text-[#34e0a1]" />
                    </div>
                    Start Date
                  </label>
                  <Input 
                    type="date"
                    value={tripInput.startDate}
                    onChange={(e) => updateTripInput({ startDate: e.target.value })}
                    className="border-gray-300 focus:border-[#34e0a1] focus:ring-[#34e0a1] rounded-xl h-12 px-4 text-base shadow-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-base font-medium mb-3 flex items-center gap-2 text-gray-700">
                    <div className="p-1.5 bg-[#edfcf5] rounded-full">
                      <Calendar size={18} className="text-[#34e0a1]" />
                    </div>
                    End Date
                  </label>
                  <Input 
                    type="date"
                    value={tripInput.endDate}
                    onChange={(e) => updateTripInput({ endDate: e.target.value })}
                    className="border-gray-300 focus:border-[#34e0a1] focus:ring-[#34e0a1] rounded-xl h-12 px-4 text-base shadow-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-base font-medium mb-3 flex items-center gap-2 text-gray-700">
                    <div className="p-1.5 bg-[#edfcf5] rounded-full">
                      <BarChart size={18} className="text-[#34e0a1]" />
                    </div>
                    Budget (₹)
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-medium">₹10,000</span>
                    <Slider
                      defaultValue={[tripInput.budget]}
                      max={200000}
                      min={10000}
                      step={5000}
                      onValueChange={(value) => updateTripInput({ budget: value[0] })}
                      className="flex-grow h-4"
                    />
                    <span className="text-gray-500 font-medium">₹200,000</span>
                  </div>
                  <div className="text-center mt-4 font-medium text-lg py-2 bg-[#edfcf5] rounded-xl">
                    ₹{tripInput.budget.toLocaleString()}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-base font-medium mb-3 flex items-center gap-2 text-gray-700">
                    <div className="p-1.5 bg-[#edfcf5] rounded-full">
                      <Star size={18} className="text-[#34e0a1]" />
                    </div>
                    Interests & Activities
                  </label>
                  <Textarea 
                    placeholder="Tell us what you enjoy (e.g., hiking, museums, food tours, beaches, etc.)"
                    className="h-32 border-gray-300 focus:border-[#34e0a1] focus:ring-[#34e0a1] rounded-xl px-4 py-3 text-base shadow-sm"
                    value={tripInput.interests || ''}
                    onChange={(e) => updateTripInput({ interests: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="mt-10 flex justify-center">
                <Button 
                  className="bg-gradient-to-r from-[#34e0a1] to-[#2bc889] hover:opacity-90 text-black px-10 py-7 rounded-xl font-medium flex items-center gap-3 shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1 text-lg"
                  onClick={handleNextStep}
                  disabled={loading || !tripInput.origin || !tripInput.startDate || !tripInput.endDate}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Planning...
                    </div>
                  ) : (
                    <>
                      <img 
                        src="https://static.thenounproject.com/png/6404439-200.png" 
                        alt="AI Icon" 
                        className="w-6 h-6"
                      />
                      Plan My Trip
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Agent Reasoning Viewer */}
        {step === 2 && (
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 border-4 border-[#34e0a1] border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-xl font-medium mb-2">Our AI agents are planning your perfect trip...</p>
                <p className="text-gray-500 max-w-md text-center">Finding the best destinations, flights, and experiences tailored just for you.</p>
              </div>
            ) : (
              <div>
                {error && (
                  <div className="bg-red-50 text-red-700 p-6 mb-6 rounded-xl shadow-sm border border-red-100">
                    <p className="font-medium">Error: {error}</p>
                    <p className="text-sm mt-1">Please try again or adjust your trip parameters.</p>
                  </div>
                )}
                
                <Tabs defaultValue="all" className="mb-8">
                  <TabsList className="mb-6 p-1 bg-gray-100 rounded-full overflow-hidden w-full flex">
                    <TabsTrigger value="all" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">All Agents</TabsTrigger>
                    <TabsTrigger value="destination" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Destination Finder</TabsTrigger>
                    <TabsTrigger value="flights" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Flight Booking</TabsTrigger>
                    <TabsTrigger value="hotels" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Hotel Booking</TabsTrigger>
                    <TabsTrigger value="budget" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Budget Optimizer</TabsTrigger>
                    <TabsTrigger value="itinerary" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Itinerary Generator</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <div className="space-y-6">
                      <AgentCard 
                        title="Destination Finder Agent" 
                        icon={<Map size={18} />}
                        description="Finding top 3 destinations based on your preferences..."
                        result={<DestinationResult detailed={false} />}
                        detailed={false}
                      />
                      <AgentCard 
                        title="Flight Booking Agent" 
                        icon={<Plane size={18} />}
                        description="Searching for the best flight options..."
                        result={<FlightResult detailed={false} />}
                        detailed={false}
                      />
                      <AgentCard 
                        title="Hotel Booking Agent" 
                        icon={<Hotel size={18} />}
                        description="Finding accommodations that match your preferences..."
                        result={<HotelResult detailed={false} />}
                        detailed={false}
                      />
                      <AgentCard 
                        title="Budget Optimizer Agent" 
                        icon={<BarChart size={18} />}
                        description="Optimizing your trip to stay within budget..."
                        result={<BudgetResult detailed={false} />}
                        detailed={false}
                      />
                      <AgentCard 
                        title="Itinerary Generator Agent" 
                        icon={<Calendar size={18} />}
                        description="Creating your perfect day-by-day plan..."
                        result={<ItineraryPreview detailed={false} />}
                        detailed={false}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="destination">
                    <AgentCard 
                      title="Destination Finder Agent" 
                      icon={<Map size={18} />}
                      description="Finding top 3 destinations based on your preferences..."
                      result={<DestinationResult detailed={true} />}
                      detailed={true}
                    />
                  </TabsContent>
                  
                  <TabsContent value="flights">
                    <AgentCard 
                      title="Flight Booking Agent" 
                      icon={<Plane size={18} />}
                      description="Searching for the best flight options..."
                      result={<FlightResult detailed={true} />}
                      detailed={true}
                    />
                  </TabsContent>
                  
                  <TabsContent value="hotels">
                    <AgentCard 
                      title="Hotel Booking Agent" 
                      icon={<Hotel size={18} />}
                      description="Finding accommodations that match your preferences..."
                      result={<HotelResult detailed={true} />}
                      detailed={true}
                    />
                  </TabsContent>
                  
                  <TabsContent value="budget">
                    <AgentCard 
                      title="Budget Optimizer Agent" 
                      icon={<BarChart size={18} />}
                      description="Optimizing your trip to stay within budget..."
                      result={<BudgetResult detailed={true} />}
                      detailed={true}
                    />
                  </TabsContent>
                  
                  <TabsContent value="itinerary">
                    <AgentCard 
                      title="Itinerary Generator Agent" 
                      icon={<Calendar size={18} />}
                      description="Creating your perfect day-by-day plan..."
                      result={<ItineraryPreview detailed={true} />}
                      detailed={true}
                    />
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-center mt-12">
                  <Button 
                    className="bg-gradient-to-r from-[#34e0a1] to-[#2bc889] hover:opacity-90 text-black px-10 py-7 rounded-xl font-medium flex items-center gap-3 shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1 text-lg"
                    onClick={handleNextStep}
                  >
                    <img 
                      src="https://static.thenounproject.com/png/6404439-200.png" 
                      alt="AI Icon" 
                      className="w-6 h-6"
                    />
                    View Final Trip Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Final Plan Summary */}
        {step === 3 && tripPlan && (
          <div>
            <TripPlanDisplay 
              tripPlan={tripPlan} 
              onBack={() => setStep(1)}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

// Agent Result Components
const AgentCard = ({ title, icon, description, result, detailed }: {
  title: string; 
  icon: React.ReactNode;
  description: string; 
  result: React.ReactNode; 
  detailed: boolean; 
}) => {
  // Get access to the Tabs component
  const getTabValue = (title: string) => {
    if (title.includes("Destination")) return "destination";
    if (title.includes("Flight")) return "flights";
    if (title.includes("Hotel")) return "hotels";
    if (title.includes("Budget")) return "budget";
    if (title.includes("Itinerary")) return "itinerary";
    return "all";
  };
  
  return (
    <Card className="overflow-hidden shadow-md border-0 transition-all hover:shadow-lg rounded-xl">
      <div className="border-b p-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#edfcf5] rounded-full text-[#34e0a1]">
            {icon}
          </div>
          <div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
        </div>
      </div>
      <CardContent className="p-6">
      {result}
      {!detailed && (
        <div className="mt-4 text-right">
            <Button 
              variant="ghost" 
              className="text-[#0066cc] hover:bg-[#edf5fc] font-medium"
              onClick={() => {
                // Find and click the tab with the matching value
                const tabValue = getTabValue(title);
                const tabTrigger = document.querySelector(`[data-state][value="${tabValue}"]`);
                if (tabTrigger && tabTrigger instanceof HTMLElement) {
                  tabTrigger.click();
                }
              }}
            >
            View Details
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);
};

const DestinationResult = ({ detailed }: { detailed: boolean }) => {
  const { destinations, selectedDestination } = useTripContext();
  console.log("DESTINATION RESULT COMPONENT - destinations:", destinations);
  
  // Effect to log destinations data when it changes
  useEffect(() => {
    console.log("DESTINATIONS DATA UPDATED:", destinations);
  }, [destinations]);
  
  // If no destinations yet, show placeholder
  if (!destinations || destinations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
        <Map size={24} className="mx-auto mb-2 text-gray-400" />
        <p>Destination information will appear here after processing.</p>
      </div>
    );
  }
  
  return (
  <div>
      <div className="space-y-6">
        {destinations.slice(0, detailed ? destinations.length : 1).map((destination, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="relative h-40 overflow-hidden">
              <img 
                src={destination.imageUrl || "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=1770&auto=format&fit=crop"} 
                alt={destination.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-[#34e0a1]/90 text-black font-medium px-3 py-1 backdrop-blur-sm">
                  {destination.matchPercentage}% match
                </Badge>
        </div>
          </div>
            <div className="p-5">
              <h4 className="text-xl font-bold">{destination.name}, {destination.country}</h4>
              <p className="text-gray-600 mt-2">{destination.description}</p>

              {detailed && destination.highlights && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Highlights:</p>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, i) => (
                      <Badge key={i} variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
          )}
        </div>
      </div>
        ))}
        
        {detailed && (
          <div className="mt-6 p-5 bg-[#edfcf5] rounded-xl border border-[#d0f5e6]">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <div className="p-1 bg-[#34e0a1] rounded-full">
                <img
                  src="https://static.thenounproject.com/png/6404439-200.png"
                  alt="AI Icon"
                  className="w-4 h-4"
                />
              </div>
              Agent Reasoning
            </h4>
            <p className="text-sm">
              Based on your preferences for {destinations[0]?.matchPercentage}% match with {destinations[0]?.name}, 
              I've selected these destinations considering your budget, travel dates, and interests. 
              Each offers activities matching your {destinations[0]?.highlights?.join(', ')} interests.
            </p>
          </div>
        )}
    </div>
  </div>
);
};

const FlightResult = ({ detailed }: { detailed: boolean }) => {
  const { flights } = useTripContext();
  
  // If no flights yet, show placeholder
  if (!flights) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
        <Plane size={24} className="mx-auto mb-2 text-gray-400" />
        <p>Flight information will appear here after processing.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
    <div>
        <h4 className="font-medium mb-4 text-gray-700 flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-full text-blue-500">
            <Plane size={14} />
          </div>
          Outbound Flight
        </h4>
        <div className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-4">
          <div>
              <p className="font-medium text-lg">{flights.outbound.departure.airport} → {flights.outbound.arrival.airport}</p>
              <p className="text-gray-500">
                {flights.outbound.airline} • {flights.outbound.duration} • 
                {flights.outbound.flightNumber ? ` ${flights.outbound.flightNumber} •` : ''} Direct
              </p>
          </div>
          <div className="text-right">
              <p className="font-bold text-lg">₹{flights.outbound.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">per person</p>
          </div>
        </div>
        
        {detailed && (
            <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                  <p className="text-sm font-medium">{flights.outbound.departure.time}</p>
                  <p className="text-xs text-gray-500">{flights.outbound.departure.airport} ({flights.outbound.departure.code})</p>
              </div>
              <div className="flex-1 px-4">
                <div className="relative">
                  <div className="h-0.5 bg-gray-200 w-full absolute top-1/2"></div>
                  <div className="flex justify-between relative">
                      <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-100"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-100"></div>
                  </div>
                </div>
                  <p className="text-xs text-center text-gray-500 mt-1">{flights.outbound.duration}</p>
              </div>
              <div>
                  <p className="text-sm font-medium">{flights.outbound.arrival.time}</p>
                  <p className="text-xs text-gray-500">{flights.outbound.arrival.airport} ({flights.outbound.arrival.code})</p>
              </div>
            </div>
            
              <div className="mt-4 flex gap-6 text-xs p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-500">Flight #</p>
                  <p className="font-medium">{flights.outbound.flightNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Aircraft</p>
                  <p className="font-medium">{flights.outbound.aircraft || 'Standard'}</p>
              </div>
              <div>
                <p className="text-gray-500">Class</p>
                  <p className="font-medium">{flights.outbound.class || 'Economy'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
    <div>
        <h4 className="font-medium mb-4 text-gray-700 flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-full text-blue-500">
            <Plane size={14} style={{ transform: 'rotate(180deg)' }} />
          </div>
          Return Flight
        </h4>
        <div className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-4">
          <div>
              <p className="font-medium text-lg">{flights.return.departure.airport} → {flights.return.arrival.airport}</p>
              <p className="text-gray-500">
                {flights.return.airline} • {flights.return.duration} • 
                {flights.return.flightNumber ? ` ${flights.return.flightNumber} •` : ''} Direct
              </p>
          </div>
          <div className="text-right">
              <p className="font-bold text-lg">₹{flights.return.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">per person</p>
          </div>
        </div>
        
        {detailed && (
            <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                  <p className="text-sm font-medium">{flights.return.departure.time}</p>
                  <p className="text-xs text-gray-500">{flights.return.departure.airport} ({flights.return.departure.code})</p>
              </div>
              <div className="flex-1 px-4">
                <div className="relative">
                  <div className="h-0.5 bg-gray-200 w-full absolute top-1/2"></div>
                  <div className="flex justify-between relative">
                      <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-100"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-100"></div>
                  </div>
                </div>
                  <p className="text-xs text-center text-gray-500 mt-1">{flights.return.duration}</p>
              </div>
              <div>
                  <p className="text-sm font-medium">{flights.return.arrival.time}</p>
                  <p className="text-xs text-gray-500">{flights.return.arrival.airport} ({flights.return.arrival.code})</p>
              </div>
            </div>
            
              <div className="mt-4 flex gap-6 text-xs p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-500">Flight #</p>
                  <p className="font-medium">{flights.return.flightNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Aircraft</p>
                  <p className="font-medium">{flights.return.aircraft || 'Standard'}</p>
              </div>
              <div>
                <p className="text-gray-500">Class</p>
                  <p className="font-medium">{flights.return.class || 'Economy'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
    {detailed && (
        <div className="mt-6 p-5 bg-[#edfcf5] rounded-xl border border-[#d0f5e6]">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <div className="p-1 bg-[#34e0a1] rounded-full">
              <img
                src="https://static.thenounproject.com/png/6404439-200.png"
                alt="AI Icon"
                className="w-4 h-4"
              />
            </div>
            Agent Reasoning
          </h4>
        <p className="text-sm">
            I've selected these flights based on your budget constraints and travel dates. 
            {flights.outbound.airline} offers the best value with direct flights in both directions. 
            Morning departure for the outbound flight allows for a full day at the destination on arrival, 
            while the evening return maximizes your time on the last day.
          </p>
      </div>
    )}
  </div>
);
};

const HotelResult = ({ detailed }: { detailed: boolean }) => {
  const { hotels, selectedHotel } = useTripContext();
  const [expandedHotel, setExpandedHotel] = useState<string | null>(null);
  
  const toggleHotel = (id: string) => {
    if (expandedHotel === id) {
      setExpandedHotel(null);
    } else {
      setExpandedHotel(id);
    }
  };
  
  // If no hotels yet, show placeholder
  if (!selectedHotel || hotels.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
        <Hotel size={24} className="mx-auto mb-2 text-gray-400" />
        <p>Hotel information will appear here after processing.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="relative h-48 overflow-hidden">
            <img 
              src={selectedHotel.imageUrls?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1770&auto=format&fit=crop"} 
              alt={selectedHotel.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white font-bold text-lg">{selectedHotel.name}</p>
            <div className="flex items-center gap-1">
              <div className="flex text-[#34e0a1]">
                {Array(selectedHotel.stars).fill(0).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                {Array(5 - selectedHotel.stars).fill(0).map((_, i) => (
                  <Star key={i} size={14} />
                ))}
              </div>
              <span className="text-sm text-white/80">({selectedHotel.reviews} reviews)</span>
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-black font-medium px-3 py-1 backdrop-blur-sm">
              ₹{selectedHotel.pricePerNight.toLocaleString()}/night
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-gray-400" />
            <p className="text-gray-600">{selectedHotel.location}</p>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={() => toggleHotel('primary')}
          >
            {expandedHotel === 'primary' ? 'Hide Details' : 'View Details'}
          </Button>
        </div>
        
        {(detailed && expandedHotel === 'primary') && (
          <div className="mt-4 animate-in fade-in duration-200">
            {selectedHotel.imageUrls && selectedHotel.imageUrls.length > 1 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {selectedHotel.imageUrls.slice(0, 6).map((url, i) => (
                  <img 
                    key={i} 
                    src={url} 
                      alt={`${selectedHotel.name} ${i + 1}`}
                      className="rounded-lg aspect-video object-cover hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
            </div>
            )}
            
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3 text-gray-700">Amenities</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                {selectedHotel.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                      <div className="w-2 h-2 bg-[#34e0a1] rounded-full"></div>
                    <span>{amenity}</span>
                </div>
                ))}
                </div>
                </div>
            
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2 text-gray-700">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedHotel.description}</p>
            </div>
          </div>
        )}
        </div>
      </div>
      
      {detailed && hotels.length > 1 && (
        <>
          <div className="h-px w-full bg-gray-200 my-6"></div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="relative h-48 overflow-hidden">
                <img 
                  src={hotels[1].imageUrls?.[0] || "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1774&auto=format&fit=crop"} 
                  alt={hotels[1].name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white font-bold text-lg">{hotels[1].name}</p>
                <div className="flex items-center gap-1">
                  <div className="flex text-[#34e0a1]">
                    {Array(hotels[1].stars).fill(0).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                    {Array(5 - hotels[1].stars).fill(0).map((_, i) => (
                      <Star key={i} size={14} />
                    ))}
                  </div>
                  <span className="text-sm text-white/80">({hotels[1].reviews} reviews)</span>
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/90 text-black font-medium px-3 py-1 backdrop-blur-sm">
                  ₹{hotels[1].pricePerNight.toLocaleString()}/night
                </Badge>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-gray-400" />
                <p className="text-gray-600">{hotels[1].location}</p>
              </div>

              <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() => toggleHotel('secondary')}
              >
                {expandedHotel === 'secondary' ? 'Hide Details' : 'View Details'}
              </Button>
            </div>
            
            {expandedHotel === 'secondary' && (
              <div className="mt-4 animate-in fade-in duration-200">
                {hotels[1].imageUrls && hotels[1].imageUrls.length > 1 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {hotels[1].imageUrls.slice(0, 6).map((url, i) => (
                      <img 
                        key={i} 
                        src={url} 
                          alt={`${hotels[1].name} ${i + 1}`}
                          className="rounded-lg aspect-video object-cover hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ))}
                </div>
                )}
                
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-3 text-gray-700">Amenities</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                    {hotels[1].amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                          <div className="w-2 h-2 bg-[#34e0a1] rounded-full"></div>
                        <span>{amenity}</span>
                    </div>
                    ))}
                    </div>
                    </div>
                
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2 text-gray-700">Description</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{hotels[1].description}</p>
                </div>
              </div>
            )}
            </div>
          </div>
          
          <div className="mt-6 p-5 bg-[#edfcf5] rounded-xl border border-[#d0f5e6]">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <div className="p-1 bg-[#34e0a1] rounded-full">
                <img
                  src="https://static.thenounproject.com/png/6404439-200.png"
                  alt="AI Icon"
                  className="w-4 h-4"
                />
              </div>
              Agent Reasoning
            </h4>
            <p className="text-sm">
              I've selected {selectedHotel.name} as your primary option because it matches your preference for 
              {selectedHotel.location.toLowerCase().includes('beach') ? ' beachfront location' : ' convenient location'} and 
              {selectedHotel.amenities.some(a => a.toLowerCase().includes('spa')) ? ' wellness facilities' : ' quality amenities'}. 
              The resort offers exceptional value given your preferences and trip type.
            </p>
            <p className="text-sm mt-2">
              {hotels[1].name} is provided as a more budget-friendly alternative that still maintains 
              good quality and is in a convenient location, which could free up funds for more activities.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const BudgetResult = ({ detailed }: { detailed: boolean }) => {
  const { budget, tripInput } = useTripContext();
  
  // If no budget yet, show placeholder
  if (!budget) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
        <BarChart size={24} className="mx-auto mb-2 text-gray-400" />
        <p>Budget information will appear here after processing.</p>
      </div>
    );
  }
  
  const budgetPercentage = Math.round((budget?.mainPlan?.total / budget?.mainPlan?.originalBudget) * 100);
  const isOverBudget = budgetPercentage > 100;
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl flex-1 mr-3">
            <p className="text-sm font-medium text-gray-500 mb-1">Original Budget</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              ₹{budget?.mainPlan?.originalBudget?.toLocaleString()}
            </p>
        </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl flex-1 ml-3">
            <p className="text-sm font-medium text-gray-500 mb-1">Estimated Cost</p>
            <p className={`text-3xl font-bold ${isOverBudget ?
              'bg-gradient-to-r from-amber-500 to-amber-600' :
              'bg-gradient-to-r from-[#34e0a1] to-[#2bc889]'} bg-clip-text text-transparent`}>
              ₹{budget?.mainPlan?.total?.toLocaleString()}
            </p>
        </div>
      </div>
      
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Budget Usage</span>
            <span className={isOverBudget ? 'text-amber-500 font-medium' : 'text-[#34e0a1] font-medium'}>
              {budgetPercentage}%
            </span>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full ${isOverBudget ? 'bg-amber-500' : 'bg-gradient-to-r from-[#34e0a1] to-[#2bc889]'}`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          ></div>
      </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>₹0</span>
            <span className="font-medium">Budget: ₹{budget?.mainPlan?.originalBudget?.toLocaleString()}</span>
            <span>₹{(budget?.mainPlan?.originalBudget * 1.5).toLocaleString()}</span>
          </div>
      </div>
      
        {budget?.mainPlan?.total > budget?.mainPlan?.originalBudget && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-amber-800 font-medium mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Budget Alert: ₹{(budget?.mainPlan?.total - budget?.mainPlan?.originalBudget).toLocaleString()} over budget
            </p>
            <p className="text-sm text-amber-700 mb-2">Consider these optimizations:</p>
            <ul className="space-y-2">
              {budget?.alternativePlans && budget?.alternativePlans?.length > 0 && budget?.alternativePlans[0]?.total < budget?.mainPlan?.total && (
                <li className="flex items-start gap-2 text-sm text-amber-800">
                  <div className="mt-1 min-w-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Choose a {budget.alternativePlans[0].name || 'more economical option'} (saves ~₹{(budget.mainPlan.total - budget.alternativePlans[0].total).toLocaleString()})</span>
                </li>
              )}
              <li className="flex items-start gap-2 text-sm text-amber-800">
                <div className="mt-1 min-w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Travel during weekdays for cheaper flights (saves ~₹4,000)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-amber-800">
                <div className="mt-1 min-w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Reduce planned activities or select free alternatives (saves ~₹5,000)</span>
              </li>
        </ul>
      </div>
        )}
    </div>
    
    {detailed && (
      <>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="font-medium mb-4 text-gray-700">Cost Breakdown</h4>

            <div className="space-y-4">
              <BudgetItem
                color="bg-blue-500"
                label="Flights"
                amount={budget?.mainPlan?.flights}
                total={budget?.mainPlan?.total}
              />
              <BudgetItem
                color="bg-green-500"
                label="Accommodation"
                amount={budget?.mainPlan?.accommodation}
                total={budget?.mainPlan?.total}
              />
              <BudgetItem
                color="bg-purple-500"
                label="Activities"
                amount={budget?.mainPlan?.activities}
                total={budget?.mainPlan?.total}
              />
              <BudgetItem
                color="bg-yellow-500"
                label="Food"
                amount={budget?.mainPlan?.food}
                total={budget?.mainPlan?.total}
              />
              <BudgetItem
                color="bg-red-500"
                label="Transportation"
                amount={budget?.mainPlan?.transportation}
                total={budget?.mainPlan?.total}
              />
              <BudgetItem
                color="bg-gray-500"
                label="Miscellaneous"
                amount={budget?.mainPlan?.miscellaneous}
                total={budget?.mainPlan?.total}
              />
          </div>
        </div>
        
          {budget?.alternativePlans && budget?.alternativePlans?.length > 0 && (
            <div className="mt-6 p-5 bg-[#edfcf5] rounded-xl border border-[#d0f5e6]">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <div className="p-1 bg-[#34e0a1] rounded-full">
                  <img
                    src="https://static.thenounproject.com/png/6404439-200.png"
                    alt="AI Icon"
                    className="w-4 h-4"
                  />
                </div>
                Agent Reasoning
              </h4>
          <p className="text-sm">
            I've analyzed your preferences and the destination costs to provide the most optimized trip. 
                {budget?.mainPlan?.total > budget?.mainPlan?.originalBudget ?
                  ` The current plan exceeds your budget primarily due to the accommodation and premium activities.` : 
                  ` The current plan fits within your budget while maintaining quality experiences.`
                }
                Here are alternative plans that offer different value propositions:
              </p>
              
              <div className="mt-4 space-y-3">
                {budget?.alternativePlans?.map((alt, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-100">
                    <p className="text-sm font-medium flex justify-between items-center">
                      <span>{alt.name}</span>
                      <span className="text-[#34e0a1]">₹{alt?.total?.toLocaleString()}</span>
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {alt?.breakdown?.flights && (
                        <div className="text-xs bg-gray-50 p-2 rounded flex justify-between">
                          <span>Flights</span>
                          <span className="font-medium">₹{alt?.breakdown?.flights?.toLocaleString()}</span>
                        </div>
                      )}
                      {alt?.breakdown?.accommodation && (
                        <div className="text-xs bg-gray-50 p-2 rounded flex justify-between">
                          <span>Accommodation</span>
                          <span className="font-medium">₹{alt?.breakdown?.accommodation?.toLocaleString()}</span>
                        </div>
                      )}
                      {alt?.breakdown?.activities && (
                        <div className="text-xs bg-gray-50 p-2 rounded flex justify-between">
                          <span>Activities</span>
                          <span className="font-medium">₹{alt?.breakdown?.activities?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
          </div>
              ))}
              </div>
          </div>
          )}
      </>
    )}
  </div>
);
};

// Budget Item Component
const BudgetItem = ({ color, label, amount, total }: {
  color: string;
  label: string;
  amount: number;
  total: number;
}) => {
  const percentage = Math.round((amount / total) * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <span>{label}</span>
        </div>
        <div className="font-medium">₹{amount?.toLocaleString()} <span className="text-gray-400 text-xs">({percentage}%)</span></div>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
  </div>
);
};

const ItineraryPreview = ({ detailed }: { detailed: boolean }) => {
  const { itinerary, selectedDestination, selectedHotel } = useTripContext();
  
  // If no itinerary yet, show placeholder
  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
        <Calendar size={24} className="mx-auto mb-2 text-gray-400" />
        <p>Itinerary information will appear here after processing.</p>
          </div>
    );
  }
  
  // Show the first 3 days or all days based on detailed flag
  const displayItinerary = detailed ? itinerary : itinerary.slice(0, 3);
  
  return (
    <div className="space-y-8">
      {displayItinerary.map((day, index) => (
        <div key={index} className="relative">
          {/* Day header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-[#34e0a1]/10 text-[#2bc889] font-bold w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              {day?.day}
          </div>
            <div>
              <Badge className="bg-blue-100 text-blue-800 font-medium mb-1">Day {day.day}</Badge>
              <h4 className="font-bold text-lg">{day?.title}</h4>
            </div>
          </div>

          {/* Day timeline */}
          <div className="pl-6 relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-2 bottom-0 w-px bg-gray-200"></div>

            {/* Activities */}
            <div className="space-y-6">
              {day?.activities?.map((activity, actIndex) => (
                <div key={actIndex} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 w-3 h-3 bg-[#34e0a1] rounded-full -translate-x-[7px] z-10"></div>

                  {/* Activity card */}
                  <div className="ml-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex justify-between">
                      {activity?.time && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 mb-2">
                          {activity?.time}
                        </Badge>
                      )}
                      {activity?.cost !== undefined && activity?.cost > 0 && (
                        <Badge variant="outline" className="bg-[#edfcf5] text-[#2bc889] mb-2">
                          ₹{activity?.cost?.toLocaleString()}
                        </Badge>
                      )}
                    </div>

                    <p className="font-medium mb-1">{activity?.description}</p>

                    {detailed && (activity?.location || activity?.notes) && (
                      <div className="mt-2 space-y-2">
                        {activity?.location && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin size={12} />
                            <span>{activity?.location}</span>
                          </div>
                        )}
                        {activity?.notes && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
                            <span className="font-medium">Note:</span> {activity?.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Show more days button if not detailed */}
      {!detailed && itinerary.length > 3 && (
        <div className="pt-4 text-center">
          <Button variant="outline" className="text-[#0066cc] hover:bg-[#edf5fc]">
            View Full Itinerary
          </Button>
        </div>
      )}
      
      {detailed && (
        <div className="mt-6 p-5 bg-[#edfcf5] rounded-xl border border-[#d0f5e6]">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <div className="p-1 bg-[#34e0a1] rounded-full">
              <img
                src="https://static.thenounproject.com/png/6404439-200.png"
                alt="AI Icon"
                className="w-4 h-4"
              />
            </div>
            Agent Reasoning
          </h4>
          <p className="text-sm">
            I've designed this itinerary to balance beach activities, cultural experiences, and adventure elements 
            based on your preferences. The schedule provides:
          </p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-start gap-2">
              <div className="p-1 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium">Gradual pace</p>
                <p className="text-gray-600">Starting with relaxation, then increasing activity levels</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-start gap-2">
              <div className="p-1 rounded-full bg-green-100 text-green-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="8 12 12 16 16 12"></polyline>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium">Geographic efficiency</p>
                <p className="text-gray-600">Grouping attractions by area to minimize travel time</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-start gap-2">
              <div className="p-1 rounded-full bg-purple-100 text-purple-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium">Experience variety</p>
                <p className="text-gray-600">Mix of beaches, water sports, cultural sites, and natural attractions</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-start gap-2">
              <div className="p-1 rounded-full bg-yellow-100 text-yellow-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium">Culinary exploration</p>
                <p className="text-gray-600">Selected restaurants showcase local cuisine at different price points</p>
              </div>
            </div>
          </div>
          <p className="text-sm mt-4">
            I've included free time for spontaneous activities and relaxation. Each day includes at least one 
            highlight activity while avoiding overscheduling.
          </p>
        </div>
    )}
  </div>
); 
}; 