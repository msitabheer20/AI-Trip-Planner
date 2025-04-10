"use client"

import { useEffect } from 'react';
import { useTripContext } from '@/lib/trip-context';
import { useRouter } from 'next/navigation';
import TripPlanDisplay from '@/components/TripPlanDisplay';

export default function TripResults() {
  const router = useRouter();
  const {
    loading,
    error,
    tripPlan,
  } = useTripContext();

  useEffect(() => {
    // Debug logging to see what data is available
    console.log("Trip Results - Context Data:", {
      loading,
      tripPlan
    });
    
    // If no trip data is available and not loading, redirect back to planner
    if (!tripPlan && !loading) {
      console.log("No trip plan data, redirecting back to planner");
      router.push('/trip-planner');
    }
  }, [tripPlan, loading, router]);

  const handleBack = () => {
    router.push('/trip-planner');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#34e0a1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Finalizing your perfect trip...</h2>
          <p className="text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-medium text-red-700 mb-2">Error Planning Your Trip</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              onClick={handleBack}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!tripPlan) {
    return null; // Will redirect in useEffect
  }

  return (
    <TripPlanDisplay 
      tripPlan={tripPlan} 
      onBack={handleBack}
    />
  );
} 