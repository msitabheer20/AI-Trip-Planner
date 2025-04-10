import { NextRequest, NextResponse } from 'next/server';
import { AiAgentService } from '@/lib/ai-agent-service';

export async function POST(req: NextRequest) {
  try {
    const tripInput = await req.json();
    
    // Validate required fields
    if (!tripInput.origin || !tripInput.budget || !tripInput.startDate || !tripInput.endDate || !tripInput.tripType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const aiAgentService = new AiAgentService();
    const destinations = await aiAgentService.findDestinations(tripInput);
    
    return NextResponse.json({ destinations });
  } catch (error) {
    console.error('Error in destinations API:', error);
    return NextResponse.json(
      { error: 'Failed to find destinations' },
      { status: 500 }
    );
  }
} 