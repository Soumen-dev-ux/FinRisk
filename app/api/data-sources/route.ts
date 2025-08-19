import { type NextRequest, NextResponse } from "next/server"

// Mock data sources configuration
const dataSources = [
  {
    id: "market-data",
    name: "Market Data Feed",
    type: "real-time",
    status: "active",
    lastUpdate: new Date().toISOString(),
    metrics: { recordsPerSecond: 1250, latency: 45 },
  },
  {
    id: "news-sentiment",
    name: "News Sentiment Analysis",
    type: "batch",
    status: "active",
    lastUpdate: new Date(Date.now() - 300000).toISOString(),
    metrics: { recordsPerSecond: 85, latency: 120 },
  },
  {
    id: "economic-indicators",
    name: "Economic Indicators",
    type: "scheduled",
    status: "active",
    lastUpdate: new Date(Date.now() - 900000).toISOString(),
    metrics: { recordsPerSecond: 12, latency: 200 },
  },
  {
    id: "credit-ratings",
    name: "Credit Rating Updates",
    type: "event-driven",
    status: "warning",
    lastUpdate: new Date(Date.now() - 1800000).toISOString(),
    metrics: { recordsPerSecond: 3, latency: 500 },
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: dataSources,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch data sources" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newSource = {
      id: `source-${Date.now()}`,
      ...body,
      status: "pending",
      lastUpdate: new Date().toISOString(),
      metrics: { recordsPerSecond: 0, latency: 0 },
    }

    return NextResponse.json({
      success: true,
      data: newSource,
      message: "Data source created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create data source" }, { status: 500 })
  }
}
