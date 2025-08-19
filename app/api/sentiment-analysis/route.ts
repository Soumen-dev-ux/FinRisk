import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sentimentSources = [
      { source: "news", weight: 0.4 },
      { source: "social", weight: 0.3 },
      { source: "analyst", weight: 0.3 },
    ]

    // Simulate real-time sentiment data
    const generateSentiment = () => ({
      score: 0.3 + Math.random() * 0.4, // 0.3 to 0.7 range
      confidence: 0.7 + Math.random() * 0.3,
      volume: Math.floor(500 + Math.random() * 1000),
      timestamp: new Date().toISOString(),
    })

    const sentimentData = {
      overall: {
        score: 0.65,
        trend: "positive",
        change24h: 0.05,
        confidence: 0.82,
      },
      sources: {
        news: generateSentiment(),
        social: generateSentiment(),
        analyst: generateSentiment(),
        earnings: generateSentiment(),
      },
      trendingTopics: [
        {
          topic: "Federal Reserve Policy",
          sentiment: 0.45,
          volume: 1250,
          trend: "negative",
          keywords: ["interest rates", "inflation", "monetary policy"],
          impact: "high",
        },
        {
          topic: "Tech Earnings Season",
          sentiment: 0.78,
          volume: 980,
          trend: "positive",
          keywords: ["AI", "cloud computing", "revenue growth"],
          impact: "medium",
        },
        {
          topic: "Energy Transition",
          sentiment: 0.69,
          volume: 750,
          trend: "positive",
          keywords: ["renewable energy", "ESG", "sustainability"],
          impact: "medium",
        },
        {
          topic: "Banking Sector Stress",
          sentiment: 0.32,
          volume: 650,
          trend: "negative",
          keywords: ["credit risk", "loan defaults", "regulation"],
          impact: "high",
        },
      ],
      historicalData: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        sentiment: 0.5 + Math.sin(i * 0.3) * 0.15 + (Math.random() - 0.5) * 0.1,
        volume: 500 + Math.random() * 300,
        newsCount: Math.floor(10 + Math.random() * 20),
        socialMentions: Math.floor(100 + Math.random() * 200),
      })),
      sectorSentiment: [
        { sector: "Technology", sentiment: 0.72, change: 0.03 },
        { sector: "Healthcare", sentiment: 0.68, change: -0.01 },
        { sector: "Financial", sentiment: 0.45, change: -0.08 },
        { sector: "Energy", sentiment: 0.61, change: 0.05 },
        { sector: "Consumer", sentiment: 0.58, change: 0.02 },
      ],
      riskIndicators: {
        fearGreedIndex: 42, // 0-100 scale
        volatilityIndex: 28.5,
        marketStress: "moderate",
        sentimentDivergence: 0.15, // Difference between sources
      },
    }

    return NextResponse.json(sentimentData)
  } catch (error) {
    console.error("Sentiment analysis error:", error)
    return NextResponse.json({ error: "Failed to fetch sentiment data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { text, source } = await request.json()

    const words = text.toLowerCase().split(/\s+/)

    const positiveWords = [
      "good",
      "great",
      "excellent",
      "positive",
      "growth",
      "profit",
      "gain",
      "up",
      "bullish",
      "strong",
    ]
    const negativeWords = [
      "bad",
      "terrible",
      "negative",
      "loss",
      "decline",
      "down",
      "bearish",
      "weak",
      "crisis",
      "risk",
    ]

    let positiveScore = 0
    let negativeScore = 0

    words.forEach((word) => {
      if (positiveWords.includes(word)) positiveScore++
      if (negativeWords.includes(word)) negativeScore++
    })

    const totalWords = words.length
    const sentiment = (positiveScore - negativeScore) / totalWords
    const normalizedSentiment = Math.max(0, Math.min(1, 0.5 + sentiment))

    return NextResponse.json({
      sentiment: normalizedSentiment,
      confidence: Math.min(0.9, ((positiveScore + negativeScore) / totalWords) * 2),
      breakdown: {
        positive: positiveScore,
        negative: negativeScore,
        neutral: totalWords - positiveScore - negativeScore,
      },
      source: source || "custom",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Custom sentiment analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}
