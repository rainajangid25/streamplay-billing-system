"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Brain, TrendingUp, Users, AlertTriangle, DollarSign, Target, Activity, Bot } from "lucide-react"

export default function AIInsightsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")
  const [isLoading, setIsLoading] = useState(false)
  const [aiInsights, setAiInsights] = useState({
    churnPrediction: {
      highRiskCustomers: 23,
      mediumRiskCustomers: 67,
      lowRiskCustomers: 410,
      predictedChurnRate: 4.2,
      preventionOpportunities: 89000,
    },
    revenueForecasting: {
      nextMonthPrediction: 245000,
      confidence: 87,
      growthRate: 12.5,
      seasonalTrends: [
        { month: "Jan", predicted: 220000, actual: 218000 },
        { month: "Feb", predicted: 235000, actual: 232000 },
        { month: "Mar", predicted: 245000, actual: null },
        { month: "Apr", predicted: 255000, actual: null },
      ],
    },
    customerSegmentation: [
      { segment: "Champions", count: 89, value: 450000, color: "#10B981" },
      { segment: "Loyal Customers", count: 156, value: 320000, color: "#3B82F6" },
      { segment: "Potential Loyalists", count: 134, value: 180000, color: "#8B5CF6" },
      { segment: "At Risk", count: 67, value: 95000, color: "#F59E0B" },
      { segment: "Cannot Lose Them", count: 54, value: 380000, color: "#EF4444" },
    ],
    pricingOptimization: {
      averageOptimalPrice: 127.5,
      currentAveragePrice: 115.0,
      potentialRevenueLift: 18.2,
      optimizedCustomers: 234,
    },
    fraudDetection: {
      transactionsAnalyzed: 15420,
      fraudPrevented: 12,
      falsePositives: 3,
      accuracy: 97.8,
      amountSaved: 45600,
    },
  })

  const [mlModelPerformance] = useState([
    { model: "Churn Prediction", accuracy: 94.2, precision: 91.8, recall: 89.5 },
    { model: "LTV Prediction", accuracy: 87.6, precision: 85.3, recall: 88.1 },
    { model: "Fraud Detection", accuracy: 97.8, precision: 96.2, recall: 94.7 },
    { model: "Price Optimization", accuracy: 89.4, precision: 87.9, recall: 90.2 },
  ])

  const [customerJourneyData] = useState([
    { stage: "Awareness", customers: 1000, conversion: 25 },
    { stage: "Interest", customers: 250, conversion: 40 },
    { stage: "Consideration", customers: 100, conversion: 60 },
    { stage: "Purchase", customers: 60, conversion: 85 },
    { stage: "Retention", customers: 51, conversion: 92 },
    { stage: "Advocacy", customers: 47, conversion: 100 },
  ])

  const [sentimentAnalysis] = useState({
    overall: 78,
    trends: [
      { month: "Jan", positive: 72, neutral: 20, negative: 8 },
      { month: "Feb", positive: 75, neutral: 18, negative: 7 },
      { month: "Mar", positive: 78, neutral: 16, negative: 6 },
      { month: "Apr", positive: 81, neutral: 14, negative: 5 },
    ],
  })

  const refreshInsights = async () => {
    setIsLoading(true)
    // Simulate API call to refresh AI insights
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              AI-Powered Insights
            </h1>
            <p className="text-gray-600">Advanced machine learning analytics and predictions</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={refreshInsights} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Refresh AI Insights
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Key AI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Churn Prevention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${aiInsights.churnPrediction.preventionOpportunities.toLocaleString()}
              </div>
              <p className="text-xs opacity-75">Revenue at risk prevented</p>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {aiInsights.churnPrediction.highRiskCustomers} high-risk customers
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Revenue Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${aiInsights.revenueForecasting.nextMonthPrediction.toLocaleString()}
              </div>
              <p className="text-xs opacity-75">Next month prediction</p>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {aiInsights.revenueForecasting.confidence}% confidence
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Price Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{aiInsights.pricingOptimization.potentialRevenueLift}%</div>
              <p className="text-xs opacity-75">Potential revenue lift</p>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {aiInsights.pricingOptimization.optimizedCustomers} customers optimized
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Fraud Prevention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${aiInsights.fraudDetection.amountSaved.toLocaleString()}</div>
              <p className="text-xs opacity-75">Fraud losses prevented</p>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {aiInsights.fraudDetection.accuracy}% accuracy
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="churn" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="churn">Churn Analysis</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Forecasting</TabsTrigger>
            <TabsTrigger value="segmentation">Customer Segments</TabsTrigger>
            <TabsTrigger value="pricing">Price Optimization</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="churn" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Churn Risk Distribution
                  </CardTitle>
                  <CardDescription>Customer churn risk levels and predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">High Risk</span>
                      <div className="flex items-center gap-2">
                        <Progress value={23} className="w-32 h-2" />
                        <span className="text-sm text-gray-600">{aiInsights.churnPrediction.highRiskCustomers}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Medium Risk</span>
                      <div className="flex items-center gap-2">
                        <Progress value={67} className="w-32 h-2" />
                        <span className="text-sm text-gray-600">{aiInsights.churnPrediction.mediumRiskCustomers}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Low Risk</span>
                      <div className="flex items-center gap-2">
                        <Progress value={82} className="w-32 h-2" />
                        <span className="text-sm text-gray-600">{aiInsights.churnPrediction.lowRiskCustomers}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">AI Recommendations</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Send retention offers to 23 high-risk customers</li>
                      <li>• Schedule success manager calls for top 10 at-risk accounts</li>
                      <li>• Implement loyalty program for medium-risk segment</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Journey Analysis</CardTitle>
                  <CardDescription>Conversion rates through customer lifecycle</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={customerJourneyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="customers" fill="#3B82F6" />
                      <Bar dataKey="conversion" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Revenue Forecasting
                  </CardTitle>
                  <CardDescription>AI-powered revenue predictions vs actual performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={aiInsights.revenueForecasting.seasonalTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, ""]} />
                      <Legend />
                      <Line type="monotone" dataKey="predicted" stroke="#3B82F6" strokeWidth={2} name="AI Prediction" />
                      <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual Revenue" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                  <CardDescription>Key growth indicators and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Monthly Growth Rate</span>
                        <span className="text-lg font-bold text-green-600">
                          +{aiInsights.revenueForecasting.growthRate}%
                        </span>
                      </div>
                      <Progress value={aiInsights.revenueForecasting.growthRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Forecast Confidence</span>
                        <span className="text-lg font-bold text-blue-600">
                          {aiInsights.revenueForecasting.confidence}%
                        </span>
                      </div>
                      <Progress value={aiInsights.revenueForecasting.confidence} className="h-2" />
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">AI Insights</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Strong upward trend detected in Q2</li>
                        <li>• Seasonal peak expected in March</li>
                        <li>• New customer acquisition driving 60% of growth</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="segmentation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    Customer Segmentation
                  </CardTitle>
                  <CardDescription>AI-powered customer segments based on behavior and value</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={aiInsights.customerSegmentation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ segment, count }) => `${segment}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {aiInsights.customerSegmentation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Segment Value Analysis</CardTitle>
                  <CardDescription>Revenue contribution by customer segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsights.customerSegmentation.map((segment, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                          <div>
                            <div className="font-medium">{segment.segment}</div>
                            <div className="text-sm text-gray-600">{segment.count} customers</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${segment.value.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">
                            ${Math.round(segment.value / segment.count).toLocaleString()} avg
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Dynamic Pricing Optimization
                  </CardTitle>
                  <CardDescription>AI-driven pricing recommendations and impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          ${aiInsights.pricingOptimization.currentAveragePrice}
                        </div>
                        <div className="text-sm text-gray-600">Current Avg Price</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ${aiInsights.pricingOptimization.averageOptimalPrice}
                        </div>
                        <div className="text-sm text-gray-600">AI Optimal Price</div>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Optimization Impact</h4>
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        +{aiInsights.pricingOptimization.potentialRevenueLift}%
                      </div>
                      <div className="text-sm text-gray-600">Potential revenue increase</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing Factors</CardTitle>
                  <CardDescription>Key factors influencing AI pricing decisions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Customer Value Score</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Market Demand</span>
                      <div className="flex items-center gap-2">
                        <Progress value={72} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">72%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Competitive Position</span>
                      <div className="flex items-center gap-2">
                        <Progress value={68} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">68%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Willingness to Pay</span>
                      <div className="flex items-center gap-2">
                        <Progress value={78} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">78%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Sentiment Analysis</CardTitle>
                  <CardDescription>AI-powered sentiment tracking from customer communications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">{sentimentAnalysis.overall}%</div>
                    <div className="text-gray-600">Overall Positive Sentiment</div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={sentimentAnalysis.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="positive" stackId="1" stroke="#10B981" fill="#10B981" />
                      <Area type="monotone" dataKey="neutral" stackId="1" stroke="#6B7280" fill="#6B7280" />
                      <Area type="monotone" dataKey="negative" stackId="1" stroke="#EF4444" fill="#EF4444" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Insights</CardTitle>
                  <CardDescription>Key themes and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-1">Positive Themes</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Excellent customer support response times</li>
                        <li>• User-friendly interface improvements</li>
                        <li>• Reliable blockchain payment processing</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-1">Areas for Improvement</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Mobile app performance issues</li>
                        <li>• Complex pricing structure feedback</li>
                        <li>• Onboarding process length concerns</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-1">AI Recommendations</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Prioritize mobile app optimization</li>
                        <li>• Simplify pricing communication</li>
                        <li>• Implement guided onboarding flow</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  ML Model Performance
                </CardTitle>
                <CardDescription>Real-time performance metrics for all AI/ML models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mlModelPerformance.map((model, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3">{model.model}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Accuracy</span>
                          <div className="flex items-center gap-2">
                            <Progress value={model.accuracy} className="w-20 h-2" />
                            <span className="text-sm font-medium">{model.accuracy}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Precision</span>
                          <div className="flex items-center gap-2">
                            <Progress value={model.precision} className="w-20 h-2" />
                            <span className="text-sm font-medium">{model.precision}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Recall</span>
                          <div className="flex items-center gap-2">
                            <Progress value={model.recall} className="w-20 h-2" />
                            <span className="text-sm font-medium">{model.recall}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Model Training Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Last Training</div>
                      <div className="text-blue-700">2 hours ago</div>
                    </div>
                    <div>
                      <div className="font-medium">Data Points</div>
                      <div className="text-blue-700">1.2M records</div>
                    </div>
                    <div>
                      <div className="font-medium">Next Update</div>
                      <div className="text-blue-700">In 22 hours</div>
                    </div>
                    <div>
                      <div className="font-medium">Model Version</div>
                      <div className="text-blue-700">v2.1.3</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
