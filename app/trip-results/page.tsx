"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, MapPin, Calendar, Clock } from 'lucide-react';
import { useTripContext } from '@/lib/trip-context';
import { useRouter } from 'next/navigation';

export default function TripResults() {
  const router = useRouter();
  const {
    loading,
    error,
    tripInput,
    destinations,
    selectedDestination,
    flights,
    hotels,
    selectedHotel,
    budget,
    itinerary,
    activities,
  } = useTripContext();

  useEffect(() => {
    // Debug logging to see what data is available
    console.log("Trip Results - Context Data:", {
      loading,
      selectedDestination,
      flights,
      hotels,
      selectedHotel,
      budget,
      itinerary,
      activities
    });
    
    // If no trip data is available and not loading, redirect back to planner
    if (!selectedDestination && !loading) {
      console.log("No destination data, redirecting back to planner");
      router.push('/trip-planner');
    }
  }, [selectedDestination, loading, router, flights, hotels, selectedHotel, budget, itinerary, activities]);

  const handleBack = () => {
    router.push('/trip-planner');
  };

  // Calculate trip dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const tripDuration = () => {
    if (!tripInput.startDate || !tripInput.endDate) return '';
    const start = new Date(tripInput.startDate);
    const end = new Date(tripInput.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#34e0a1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Finalizing your perfect trip...</h2>
          <p className="text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-8">
            <ArrowLeft className="mr-2" size={16} /> Back to Trip Planner
          </Button>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-medium text-red-700 mb-2">Error Planning Your Trip</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={handleBack}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedDestination) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#34e0a1] to-[#00aa6c] p-2.5 rounded-xl shadow-md transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <MapPin size={24} className="text-white drop-shadow-sm" />
            </div>
            <span className="font-bold text-2xl tracking-tight">
              Trip<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34e0a1] to-[#00aa6c]">Nest</span>
            </span>
          </div>
          <Button className="text-black rounded-full font-bold border border-gray-300 hover:bg-[#34e0a1] hover:text-white hover:border-transparent transition-all duration-300">
            Sign In
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-8">
          <ArrowLeft className="mr-2" size={16} /> Back to Trip Planner
        </Button>

        {/* Trip Overview */}
        <div className="bg-[#f8f9fa] rounded-xl p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {selectedDestination.name}, {selectedDestination.country}
              </h1>
              <p className="text-gray-500 mb-4">
                {tripDuration()} • {formatDate(tripInput.startDate)} - {formatDate(tripInput.endDate)}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedDestination.highlights && selectedDestination.highlights.map((highlight, index) => (
                  <Badge key={index} className="bg-[#e6f4ff] text-[#0066cc] hover:bg-[#d9efff]">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
            <Button className="bg-[#34e0a1] hover:bg-[#2bc889] text-black px-4 py-2 rounded-full">
              Download PDF
            </Button>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-4">Cost Breakdown</h2>
              {budget && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Flights</span>
                    <span className="font-medium">₹{budget.flights.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hotel ({tripDuration()})</span>
                    <span className="font-medium">₹{budget.accommodation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities</span>
                    <span className="font-medium">₹{budget.activities.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food</span>
                    <span className="font-medium">₹{budget.food.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transportation</span>
                    <span className="font-medium">₹{budget.transportation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Miscellaneous</span>
                    <span className="font-medium">₹{budget.miscellaneous.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">₹{budget.total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flight Details */}
          {flights && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-4">Flight Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Outbound • {formatDate(tripInput.startDate)}</p>
                    <p className="font-medium">{flights.outbound.departure.airport} to {flights.outbound.arrival.airport}</p>
                    <p>{flights.outbound.airline} • {flights.outbound.departure.time} - {flights.outbound.arrival.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Return • {formatDate(tripInput.endDate)}</p>
                    <p className="font-medium">{flights.return.departure.airport} to {flights.return.arrival.airport}</p>
                    <p>{flights.return.airline} • {flights.return.departure.time} - {flights.return.arrival.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hotel */}
          {selectedHotel && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-4">Hotel</h2>
                <div>
                  <p className="font-medium">{selectedHotel.name}</p>
                  <p className="text-sm mb-2">{selectedHotel.location}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-[#00aa6c]">
                      {Array(selectedHotel.stars).fill(0).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({selectedHotel.reviews} reviews)</span>
                  </div>
                  <p className="font-medium">₹{selectedHotel.pricePerNight.toLocaleString()} per night</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Destination Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-bold text-xl mb-4">About {selectedDestination.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <p className="text-gray-700 mb-4">{selectedDestination.description}</p>
                <h3 className="font-medium text-lg mb-2">Highlights</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedDestination.highlights && selectedDestination.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
              <div>
                {selectedDestination.imageUrl && (
                  <img 
                    src={selectedDestination.imageUrl} 
                    alt={selectedDestination.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hotel Details */}
        {selectedHotel && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="font-bold text-xl mb-4">Accommodation Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="font-bold text-lg">{selectedHotel.name}</h3>
                  <p className="text-gray-500 mb-3">{selectedHotel.location}</p>
                  <p className="text-gray-700 mb-4">{selectedHotel.description}</p>
                  
                  <h3 className="font-medium text-lg mb-2">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedHotel.amenities && selectedHotel.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#34e0a1] rounded-full"></div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  {selectedHotel.imageUrls && selectedHotel.imageUrls.length > 0 && (
                    <img 
                      src={selectedHotel.imageUrls[0]} 
                      alt={selectedHotel.name} 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Itinerary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-bold text-xl mb-4">Your Trip Itinerary</h2>
            {itinerary && itinerary.length > 0 ? (
              <div className="space-y-8">
                {itinerary.map((day, index) => (
                  <div key={index} className="relative pl-8 pb-8 border-l border-gray-200 last:border-0">
                    <div className="absolute left-0 top-0 transform -translate-x-1/2 bg-blue-100 rounded-full p-1">
                      <Calendar size={18} className="text-blue-700" />
                    </div>
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-blue-700">Day {day.day}: {day.title}</h3>
                      <p className="text-sm text-gray-500">{day.date}</p>
                    </div>
                    <div className="space-y-4">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="relative pl-7">
                          <div className="absolute left-0 top-1 transform -translate-x-1/2">
                            <Clock size={16} className="text-gray-400" />
                          </div>
                          <div>
                            <p>
                              <span className="font-medium">{activity.time}</span> - {activity.description}
                              {activity.cost !== undefined && activity.cost > 0 && <span className="text-gray-500"> (₹{activity.cost.toLocaleString()})</span>}
                            </p>
                            {activity.location && (
                              <p className="text-sm text-gray-500">Location: {activity.location}</p>
                            )}
                            {activity.notes && (
                              <p className="text-sm text-gray-500 italic">{activity.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Itinerary information is not available.</p>
            )}
          </CardContent>
        </Card>

        {/* Recommended Activities */}
        {activities && activities.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="font-bold text-xl mb-4">Recommended Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activities.map((activity, index) => (
                  <Card key={index} className="overflow-hidden">
                    {activity.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={activity.imageUrl} 
                          alt={activity.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{activity.name}</h3>
                        <Badge className={activity.recommended ? "bg-green-100 text-green-800" : "bg-gray-100"}>
                          {activity.recommended ? "Recommended" : "Optional"}
                        </Badge>
                      </div>
                      <p className="text-gray-700 my-2">{activity.description}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>₹{activity.price.toLocaleString()}</span>
                        <span>{activity.duration}</span>
                        <span>{activity.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            className="rounded-full"
            onClick={handleBack}
          >
            Modify Trip
          </Button>
          <Button 
            className="bg-[#34e0a1] hover:bg-[#2bc889] text-black px-8 py-2 rounded-full font-medium"
          >
            Confirm Trip
          </Button>
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