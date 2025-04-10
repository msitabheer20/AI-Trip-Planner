import { NextRequest, NextResponse } from 'next/server';
import { AiAgentService } from '@/lib/ai-agent-service';

export async function POST(req: NextRequest) {
  try {
    const { tripInput, destination, budget } = await req.json();
    
    // Validate required fields
    if (!tripInput || !destination || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const aiAgentService = new AiAgentService();
    const activities = await aiAgentService.recommendActivities(tripInput, destination, budget);
    
    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error in activities API:', error);
    return NextResponse.json(
      { error: 'Failed to recommend activities' },
      { status: 500 }
    );
  }
} 