import { openai } from './openai';
import { TripInput, TripPlan, Destination, Flight, BudgetBreakdown, ItineraryDay, Activity } from './types';
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
    try {
      console.log('Finding destinations...');
      const prompt = destinationFinderPrompt(tripInput);
      
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });
      
      const content = response.choices[0]?.message?.content?.trim() || '';
      console.log('Raw AI response:', content);
      
      try {
        // First attempt: Direct parsing
        const parsedData = JSON.parse(content);
        
        // Case 1: Response is a direct array of destinations
        if (Array.isArray(parsedData)) {
          if (parsedData.length > 0 && this.validateDestinationObject(parsedData[0])) {
            console.log('Parsed destinations directly from array:', parsedData.length);
            return parsedData as Destination[];
          }
        }
        
        // Case 2: Response is an object with a destinations array property
        if (parsedData.destinations && Array.isArray(parsedData.destinations)) {
          if (parsedData.destinations.length > 0 && this.validateDestinationObject(parsedData.destinations[0])) {
            console.log('Extracted destinations from object property:', parsedData.destinations.length);
            return parsedData.destinations as Destination[];
          }
        }
        
        // Case 3: Response is a single destination object
        if (this.validateDestinationObject(parsedData)) {
          console.log('Found single destination object');
          return [parsedData] as Destination[];
        }
        
        // Case 4: Search for nested arrays or objects that might contain destinations
        const possibleDestinations = this.findNestedDestinations(parsedData);
        if (possibleDestinations.length > 0) {
          console.log('Found destinations in nested structure:', possibleDestinations.length);
          return possibleDestinations as Destination[];
        }
        
        console.error('Unable to find valid destinations in the parsed data');
        return [];
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        
        // Fallback: Try to extract JSON from text if initial parsing failed
        const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        if (jsonMatch && jsonMatch[0]) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0]);
            
            if (Array.isArray(extractedJson)) {
              if (extractedJson.length > 0 && this.validateDestinationObject(extractedJson[0])) {
                console.log('Extracted destinations from text using regex:', extractedJson.length);
                return extractedJson as Destination[];
              }
            } else if (extractedJson.destinations && Array.isArray(extractedJson.destinations)) {
              console.log('Extracted destinations property from text using regex:', extractedJson.destinations.length);
              return extractedJson.destinations as Destination[];
            } else if (this.validateDestinationObject(extractedJson)) {
              console.log('Extracted single destination from text using regex');
              return [extractedJson] as Destination[];
            }
          } catch (fallbackError) {
            console.error('Fallback JSON extraction failed:', fallbackError);
          }
        }
        
        console.error('All parsing attempts failed');
        return [];
      }
    } catch (error) {
      console.error('Error in findDestinations:', error);
      return [];
    }
  }
  
  private validateDestinationObject(obj: any): boolean {
    return obj && 
           typeof obj === 'object' &&
           typeof obj.name === 'string' && 
           typeof obj.country === 'string' &&
           typeof obj.description === 'string';
  }
  
  private findNestedDestinations(data: any): Destination[] {
    const results: Destination[] = [];
    
    // Helper function to recursively search for destination-like objects
    const searchNestedObjects = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      
      // Check if current object looks like a destination
      if (this.validateDestinationObject(obj)) {
        results.push(obj as Destination);
        return;
      }
      
      // Explore array elements
      if (Array.isArray(obj)) {
        for (const item of obj) {
          searchNestedObjects(item);
        }
        return;
      }
      
      // Explore object properties
      for (const key in obj) {
        // Special handling for common container properties
        if (key === 'destinations' || key === 'results' || key === 'options' || key === 'suggestions') {
          if (Array.isArray(obj[key])) {
            if (obj[key].length > 0 && this.validateDestinationObject(obj[key][0])) {
              results.push(...obj[key]);
              continue;
            }
          }
        }
        
        searchNestedObjects(obj[key]);
      }
    };
    
    searchNestedObjects(data);
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
      // console.log("[[hotel is here]] :", hotel);
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
        hotels: fetchedHotels.hotels,
        itinerary: itinerary,
        budget: budget,
        activities: activities,
        tripInput: tripInput
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