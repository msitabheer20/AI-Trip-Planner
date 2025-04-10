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
            <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
            <div className="flex items-center mb-2">
              <div className="flex text-amber-400 mr-2">
                {Array(hotel.stars).fill(0).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-gray-500">({hotel.reviews} reviews)</span>
            </div>
            
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin size={16} className="mr-1" />
              <span>{hotel.location}</span>
            </div>

            <p className="text-gray-700 mb-4">{hotel.description}</p>

            {!isPreview && (
              <>
                <h4 className="font-medium text-lg mb-2">Amenities</h4>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {hotel.amenities?.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Check size={16} className="text-green-500 mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-between items-center border-t pt-4">
              <div>
                <p className="text-gray-500">Price per night</p>
                <p className="font-bold text-xl">₹{hotel.pricePerNight.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Total for {nights} nights</p>
                <p className="font-bold text-xl">₹{(hotel.pricePerNight * nights).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {hotel.imageUrls && hotel.imageUrls.length > 0 ? (
              <>
                <div className="relative rounded-lg overflow-hidden h-48 md:h-64">
                  <img 
                    src={hotel.imageUrls[activeImageIndex]} 
                    alt={hotel.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                
                {!isPreview && hotel.imageUrls.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {hotel.imageUrls.map((url, index) => (
                      <div 
                        key={index}
                        className={`cursor-pointer rounded-md overflow-hidden h-16 border-2 ${index === activeImageIndex ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img src={url} alt={`${hotel.name} ${index+1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center h-48 md:h-64">
                <Building size={48} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 