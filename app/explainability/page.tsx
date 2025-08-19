import { ExplainabilityDashboard } from "@/components/explainability-dashboard"

export default function ExplainabilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ExplainabilityDashboard />
      </div>
    </div>
  )
}
