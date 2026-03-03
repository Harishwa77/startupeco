# EchelonAI | Project Manifest & AI System Prompt

## Core Identity
EchelonAI is an **Advanced AI Startup Ecosystem Engine** designed for Founders, Investors, and Talent. It leverages Genkit (Gemini 1.5/2.0) and live data layers to provide professional-grade strategic intelligence.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **AI/GenAI**: Genkit for Google AI (Gemini 2.5 Flash / Flash-Image)
- **Database**: Firebase Firestore (Real-time pool & private reports)
- **Auth**: Firebase Authentication (Anonymous & Secure)
- **Integrations**: 
  - **NewsAPI**: Real-time industry sentiment analysis.
  - **Alpha Vantage**: Financial benchmarks and sector performance.
  - **Google Maps JS API**: Geospatial Intelligence for regional strategy.
- **UI/UX**: Tailwind CSS, ShadCN UI, Lucide Icons, Recharts (Data Visualization).

## Functional Modes
1. **Founder Mode**: 
   - Generates 3-month roadmaps and optimized startup concepts.
   - Provides **Geospatial Intelligence** analyzing local market dynamics.
   - Recommends strategic API stacks.
   - Features "Register for Investment" to move ideas into the public pool.

2. **Investor Mode**:
   - Pulls from a live Firestore pool of registered startups.
   - Generates 5-year numerical projections (Valuation vs. Revenue).
   - Simulates recession survival and ROI.
   - Visualizes growth trajectories using Recharts.

3. **Talent Mode**:
   - Performs semantic matching between user skills and the **real Firestore startup pool**.
   - Identifies skill gaps and recommends specific roles.
   - Includes an "Apply Now" workflow for immediate candidate-startup connection.

4. **Evolution Mode**:
   - Genetic startup mutation engine.
   - Creates 3 variants of an idea with fitness scores based on innovation, pricing, and scalability.

## Data Schema (Firestore)
- `/users/{userId}`: User profiles with `userType` (founder, investor, intern).
- `/startups_for_investment/{startupId}`: Public pool of analyzed startups with revenue and industry data.
- `/users/{userId}/analysisReports/{reportId}`: Private AI-generated strategic reports.

## Environment Config (Active)
- `NEWS_API_KEY`: a5c3789a-6899-4e34-9e66-614bf923aedc
- `ALPHA_VANTAGE_API_KEY`: LBFN1L9QJ85O2W4Z
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: [Configured for Maps JS API]
