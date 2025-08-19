import { type NextRequest, NextResponse } from "next/server"

// Mock audit trail data for regulatory compliance
function generateAuditTrail(entityId: string) {
  const events = [
    {
      id: "audit-001",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      event: "Score Calculation",
      details: "Risk score calculated using ML model v2.1.3",
      modelVersion: "v2.1.3",
      dataVersion: "20241219-001",
      user: "system",
      confidence: 0.94,
      inputs: {
        debtToEquity: 2.34,
        currentRatio: 1.45,
        marketSentiment: 0.23,
      },
      output: 78.2,
    },
    {
      id: "audit-002",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      event: "Data Update",
      details: "Financial statements updated from SEC filing",
      source: "SEC EDGAR",
      filingType: "10-K",
      user: "data-pipeline",
      changedFields: ["revenue", "totalDebt", "totalEquity"],
    },
    {
      id: "audit-003",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      event: "Model Validation",
      details: "Model performance validated against holdout dataset",
      accuracy: 0.923,
      precision: 0.891,
      recall: 0.876,
      user: "ml-ops",
    },
    {
      id: "audit-004",
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      event: "Alert Triggered",
      details: "Risk score increased by >10 points, alert sent to subscribers",
      previousScore: 67.1,
      newScore: 78.2,
      threshold: 10,
      user: "alert-system",
    },
  ]

  return {
    entityId,
    auditTrail: events,
    complianceStatus: "compliant",
    lastAudit: new Date().toISOString(),
    retentionPeriod: "7 years",
    regulatoryFramework: ["Basel III", "Solvency II", "GDPR"],
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const entityId = searchParams.get("entityId") || "default-entity"
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  try {
    const auditData = generateAuditTrail(entityId)

    return NextResponse.json({
      success: true,
      data: {
        ...auditData,
        auditTrail: auditData.auditTrail.slice(0, limit),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch audit trail" }, { status: 500 })
  }
}
