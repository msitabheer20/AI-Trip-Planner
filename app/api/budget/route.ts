import { NextRequest, NextResponse } from 'next/server';
import { AiAgentService } from '@/lib/ai-agent-service';

export async function POST(req: NextRequest) {
  try {
    const { tripInput, destination, flights, hotel } = await req.json();
    
    // Validate required fields
    if (!tripInput || !destination || !flights || !hotel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const aiAgentService = new AiAgentService();
    const budget = await aiAgentService.optimizeBudget(tripInput, destination, flights, hotel);
    
    return NextResponse.json({ budget });
  } catch (error) {
    console.error('Error in budget API:', error);
    return NextResponse.json(
      { error: 'Failed to optimize budget' },
      { status: 500 }
    );
  }
} 