import { TripPlan } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe } from 'lucide-react';

interface DestinationSectionProps {
  tripPlan: TripPlan;
  isPreview: boolean;
}

export default function DestinationSection({ tripPlan, isPreview }: DestinationSectionProps) {
  const { destination } = tripPlan;

  return (
    <Card>
      <CardContent className={`p-6 ${!isPreview ? 'space-y-6' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <span className="bg-blue-100 p-1.5 rounded-full mr-2">
              <MapPin size={16} className="text-blue-500" />
            </span>
            Destination
          </h2>
          {isPreview && (
            <Badge variant="outline" className="bg-gray-50">
              {destination?.matchPercentage || 0}% Match
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">{destination?.name || 'Destination'}, {destination?.country || 'Country'}</h3>
            <p className="text-gray-600 mb-4">{destination?.description || 'No description available'}</p>
            
            {!isPreview && (
              <>
                <h4 className="font-medium text-lg mb-2">Highlights</h4>
                <ul className="space-y-1 pl-5 list-disc mb-6">
                  {destination?.highlights?.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>

                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Globe size={16} className="mr-1.5" />
                    <span>{destination?.country || 'Country'}</span>
                  </div>
                  {destination?.language && (
                    <div>
                      <span className="font-medium">Language:</span> {destination.language}
                    </div>
                  )}
                  {destination?.currency && (
                    <div>
                      <span className="font-medium">Currency:</span> {destination.currency}
                    </div>
                  )}
                </div>
              </>
            )}
            
            {isPreview && destination?.highlights && destination.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {destination.highlights.slice(0, 3).map((highlight, index) => (
                  <Badge key={index} className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {highlight}
                  </Badge>
                ))}
                {destination.highlights.length > 3 && (
                  <Badge variant="outline">+{destination.highlights.length - 3} more</Badge>
                )}
              </div>
            )}
          </div>
          
          {destination?.imageUrl && (
            <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
              <img 
                src={destination.imageUrl} 
                alt={`${destination.name}, ${destination.country}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 