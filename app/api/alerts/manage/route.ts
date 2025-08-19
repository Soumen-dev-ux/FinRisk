import { type NextRequest, NextResponse } from "next/server"

// Mock alert configuration storage
let alertConfigurations = [
  {
    id: "config-1",
    name: "High Risk Score Alert",
    type: "risk_threshold",
    enabled: true,
    conditions: {
      metric: "risk_score",
      operator: "greater_than",
      threshold: 80,
      entity: "all",
    },
    notifications: {
      email: true,
      sms: false,
      dashboard: true,
    },
    frequency: "immediate",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "config-2",
    name: "Market Volatility Warning",
    type: "volatility_threshold",
    enabled: true,
    conditions: {
      metric: "volatility",
      operator: "greater_than",
      threshold: 25,
      entity: "sector",
    },
    notifications: {
      email: true,
      sms: true,
      dashboard: true,
    },
    frequency: "hourly",
    createdBy: "risk_manager",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "config-3",
    name: "Model Performance Check",
    type: "system_health",
    enabled: false,
    conditions: {
      metric: "model_accuracy",
      operator: "less_than",
      threshold: 0.9,
      entity: "system",
    },
    notifications: {
      email: true,
      sms: false,
      dashboard: true,
    },
    frequency: "daily",
    createdBy: "ml_ops",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: alertConfigurations,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch alert configurations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newConfig = {
      id: `config-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }

    alertConfigurations.push(newConfig)

    return NextResponse.json({
      success: true,
      data: newConfig,
      message: "Alert configuration created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create alert configuration" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const configIndex = alertConfigurations.findIndex((config) => config.id === id)
    if (configIndex === -1) {
      return NextResponse.json({ success: false, error: "Alert configuration not found" }, { status: 404 })
    }

    alertConfigurations[configIndex] = {
      ...alertConfigurations[configIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: alertConfigurations[configIndex],
      message: "Alert configuration updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update alert configuration" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Alert configuration ID required" }, { status: 400 })
    }

    alertConfigurations = alertConfigurations.filter((config) => config.id !== id)

    return NextResponse.json({
      success: true,
      message: "Alert configuration deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete alert configuration" }, { status: 500 })
  }
}
