import { TripPlan } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, Coffee, Car, Utensils, Info, Sunrise, Sunset, Sun } from 'lucide-react';
import { useState } from 'react';

interface ItinerarySectionProps {
  tripPlan: TripPlan;
  isPreview: boolean;
}

export default function ItinerarySection({ tripPlan, isPreview }: ItinerarySectionProps) {
  const { itinerary } = tripPlan;
  const [expandedDay, setExpandedDay] = useState<number | null>(isPreview ? null : 1);

  if (!itinerary || itinerary.length === 0) return null;

  const toggleDay = (day: number) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  const getActivityIcon = (activity: any) => {
    const description = activity.description.toLowerCase();
    
    if (description.includes('breakfast') || description.includes('coffee')) {
      return <Coffee size={16} className="text-amber-500" />;
    } else if (description.includes('lunch') || description.includes('dinner') || description.includes('meal')) {
      return <Utensils size={16} className="text-red-500" />;
    } else if (description.includes('drive') || description.includes('taxi') || description.includes('transport')) {
      return <Car size={16} className="text-blue-500" />;
    } else if (description.includes('morning')) {
      return <Sunrise size={16} className="text-amber-500" />;
    } else if (description.includes('evening')) {
      return <Sunset size={16} className="text-purple-500" />;
    } else {
      return <Sun size={16} className="text-teal-500" />;
    }
  };

  // For preview mode, show only the first day
  const displayItinerary = isPreview ? itinerary.slice(0, 1) : itinerary;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <span className="bg-indigo-100 p-1.5 rounded-full mr-2">
            <CalendarDays size={16} className="text-indigo-500" />
          </span>
          {isPreview ? 'Itinerary Preview' : 'Complete Itinerary'}
        </h2>

        <div className="space-y-4">
          {displayItinerary.map((day) => (
            <div key={day.day} className="border rounded-lg overflow-hidden">
              <div 
                className={`${expandedDay === day.day ? 'bg-indigo-50' : 'bg-gray-50'} px-4 py-3 flex justify-between items-center cursor-pointer border-b`}
                onClick={() => toggleDay(day.day)}
              >
                <div>
                  <h3 className="font-bold">
                    Day {day.day}: {day.title}
                  </h3>
                  <p className="text-sm text-gray-500">{day.date}</p>
                </div>
                <div className="text-gray-400">
                  {expandedDay === day.day ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </div>
              
              {(expandedDay === day.day || (isPreview && day.day === 1)) && (
                <div className="p-4 space-y-4">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="relative pl-8 py-2">
                      <div className="absolute left-0 top-3">
                        {getActivityIcon(activity)}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <div className="font-medium mr-2">{activity.time}</div>
                          <div>{activity.description}</div>
                          {activity.cost > 0 && (
                            <div className="ml-2 text-sm text-gray-500">
                              ₹{activity.cost.toLocaleString()}
                            </div>
                          )}
                        </div>
                        {activity.location && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin size={14} className="mr-1" />
                            {activity.location}
                          </div>
                        )}
                        {activity.notes && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Info size={14} className="mr-1" />
                            {activity.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {isPreview && itinerary.length > 1 && (
          <div className="mt-4 text-center">
            <p className="text-gray-500">
              + {itinerary.length - 1} more days in your complete itinerary
            </p>
          </div>
        )}

        {!isPreview && (
          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-medium text-green-800 mb-2">Itinerary Notes</h3>
            <ul className="text-sm text-green-700 space-y-2">
              <li>• All activities are flexible and can be adjusted based on your preferences.</li>
              <li>• We've balanced sightseeing with leisure time to ensure a relaxing experience.</li>
              <li>• Local transportation between attractions is not included in activity costs unless specified.</li>
              <li>• We recommend confirming opening hours and availability for attractions before your visit.</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 