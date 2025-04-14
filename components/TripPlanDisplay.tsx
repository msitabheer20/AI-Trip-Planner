"use client"

import { useState } from 'react';
import { TripPlan } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Star, MapPin, Calendar, Clock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from './layout/Layout';

import DestinationSection from './trip-sections/DestinationSection';
import FlightsSection from './trip-sections/FlightsSection';
import HotelSection from './trip-sections/HotelSection';
import BudgetSection from './trip-sections/BudgetSection';
import ItinerarySection from './trip-sections/ItinerarySection';
import ActivitiesSection from './trip-sections/ActivitiesSection';

interface TripPlanDisplayProps {
  tripPlan: TripPlan;
  onBack?: () => void;
}

export default function TripPlanDisplay({ tripPlan, onBack }: TripPlanDisplayProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Helper functions
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateTripDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const tripDuration = calculateTripDuration(
    tripPlan.tripInput?.startDate || '', 
    tripPlan.tripInput?.endDate || ''
  );

  return (
    <div>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#34e0a1] to-[#00aa6c] text-white">
        <div className="container max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Your Trip to {tripPlan.destination?.name || 'Destination'}, {tripPlan.destination?.country || 'Country'}
              </h1>
              <p className="text-xl opacity-90">
                {tripDuration} • {formatDate(tripPlan.tripInput?.startDate || '')} - {formatDate(tripPlan.tripInput?.endDate || '')}
              </p>
            </div>
            {onBack && (
              <Button 
                variant="outline" 
                className="mt-4 md:mt-0 bg-white/20 text-white hover:bg-white/30 border-white/40"
                onClick={onBack}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="destination">Destination</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Budget Summary Card */}
              <Card className="md:col-span-1">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-purple-100 p-1.5 rounded-full mr-2">
                      <span className="block bg-purple-500 w-4 h-4 rounded-full"></span>
                    </span>
                    Budget
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Cost</span>
                      <span className="font-bold">₹{tripPlan.budget?.mainPlan?.total?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Per Person</span>
                      <span className="font-medium">₹{tripPlan.budget?.mainPlan?.total?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("budget")}>
                        View Detailed Budget
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Highlights Card */}
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-amber-100 p-1.5 rounded-full mr-2">
                      <span className="block bg-amber-500 w-4 h-4 rounded-full"></span>
                    </span>
                    Trip Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tripPlan.destination?.highlights?.slice(0, 4).map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("destination")}>
                      Explore Destination
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Overview Sections */}
            <DestinationSection tripPlan={tripPlan} isPreview={true} />
            <FlightsSection tripPlan={tripPlan} isPreview={true} />
            <HotelSection tripPlan={tripPlan} isPreview={true} />
            <ItinerarySection tripPlan={tripPlan} isPreview={true} />
          </TabsContent>

          {/* Detailed Tabs */}
          <TabsContent value="destination">
            <DestinationSection tripPlan={tripPlan} isPreview={false} />
          </TabsContent>

          <TabsContent value="flights">
            <FlightsSection tripPlan={tripPlan} isPreview={false} />
          </TabsContent>

          <TabsContent value="accommodation">
            <HotelSection tripPlan={tripPlan} isPreview={false} />
          </TabsContent>

          <TabsContent value="itinerary">
            <ItinerarySection tripPlan={tripPlan} isPreview={false} />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetSection tripPlan={tripPlan} />
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-between mt-12 pt-6 border-t">
          <Button variant="outline" onClick={onBack}>
            Modify Trip
          </Button>
          
          <div className="space-x-4">
            <Button variant="outline">
              Save Trip
            </Button>
            <Button className="bg-[#34e0a1] hover:bg-[#2bc889] text-black flex items-center gap-2">
              <img 
                src="https://static.thenounproject.com/png/6404439-200.png" 
                alt="AI Icon" 
                className="w-5 h-5"
              />
              Confirm & Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 