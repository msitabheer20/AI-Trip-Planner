import { openai } from './openai';
import { TripInput, TripPlan, Destination, Flight, Hotel, BudgetBreakdown, ItineraryDay, Activity } from './types';
import {
  destinationFinderPrompt,
  flightBookingPrompt,
  hotelBookingPrompt,
  budgetOptimizerPrompt,
  itineraryGeneratorPrompt,
  activityRecommendationPrompt,
  tripFinalizePrompt
} from './prompts';

export const MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo';

export class AiAgentService {
  
  // Find the best destination recommendations based on trip input
  async findDestinations(tripInput: TripInput): Promise<Destination[]> {

    // console.log("[[tripInput is here]] :", tripInput);
    try {
      const prompt = destinationFinderPrompt(tripInput);
      
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });
      
      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content returned from OpenAI');
      
      try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(content);
        
        // Handle different response formats
        if (Array.isArray(parsedResponse)) {
          // Direct array of destinations
          return parsedResponse;
        } else if (parsedResponse.destinations && Array.isArray(parsedResponse.destinations)) {
          // Object with destinations array property
          return parsedResponse.destinations;
        } else if (parsedResponse.name && parsedResponse.country) {
          // Single destination object
          return [parsedResponse];
        } else {
          // Check if there's a nested data structure with destinations
          const potentialArrays = Object.values(parsedResponse).filter(Array.isArray);
          if (potentialArrays.length > 0) {
            // Use the first array found that looks like destinations
            const destinationArray = potentialArrays.find((arr: any[]) => 
              arr.length > 0 && arr[0].name && arr[0].country
            );
            if (destinationArray) return destinationArray;
          }
          
          // Look for any objects with destination-like properties
          const allValues = this.findNestedObjects(parsedResponse);
          const destinationObjects = allValues.filter(
            (obj: any) => obj && typeof obj === 'object' && obj.name && obj.country
          );
          
          if (destinationObjects.length > 0) {
            return destinationObjects;
          }
          
          // If we get here, the response is not in the expected format
          console.error('Unexpected response format from OpenAI:', parsedResponse);
          throw new Error('Invalid destination data format');
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', content);
        
        // Last resort: try to extract JSON from the text
        try {
          const jsonMatch = content.match(/\[(.*?)\]/);
          if (jsonMatch) {
            const extractedJson = JSON.parse(jsonMatch[0]);
            if (Array.isArray(extractedJson) && extractedJson.length > 0) {
              return extractedJson;
            }
          }
        } catch (e) {
          // Ignore and fall through to the error
        }
        
        throw new Error('Failed to parse destination data');
      }
    } catch (error) {
      console.error('Error finding destinations:', error);
      throw error;
    }
  }
  
  // Helper method to find nested objects in complex JSON
  private findNestedObjects(obj: any): any[] {
    let results: any[] = [];
    
    if (obj && typeof obj === 'object') {
      // Add the object itself if it's not an array
      if (!Array.isArray(obj)) {
        results.push(obj);
      }
      
      // Process all properties/elements
      Object.values(obj).forEach(value => {
        if (value && typeof value === 'object') {
          results = results.concat(this.findNestedObjects(value));
        }
      });
    }
    
    return results;
  }
  
  // Find flight options for the selected destination
  async findFlights(tripInput: TripInput, destination: Destination): Promise<{ outbound: Flight, return: Flight }> {
    try {
      const prompt = flightBookingPrompt(tripInput, destination);
      
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });
      
      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content returned from OpenAI');
      
      // Parse the JSON response
      const flights = JSON.parse(content);
      return {
        outbound: flights.outbound,
        return: flights.return
      };
    } catch (error) {
      console.error('Error finding flights:', error);
      throw error;
    }
  }
  
  // Find hotel options for the selected destination
  async findHotels(tripInput: TripInput, destination: Destination): Promise<any> {
    try {
      const prompt = hotelBookingPrompt(tripInput, destination);

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });
      
      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content returned from OpenAI');
      
      // Parse the JSON response
      const parsedResponse = JSON.parse(content);
      
      // Return the full response which may contain a 'hotels' property
      return parsedResponse;
    } catch (error) {
      console.error('Error finding hotels:', error);
      throw error;
    }
  }
  
  // Optimize the budget based on selected options
  async optimizeBudget(
    tripInput: TripInput, 
    destination: Destination, 
    flights: { outbound: Flight, return: Flight }, 
    hotels: any
  ): Promise<BudgetBreakdown> {
    try {
      const prompt = budgetOptimizerPrompt(tripInput, destination, flights, hotels);
      
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });
      
      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content returned from OpenAI');
      
      // Parse the JSON response
      const budget = JSON.parse(content);
      return budget;
    } catch (error) {
      console.error('Error optimizing budget:', error);
      throw error;
    }
  }
  
  // Generate a day-by-day itinerary
  async generateItinerary(
    tripInput: TripInput, 
    destination: Destination, 
    hotel: any, 
    budget: BudgetBreakdown
  ): Promise<ItineraryDay[]> {
    try {
      console.log("[[hotel is here]] :", hotel);
      const prompt = itineraryGeneratorPrompt(tripInput, destination, hotel, budget);
      
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });
      
      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content returned from OpenAI');
      
      try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(content);
        
        // Handle different response formats
        if (parsedResponse.Itinerary && Array.isArray(parsedResponse.Itinerary)) {
          // Object with Itinerary property - this is our expected format
          return parsedResponse.Itinerary;
        } else if (Array.isArray(parsedResponse)) {
          // Direct array of itinerary days
          return parsedResponse;
        } else if (parsedResponse.itinerary && Array.isArray(parsedResponse.itinerary)) {
          // Object with itinerary array property
          return parsedResponse.itinerary;
        } else {
          // Look for any arrays that might contain itinerary data
          const potentialArrays = Object.values(parsedResponse).filter(Array.isArray);
          if (potentialArrays.length > 0) {
            // Use the first array found that looks like itinerary days
            const itineraryArray = potentialArrays.find((arr: any[]) => 
              arr.length > 0 && arr[0].day !== undefined && arr[0].activities
            );
            if (itineraryArray) return itineraryArray;
          }
          
          // If we get here, the response is not in the expected format
          console.error('Unexpected itinerary format from OpenAI:', parsedResponse);
          throw new Error('Invalid itinerary data format');
        }
      } catch (parseError) {
        console.error('JSON parsing error in itinerary:', parseError);
        console.error('Raw itinerary content:', content);
        
        // Last resort: try to extract JSON from the text
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch && jsonMatch[0]) {
            const extractedJson = JSON.parse(jsonMatch[0]);
            if (extractedJson.Itinerary && Array.isArray(extractedJson.Itinerary)) {
              return extractedJson.Itinerary;
            }
          }
        } catch (e) {
          console.error('Failed to extract itinerary JSON from text:', e);
        }
        
        throw new Error('Failed to parse itinerary data');
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  }
  
  // Recommend activities for the trip
  async recommendActivities(
    tripInput: TripInput, 
    destination: Destination, 
    budget: BudgetBreakdown
  ): Promise<Activity[]> {
    try {
      const prompt = activityRecommendationPrompt(tripInput, destination, budget);
      
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });
      
      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content returned from OpenAI');
      
      // Parse the JSON response
      const activities = JSON.parse(content);
      return activities;
    } catch (error) {
      console.error('Error recommending activities:', error);
      throw error;
    }
  }
  
  // Create a complete trip plan
  async createTripPlan(tripInput: TripInput): Promise<TripPlan> {
    try {
      console.log("===== START: Creating Trip Plan =====");
      console.log("Trip Input:", tripInput);
      
      // Step 1: Find destinations
      console.log("Finding destinations...");
      const destinations = await this.findDestinations(tripInput);
      console.log("Destinations found:", destinations);
      
      // Validate destinations
      if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
        throw new Error('No suitable destinations found');
      }
      
      const selectedDestination = destinations[0]; // Select the first destination
      console.log("Selected destination:", selectedDestination);
      
      // Validate selected destination
      if (!selectedDestination || !selectedDestination.name || !selectedDestination.country) {
        throw new Error('Invalid destination data returned from AI');
      }
      
      // Step 2: Find flights
      console.log("Finding flights...");
      const flights = await this.findFlights(tripInput, selectedDestination);
      console.log("Flights found:", flights);
      
      // Step 3: Find hotels
      console.log("Finding hotels...");
      const fetchedHotels = await this.findHotels(tripInput, selectedDestination);
      console.log("Hotels response:", fetchedHotels);
      
      const selectedHotel = fetchedHotels.hotels[0]; // Access the first hotel directly from the array
      console.log("Selected hotel:", selectedHotel);
      
      // Step 4: Optimize budget
      console.log("Optimizing budget...");
      const budget = await this.optimizeBudget(tripInput, selectedDestination, flights, selectedHotel);
      console.log("Budget optimized:", budget);
      
      // Step 5: Generate itinerary
      console.log("Generating itinerary...");
      const itinerary = await this.generateItinerary(tripInput, selectedDestination, selectedHotel, budget);
      console.log("Itinerary generated:", itinerary);
      
      // Step 6: Recommend activities
      console.log("Recommending activities...");
      const activities = await this.recommendActivities(tripInput, selectedDestination, budget);
      console.log("Activities recommended:", activities);
      
      // Assemble the complete trip plan
      const tripPlan: TripPlan = {
        destination: selectedDestination,
        flights: flights,
        hotel: selectedHotel,
        itinerary: itinerary,
        budget: budget,
        activities: activities
      };
      
      console.log("===== COMPLETE: Trip Plan Created =====");
      console.log("Final Trip Plan:", tripPlan);
      
      return tripPlan;
    } catch (error) {
      console.error('Error creating trip plan:', error);
      throw error;
    }
  }
  // Generate a final summary of the trip
  async finalizeTripPlan(tripPlan: TripPlan): Promise<any> {
    try {
      const prompt = tripFinalizePrompt(tripPlan);
      
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });
      
      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content returned from OpenAI');
      
      // Parse the JSON response
      const finalSummary = JSON.parse(content);
      return finalSummary;
    } catch (error) {
      console.error('Error finalizing trip plan:', error);
      throw error;
    }
  }
  
}