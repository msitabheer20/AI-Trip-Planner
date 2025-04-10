"use client"

import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, User, Star, ChevronDown, Menu, X, Heart, Bell, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTripContext } from '@/lib/trip-context';

export default function TripPlanner() {
  const router = useRouter();
  const {
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
    
    setStep,
    updateTripInput,
    
    findDestinations,
    createTripPlan,
  } = useTripContext();

  const handleNextStep = async () => {
    window.scrollTo(0, 0);
    
    if (step === 1) {
      // Step 1: Generate complete trip plan in one go
      try {
        console.log("Starting trip plan creation...");
        // createTripPlan internally handles all the steps and returns the created plan
        const tripPlanResult = await createTripPlan();
        console.log("Trip plan created successfully");
        
        if (tripPlanResult) {
          console.log("TRIP PLAN DETAILS:", JSON.stringify(tripPlanResult, null, 2));
          
          // Add a small delay before redirect to ensure state is updated
          setTimeout(() => {
            router.push('/trip-results');
          }, 500);
        } else {
          console.error("Trip plan creation returned null or undefined");
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-[#34e0a1] to-[#00aa6c] p-2.5 rounded-xl shadow-md transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <MapPin size={24} className="text-white drop-shadow-sm" />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Trip<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34e0a1] to-[#00aa6c]">Nest</span>
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Heart size={22} />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <Bell size={22} />
            </button>
            <Button className="text-black rounded-full font-bold border border-gray-300 hover:bg-[#34e0a1] hover:text-white hover:border-transparent transition-all duration-300">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          {/* Back button and progress */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2" 
              onClick={() => step === 1 ? window.location.href = "/" : handleBack()}
            >
              <ArrowLeft size={16} />
              {step === 1 ? "Back to Home" : "Back"}
            </Button>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[#34e0a1]' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[#34e0a1]' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-[#34e0a1]' : 'bg-gray-300'}`}></div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Trip Planner</h1>
            <p className="text-gray-500">
              {step === 1 ? "Tell us about your dream trip" : 
               step === 2 ? "Our AI is crafting your perfect trip" : 
               "Your personalized trip plan"}
            </p>
          </div>

          {/* Step 1: User Input Form */}
          {step === 1 && (
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Origin City</label>
                    <Input 
                      placeholder="Where are you traveling from?" 
                      value={tripInput.origin}
                      onChange={(e) => updateTripInput({ origin: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Trip Type</label>
                    <Select 
                      defaultValue={tripInput.tripType}
                      onValueChange={(value) => updateTripInput({ tripType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="relaxation">Relaxation</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="romantic">Romantic</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input 
                      type="date"
                      value={tripInput.startDate}
                      onChange={(e) => updateTripInput({ startDate: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input 
                      type="date"
                      value={tripInput.endDate}
                      onChange={(e) => updateTripInput({ endDate: e.target.value })}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Budget (₹)</label>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">₹10,000</span>
                      <Slider
                        defaultValue={[tripInput.budget]}
                        max={200000}
                        min={10000}
                        step={5000}
                        onValueChange={(value) => updateTripInput({ budget: value[0] })}
                        className="flex-grow"
                      />
                      <span className="text-gray-500">₹200,000</span>
                    </div>
                    <div className="text-center mt-2 font-medium">₹{tripInput.budget.toLocaleString()}</div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Interests & Activities</label>
                    <Textarea 
                      placeholder="Tell us what you enjoy (e.g., hiking, museums, food tours, beaches, etc.)"
                      className="h-24"
                      value={tripInput.interests || ''}
                      onChange={(e) => updateTripInput({ interests: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button 
                    className="bg-[#34e0a1] hover:bg-[#2bc889] text-black px-8 py-2 rounded-full font-medium"
                    onClick={handleNextStep}
                    disabled={loading || !tripInput.origin || !tripInput.startDate || !tripInput.endDate}
                  >
                    {loading ? 'Planning...' : 'Plan My Trip'}
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
                  <div className="w-16 h-16 border-4 border-[#34e0a1] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium">Our AI agents are planning your perfect trip...</p>
                </div>
              ) : (
                <div>
                  {error && (
                    <div className="bg-red-50 text-red-700 p-4 mb-4 rounded-lg">
                      <p className="font-medium">Error: {error}</p>
                      <p className="text-sm mt-1">Please try again or adjust your trip parameters.</p>
                    </div>
                  )}
                  
                  <Tabs defaultValue="all" className="mb-8">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Agents</TabsTrigger>
                      <TabsTrigger value="destination">Destination Finder</TabsTrigger>
                      <TabsTrigger value="flights">Flight Booking</TabsTrigger>
                      <TabsTrigger value="hotels">Hotel Booking</TabsTrigger>
                      <TabsTrigger value="budget">Budget Optimizer</TabsTrigger>
                      <TabsTrigger value="itinerary">Itinerary Generator</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <div className="space-y-6">
                        <AgentCard 
                          title="Destination Finder Agent" 
                          description="Finding top 3 destinations based on your preferences..."
                          result={<DestinationResult detailed={false} />}
                          detailed={false}
                        />
                        <AgentCard 
                          title="Flight Booking Agent" 
                          description="Searching for the best flight options..."
                          result={<FlightResult detailed={false} />}
                          detailed={false}
                        />
                        <AgentCard 
                          title="Hotel Booking Agent" 
                          description="Finding accommodations that match your preferences..."
                          result={<HotelResult detailed={false} />}
                          detailed={false}
                        />
                        <AgentCard 
                          title="Budget Optimizer Agent" 
                          description="Optimizing your trip to stay within budget..."
                          result={<BudgetResult detailed={false} />}
                          detailed={false}
                        />
                        <AgentCard 
                          title="Itinerary Generator Agent" 
                          description="Creating your perfect day-by-day plan..."
                          result={<ItineraryPreview detailed={false} />}
                          detailed={false}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="destination">
                      <AgentCard 
                        title="Destination Finder Agent" 
                        description="Finding top 3 destinations based on your preferences..."
                        result={<DestinationResult detailed={true} />}
                        detailed={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="flights">
                      <AgentCard 
                        title="Flight Booking Agent" 
                        description="Searching for the best flight options..."
                        result={<FlightResult detailed={true} />}
                        detailed={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="hotels">
                      <AgentCard 
                        title="Hotel Booking Agent" 
                        description="Finding accommodations that match your preferences..."
                        result={<HotelResult detailed={true} />}
                        detailed={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="budget">
                      <AgentCard 
                        title="Budget Optimizer Agent" 
                        description="Optimizing your trip to stay within budget..."
                        result={<BudgetResult detailed={true} />}
                        detailed={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="itinerary">
                      <AgentCard 
                        title="Itinerary Generator Agent" 
                        description="Creating your perfect day-by-day plan..."
                        result={<ItineraryPreview detailed={true} />}
                        detailed={true}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end mt-8">
                    <Button 
                      className="bg-[#34e0a1] hover:bg-[#2bc889] text-black px-8 py-2 rounded-full font-medium"
                      onClick={handleNextStep}
                    >
                      View Final Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Final Plan Summary */}
          {step === 3 && (
            <div>
              <div className="bg-[#f8f9fa] rounded-xl p-6 mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Goa, India</h2>
                    <p className="text-gray-500 mb-4">7-day trip • May 15 - May 21, 2023</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#e6f4ff] text-[#0066cc] hover:bg-[#d9efff]">Beach</Badge>
                      <Badge className="bg-[#e6f4ff] text-[#0066cc] hover:bg-[#d9efff]">Adventure</Badge>
                      <Badge className="bg-[#e6f4ff] text-[#0066cc] hover:bg-[#d9efff]">Relaxation</Badge>
                    </div>
                  </div>
                  <Button className="bg-[#34e0a1] hover:bg-[#2bc889] text-black px-4 py-2 rounded-full">
                    Download PDF
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">Cost Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Flights</span>
                        <span className="font-medium">₹28,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hotel (6 nights)</span>
                        <span className="font-medium">₹36,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Activities</span>
                        <span className="font-medium">₹15,000</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">₹79,500</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">Flight Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Outbound • May 15</p>
                        <p className="font-medium">Delhi to Goa</p>
                        <p>IndiGo Airlines • 8:30 AM - 11:05 AM</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Return • May 21</p>
                        <p className="font-medium">Goa to Delhi</p>
                        <p>IndiGo Airlines • 7:15 PM - 9:55 PM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">Hotel</h3>
                    <div>
                      <p className="font-medium">Taj Resort & Spa, Goa</p>
                      <p className="text-sm mb-2">Beachfront location in Baga</p>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-[#00aa6c]">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">(473 reviews)</span>
                      </div>
                      <p className="font-medium">₹6,000 per night</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-8">
                <CardContent className="p-4">
                  <h3 className="font-bold text-xl mb-4">Your 7-Day Itinerary</h3>
                  <div className="space-y-4">
                    {[
                      {
                        day: "Day 1", 
                        activities: [
                          "Arrival and check-in at Taj Resort & Spa",
                          "Evening stroll at Baga Beach",
                          "Welcome dinner at Britto's Restaurant"
                        ]
                      },
                      {
                        day: "Day 2", 
                        activities: [
                          "Breakfast at hotel",
                          "Water sports at Calangute Beach",
                          "Lunch at Souza Lobo",
                          "Visit to Fort Aguada",
                          "Dinner at Thalassa"
                        ]
                      },
                      {
                        day: "Day 3", 
                        activities: [
                          "South Goa exploration tour",
                          "Visit Palolem and Agonda beaches",
                          "Seafood lunch at Martin's Corner",
                          "Evening at Colva Beach"
                        ]
                      }
                    ].map((day, index) => (
                      <div key={index}>
                        <h4 className="font-bold text-lg text-[#0066cc]">{day.day}</h4>
                        <ul className="list-disc pl-5 mt-2">
                          {day.activities.map((activity, actIndex) => (
                            <li key={actIndex}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="text-center">
                      <Button variant="outline" className="mt-2">
                        View Full Itinerary
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => setStep(1)}
                >
                  Modify Trip
                </Button>
                <Button 
                  className="bg-[#34e0a1] hover:bg-[#2bc889] text-black px-8 py-2 rounded-full font-medium"
                >
                  Confirm Trip
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="border-t border-gray-700 pt-6 text-sm text-center">
            <p>© {new Date().getFullYear()} TripNest AI Trip Planner</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <a href="#" className="hover:text-white">Terms of Use</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Agent Result Components
const AgentCard = ({ title, description, result, detailed }: { 
  title: string; 
  description: string; 
  result: React.ReactNode; 
  detailed: boolean; 
}) => (
  <Card className="overflow-hidden">
    <div className="border-b p-4 bg-gray-50">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <CardContent className="p-4">
      {result}
      {!detailed && (
        <div className="mt-4 text-right">
          <Button variant="ghost" className="text-[#0066cc]">
            View Details
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

const DestinationResult = ({ detailed }: { detailed: boolean }) => {
  const { destinations, selectedDestination } = useTripContext();
  
  // If no destinations yet, show placeholder
  if (!destinations || destinations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Destination information will appear here after processing.
      </div>
    );
  }
  
  return (
  <div>
    <div className="space-y-4">
        {destinations.slice(0, detailed ? destinations.length : 1).map((destination, index) => (
          <div key={index} className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img 
                src={destination.imageUrl || "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=1770&auto=format&fit=crop"} 
                alt={destination.name} 
                className="w-full h-full object-cover" 
              />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
                <h4 className="font-bold">{destination.name}, {destination.country}</h4>
                <div className="text-[#00aa6c] font-medium">{destination.matchPercentage}% match</div>
          </div>
              <p className="text-sm text-gray-600 mt-1">{destination.description}</p>
              {detailed && destination.highlights && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Highlights:</p>
                  <ul className="list-disc pl-5 text-sm mt-1">
                    {destination.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
          )}
        </div>
      </div>
        ))}
        
        {detailed && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Agent Reasoning</h4>
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
      <div className="p-4 text-center text-gray-500">
        Flight information will appear here after processing.
      </div>
    );
  }
  
  return (
  <div className="space-y-4">
    <div>
      <h4 className="font-medium mb-3">Outbound Flight</h4>
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
              <p className="font-medium">{flights.outbound.departure.airport} → {flights.outbound.arrival.airport}</p>
              <p className="text-sm text-gray-500">
                {flights.outbound.airline} • {flights.outbound.duration} • 
                {flights.outbound.flightNumber ? ` ${flights.outbound.flightNumber} •` : ''} Direct
              </p>
          </div>
          <div className="text-right">
              <p className="font-medium">₹{flights.outbound.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">per person</p>
          </div>
        </div>
        
        {detailed && (
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <div>
                  <p className="text-sm font-medium">{flights.outbound.departure.time}</p>
                  <p className="text-xs">{flights.outbound.departure.airport} ({flights.outbound.departure.code})</p>
              </div>
              <div className="flex-1 px-4">
                <div className="relative">
                  <div className="h-0.5 bg-gray-200 w-full absolute top-1/2"></div>
                  <div className="flex justify-between relative">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  </div>
                </div>
                  <p className="text-xs text-center text-gray-500 mt-1">{flights.outbound.duration}</p>
              </div>
              <div>
                  <p className="text-sm font-medium">{flights.outbound.arrival.time}</p>
                  <p className="text-xs">{flights.outbound.arrival.airport} ({flights.outbound.arrival.code})</p>
              </div>
            </div>
            
            <div className="mt-3 flex gap-4 text-xs">
              <div>
                <p className="text-gray-500">Flight #</p>
                  <p>{flights.outbound.flightNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Aircraft</p>
                  <p>{flights.outbound.aircraft || 'Standard'}</p>
              </div>
              <div>
                <p className="text-gray-500">Class</p>
                  <p>{flights.outbound.class || 'Economy'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-3">Return Flight</h4>
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
              <p className="font-medium">{flights.return.departure.airport} → {flights.return.arrival.airport}</p>
              <p className="text-sm text-gray-500">
                {flights.return.airline} • {flights.return.duration} • 
                {flights.return.flightNumber ? ` ${flights.return.flightNumber} •` : ''} Direct
              </p>
          </div>
          <div className="text-right">
              <p className="font-medium">₹{flights.return.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">per person</p>
          </div>
        </div>
        
        {detailed && (
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <div>
                  <p className="text-sm font-medium">{flights.return.departure.time}</p>
                  <p className="text-xs">{flights.return.departure.airport} ({flights.return.departure.code})</p>
              </div>
              <div className="flex-1 px-4">
                <div className="relative">
                  <div className="h-0.5 bg-gray-200 w-full absolute top-1/2"></div>
                  <div className="flex justify-between relative">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  </div>
                </div>
                  <p className="text-xs text-center text-gray-500 mt-1">{flights.return.duration}</p>
              </div>
              <div>
                  <p className="text-sm font-medium">{flights.return.arrival.time}</p>
                  <p className="text-xs">{flights.return.arrival.airport} ({flights.return.arrival.code})</p>
              </div>
            </div>
            
            <div className="mt-3 flex gap-4 text-xs">
              <div>
                <p className="text-gray-500">Flight #</p>
                  <p>{flights.return.flightNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Aircraft</p>
                  <p>{flights.return.aircraft || 'Standard'}</p>
              </div>
              <div>
                <p className="text-gray-500">Class</p>
                  <p>{flights.return.class || 'Economy'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
    {detailed && (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Agent Reasoning</h4>
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
      <div className="p-4 text-center text-gray-500">
        Hotel information will appear here after processing.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            <img 
              src={selectedHotel.imageUrls?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1770&auto=format&fit=crop"} 
              alt={selectedHotel.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h4 className="font-bold">{selectedHotel.name}</h4>
              <p className="font-medium">₹{selectedHotel.pricePerNight.toLocaleString()}/night</p>
            </div>
            <div className="flex items-center gap-1 my-1">
              <div className="flex text-[#00aa6c]">
                {Array(selectedHotel.stars).fill(0).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                {Array(5 - selectedHotel.stars).fill(0).map((_, i) => (
                  <Star key={i} size={14} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({selectedHotel.reviews} reviews)</span>
            </div>
            <p className="text-sm text-gray-600">{selectedHotel.location}</p>
          </div>
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
            <div className="grid grid-cols-2 gap-2 mb-4">
                {selectedHotel.imageUrls.map((url, i) => (
                  <img 
                    key={i} 
                    src={url} 
                    alt={`${selectedHotel.name} ${i+1}`} 
                    className="rounded-lg aspect-video object-cover" 
                  />
                ))}
            </div>
            )}
            
            <div className="border-t pt-3">
              <h4 className="font-medium mb-2">Amenities</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {selectedHotel.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>{amenity}</span>
                </div>
                ))}
                </div>
                </div>
            
            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm">{selectedHotel.description}</p>
            </div>
          </div>
        )}
      </div>
      
      {detailed && hotels.length > 1 && (
        <>
          <div className="h-px w-full bg-gray-200 my-6"></div>
          
          <div>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden">
                <img 
                  src={hotels[1].imageUrls?.[0] || "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1774&auto=format&fit=crop"} 
                  alt={hotels[1].name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold">{hotels[1].name}</h4>
                  <p className="font-medium">₹{hotels[1].pricePerNight.toLocaleString()}/night</p>
                </div>
                <div className="flex items-center gap-1 my-1">
                  <div className="flex text-[#00aa6c]">
                    {Array(hotels[1].stars).fill(0).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                    {Array(5 - hotels[1].stars).fill(0).map((_, i) => (
                      <Star key={i} size={14} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({hotels[1].reviews} reviews)</span>
                </div>
                <p className="text-sm text-gray-600">{hotels[1].location}</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-3">
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
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {hotels[1].imageUrls.map((url, i) => (
                      <img 
                        key={i} 
                        src={url} 
                        alt={`${hotels[1].name} ${i+1}`} 
                        className="rounded-lg aspect-video object-cover" 
                      />
                    ))}
                </div>
                )}
                
                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Amenities</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {hotels[1].amenities.map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{amenity}</span>
                    </div>
                    ))}
                    </div>
                    </div>
                
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm">{hotels[1].description}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Agent Reasoning</h4>
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
      <div className="p-4 text-center text-gray-500">
        Budget information will appear here after processing.
      </div>
    );
  }
  
  const budgetPercentage = Math.round((budget.total / budget.originalBudget) * 100);
  
  return (
  <div className="space-y-4">
    <div>
      <div className="flex justify-between mb-4">
        <div>
          <p className="font-medium">Original Budget</p>
            <p className="text-2xl font-bold">₹{budget.originalBudget.toLocaleString()}</p>
        </div>
        <div>
          <p className="font-medium">Estimated Cost</p>
            <p className="text-2xl font-bold">₹{budget.total.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div 
            className={`absolute top-0 left-0 h-full ${budgetPercentage > 100 ? 'bg-amber-500' : 'bg-[#34e0a1]'} w-[${Math.min(budgetPercentage, 100)}%]`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
          <span>Budget: ₹{budget.originalBudget.toLocaleString()}</span>
          <span>Current Plan: ₹{budget.total.toLocaleString()} ({budgetPercentage}%)</span>
      </div>
      
        {budget.total > budget.originalBudget && (
      <div className="p-4 bg-amber-50 rounded-lg mt-4">
        <p className="text-sm">
              Your trip is ₹{(budget.total - budget.originalBudget).toLocaleString()} over budget. Consider these optimizations:
        </p>
        <ul className="list-disc pl-5 mt-2 text-sm">
              {budget.alternatives && budget.alternatives.length > 0 && budget.alternatives[0].total < budget.total && (
                <li>Choose a {budget.alternatives[0].name || 'more economical option'} (saves ~₹{(budget.total - budget.alternatives[0].total).toLocaleString()})</li>
              )}
          <li>Travel during weekdays for cheaper flights (saves ~₹4,000)</li>
          <li>Reduce planned activities or select free alternatives (saves ~₹5,000)</li>
        </ul>
      </div>
        )}
    </div>
    
    {detailed && (
      <>
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Cost Breakdown</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Flights</span>
              </div>
                <div className="font-medium">₹{budget.flights.toLocaleString()} ({Math.round((budget.flights / budget.total) * 100)}%)</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Accommodation</span>
              </div>
                <div className="font-medium">₹{budget.accommodation.toLocaleString()} ({Math.round((budget.accommodation / budget.total) * 100)}%)</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Activities</span>
              </div>
                <div className="font-medium">₹{budget.activities.toLocaleString()} ({Math.round((budget.activities / budget.total) * 100)}%)</div>
            </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Food</span>
                </div>
                <div className="font-medium">₹{budget.food.toLocaleString()} ({Math.round((budget.food / budget.total) * 100)}%)</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Transportation</span>
                </div>
                <div className="font-medium">₹{budget.transportation.toLocaleString()} ({Math.round((budget.transportation / budget.total) * 100)}%)</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span>Miscellaneous</span>
                </div>
                <div className="font-medium">₹{budget.miscellaneous.toLocaleString()} ({Math.round((budget.miscellaneous / budget.total) * 100)}%)</div>
              </div>
          </div>
        </div>
        
          {budget.alternatives && budget.alternatives.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Agent Reasoning</h4>
          <p className="text-sm">
            I've analyzed your preferences and the destination costs to provide the most optimized trip. 
                {budget.total > budget.originalBudget ? 
                  ` The current plan exceeds your budget primarily due to the accommodation and premium activities.` : 
                  ` The current plan fits within your budget while maintaining quality experiences.`
                }
                Here are alternative plans that offer different value propositions:
              </p>
              
              {budget.alternatives.map((alt, index) => (
                <div key={index} className="mt-3">
                  <p className="text-sm font-medium">{alt.name}: ₹{alt.total.toLocaleString()}</p>
            <ul className="list-disc pl-5 mt-1 text-sm">
                    {alt.breakdown.flights && (
                      <li>Flights: ₹{alt.breakdown.flights.toLocaleString()}</li>
                    )}
                    {alt.breakdown.accommodation && (
                      <li>Accommodation: ₹{alt.breakdown.accommodation.toLocaleString()}</li>
                    )}
                    {alt.breakdown.activities && (
                      <li>Activities: ₹{alt.breakdown.activities.toLocaleString()}</li>
                    )}
            </ul>
          </div>
              ))}
          </div>
          )}
      </>
    )}
  </div>
);
};

const ItineraryPreview = ({ detailed }: { detailed: boolean }) => {
  const { itinerary, selectedDestination, selectedHotel } = useTripContext();
  
  // If no itinerary yet, show placeholder
  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Itinerary information will appear here after processing.
          </div>
    );
  }
  
  // Show the first 3 days or all days based on detailed flag
  const displayItinerary = detailed ? itinerary : itinerary.slice(0, 3);
  
  return (
    <div className="space-y-4">
      {displayItinerary.map((day, index) => (
        <div key={index}>
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-blue-100 text-blue-800">Day {day.day}</Badge>
            <h4 className="font-medium">{day.title}</h4>
          </div>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {day.activities.map((activity, actIndex) => (
              <li key={actIndex}>
                {activity.time && <span className="font-medium">{activity.time}: </span>}
                {activity.description}
                {activity.cost !== undefined && activity.cost > 0 && <span className="text-gray-500"> (₹{activity.cost.toLocaleString()})</span>}
                {detailed && activity.location && (
                  <div className="text-xs text-gray-500 mt-0.5">Location: {activity.location}</div>
                )}
                {detailed && activity.notes && (
                  <div className="text-xs text-gray-500 mt-0.5">Note: {activity.notes}</div>
                )}
            </li>
            ))}
          </ul>
        </div>
      ))}
      
      {detailed && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Agent Reasoning</h4>
          <p className="text-sm">
            I've designed this itinerary to balance beach activities, cultural experiences, and adventure elements 
            based on your preferences. The schedule provides:
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>Gradual pace - Starting with relaxation, then increasing activity levels</li>
            <li>Geographic efficiency - Grouping attractions by area to minimize travel time</li>
            <li>Experience variety - Mix of beaches, water sports, cultural sites, and natural attractions</li>
            <li>Culinary exploration - Selected restaurants showcase local cuisine at different price points</li>
          </ul>
          <p className="text-sm mt-2">
            I've included free time for spontaneous activities and relaxation. Each day includes at least one 
            highlight activity while avoiding overscheduling.
          </p>
        </div>
    )}
  </div>
); 
}; 