import { TripPlan } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, PieChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface BudgetSectionProps {
  tripPlan: TripPlan;
}

export default function BudgetSection({ tripPlan }: BudgetSectionProps) {
  const { budget } = tripPlan;

  // Debug logging
  console.log("Budget data:", JSON.stringify(budget, null, 2));
  
  if (!budget || !budget.mainPlan) return null;

  // Calculate percentages for donut chart
  const total = budget.mainPlan.total || 0;
  const categories = [
    { name: 'Flights', value: budget.mainPlan.flights || 0, color: 'bg-blue-500', percentage: Math.round(((budget.mainPlan.flights || 0) / total) * 100) },
    { name: 'Accommodation', value: budget.mainPlan.accommodation || 0, color: 'bg-green-500', percentage: Math.round(((budget.mainPlan.accommodation || 0) / total) * 100) },
    { name: 'Activities', value: budget.mainPlan.activities || 0, color: 'bg-purple-500', percentage: Math.round(((budget.mainPlan.activities || 0) / total) * 100) },
    { name: 'Food', value: budget.mainPlan.food || 0, color: 'bg-amber-500', percentage: Math.round(((budget.mainPlan.food || 0) / total) * 100) },
    { name: 'Transportation', value: budget.mainPlan.transportation || 0, color: 'bg-red-500', percentage: Math.round(((budget.mainPlan.transportation || 0) / total) * 100) },
    { name: 'Miscellaneous', value: budget.mainPlan.miscellaneous || 0, color: 'bg-gray-500', percentage: Math.round(((budget.mainPlan.miscellaneous || 0) / total) * 100) },
  ];

  // Sort by value for better visualization
  categories.sort((a, b) => b.value - a.value);

  

  // Use real alternatives if available, otherwise use sample data for testing
  const alternatives = budget.alternativePlans && budget.alternativePlans.length > 0
    ? budget.alternativePlans 
    : [];
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <span className="bg-emerald-100 p-1.5 rounded-full mr-2">
            <Wallet size={16} className="text-emerald-500" />
          </span>
          Budget Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Budget Summary */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden shadow-md">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4">
                <h3 className="text-lg font-medium mb-1">Total Budget</h3>
                <p className="text-2xl font-bold">₹{budget.mainPlan.total?.toLocaleString() || '0'}</p>
                {budget.mainPlan.originalBudget && (
                  <div className="flex items-center mt-2 text-sm">
                    <span className="mr-1">Original Budget: ₹{budget.mainPlan.originalBudget?.toLocaleString() || '0'}</span>
                    {budget.mainPlan.total <= budget.mainPlan.originalBudget ? (
                      <TrendingDown size={16} className="text-green-200" />
                    ) : (
                      <TrendingUp size={16} className="text-red-200" />
                    )}
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                {categories.map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{category.name}</span>
                      <span className="font-medium">₹{category.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${category.color}`} style={{ width: `${category.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
                {/* Total Cost Row */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 font-bold">Total Cost</span>
                    <span className="font-bold">₹{budget.mainPlan.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Alternative Options */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Alternative Options</h3>
              <div className="space-y-4">
                {alternatives.map((alt, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-medium flex items-center">
                      <DollarSign size={16} className="mr-1 text-emerald-500" />
                      {alt.name}
                    </h4>
                    <p className="text-xl font-bold mb-2">₹{alt.total.toLocaleString()}</p>
                    {alt.breakdown && (
                      <div className="text-sm space-y-1 text-gray-600">
                        {Object.entries(alt.breakdown).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                            <span>₹{(value as number).toLocaleString()}</span>
                          </div>
                        ))}
                        {/* Alternative Total Row */}
                        <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold">
                          <span>Total Cost</span>
                          <span>₹{alt.total.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Chart and Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Visual Budget Chart */}
            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <PieChart size={256} className="text-gray-200" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-3xl font-bold">₹{budget.mainPlan.total?.toLocaleString() || '0'}</span>
                    <span className="text-gray-500">Total Budget</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card key={category.name} className="p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                    {category.name}
                  </h4>
                  <p className="text-2xl font-bold">₹{category.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{category.percentage}% of total</p>
                </Card>
              ))}
            </div>

            {/* Budget Tips */}
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4">
                <h3 className="font-medium flex items-center mb-2 text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Budget Tips
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-blue-600">1</span>
                    </span>
                    Book flights in advance to secure better rates.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-blue-600">2</span>
                    </span>
                    Consider local transportation options like public transit to save on daily travel costs.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-blue-600">3</span>
                    </span>
                    Many attractions offer discounted rates for online bookings or during weekdays.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 