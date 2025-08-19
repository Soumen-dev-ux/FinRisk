"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Brain, FileText, Shield, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react"

interface ShapAnalysis {
  entityId: string
  baseScore: number
  finalScore: number
  totalContribution: number
  features: Array<{
    name: string
    value: number
    shapValue: number
    impact: string
  }>
  explanation: string
  confidence: number
  modelVersion: string
}

interface AuditEvent {
  id: string
  timestamp: string
  event: string
  details: string
  user: string
  [key: string]: any
}

export function ExplainabilityDashboard() {
  const [shapData, setShapData] = useState<ShapAnalysis | null>(null)
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([])
  const [modelInterpretation, setModelInterpretation] = useState<any>(null)
  const [selectedEntity, setSelectedEntity] = useState("AAPL")

  useEffect(() => {
    fetchShapAnalysis()
    fetchAuditTrail()
    fetchModelInterpretation()
  }, [selectedEntity])

  const fetchShapAnalysis = async () => {
    try {
      const response = await fetch(`/api/explainability/shap-values?entityId=${selectedEntity}`)
      const result = await response.json()
      if (result.success) {
        setShapData(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch SHAP analysis:", error)
    }
  }

  const fetchAuditTrail = async () => {
    try {
      const response = await fetch(`/api/explainability/audit-trail?entityId=${selectedEntity}`)
      const result = await response.json()
      if (result.success) {
        setAuditTrail(result.data.auditTrail)
      }
    } catch (error) {
      console.error("Failed to fetch audit trail:", error)
    }
  }

  const fetchModelInterpretation = async () => {
    try {
      const response = await fetch("/api/explainability/model-interpretation")
      const result = await response.json()
      if (result.success) {
        setModelInterpretation(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch model interpretation:", error)
    }
  }

  const getImpactColor = (impact: string) => {
    return impact === "positive" ? "text-green-600" : "text-red-600"
  }

  const getImpactIcon = (impact: string) => {
    return impact === "positive" ? (
      <TrendingDown className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Explainable AI Dashboard</h2>
          <p className="text-gray-600">Transparent model reasoning and regulatory compliance</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="AAPL">Apple Inc. (AAPL)</option>
            <option value="GOOGL">Alphabet Inc. (GOOGL)</option>
            <option value="MSFT">Microsoft Corp. (MSFT)</option>
            <option value="TSLA">Tesla Inc. (TSLA)</option>
          </select>
          <Button variant="outline" onClick={fetchShapAnalysis}>
            <Brain className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      <Tabs defaultValue="shap" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shap">SHAP Analysis</TabsTrigger>
          <TabsTrigger value="model">Model Interpretation</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="shap" className="space-y-4">
          {shapData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Final Risk Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{shapData.finalScore.toFixed(1)}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Base: {shapData.baseScore} + Contributions: {shapData.totalContribution.toFixed(1)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Model Confidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{(shapData.confidence * 100).toFixed(1)}%</div>
                    <p className="text-xs text-gray-500 mt-1">Model: {shapData.modelVersion}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Top Risk Factor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">{shapData.features[0]?.name}</div>
                    <div className={`text-lg font-bold ${getImpactColor(shapData.features[0]?.impact)}`}>
                      {shapData.features[0]?.shapValue > 0 ? "+" : ""}
                      {shapData.features[0]?.shapValue.toFixed(1)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Contributions (SHAP Values)</CardTitle>
                  <CardDescription>How each feature contributes to the final risk score</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={shapData.features} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip
                        formatter={(value: any, name: string) => [
                          `${value > 0 ? "+" : ""}${value.toFixed(1)}`,
                          "SHAP Value",
                        ]}
                      />
                      <Bar dataKey="shapValue" fill={(entry: any) => (entry.shapValue > 0 ? "#ef4444" : "#10b981")} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Explanation</CardTitle>
                  <CardDescription>Plain-language interpretation of the risk assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm leading-relaxed">{shapData.explanation}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-sm">Feature Details:</h4>
                    {shapData.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {getImpactIcon(feature.impact)}
                          <span>{feature.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Value: {feature.value}</span>
                          <span className={`font-medium ${getImpactColor(feature.impact)}`}>
                            {feature.shapValue > 0 ? "+" : ""}
                            {feature.shapValue.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="model" className="space-y-4">
          {modelInterpretation && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Architecture</CardTitle>
                    <CardDescription>Ensemble model composition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {modelInterpretation.modelArchitecture.components.map((component: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-sm">{component.name}</span>
                            <div className="text-xs text-gray-500">
                              Accuracy: {(component.accuracy * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{(component.weight * 100).toFixed(0)}%</div>
                            <Progress value={component.weight * 100} className="w-16 h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Model Performance</CardTitle>
                    <CardDescription>Latest validation metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Accuracy</span>
                        <div className="font-bold text-lg">
                          {(modelInterpretation.modelPerformance.accuracy * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">AUC</span>
                        <div className="font-bold text-lg">
                          {(modelInterpretation.modelPerformance.auc * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Precision</span>
                        <div className="font-bold text-lg">
                          {(modelInterpretation.modelPerformance.precision * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Recall</span>
                        <div className="font-bold text-lg">
                          {(modelInterpretation.modelPerformance.recall * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Global Feature Importance</CardTitle>
                  <CardDescription>Overall feature importance across all predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={modelInterpretation.featureImportance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="feature" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="importance" fill="#164e63" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete history of model decisions and data changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {auditTrail.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {event.event === "Score Calculation" && <Brain className="h-4 w-4 text-blue-600" />}
                        {event.event === "Data Update" && <FileText className="h-4 w-4 text-green-600" />}
                        {event.event === "Model Validation" && <CheckCircle className="h-4 w-4 text-purple-600" />}
                        {event.event === "Alert Triggered" && <AlertCircle className="h-4 w-4 text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{event.event}</h4>
                          <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>User: {event.user}</span>
                          {event.modelVersion && <span>Model: {event.modelVersion}</span>}
                          {event.confidence && <span>Confidence: {(event.confidence * 100).toFixed(1)}%</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Compliance Status
                </CardTitle>
                <CardDescription>Regulatory framework adherence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Basel III</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Solvency II</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GDPR</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Model Risk Management</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
                <CardDescription>Audit trail and data governance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retention Period</span>
                    <span className="font-medium">7 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Audit</span>
                    <span className="font-medium">Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Classification</span>
                    <span className="font-medium">Confidential</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Encryption</span>
                    <span className="font-medium">AES-256</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Interpretability Methods</CardTitle>
              <CardDescription>Techniques used for model explanation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modelInterpretation?.interpretabilityMethods.map((method: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">{method.method}</h4>
                    <p className="text-xs text-gray-600">{method.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
