"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Target, Zap, Brain, PieChartIcon } from "lucide-react"

export default function PortfolioOptimizer() {
  const [riskTolerance, setRiskTolerance] = useState([5])
  const [timeHorizon, setTimeHorizon] = useState([5])
  const [optimizing, setOptimizing] = useState(false)
  const [optimizedPortfolio, setOptimizedPortfolio] = useState(null)

  const handleOptimize = async () => {
    setOptimizing(true)
    // Simulate AI optimization
    setTimeout(() => {
      setOptimizedPortfolio({
        expectedReturn: 12.4,
        volatility: 8.2,
        sharpeRatio: 1.51,
        allocation: [
          { asset: "US Equities", weight: 35, color: "#3b82f6" },
          { asset: "International Equities", weight: 25, color: "#10b981" },
          { asset: "Bonds", weight: 20, color: "#f59e0b" },
          { asset: "REITs", weight: 10, color: "#ef4444" },
          { asset: "Commodities", weight: 10, color: "#8b5cf6" },
        ],
      })
      setOptimizing(false)
    }, 3000)
  }

  const efficientFrontier = Array.from({ length: 20 }, (_, i) => ({
    risk: 4 + i * 0.8,
    return: 6 + i * 0.5 + Math.random() * 2,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-cyan-400" />
            AI Portfolio Optimizer
          </h1>
          <p className="text-xl text-slate-300">Advanced machine learning-powered portfolio optimization</p>
        </div>

        <Tabs defaultValue="optimizer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="backtesting">Backtesting</TabsTrigger>
          </TabsList>

          <TabsContent value="optimizer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-cyan-400" />
                    Optimization Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Risk Tolerance: {riskTolerance[0]}/10
                    </label>
                    <Slider
                      value={riskTolerance}
                      onValueChange={setRiskTolerance}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Time Horizon: {timeHorizon[0]} years
                    </label>
                    <Slider
                      value={timeHorizon}
                      onValueChange={setTimeHorizon}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <Button
                    onClick={handleOptimize}
                    disabled={optimizing}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    {optimizing ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Optimize Portfolio
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Efficient Frontier</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={efficientFrontier}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="risk" stroke="#9ca3af" />
                      <YAxis dataKey="return" stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                        labelStyle={{ color: "#f3f4f6" }}
                      />
                      <Scatter dataKey="return" fill="#06b6d4" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {optimizedPortfolio && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5 text-green-400" />
                      Optimized Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={optimizedPortfolio.allocation}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="weight"
                          label={({ asset, weight }) => `${asset}: ${weight}%`}
                        >
                          {optimizedPortfolio.allocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {optimizedPortfolio && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-green-300">Expected Return</p>
                      <p className="text-2xl font-bold text-green-400">{optimizedPortfolio.expectedReturn}%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-300">Volatility</p>
                      <p className="text-2xl font-bold text-blue-400">{optimizedPortfolio.volatility}%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-purple-300">Sharpe Ratio</p>
                      <p className="text-2xl font-bold text-purple-400">{optimizedPortfolio.sharpeRatio}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Portfolio Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Advanced portfolio analysis features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backtesting">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Historical Backtesting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Backtesting engine coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
