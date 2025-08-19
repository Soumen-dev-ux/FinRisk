import { type NextRequest, NextResponse } from "next/server"

// Mock notification history
const notifications = [
  {
    id: "notif-1",
    type: "risk_alert",
    title: "High Risk Score Detected",
    message: "AAPL risk score reached 85.2, exceeding threshold of 80",
    severity: "high",
    read: false,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    entity: "AAPL",
    actionRequired: true,
  },
  {
    id: "notif-2",
    type: "system_update",
    title: "Model Retrained Successfully",
    message: "Risk scoring model v2.1.4 deployed with improved accuracy",
    severity: "info",
    read: true,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    entity: "SYSTEM",
    actionRequired: false,
  },
  {
    id: "notif-3",
    type: "market_alert",
    title: "Market Volatility Spike",
    message: "Technology sector volatility increased to 32.1%",
    severity: "medium",
    read: false,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    entity: "TECH_SECTOR",
    actionRequired: false,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const unreadOnly = searchParams.get("unreadOnly") === "true"

  try {
    let filteredNotifications = notifications
    if (unreadOnly) {
      filteredNotifications = notifications.filter((n) => !n.read)
    }

    return NextResponse.json({
      success: true,
      data: filteredNotifications.slice(0, limit),
      unreadCount: notifications.filter((n) => !n.read).length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, read } = body

    const notificationIndex = notifications.findIndex((n) => n.id === id)
    if (notificationIndex === -1) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 })
    }

    notifications[notificationIndex].read = read

    return NextResponse.json({
      success: true,
      data: notifications[notificationIndex],
      message: "Notification updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update notification" }, { status: 500 })
  }
}
