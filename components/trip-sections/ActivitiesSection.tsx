import { TripPlan } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity as ActivityIcon, Star, Clock, DollarSign, MapPin } from 'lucide-react';
import { useState } from 'react';

interface ActivitiesSectionProps {
  tripPlan: TripPlan;
  isPreview: boolean;
}

export default function ActivitiesSection({ tripPlan, isPreview }: ActivitiesSectionProps) {
  const { activities } = tripPlan;
  const [filter, setFilter] = useState('all');

  if (!activities || activities.length === 0) return null;

  // For preview mode, show only a few activities
  const displayActivities = isPreview ? activities.slice(0, 3) : activities;

  const filteredActivities = filter === 'all' 
    ? displayActivities 
    : filter === 'recommended' 
      ? displayActivities.filter(a => a.recommended) 
      : displayActivities.filter(a => !a.recommended);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <span className="bg-rose-100 p-1.5 rounded-full mr-2">
              <ActivityIcon size={16} className="text-rose-500" />
            </span>
            Recommended Activities
          </h2>

          {!isPreview && (
            <div className="flex border rounded-md overflow-hidden">
              <button 
                className={`px-3 py-1 text-sm ${filter === 'all' ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 text-sm ${filter === 'recommended' ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                onClick={() => setFilter('recommended')}
              >
                Recommended
              </button>
              <button 
                className={`px-3 py-1 text-sm ${filter === 'other' ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                onClick={() => setFilter('other')}
              >
                Other
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map((activity, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              {activity.imageUrl && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={activity.imageUrl} 
                    alt={activity.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{activity.name || 'Activity'}</h3>
                  {activity.recommended && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Star size={12} className="mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{activity.description || 'No description available'}</p>
                
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  {activity.duration && (
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {activity.duration}
                    </div>
                  )}
                  {activity.price && (
                    <div className="flex items-center">
                      <DollarSign size={12} className="mr-1" />
                      ₹{activity.price.toLocaleString()}
                    </div>
                  )}
                  {activity.location && (
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-1" />
                      {activity.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isPreview && activities.length > 3 && (
          <div className="mt-4 text-center">
            <p className="text-gray-500">
              + {activities.length - 3} more activities available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 