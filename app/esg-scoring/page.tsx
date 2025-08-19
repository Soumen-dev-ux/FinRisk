"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Leaf, Users, Shield, Award } from "lucide-react"

export default function ESGScoring() {
  const [esgData, setEsgData] = useState({
    overall: 78,
    environmental: 82,
    social: 75,
    governance: 77,
  })

  const [portfolioESG, setPortfolioESG] = useState([
    { company: "Apple Inc.", esg: 85, environmental: 88, social: 82, governance: 85, weight: 15 },
    { company: "Microsoft Corp.", esg: 89, environmental: 92, social: 87, governance: 88, weight: 12 },
    { company: "Tesla Inc.", esg: 76, environmental: 95, social: 65, governance: 68, weight: 8 },
    { company: "Johnson & Johnson", esg: 83, environmental: 78, social: 89, governance: 82, weight: 10 },
    { company: "JPMorgan Chase", esg: 72, environmental: 68, social: 75, governance: 74, weight: 7 },
  ])

  const radarData = [
    { subject: "Carbon Footprint", A: esgData.environmental, fullMark: 100 },
    { subject: "Water Usage", A: 85, fullMark: 100 },
    { subject: "Waste Management", A: 78, fullMark: 100 },
    { subject: "Employee Satisfaction", A: esgData.social, fullMark: 100 },
    { subject: "Diversity & Inclusion", A: 82, fullMark: 100 },
    { subject: "Board Independence", A: esgData.governance, fullMark: 100 },
    { subject: "Executive Compensation", A: 74, fullMark: 100 },
    { subject: "Transparency", A: 88, fullMark: 100 },
  ]

  const getESGRating = (score) => {
    if (score >= 80) return { rating: "AAA", color: "text-green-400", bg: "bg-green-500/20" }
    if (score >= 70) return { rating: "AA", color: "text-blue-400", bg: "bg-blue-500/20" }
    if (score >= 60) return { rating: "A", color: "text-yellow-400", bg: "bg-yellow-500/20" }
    if (score >= 50) return { rating: "BBB", color: "text-orange-400", bg: "bg-orange-500/20" }
    return { rating: "BB", color: "text-red-400", bg: "bg-red-500/20" }
  }

  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    environmental: 75 + Math.sin(i * 0.5) * 5 + Math.random() * 3,
    social: 70 + Math.cos(i * 0.4) * 4 + Math.random() * 3,
    governance: 72 + Math.sin(i * 0.3) * 3 + Math.random() * 2,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Leaf className="h-10 w-10 text-green-400" />
            ESG Risk Scoring
          </h1>
          <p className="text-xl text-slate-300">Environmental, Social, and Governance risk assessment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-300">Overall ESG Score</p>
                  <p className="text-2xl font-bold text-green-400">{esgData.overall}</p>
                  <Badge className={`mt-1 ${getESGRating(esgData.overall).bg} ${getESGRating(esgData.overall).color}`}>
                    {getESGRating(esgData.overall).rating}
                  </Badge>
                </div>
                <Award className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Environmental</p>
                  <p className="text-2xl font-bold text-blue-400">{esgData.environmental}</p>
                  <Progress value={esgData.environmental} className="mt-2 w-full" />
                </div>
                <Leaf className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">Social</p>
                  <p className="text-2xl font-bold text-purple-400">{esgData.social}</p>
                  <Progress value={esgData.social} className="mt-2 w-full" />
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-300">Governance</p>
                  <p className="text-2xl font-bold text-orange-400">{esgData.governance}</p>
                  <Progress value={esgData.governance} className="mt-2 w-full" />
                </div>
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">ESG Factor Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 10 }} />
                      <Radar
                        name="ESG Score"
                        dataKey="A"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Risk Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Climate Risk</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Low
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Regulatory Risk</span>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        Medium
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Reputation Risk</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Low
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Operational Risk</span>
                      <Badge variant="outline" className="text-orange-400 border-orange-400">
                        Medium-High
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Portfolio ESG Analysis</CardTitle>
                <CardDescription className="text-slate-400">
                  ESG scores for top holdings weighted by portfolio allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioESG.map((holding, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-medium">{holding.company}</span>
                          <Badge className={`${getESGRating(holding.esg).bg} ${getESGRating(holding.esg).color}`}>
                            {getESGRating(holding.esg).rating}
                          </Badge>
                          <span className="text-sm text-slate-400">{holding.weight}% allocation</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Overall: </span>
                            <span className="text-white font-medium">{holding.esg}</span>
                          </div>
                          <div>
                            <span className="text-blue-400">E: </span>
                            <span className="text-white">{holding.environmental}</span>
                          </div>
                          <div>
                            <span className="text-purple-400">S: </span>
                            <span className="text-white">{holding.social}</span>
                          </div>
                          <div>
                            <span className="text-orange-400">G: </span>
                            <span className="text-white">{holding.governance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">ESG Score Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#f3f4f6" }}
                    />
                    <Line type="monotone" dataKey="environmental" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="social" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="governance" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benchmarks">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Industry Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Benchmark comparison features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
