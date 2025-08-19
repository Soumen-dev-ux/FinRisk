"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, MessageSquare, Globe, Twitter, Newspaper, Brain } from "lucide-react"

export default function SentimentAnalysis() {
  const [sentimentData, setSentimentData] = useState({
    overall: 0.65,
    news: 0.72,
    social: 0.58,
    analyst: 0.71,
  })

  const [trendingTopics, setTrendingTopics] = useState([
    { topic: "Federal Reserve Policy", sentiment: 0.45, volume: 1250, trend: "down" },
    { topic: "Tech Earnings", sentiment: 0.78, volume: 980, trend: "up" },
    { topic: "Inflation Data", sentiment: 0.32, volume: 1100, trend: "down" },
    { topic: "Energy Sector", sentiment: 0.69, volume: 750, trend: "up" },
    { topic: "Banking Regulations", sentiment: 0.41, volume: 650, trend: "down" },
  ])

  const sentimentHistory = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    sentiment: 0.5 + Math.sin(i * 0.3) * 0.2 + Math.random() * 0.1,
    volume: 500 + Math.random() * 300,
  }))

  const getSentimentColor = (score) => {
    if (score > 0.6) return "text-green-400"
    if (score > 0.4) return "text-yellow-400"
    return "text-red-400"
  }

  const getSentimentBg = (score) => {
    if (score > 0.6) return "bg-green-500/20 border-green-500/30"
    if (score > 0.4) return "bg-yellow-500/20 border-yellow-500/30"
    return "bg-red-500/20 border-red-500/30"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-purple-400" />
            AI Sentiment Analysis
          </h1>
          <p className="text-xl text-slate-300">
            Real-time market sentiment from news, social media, and analyst reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`${getSentimentBg(sentimentData.overall)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Overall Sentiment</p>
                  <p className={`text-2xl font-bold ${getSentimentColor(sentimentData.overall)}`}>
                    {(sentimentData.overall * 100).toFixed(0)}%
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${getSentimentBg(sentimentData.news)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">News Sentiment</p>
                  <p className={`text-2xl font-bold ${getSentimentColor(sentimentData.news)}`}>
                    {(sentimentData.news * 100).toFixed(0)}%
                  </p>
                </div>
                <Newspaper className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${getSentimentBg(sentimentData.social)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Social Media</p>
                  <p className={`text-2xl font-bold ${getSentimentColor(sentimentData.social)}`}>
                    {(sentimentData.social * 100).toFixed(0)}%
                  </p>
                </div>
                <Twitter className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${getSentimentBg(sentimentData.analyst)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Analyst Reports</p>
                  <p className={`text-2xl font-bold ${getSentimentColor(sentimentData.analyst)}`}>
                    {(sentimentData.analyst * 100).toFixed(0)}%
                  </p>
                </div>
                <Globe className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">24-Hour Sentiment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sentimentHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis domain={[0, 1]} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                    labelStyle={{ color: "#f3f4f6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: "#a855f7", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Trending Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{topic.topic}</span>
                      {topic.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Sentiment:</span>
                        <span className={`text-sm font-medium ${getSentimentColor(topic.sentiment)}`}>
                          {(topic.sentiment * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Volume:</span>
                        <span className="text-sm text-slate-300">{topic.volume}</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={topic.sentiment * 100} className="w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sentiment Impact Analysis</CardTitle>
            <CardDescription className="text-slate-400">
              How sentiment changes correlate with market movements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sentimentHistory.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Bar dataKey="volume" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
