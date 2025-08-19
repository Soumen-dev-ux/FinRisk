export const RISK_THRESHOLDS = {
  LOW: 0.3,
  MEDIUM: 0.6,
  HIGH: 0.8,
  CRITICAL: 0.95,
} as const

export const ESG_WEIGHTS = {
  ENVIRONMENTAL: 0.4,
  SOCIAL: 0.3,
  GOVERNANCE: 0.3,
} as const

export const PORTFOLIO_CONSTRAINTS = {
  MIN_ASSETS: 3,
  MAX_ASSETS: 50,
  MIN_WEIGHT: 0.01,
  MAX_WEIGHT: 0.4,
  REBALANCE_THRESHOLD: 0.05,
} as const

export const SENTIMENT_SOURCES = [
  "Reuters",
  "Bloomberg",
  "Financial Times",
  "Wall Street Journal",
  "Twitter",
  "Reddit",
  "SEC Filings",
  "Earnings Calls",
] as const

export const STRESS_TEST_SCENARIOS = {
  MARKET_CRASH: {
    name: "Market Crash",
    description: "2008-style financial crisis simulation",
    marketDrop: -0.4,
    volatilityIncrease: 2.5,
    correlationIncrease: 0.8,
  },
  INTEREST_RATE_SHOCK: {
    name: "Interest Rate Shock",
    description: "Sudden 300bp rate increase",
    rateIncrease: 0.03,
    bondImpact: -0.15,
    growthStockImpact: -0.25,
  },
  GEOPOLITICAL_CRISIS: {
    name: "Geopolitical Crisis",
    description: "Major geopolitical event impact",
    commoditySpike: 0.3,
    safeHavenFlow: 0.2,
    emergingMarketImpact: -0.35,
  },
} as const

export const API_ENDPOINTS = {
  RISK_SCORE: "/api/risk-score",
  PORTFOLIO_OPTIMIZATION: "/api/portfolio-optimization",
  SENTIMENT_ANALYSIS: "/api/sentiment-analysis",
  ESG_SCORING: "/api/esg-scoring",
  STRESS_TESTING: "/api/stress-testing",
  ALERTS: "/api/alerts",
  DATA_INGESTION: "/api/data-ingestion",
} as const

export const CHART_COLORS = {
  PRIMARY: "#0ea5e9",
  SECONDARY: "#f97316",
  SUCCESS: "#22c55e",
  WARNING: "#eab308",
  DANGER: "#ef4444",
  INFO: "#6366f1",
  NEUTRAL: "#64748b",
} as const

export const REFRESH_INTERVALS = {
  REAL_TIME: 1000,
  FAST: 5000,
  NORMAL: 30000,
  SLOW: 300000,
} as const
