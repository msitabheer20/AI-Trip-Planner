import { NextRequest, NextResponse } from 'next/server';
import { AiAgentService } from '@/lib/ai-agent-service';

export async function POST(req: NextRequest) {
  try {
    const { tripInput, destination, hotel, budget } = await req.json();
    
    // Validate required fields
    if (!tripInput || !destination || !hotel || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const aiAgentService = new AiAgentService();
    const itinerary = await aiAgentService.generateItinerary(tripInput, destination, hotel, budget);
    
    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error('Error in itinerary API:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary' },
      { status: 500 }
    );
  }
} 