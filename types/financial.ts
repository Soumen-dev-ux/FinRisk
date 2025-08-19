export interface RiskScore {
  id: string
  entityId: string
  score: number
  confidence: number
  category: RiskCategory
  timestamp: Date
  factors: RiskFactor[]
  explanation: string
}

export interface RiskFactor {
  name: string
  impact: number
  weight: number
  description: string
  category: string
}

export enum RiskCategory {
  CREDIT = "credit",
  MARKET = "market",
  OPERATIONAL = "operational",
  LIQUIDITY = "liquidity",
  ESG = "esg",
  REGULATORY = "regulatory",
}

export interface Portfolio {
  id: string
  name: string
  assets: Asset[]
  totalValue: number
  riskScore: number
  expectedReturn: number
  volatility: number
  sharpeRatio: number
  createdAt: Date
  updatedAt: Date
}

export interface Asset {
  symbol: string
  name: string
  weight: number
  price: number
  quantity: number
  sector: string
  marketCap: number
  beta: number
  dividendYield: number
}

export interface SentimentData {
  id: string
  source: string
  content: string
  sentiment: number // -1 to 1
  confidence: number
  timestamp: Date
  keywords: string[]
  impact: number
}

export interface ESGScore {
  entityId: string
  environmental: number
  social: number
  governance: number
  overall: number
  timestamp: Date
  factors: ESGFactor[]
}

export interface ESGFactor {
  category: "environmental" | "social" | "governance"
  metric: string
  score: number
  weight: number
  description: string
}

export interface StressTestScenario {
  id: string
  name: string
  description: string
  parameters: ScenarioParameter[]
  results: StressTestResult[]
  severity: "mild" | "moderate" | "severe" | "extreme"
}

export interface ScenarioParameter {
  factor: string
  baseValue: number
  stressValue: number
  impact: number
}

export interface StressTestResult {
  portfolioId: string
  originalValue: number
  stressedValue: number
  loss: number
  lossPercentage: number
  worstAssets: Asset[]
}

export interface AlertRule {
  id: string
  name: string
  condition: string
  threshold: number
  severity: "low" | "medium" | "high" | "critical"
  enabled: boolean
  recipients: string[]
  createdAt: Date
}

export interface DataSource {
  id: string
  name: string
  type: "market" | "news" | "social" | "economic" | "regulatory"
  url: string
  status: "active" | "inactive" | "error"
  lastUpdate: Date
  frequency: string
  reliability: number
}
