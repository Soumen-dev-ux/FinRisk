import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { riskTolerance, timeHorizon, constraints } = await request.json()

    const assets = [
      { name: "US Large Cap", expectedReturn: 0.1, volatility: 0.15, correlation: 1.0 },
      { name: "International Developed", expectedReturn: 0.08, volatility: 0.18, correlation: 0.7 },
      { name: "Emerging Markets", expectedReturn: 0.12, volatility: 0.25, correlation: 0.6 },
      { name: "Government Bonds", expectedReturn: 0.04, volatility: 0.05, correlation: -0.2 },
      { name: "Corporate Bonds", expectedReturn: 0.06, volatility: 0.08, correlation: 0.3 },
      { name: "REITs", expectedReturn: 0.09, volatility: 0.2, correlation: 0.5 },
      { name: "Commodities", expectedReturn: 0.07, volatility: 0.22, correlation: 0.1 },
    ]

    // Monte Carlo optimization simulation
    const numSimulations = 10000
    let bestPortfolio = null
    let bestSharpe = Number.NEGATIVE_INFINITY

    for (let i = 0; i < numSimulations; i++) {
      // Generate random weights
      const weights = Array.from({ length: assets.length }, () => Math.random())
      const sum = weights.reduce((a, b) => a + b, 0)
      const normalizedWeights = weights.map((w) => w / sum)

      // Calculate portfolio metrics
      const expectedReturn = assets.reduce((sum, asset, idx) => sum + asset.expectedReturn * normalizedWeights[idx], 0)

      const portfolioVariance = assets.reduce(
        (sum, asset, idx) => sum + Math.pow(asset.volatility * normalizedWeights[idx], 2),
        0,
      )

      const portfolioVolatility = Math.sqrt(portfolioVariance)
      const sharpeRatio = (expectedReturn - 0.02) / portfolioVolatility // Risk-free rate = 2%

      // Apply risk tolerance constraint
      const riskScore = portfolioVolatility * 10 // Scale to 1-10
      if (Math.abs(riskScore - riskTolerance) < 1.5 && sharpeRatio > bestSharpe) {
        bestSharpe = sharpeRatio
        bestPortfolio = {
          weights: normalizedWeights,
          expectedReturn: expectedReturn * 100,
          volatility: portfolioVolatility * 100,
          sharpeRatio: sharpeRatio,
          allocation: assets.map((asset, idx) => ({
            asset: asset.name,
            weight: Math.round(normalizedWeights[idx] * 100),
            expectedReturn: asset.expectedReturn * 100,
            volatility: asset.volatility * 100,
          })),
        }
      }
    }

    // Generate efficient frontier points
    const efficientFrontier = []
    for (let targetReturn = 0.04; targetReturn <= 0.15; targetReturn += 0.01) {
      // Simplified efficient frontier calculation
      const riskLevel = Math.sqrt(targetReturn * 0.8) * 100
      efficientFrontier.push({
        expectedReturn: targetReturn * 100,
        volatility: riskLevel,
        sharpeRatio: (targetReturn - 0.02) / (riskLevel / 100),
      })
    }

    return NextResponse.json({
      optimizedPortfolio: bestPortfolio,
      efficientFrontier,
      riskMetrics: {
        var95: bestPortfolio.volatility * 1.65, // 95% VaR approximation
        expectedShortfall: bestPortfolio.volatility * 2.1,
        maxDrawdown: bestPortfolio.volatility * 1.8,
        beta: 0.85 + (riskTolerance / 10) * 0.3,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Portfolio optimization error:", error)
    return NextResponse.json({ error: "Failed to optimize portfolio" }, { status: 500 })
  }
}
