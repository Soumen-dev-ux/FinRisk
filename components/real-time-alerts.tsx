"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, BellRing, Settings, AlertTriangle, Info, TrendingUp, Check } from "lucide-react"

interface Alert {
  id: string
  type: string
  severity: string
  title: string
  message: string
  timestamp: string
  entity?: string
  [key: string]: any
}

interface MarketUpdate {
  type: string
  symbol: string
  price: number
  change: number
  changePercent: number
  riskScore: number
  timestamp: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  severity: string
  read: boolean
  timestamp: string
  entity: string
  actionRequired: boolean
}

export function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [marketUpdates, setMarketUpdates] = useState<MarketUpdate[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [alertConfigs, setAlertConfigs] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    fetchNotifications()
    fetchAlertConfigurations()
    connectToAlertStream()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  const connectToAlertStream = () => {
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

        if (data.type === "alert") {
          setAlerts((prev) => [data, ...prev].slice(0, 20))
          // Add to notifications
          const notification = {
            id: data.id,
            type: data.type,
            title: data.title,
            message: data.message,
            severity: data.severity,
            read: false,
            timestamp: data.timestamp,
            entity: data.entity || "SYSTEM",
            actionRequired: data.severity === "high",
          }
          setNotifications((prev) => [notification, ...prev])
          setUnreadCount((prev) => prev + 1)
        } else if (data.type === "market_update") {
          setMarketUpdates((prev) => [data, ...prev].slice(0, 10))
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      // Attempt to reconnect after 5 seconds
      setTimeout(connectToAlertStream, 5000)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      const result = await response.json()
      if (result.success) {
        setNotifications(result.data)
        setUnreadCount(result.unreadCount)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const fetchAlertConfigurations = async () => {
    try {
      const response = await fetch("/api/alerts/manage")
      const result = await response.json()
      if (result.success) {
        setAlertConfigs(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch alert configurations:", error)
    }
  }

  const markNotificationAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      })

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const toggleAlertConfig = async (id: string, enabled: boolean) => {
    try {
      await fetch("/api/alerts/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, enabled }),
      })

      setAlertConfigs((prev) => prev.map((config) => (config.id === id ? { ...config, enabled } : config)))
    } catch (error) {
      console.error("Failed to update alert configuration:", error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-time Alerts & Notifications</h2>
          <p className="text-gray-600">Monitor live risk events and system updates</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-gray-600">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
          <Button variant="outline" onClick={connectToAlertStream}>
            <Bell className="h-4 w-4 mr-2" />
            Reconnect
          </Button>
        </div>
      </div>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live">Live Alerts</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadCount > 0 && <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-red-500 text-white">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="market">Market Updates</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5" />
                Live Risk Alerts
                {isConnected && <Badge className="bg-green-100 text-green-800">Live</Badge>}
              </CardTitle>
              <CardDescription>Real-time alerts based on your configured thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {alerts.length > 0 ? (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getSeverityIcon(alert.severity)}
                            <div>
                              <h4 className="font-semibold text-sm">{alert.title}</h4>
                              <p className="text-sm mt-1">{alert.message}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs opacity-75">
                                {alert.entity && <span>Entity: {alert.entity}</span>}
                                <span>{new Date(alert.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {isConnected ? "No alerts received yet. Monitoring..." : "Disconnected from alert stream"}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>All notifications and system updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(notification.severity)}
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            <p className="text-sm mt-1 text-gray-600">{notification.message}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Entity: {notification.entity}</span>
                              <span>{new Date(notification.timestamp).toLocaleString()}</span>
                              {notification.actionRequired && (
                                <Badge variant="outline" className="text-red-600 border-red-200">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button size="sm" variant="ghost" onClick={() => markNotificationAsRead(notification.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Market Updates</CardTitle>
              <CardDescription>Real-time market data and risk score changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {marketUpdates.length > 0 ? (
                  <div className="space-y-3">
                    {marketUpdates.map((update, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-sm">{update.symbol}</span>
                          <span className="font-mono text-sm">${update.price}</span>
                          <span
                            className={`font-mono text-sm ${update.change >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {update.change >= 0 ? "+" : ""}
                            {update.change} ({update.changePercent}%)
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Risk: {update.riskScore}</span>
                          <span>{new Date(update.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {isConnected ? "Waiting for market updates..." : "Disconnected from market feed"}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alert Configurations
              </CardTitle>
              <CardDescription>Manage your alert thresholds and notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertConfigs.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{config.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {config.conditions.metric} {config.conditions.operator.replace("_", " ")}{" "}
                        {config.conditions.threshold}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Type: {config.type}</span>
                        <span>Frequency: {config.frequency}</span>
                        <span>Created by: {config.createdBy}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs">
                        {config.notifications.email && <Badge variant="outline">Email</Badge>}
                        {config.notifications.sms && <Badge variant="outline">SMS</Badge>}
                        {config.notifications.dashboard && <Badge variant="outline">Dashboard</Badge>}
                      </div>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(enabled) => toggleAlertConfig(config.id, enabled)}
                      />
                    </div>
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
