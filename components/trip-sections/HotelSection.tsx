import { useState } from 'react';
import { TripPlan } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Star, MapPin, Wifi, Coffee, Check } from 'lucide-react';

interface HotelSectionProps {
  tripPlan: TripPlan;
  isPreview: boolean;
}

export default function HotelSection({ tripPlan, isPreview }: HotelSectionProps) {
  const { hotel } = tripPlan;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!hotel) return null;

  const calculateTripDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateTripDuration(
    tripPlan.tripInput?.startDate || '', 
    tripPlan.tripInput?.endDate || ''
  );

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <span className="bg-amber-100 p-1.5 rounded-full mr-2">
            <Building size={16} className="text-amber-500" />
          </span>
          Accommodation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">{hotel?.name || 'Hotel'}</h3>
            <div className="flex items-center mb-2">
              <div className="flex text-amber-400 mr-2">
                {Array(hotel?.stars || 0).fill(0).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-gray-600">{hotel?.reviews || 0} reviews</span>
            </div>
            <p className="text-gray-600 mb-4">{hotel?.description || 'No description available'}</p>
            
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <MapPin size={16} className="mr-1.5" />
              <span>{hotel?.location || 'Location not specified'}</span>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {hotel?.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Check size={14} className="text-green-500 mr-1.5" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Price per night</span>
                <span className="font-bold">₹{hotel?.pricePerNight?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total for {nights} nights</span>
                <span className="font-bold">₹{(hotel?.pricePerNight || 0) * nights}</span>
              </div>
            </div>
          </div>
          
          {hotel?.imageUrls && hotel.imageUrls.length > 0 && (
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img 
                src={hotel.imageUrls[activeImageIndex]} 
                alt={hotel.name} 
                className="w-full h-full object-cover"
              />
              {hotel.imageUrls.length > 1 && (
                <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-1">
                  {hotel.imageUrls.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 