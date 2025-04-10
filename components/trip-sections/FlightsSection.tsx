import { TripPlan } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";
import { Plane, ArrowRight, Clock } from 'lucide-react';

interface FlightsSectionProps {
  tripPlan: TripPlan;
  isPreview: boolean;
}

export default function FlightsSection({ tripPlan, isPreview }: FlightsSectionProps) {
  const { flights } = tripPlan;
  
  if (!flights) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <span className="bg-green-100 p-1.5 rounded-full mr-2">
            <Plane size={16} className="text-green-500" />
          </span>
          Flight Details
        </h2>

        <div className="space-y-6">
          {/* Outbound Flight */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="font-medium">Outbound Flight • {formatDate(tripPlan.tripInput?.startDate || '')}</h3>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-bold text-lg">{flights.outbound.departure.time}</p>
                  <p className="text-sm text-gray-600">{flights.outbound.departure.airport} ({flights.outbound.departure.code})</p>
                </div>
                <div className="flex-1 px-6 relative">
                  <div className="border-t border-dashed border-gray-300 w-full absolute top-1/2"></div>
                  <div className="absolute left-0 top-1/2 w-2 h-2 rounded-full bg-gray-400 transform -translate-y-1/2"></div>
                  <div className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-gray-400 transform -translate-y-1/2"></div>
                  <p className="text-xs text-center mt-2 flex items-center justify-center">
                    <Clock size={12} className="mr-1" />
                    {flights.outbound.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{flights.outbound.arrival.time}</p>
                  <p className="text-sm text-gray-600">{flights.outbound.arrival.airport} ({flights.outbound.arrival.code})</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                <div>
                  <p className="text-gray-500">Airline</p>
                  <p>{flights.outbound.airline}</p>
                </div>
                <div>
                  <p className="text-gray-500">Flight #</p>
                  <p>{flights.outbound.flightNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Class</p>
                  <p>{flights.outbound.class || 'Economy'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium">₹{flights.outbound.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Flight */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="font-medium">Return Flight • {formatDate(tripPlan.tripInput?.endDate || '')}</h3>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-bold text-lg">{flights.return.departure.time}</p>
                  <p className="text-sm text-gray-600">{flights.return.departure.airport} ({flights.return.departure.code})</p>
                </div>
                <div className="flex-1 px-6 relative">
                  <div className="border-t border-dashed border-gray-300 w-full absolute top-1/2"></div>
                  <div className="absolute left-0 top-1/2 w-2 h-2 rounded-full bg-gray-400 transform -translate-y-1/2"></div>
                  <div className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-gray-400 transform -translate-y-1/2"></div>
                  <p className="text-xs text-center mt-2 flex items-center justify-center">
                    <Clock size={12} className="mr-1" />
                    {flights.return.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{flights.return.arrival.time}</p>
                  <p className="text-sm text-gray-600">{flights.return.arrival.airport} ({flights.return.arrival.code})</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                <div>
                  <p className="text-gray-500">Airline</p>
                  <p>{flights.return.airline}</p>
                </div>
                <div>
                  <p className="text-gray-500">Flight #</p>
                  <p>{flights.return.flightNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Class</p>
                  <p>{flights.return.class || 'Economy'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium">₹{flights.return.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {!isPreview && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Travel Tip:</span> We recommend arriving at the airport at least 2 hours before your flight for domestic travel and 3 hours for international travel.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 