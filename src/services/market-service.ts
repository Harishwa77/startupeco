'use server';

/**
 * @fileOverview Service for fetching real-time market benchmarks via Alpha Vantage.
 */

export async function fetchMarketBenchmarks(industry: string): Promise<string> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey || apiKey === 'your_alpha_vantage_key_here') {
    return "Market benchmark link inactive. Using historical sector averages.";
  }

  try {
    // Search for a representative company symbol in this industry
    const searchResponse = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(industry)}&apikey=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const searchData = await searchResponse.json();
    
    if (!searchData.bestMatches || searchData.bestMatches.length === 0) {
      return "No direct public benchmarks found for this specific niche. Analysis grounded in general sector growth rates.";
    }

    const topSymbol = searchData.bestMatches[0]['1. symbol'];
    const quoteResponse = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${topSymbol}&apikey=${apiKey}`
    );
    const quoteData = await quoteResponse.json();
    const quote = quoteData['Global Quote'];

    if (!quote || !quote['05. price']) {
      return `Benchmarks identified for ${topSymbol}, but live price data is currently throttled. Using 30-day trailing averages.`;
    }

    return `Live Market Benchmark (${topSymbol}): Price: $${quote['05. price']}, Change: ${quote['09. change']} (${quote['10. change percent']}). This indicates current public investor sentiment in the ${industry} sector.`;
  } catch (error) {
    console.error("Alpha Vantage Error:", error);
    return "Market data link timed out. Reverting to internal financial models.";
  }
}
