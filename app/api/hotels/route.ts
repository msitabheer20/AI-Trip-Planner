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
    const hotels = await aiAgentService.findHotels(tripInput, destination);
    
    return NextResponse.json({ hotels });
  } catch (error) {
    console.error('Error in hotels API:', error);
    return NextResponse.json(
      { error: 'Failed to find hotels' },
      { status: 500 }
    );
  }
}