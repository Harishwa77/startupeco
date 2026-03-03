# EchelonAI | Startup Ecosystem Engine

Advanced AI Startup Accelerator, VC, and Market Analyst. Built with Next.js 15, Genkit, and Firebase.

## 🚀 Getting Started

1. **Connect**: Click "Secure Connect" in the header to establish your session.
2. **Analyze**: 
   - **Founder Mode**: Enter your idea to get a 3-month roadmap, API recommendations, and **Geospatial Intelligence**.
   - **Investor Mode**: Select a startup from the public pool and run a deep-dive investment memo.
   - **Talent Mode**: Match your skills semantically with top startups.
3. **Register**: Founders can "Publish" analyzed startups to the public pool.

## ☁️ Deployment Guide: Push to GitHub & Live

Follow these steps to move your code from this development environment to a live production URL:

### 1. Initialize Git in this Workspace
Open your terminal in this workspace and run:
```bash
git init
git add .
git commit -m "feat: echelon-ai v1.0 launch"
```

### 2. Create a GitHub Repository
1. Go to [GitHub](https://github.com/new).
2. Name your repository (e.g., `echelon-ai`).
3. Leave it public or private, then click **Create repository**.
4. Copy the repository URL (e.g., `https://github.com/your-username/echelon-ai.git`).

### 3. Connect and Push
Run these commands in your terminal, replacing the URL with yours:
```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

### 4. Deploy to Firebase App Hosting
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Navigate to **App Hosting** in the left sidebar.
4. Click **Get Started** or **Create Backend**.
5. Select your GitHub account and the `echelon-ai` repository.
6. **Environment Secrets**: This is CRITICAL. In the App Hosting dashboard, add these secrets so the AI functions in production:
   - `NEWS_API_KEY`: Your NewsAPI key.
   - `ALPHA_VANTAGE_API_KEY`: Your Alpha Vantage key.
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps JS API key.
7. Click **Finish and Deploy**. Firebase will build your site and provide a live `.web.app` URL.

## 🔑 Intelligence Layers

### Active
- **Genkit + Gemini 2.5**: Core reasoning and flow engine.
- **NewsAPI**: Real-time industry sentiment analysis.
- **Alpha Vantage**: Financial benchmarks and sector performance.
- **Google Maps JS API**: Geospatial Intelligence for regional strategy.
- **Imagen 4**: Neural concept art visualization.

## 🛠 Tech Stack
- **Framework**: Next.js 15
- **AI**: Genkit with Google Gemini
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **UI**: Tailwind CSS + ShadCN UI + Recharts
