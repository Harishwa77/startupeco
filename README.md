# EchelonAI | Startup Ecosystem Engine

Advanced AI Startup Accelerator, VC, and Market Analyst.

## 🚀 Getting Started

1. **Connect**: Click "Secure Connect" in the header to establish your session.
2. **Analyze**: 
   - **Founder Mode**: Enter your idea to get a 3-month roadmap, API recommendations, and **Geospatial Intelligence**.
   - **Investor Mode**: Select a startup from the public pool and run a deep-dive investment memo.
   - **Talent Mode**: Match your skills semantically with top startups.
3. **Register**: Founders can "Publish" analyzed startups to the public pool.

## ☁️ Cloud Deployment: Push to GitHub

Since I am your AI partner, I can prepare the code, but you'll need to run these commands in your terminal to push to GitHub:

1. **Initialize Git**:
   ```bash
   git init
   git add .
   git commit -m "initial: echelon-ai engine"
   ```

2. **Connect to GitHub**:
   - Create a new repository on [GitHub](https://github.com/new).
   - Copy the repository URL and run:
   ```bash
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git branch -M main
   git push -u origin main
   ```

3. **Deploy to Firebase App Hosting**:
   - Go to the **App Hosting** section in the [Firebase Console](https://console.firebase.google.com/).
   - Click "Create Backend" and select your GitHub repository.
   - **Environment Secrets**: Add these in the App Hosting dashboard:
     - `NEWS_API_KEY`
     - `ALPHA_VANTAGE_API_KEY`
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Firebase will automatically detect the `apphosting.yaml` and deploy your Next.js 15 site.

## 🔑 Intelligence Layers

### Active
- **Genkit + Gemini 2.5**: Core reasoning and flow engine.
- **NewsAPI**: Real-time industry sentiment analysis.
- **Alpha Vantage**: Financial benchmarks and sector performance.
- **Google Maps JS API**: Geospatial Intelligence for regional strategy.
- **Imagen 4**: Neural concept art visualization.

### Recommended (To Add)
- **Clearbit API** (`CLEARBIT_API_KEY`): Identity enrichment (Logos, Bio).
- **Unsplash API** (`UNSPLASH_ACCESS_KEY`): High-quality startup imagery.
- **Serper.dev API** (`SERPER_API_KEY`): Live competitor web-search.

## 🛠 Tech Stack

- **Framework**: Next.js 15
- **AI**: Genkit with Google Gemini
- **Intelligence**: NewsAPI + Alpha Vantage
- **Database**: Firebase Firestore
- **UI**: Tailwind CSS + ShadCN UI + Recharts
