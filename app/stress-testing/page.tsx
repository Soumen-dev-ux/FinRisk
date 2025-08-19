"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { AlertTriangle, Play, RotateCcw, Shield, Zap } from "lucide-react"

export default function StressTesting() {
  const [scenario, setScenario] = useState("")
  const [severity, setSeverity] = useState([5])
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)

  const scenarios = [
    { id: "market-crash", name: "Market Crash (-30%)", description: "Severe market downturn scenario" },
    { id: "interest-spike", name: "Interest Rate Spike (+5%)", description: "Rapid interest rate increase" },
    { id: "credit-crisis", name: "Credit Crisis", description: "Liquidity and credit market freeze" },
    { id: "currency-crisis", name: "Currency Crisis", description: "Major currency devaluation" },
    { id: "recession", name: "Economic Recession", description: "Prolonged economic downturn" },
    { id: "custom", name: "Custom Scenario", description: "Define your own stress parameters" },
  ]

  const runStressTest = async () => {
    setRunning(true)
    // Simulate stress test execution
    setTimeout(() => {
      const baseImpact = severity[0] * 0.1
      setResults({
        portfolioImpact: -baseImpact * 15,
        varImpact: baseImpact * 25,
        liquidityImpact: -baseImpact * 8,
        capitalRatio: Math.max(8, 15 - baseImpact * 2),
        timeline: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          portfolioValue: 100 * (1 - baseImpact * 0.15 * Math.sin(i * 0.5)),
          var: 5 + baseImpact * 2.5 * (1 + Math.sin(i * 0.3)),
          liquidity: Math.max(10, 50 - baseImpact * 8 * Math.exp(-i * 0.2)),
        })),
      })
      setRunning(false)
    }, 3000)
  }

  const getSeverityColor = (level) => {
    if (level <= 3) return "text-green-400"
    if (level <= 7) return "text-yellow-400"
    return "text-red-400"
  }

  const getSeverityBg = (level) => {
    if (level <= 3) return "bg-green-500/20"
    if (level <= 7) return "bg-yellow-500/20"
    return "bg-red-500/20"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Shield className="h-10 w-10 text-red-400" />
            Stress Testing Simulator
          </h1>
          <p className="text-xl text-slate-300">Advanced scenario modeling and risk stress testing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                Scenario Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Stress Scenario</label>
                <Select value={scenario} onValueChange={setScenario}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-sm text-slate-400">{s.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Severity Level: {severity[0]}/10
                </label>
                <Slider value={severity} onValueChange={setSeverity} max={10} min={1} step={1} className="w-full" />
                <div className={`mt-2 p-2 rounded text-center ${getSeverityBg(severity[0])}`}>
                  <span className={`font-medium ${getSeverityColor(severity[0])}`}>
                    {severity[0] <= 3 ? "Mild Stress" : severity[0] <= 7 ? "Moderate Stress" : "Severe Stress"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={runStressTest}
                  disabled={!scenario || running}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  {running ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Running Test...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Stress Test
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 hover:bg-slate-700 bg-transparent"
                  onClick={() => setResults(null)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {results && (
            <>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Impact Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-500/20 rounded-lg">
                      <p className="text-sm text-red-300">Portfolio Impact</p>
                      <p className="text-xl font-bold text-red-400">{results.portfolioImpact.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-3 bg-orange-500/20 rounded-lg">
                      <p className="text-sm text-orange-300">VaR Impact</p>
                      <p className="text-xl font-bold text-orange-400">+{results.varImpact.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-500/20 rounded-lg">
                      <p className="text-sm text-yellow-300">Liquidity Impact</p>
                      <p className="text-xl font-bold text-yellow-400">{results.liquidityImpact.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-3 bg-blue-500/20 rounded-lg">
                      <p className="text-sm text-blue-300">Capital Ratio</p>
                      <p className="text-xl font-bold text-blue-400">{results.capitalRatio.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge
                      variant={results.capitalRatio > 12 ? "default" : "destructive"}
                      className="w-full justify-center"
                    >
                      {results.capitalRatio > 12 ? "✓ Regulatory Compliant" : "⚠ Below Minimum"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Risk Metrics Evolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={results.timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                        labelStyle={{ color: "#f3f4f6" }}
                      />
                      <Line type="monotone" dataKey="portfolioValue" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="var" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="liquidity" stroke="#06b6d4" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {results && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Detailed Timeline Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                    labelStyle={{ color: "#f3f4f6" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="portfolioValue"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                  <Area type="monotone" dataKey="var" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
