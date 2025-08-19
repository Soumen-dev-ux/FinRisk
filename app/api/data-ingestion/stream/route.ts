import { type NextRequest, NextResponse } from "next/server"

// Mock real-time data generator
function generateMarketData() {
  const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA"]
  const basePrice = Math.random() * 200 + 50

  return {
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    price: +(basePrice + (Math.random() - 0.5) * 10).toFixed(2),
    volume: Math.floor(Math.random() * 1000000),
    change: +((Math.random() - 0.5) * 10).toFixed(2),
    changePercent: +((Math.random() - 0.5) * 5).toFixed(2),
    timestamp: new Date().toISOString(),
    riskScore: +(Math.random() * 100).toFixed(1),
    volatility: +(Math.random() * 50).toFixed(2),
  }
}

function generateNewsData() {
  const headlines = [
    "Federal Reserve announces interest rate decision",
    "Major tech earnings exceed expectations",
    "Global supply chain disruptions continue",
    "Cryptocurrency market shows volatility",
    "Energy sector faces regulatory changes",
  ]

  return {
    id: `news-${Date.now()}-${Math.random()}`,
    headline: headlines[Math.floor(Math.random() * headlines.length)],
    sentiment: +(Math.random() * 2 - 1).toFixed(2), // -1 to 1
    impact: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
    timestamp: new Date().toISOString(),
    source: "Financial News API",
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dataType = searchParams.get("type") || "market"

  try {
    let data
    switch (dataType) {
      case "market":
        data = Array.from({ length: 5 }, generateMarketData)
        break
      case "news":
        data = Array.from({ length: 3 }, generateNewsData)
        break
      default:
        data = {
          market: Array.from({ length: 3 }, generateMarketData),
          news: Array.from({ length: 2 }, generateNewsData),
        }
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      type: dataType,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to stream data" }, { status: 500 })
  }
}
