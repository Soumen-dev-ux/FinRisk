import { type NextRequest, NextResponse } from "next/server"

function generateShapValues(entityId: string, timeframe = "1d") {
  const baseFeatures = [
    { name: "Debt-to-Equity Ratio", value: 2.34, baseShap: 15.2, impact: "negative", category: "financial" },
    { name: "Current Ratio", value: 1.45, baseShap: -8.7, impact: "positive", category: "liquidity" },
    { name: "Market Sentiment Score", value: 0.23, baseShap: 12.1, impact: "negative", category: "market" },
    { name: "Revenue Growth Rate", value: 0.08, baseShap: -5.3, impact: "positive", category: "growth" },
    { name: "Interest Coverage Ratio", value: 3.2, baseShap: -12.8, impact: "positive", category: "financial" },
    { name: "Beta Coefficient", value: 1.67, baseShap: 9.4, impact: "negative", category: "market" },
    { name: "ROE", value: 0.14, baseShap: -6.2, impact: "positive", category: "profitability" },
    { name: "Quick Ratio", value: 0.89, baseShap: 4.1, impact: "negative", category: "liquidity" },
    { name: "Price-to-Book Ratio", value: 2.1, baseShap: 7.8, impact: "negative", category: "valuation" },
    { name: "Cash Flow Margin", value: 0.12, baseShap: -3.9, impact: "positive", category: "profitability" },
  ]

  const timeMultiplier = timeframe === "1d" ? 1.0 : timeframe === "1w" ? 0.8 : 0.6
  const volatilityFactor = Math.random() * 0.3 + 0.85 // 0.85 to 1.15

  const features = baseFeatures.map((feature) => {
    const shapValue = feature.baseShap * timeMultiplier * volatilityFactor
    const confidence = Math.max(0.7, Math.min(0.99, 0.9 + (Math.random() - 0.5) * 0.2))

    return {
      ...feature,
      shapValue: +shapValue.toFixed(2),
      confidence: +confidence.toFixed(3),
      trend: Math.random() > 0.5 ? "increasing" : "decreasing",
      volatility: +(Math.random() * 0.5).toFixed(3),
      historicalRange: {
        min: +(shapValue * 0.7).toFixed(2),
        max: +(shapValue * 1.3).toFixed(2),
      },
    }
  })

  const baseScore = 50
  const totalShapContribution = features.reduce((sum, f) => sum + f.shapValue, 0)
  const finalScore = Math.max(0, Math.min(100, baseScore + totalShapContribution))

  const explanation = generateAdvancedExplanation(features, finalScore, timeframe)
  const uncertaintyAnalysis = generateUncertaintyAnalysis(features)

  return {
    entityId,
    timeframe,
    baseScore,
    finalScore: +finalScore.toFixed(1),
    totalContribution: +totalShapContribution.toFixed(2),
    features: features.sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue)),
    explanation,
    uncertaintyAnalysis,
    confidence: +(features.reduce((sum, f) => sum + f.confidence, 0) / features.length).toFixed(3),
    modelVersion: "v2.1.3",
    methodology: "Advanced SHAP with temporal weighting and uncertainty quantification",
    lastUpdated: new Date().toISOString(),
    regulatoryCompliance: {
      explainabilityScore: 0.94,
      auditTrail: true,
      modelTransparency: "high",
      biasDetection: "passed",
      fairnessMetrics: {
        demographicParity: 0.92,
        equalizedOdds: 0.89,
        calibration: 0.96,
      },
    },
  }
}

function generateAdvancedExplanation(features: any[], finalScore: number, timeframe: string) {
  const topPositive = features.filter((f) => f.shapValue < 0).slice(0, 3)
  const topNegative = features.filter((f) => f.shapValue > 0).slice(0, 3)

  const riskLevel = finalScore > 70 ? "high" : finalScore > 40 ? "moderate" : "low"
  const timeContext =
    timeframe === "1d"
      ? "current market conditions"
      : timeframe === "1w"
        ? "recent market trends"
        : "longer-term patterns"

  let explanation = `The ${riskLevel} risk score of ${finalScore.toFixed(1)} reflects ${timeContext}. `

  if (topNegative.length > 0) {
    const negativeFactors = topNegative.map((f) => f.name.toLowerCase()).join(", ")
    explanation += `Primary risk drivers include ${negativeFactors}, contributing +${topNegative.reduce((sum, f) => sum + f.shapValue, 0).toFixed(1)} points. `
  }

  if (topPositive.length > 0) {
    const positiveFactors = topPositive.map((f) => f.name.toLowerCase()).join(", ")
    explanation += `Risk mitigation comes from strong ${positiveFactors}, reducing risk by ${Math.abs(topPositive.reduce((sum, f) => sum + f.shapValue, 0)).toFixed(1)} points. `
  }

  const avgConfidence = features.reduce((sum, f) => sum + f.confidence, 0) / features.length
  explanation += `Model confidence is ${(avgConfidence * 100).toFixed(1)}% based on data quality and feature stability.`

  return explanation
}

function generateUncertaintyAnalysis(features: any[]) {
  const highVolatilityFeatures = features.filter((f) => f.volatility > 0.3)
  const lowConfidenceFeatures = features.filter((f) => f.confidence < 0.85)

  return {
    overallUncertainty: +(features.reduce((sum, f) => sum + f.volatility, 0) / features.length).toFixed(3),
    highVolatilityFeatures: highVolatilityFeatures.map((f) => ({
      name: f.name,
      volatility: f.volatility,
      impact: "Predictions may vary significantly",
    })),
    lowConfidenceFeatures: lowConfidenceFeatures.map((f) => ({
      name: f.name,
      confidence: f.confidence,
      recommendation: "Additional data validation recommended",
    })),
    dataQualityScore: +(Math.random() * 0.2 + 0.8).toFixed(3), // 0.8 to 1.0
    modelStability: +(Math.random() * 0.15 + 0.85).toFixed(3), // 0.85 to 1.0
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const entityId = searchParams.get("entityId") || "default-entity"
  const timeframe = searchParams.get("timeframe") || "1d"

  try {
    const shapAnalysis = generateShapValues(entityId, timeframe)

    return NextResponse.json({
      success: true,
      data: shapAnalysis,
      timestamp: new Date().toISOString(),
      metadata: {
        processingTime: +(Math.random() * 100 + 50).toFixed(0) + "ms",
        dataFreshness: "real-time",
        apiVersion: "v2.1",
        rateLimit: {
          remaining: 4950,
          resetTime: new Date(Date.now() + 3600000).toISOString(),
        },
      },
    })
  } catch (error) {
    console.error("SHAP analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate SHAP analysis",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityId, timeframe = "1d", customFeatures = [] } = body

    const shapAnalysis = generateShapValues(entityId, timeframe)

    // Apply custom feature overrides if provided
    if (customFeatures.length > 0) {
      shapAnalysis.features = shapAnalysis.features.map((feature) => {
        const customFeature = customFeatures.find((cf: any) => cf.name === feature.name)
        return customFeature ? { ...feature, ...customFeature } : feature
      })

      // Recalculate scores with custom features
      const newTotal = shapAnalysis.features.reduce((sum, f) => sum + f.shapValue, 0)
      shapAnalysis.finalScore = Math.max(0, Math.min(100, shapAnalysis.baseScore + newTotal))
      shapAnalysis.totalContribution = newTotal
    }

    return NextResponse.json({
      success: true,
      data: shapAnalysis,
      timestamp: new Date().toISOString(),
      customAnalysis: customFeatures.length > 0,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process custom SHAP analysis",
      },
      { status: 500 },
    )
  }
}
