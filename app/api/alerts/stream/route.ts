import type { NextRequest } from "next/server"

// Server-Sent Events for real-time alerts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "default-user"

  // Set up SSE headers
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  })

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(
        `data: ${JSON.stringify({ type: "connected", userId, timestamp: new Date().toISOString() })}\n\n`,
      )

      // Mock real-time alert generation
      const alertInterval = setInterval(() => {
        const alerts = generateRealTimeAlerts()
        alerts.forEach((alert) => {
          controller.enqueue(`data: ${JSON.stringify(alert)}\n\n`)
        })
      }, 5000) // Send alerts every 5 seconds

      // Market data updates
      const marketInterval = setInterval(() => {
        const marketUpdate = generateMarketUpdate()
        controller.enqueue(`data: ${JSON.stringify(marketUpdate)}\n\n`)
      }, 2000) // Send market updates every 2 seconds

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(alertInterval)
        clearInterval(marketInterval)
        controller.close()
      })
    },
  })

  return new Response(stream, { headers })
}

function generateRealTimeAlerts() {
  const alertTypes = [
    {
      type: "risk_spike",
      severity: "high",
      title: "Risk Score Spike Detected",
      message: "TSLA risk score increased by 15 points in the last hour",
      entity: "TSLA",
      threshold: 15,
      currentValue: 82.3,
      previousValue: 67.3,
    },
    {
      type: "market_volatility",
      severity: "medium",
      title: "Market Volatility Alert",
      message: "Technology sector showing increased volatility",
      entity: "TECH_SECTOR",
      threshold: 25,
      currentValue: 28.7,
      previousValue: 22.1,
    },
    {
      type: "compliance_warning",
      severity: "low",
      title: "Compliance Check Required",
      message: "Monthly model validation due in 3 days",
      entity: "SYSTEM",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Randomly select 0-2 alerts to send
  const numAlerts = Math.floor(Math.random() * 3)
  const selectedAlerts = []

  for (let i = 0; i < numAlerts; i++) {
    const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    selectedAlerts.push({
      ...alert,
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      type: "alert",
    })
  }

  return selectedAlerts
}

function generateMarketUpdate() {
  const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"]
  const symbol = symbols[Math.floor(Math.random() * symbols.length)]

  return {
    type: "market_update",
    symbol,
    price: +(Math.random() * 200 + 50).toFixed(2),
    change: +((Math.random() - 0.5) * 10).toFixed(2),
    changePercent: +((Math.random() - 0.5) * 5).toFixed(2),
    volume: Math.floor(Math.random() * 1000000),
    riskScore: +(Math.random() * 100).toFixed(1),
    timestamp: new Date().toISOString(),
  }
}
