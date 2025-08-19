"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Text, Sphere } from "@react-three/drei"
import * as THREE from "three"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, AlertTriangle, Shield, Database, Brain, Eye, Wifi, WifiOff } from "lucide-react"

interface RealTimeData {
  riskScores: Array<{ name: string; score: number; traditional: number; timestamp: string }>
  riskFactors: Array<{ name: string; value: number; impact: string; change: number }>
  pieData: Array<{ name: string; value: number; color: string }>
  companies: Array<{ name: string; riskLevel: number; position: [number, number, number]; change: number }>
  alerts: Array<{ id: string; type: string; message: string; severity: string; timestamp: string }>
}

function RiskSphere({
  position,
  riskLevel,
  company,
  change,
}: { position: [number, number, number]; riskLevel: number; company: string; change: number }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const color = riskLevel > 70 ? "#ef4444" : riskLevel > 40 ? "#f59e0b" : "#10b981"
  const pulseIntensity = Math.abs(change) / 10 // Pulse based on risk change

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * pulseIntensity * 0.1
      meshRef.current.scale.setScalar(hovered ? 1.2 * pulse : pulse)
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[0.5, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={color} transparent opacity={0.8} emissive={color} emissiveIntensity={0.2} />
      </Sphere>
      {hovered && (
        <Html position={[0, 1, 0]} center>
          <div className="bg-card border rounded-lg p-3 shadow-lg min-w-48">
            <p className="font-semibold text-sm">{company}</p>
            <p className="text-xs text-muted-foreground">Risk Score: {riskLevel}</p>
            <p className={`text-xs ${change >= 0 ? "text-red-500" : "text-green-500"}`}>
              Change: {change >= 0 ? "+" : ""}
              {change.toFixed(1)}
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}

function DataVisualization({ companies }: { companies: Array<{ name: string; riskLevel: number; position: [number, number, number]; change: number }> }) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="studio" />

      {companies.map((company) => (
        <RiskSphere
          key={company.name}
          position={company.position}
          riskLevel={company.riskLevel}
          company={company.name}
          change={company.change}
        />
      ))}

      <Text
        position={[0, 3.5, 0]}
        fontSize={0.5}
        color="#164e63"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        Real-Time Risk Universe
      </Text>

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  )
}

export default function FinancialRiskPlatform() {
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    riskScores: [],
    riskFactors: [],
    pieData: [],
    companies: [],
    alerts: [],
  })
  const [currentScore, setCurrentScore] = useState(78)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    initializeData()
    connectToRealTimeStream()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  const initializeData = async () => {
    try {
      // Fetch initial data
      const [riskResponse] = await Promise.all([
        fetch("/api/risk-score?entity=PORTFOLIO"),
      ])

      const riskData = await riskResponse.json()
      // Removed unused marketData assignment

      if (riskData.success) {
        setCurrentScore(riskData.data.riskScore)
      }

      // Initialize with sample data that will be updated by real-time stream
      setRealTimeData({
        riskScores: [
          { name: "Jan", score: 72, traditional: 68, timestamp: new Date().toISOString() },
          { name: "Feb", score: 75, traditional: 70, timestamp: new Date().toISOString() },
          { name: "Mar", score: 68, traditional: 65, timestamp: new Date().toISOString() },
          { name: "Apr", score: 82, traditional: 78, timestamp: new Date().toISOString() },
          { name: "May", score: 79, traditional: 75, timestamp: new Date().toISOString() },
          { name: "Jun", score: 85, traditional: 80, timestamp: new Date().toISOString() },
        ],
        riskFactors: [
          { name: "Debt Ratio", value: 35, impact: "high", change: 2.1 },
          { name: "Market Volatility", value: 28, impact: "medium", change: -1.5 },
          { name: "Liquidity", value: 22, impact: "medium", change: 0.8 },
          { name: "Regulatory", value: 15, impact: "low", change: -0.3 },
        ],
        pieData: [
          { name: "Low Risk", value: 45, color: "#10b981" },
          { name: "Medium Risk", value: 35, color: "#f59e0b" },
          { name: "High Risk", value: 20, color: "#ef4444" },
        ],
        companies: [
          { name: "TechCorp Inc.", riskLevel: 85, position: [-2, 1, 0], change: 3.2 },
          { name: "SafeBank Ltd.", riskLevel: 45, position: [2, -1, 0], change: -1.1 },
          { name: "GrowthCo", riskLevel: 72, position: [0, 2, -1], change: 0.5 },
          { name: "StableFund", riskLevel: 38, position: [-1, -2, 1], change: -0.8 },
          { name: "VolatileTech", riskLevel: 91, position: [3, 0, -2], change: 5.7 },
        ],
        alerts: [],
      })

      setIsLoading(false)
    } catch (error) {
      console.error("Failed to initialize data:", error)
      setIsLoading(false)
    }
  }

  const connectToRealTimeStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource("/api/alerts/stream?userId=demo-user")
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastUpdate(new Date())

        if (data.type === "market_update") {
          setRealTimeData((prev) => ({
            ...prev,
            companies: prev.companies.map((company) => {
              if (company.name.includes(data.symbol)) {
                const newRiskLevel = Math.max(0, Math.min(100, data.riskScore))
                return {
                  ...company,
                  riskLevel: newRiskLevel,
                  change: newRiskLevel - company.riskLevel,
                }
              }
              return company
            }),
          }))

          // Update current portfolio score
          setCurrentScore((prev) => {
            const change = (Math.random() - 0.5) * 2
            return Math.max(0, Math.min(100, prev + change))
          })
        }

        if (data.type === "alert") {
          setRealTimeData((prev) => ({
            ...prev,
            alerts: [data, ...prev.alerts].slice(0, 10),
          }))
        }
      } catch (error) {
        console.error("Error parsing real-time data:", error)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      setTimeout(connectToRealTimeStream, 5000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-foreground">Initializing Risk Analytics Platform</h2>
          <p className="text-muted-foreground">Loading real-time financial data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-foreground font-[family-name:var(--font-montserrat)]">
                  FinRisk
                </h1>
                <p className="text-sm text-muted-foreground">Professional Risk Scoring Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className={`${isConnected ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}`}
              >
                {isConnected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                {isConnected ? "Live Data" : "Disconnected"}
              </Badge>
              <div className="text-xs text-muted-foreground">Last update: {lastUpdate.toLocaleTimeString()}</div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section with 3D Visualization */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-black text-foreground mb-4 font-[family-name:var(--font-montserrat)]">
                Real-Time Financial Risk Intelligence
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Advanced AI-powered risk scoring with transparent, explainable insights for investors and regulators.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Score</p>
                      <p className="text-2xl font-bold text-primary transition-all duration-500">
                        {currentScore.toFixed(1)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Data Sources</p>
                      <p className="text-2xl font-bold text-accent">247</p>
                    </div>
                    <Database className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="h-96 overflow-hidden">
            <CardContent className="p-0 h-full">
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center bg-muted/20">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading 3D Visualization</p>
                    </div>
                  </div>
                }
              >
                <DataVisualization companies={realTimeData.companies} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scoring">Scoring Engine</TabsTrigger>
            <TabsTrigger value="explainability">Explainability</TabsTrigger>
            <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Risk Score Trends</CardTitle>
                  <CardDescription>AI-powered vs Traditional scoring comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={realTimeData.riskScores}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#164e63" strokeWidth={3} name="AI Score" />
                      <Line type="monotone" dataKey="traditional" stroke="#f97316" strokeWidth={2} name="Traditional" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Portfolio risk breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={realTimeData.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {realTimeData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Risk Factor Analysis</CardTitle>
                <CardDescription>Key factors contributing to current risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {realTimeData.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            factor.impact === "high"
                              ? "bg-destructive"
                              : factor.impact === "medium"
                                ? "bg-accent"
                                : "bg-chart-1"
                          }`}
                        />
                        <span className="font-medium">{factor.name}</span>
                        <span className={`text-xs ${factor.change >= 0 ? "text-red-500" : "text-green-500"}`}>
                          ({factor.change >= 0 ? "+" : ""}
                          {factor.change}%)
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={factor.value} className="w-24" />
                        <span className="text-sm font-medium w-8">{factor.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scoring">
            <Card>
              <CardHeader>
                <CardTitle>Scoring Engine Architecture</CardTitle>
                <CardDescription>Real-time model performance and data pipeline status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-muted/20 rounded-lg">
                    <Database className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Data Ingestion</h3>
                    <p className="text-sm text-muted-foreground">247 sources active</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="text-center p-6 bg-muted/20 rounded-lg">
                    <Brain className="w-12 h-12 text-accent mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">ML Models</h3>
                    <p className="text-sm text-muted-foreground">99.2% accuracy</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Optimal</Badge>
                  </div>
                  <div className="text-center p-6 bg-muted/20 rounded-lg">
                    <Shield className="w-12 h-12 text-chart-1 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Risk Engine</h3>
                    <p className="text-sm text-muted-foreground">Real-time scoring</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explainability">
            <Card>
              <CardHeader>
                <CardTitle>Explainable AI Insights</CardTitle>
                <CardDescription>Transparent reasoning behind risk assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-accent">High Impact Event Detected</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Debt restructuring announcement → Risk score increased by 12 points
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Source: SEC Filing 8-K, processed 2 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3">Feature Contributions</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Debt-to-Equity Ratio</span>
                          <span className="text-destructive">+15.2</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Market Sentiment</span>
                          <span className="text-destructive">+8.7</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Liquidity Position</span>
                          <span className="text-green-600">-3.1</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3">Recent Events</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-destructive rounded-full"></div>
                          <span>Credit rating downgrade</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span>Earnings miss</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>New partnership announced</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="grid gap-4">
              {realTimeData.alerts.length > 0 ? (
                realTimeData.alerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={`border-${alert.severity === "high" ? "destructive" : "accent"}/20 bg-${alert.severity === "high" ? "destructive" : "accent"}/5`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle
                          className={`w-5 h-5 text-${alert.severity === "high" ? "destructive" : "accent"}`}
                        />
                        <div>
                          <h4 className={`font-semibold text-${alert.severity === "high" ? "destructive" : "accent"}`}>
                            {alert.message}
                          </h4>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                          {alert.severity}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-accent/20 bg-accent/5">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      <div>
                        <h4 className="font-semibold text-accent">System Monitoring</h4>
                        <p className="text-sm text-muted-foreground">All systems operational - monitoring for alerts</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Normal</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
