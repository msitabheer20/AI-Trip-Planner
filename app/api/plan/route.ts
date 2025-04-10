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
    const tripPlan = await aiAgentService.createTripPlan(tripInput);
    
    return NextResponse.json({ tripPlan });
  } catch (error) {
    console.error('Error in trip plan API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to create trip plan', 
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : null
      },
      { status: 500 }
    );
  }
} 