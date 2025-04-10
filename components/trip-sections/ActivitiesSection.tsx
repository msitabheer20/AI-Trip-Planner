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
                className={`px-3 py-1 text-sm ${filter === 'optional' ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                onClick={() => setFilter('optional')}
              >
                Optional
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map((activity, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              {activity.imageUrl && (
                <div className="h-36 overflow-hidden">
                  <img 
                    src={activity.imageUrl} 
                    alt={activity.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold">{activity.name}</h3>
                  <Badge className={`${activity.recommended ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {activity.recommended ? 'Recommended' : 'Optional'}
                  </Badge>
                </div>
                
                <p className="text-gray-600 text-sm mt-1 mb-3 line-clamp-2">{activity.description}</p>
                
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <DollarSign size={14} className="mr-1" />
                    ₹{activity.price.toLocaleString()}
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {activity.duration}
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {activity.location}
                  </div>
                </div>
              </CardContent>
            </Card>
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