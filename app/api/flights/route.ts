import { NextRequest, NextResponse } from 'next/server';
import { AiAgentService } from '@/lib/ai-agent-service';

export async function POST(req: NextRequest) {
  try {
    const { tripInput, destination } = await req.json();
    
    // Validate required fields
    if (!tripInput || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const aiAgentService = new AiAgentService();
    const flights = await aiAgentService.findFlights(tripInput, destination);
    
    return NextResponse.json({ flights });
  } catch (error) {
    console.error('Error in flights API:', error);
    return NextResponse.json(
      { error: 'Failed to find flights' },
      { status: 500 }
    );
  }
} 