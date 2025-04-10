# TripNest AI Trip Planner

TripNest is an AI-powered trip planning application that helps users create personalized travel plans. It leverages OpenAI APIs to provide intelligent recommendations for destinations, flights, accommodations, and activities based on user preferences.

## Features

- AI-powered destination recommendations based on user preferences
- Intelligent flight and hotel suggestions
- Budget optimization and analysis
- Detailed itinerary generation
- Activity recommendations

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Integration**: OpenAI API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trip-planner.git
   cd trip-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4-turbo
   API_ROUTE_SECRET=trip_planner_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## AI Trip Planning Process

The application uses a multi-agent AI approach to plan trips:

1. **Destination Finder Agent**: Recommends destinations based on user preferences
2. **Flight Booking Agent**: Finds suitable flights to the destination
3. **Hotel Booking Agent**: Recommends accommodations based on user preferences
4. **Budget Optimizer Agent**: Creates a detailed budget breakdown
5. **Itinerary Generator Agent**: Creates a day-by-day itinerary
6. **Activity Recommendation Agent**: Suggests activities at the destination

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: The OpenAI model to use (default: gpt-4-turbo)
- `API_ROUTE_SECRET`: Secret key for API route protection

## License

This project is licensed under the MIT License - see the LICENSE file for details.
