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
    if (!activity || !activity.description) return <Sun size={16} className="text-teal-500" />;
    
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
          {displayItinerary.map((day, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div 
                className={`${expandedDay === day.day ? 'bg-indigo-50' : 'bg-gray-50'} px-4 py-2 flex justify-between items-center cursor-pointer`}
                onClick={() => toggleDay(day.day)}
              >
                <h3 className="font-medium">Day {day.day}: {day.title || 'Day ' + day.day}</h3>
                <div className="text-sm text-gray-500">{day.date || 'Date not specified'}</div>
              </div>
              
              {expandedDay === day.day && (
                <div className="p-4 space-y-3">
                  {day.activities?.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-start">
                      <div className="mr-3 mt-1">
                        {getActivityIcon(activity)}
                      </div>
                      <div className="flex-1">
                        {activity.time && (
                          <div className="text-sm text-gray-500 mb-1 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {activity.time}
                          </div>
                        )}
                        <p>{activity.description || 'No description available'}</p>
                        {activity.location && (
                          <div className="text-sm text-gray-600 mt-1 flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {activity.location}
                          </div>
                        )}
                        {activity.cost && (
                          <div className="text-sm text-gray-600 mt-1">
                            Cost: ₹{activity.cost.toLocaleString()}
                          </div>
                        )}
                        {activity.notes && (
                          <div className="text-sm text-gray-600 mt-1 flex items-start">
                            <Info size={14} className="mr-1 mt-0.5" />
                            <span>{activity.notes}</span>
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