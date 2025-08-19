"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Database, Zap, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface DataSource {
  id: string
  name: string
  type: string
  status: string
  lastUpdate: string
  metrics: {
    recordsPerSecond: number
    latency: number
  }
}

export function DataIngestionDashboard() {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [streamData, setStreamData] = useState<any[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [batchStatus, setBatchStatus] = useState<any>(null)

  useEffect(() => {
    fetchDataSources()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStreaming) {
      interval = setInterval(() => {
        fetchStreamData()
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isStreaming])

  const fetchDataSources = async () => {
    try {
      const response = await fetch("/api/data-sources")
      const result = await response.json()
      if (result.success) {
        setDataSources(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch data sources:", error)
    }
  }

  const fetchStreamData = async () => {
    try {
      const response = await fetch("/api/data-ingestion/stream?type=market")
      const result = await response.json()
      if (result.success) {
        setStreamData((prev) => [...result.data, ...prev].slice(0, 20))
      }
    } catch (error) {
      console.error("Failed to fetch stream data:", error)
    }
  }

  const runBatchProcess = async () => {
    try {
      setBatchStatus({ status: "processing" })
      const response = await fetch("/api/data-ingestion/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordCount: 5000 }),
      })
      const result = await response.json()
      setBatchStatus(result.success ? { status: "completed", data: result.data } : { status: "failed" })
    } catch (error) {
      setBatchStatus({ status: "failed" })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Ingestion Control Center</h2>
          <p className="text-gray-600">Monitor and manage real-time financial data streams</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsStreaming(!isStreaming)}
            variant={isStreaming ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            {isStreaming ? "Stop Stream" : "Start Stream"}
          </Button>
          <Button onClick={runBatchProcess} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Database className="h-4 w-4" />
            Run Batch Process
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="stream">Live Stream</TabsTrigger>
          <TabsTrigger value="batch">Batch Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dataSources.map((source) => (
              <Card key={source.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{source.name}</CardTitle>
                    {getStatusIcon(source.status)}
                  </div>
                  <CardDescription className="text-xs">Type: {source.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>Status</span>
                    <Badge variant="secondary" className={`${getStatusColor(source.status)} text-white`}>
                      {source.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Records/sec</span>
                      <span className="font-mono">{source.metrics.recordsPerSecond}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Latency</span>
                      <span className="font-mono">{source.metrics.latency}ms</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last update: {new Date(source.lastUpdate).toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stream" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Real-time Market Data Stream
                {isStreaming && <Badge className="bg-green-500">Live</Badge>}
              </CardTitle>
              <CardDescription>Live financial data updates every 2 seconds</CardDescription>
            </CardHeader>
            <CardContent>
              {streamData.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {streamData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold">{item.symbol}</span>
                        <span className="font-mono">${item.price}</span>
                        <span className={`font-mono ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {item.change >= 0 ? "+" : ""}
                          {item.change} ({item.changePercent}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Risk: {item.riskScore}</span>
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isStreaming ? "Waiting for data..." : 'Click "Start Stream" to begin receiving live data'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Batch Data Processing
              </CardTitle>
              <CardDescription>Process large datasets for historical analysis and model training</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {batchStatus?.status === "processing" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing 5,000 records...</span>
                    <span>Please wait</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              )}

              {batchStatus?.status === "completed" && (
                <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Batch processing completed successfully</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Records processed:</span>
                      <span className="ml-2 font-mono">{batchStatus.data.recordsProcessed}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Processing time:</span>
                      <span className="ml-2 font-mono">{batchStatus.data.processingTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Data quality:</span>
                      <span className="ml-2 font-mono">{batchStatus.data.dataQuality}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Warnings:</span>
                      <span className="ml-2 font-mono">{batchStatus.data.warnings}</span>
                    </div>
                  </div>
                </div>
              )}

              {batchStatus?.status === "failed" && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Batch processing failed</span>
                  </div>
                </div>
              )}

              {!batchStatus && (
                <div className="text-center py-8 text-gray-500">
                  Click "Run Batch Process" to start processing historical data
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
