"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  AlertTriangle,
  Lightbulb,
  Star,
  Eye,
  ShoppingCart,
} from "lucide-react"

interface AdvancedAnalyticsProps {
  data: any
}

export function AdvancedAnalyticsDashboard({ data }: AdvancedAnalyticsProps) {
  const COLORS = ["#ec4899", "#475569", "#10b981", "#f59e0b", "#8b5cf6"]

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatPercentage = (value: number) => `${value}%`

  return (
    <div className="space-y-8">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performance.totalViews.value.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{data.performance.totalViews.change}%{" "}
              {data.performance.totalViews.period}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performance.clickThroughRate.value}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{data.performance.clickThroughRate.change}%{" "}
              {data.performance.clickThroughRate.period}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.performance.averageOrderValue.value)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{data.performance.averageOrderValue.change}%{" "}
              {data.performance.averageOrderValue.period}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performance.returnCustomers.value}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{data.performance.returnCustomers.change}%{" "}
              {data.performance.returnCustomers.period}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performance.profitMargin.value}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{data.performance.profitMargin.change}%{" "}
              {data.performance.profitMargin.period}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performance.inventoryTurnover.value}x</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              {data.performance.inventoryTurnover.change}% {data.performance.inventoryTurnover.period}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Insights */}
      <Tabs defaultValue="demographics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Demographics */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Customer Age Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.customerInsights.demographics.ageGroups}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {data.customerInsights.demographics.ageGroups.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Locations */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Top Customer Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.customerInsights.demographics.topLocations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenue"]} />
                    <Bar dataKey="revenue" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-sm">Avg Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.customerInsights.behavior.averageSessionDuration}</div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-sm">Pages per Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.customerInsights.behavior.pagesPerSession}</div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-sm">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.customerInsights.behavior.bounceRate}%</div>
              </CardContent>
            </Card>
          </div>

          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Peak Traffic Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.customerInsights.behavior.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="traffic" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.productPerformance.topPerformers.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-1">{product.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{product.sales} sales</span>
                        <span>{formatCurrency(product.revenue)}</span>
                        <span>{product.conversionRate}% CVR</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{product.views} views</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Under Performers */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.productPerformance.underPerformers.map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-1">{product.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{product.sales} sales</span>
                        <span>{formatCurrency(product.revenue)}</span>
                        <span>{product.conversionRate}% CVR</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-orange-300 text-orange-700">
                      {product.views} views
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get Optimization Tips
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Next Month Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Predicted Revenue</span>
                  <span className="font-bold">{formatCurrency(data.forecasting.nextMonth.predictedRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Predicted Orders</span>
                  <span className="font-bold">{data.forecasting.nextMonth.predictedOrders.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence Level</span>
                    <span className="font-bold">{data.forecasting.nextMonth.confidence}%</span>
                  </div>
                  <Progress value={data.forecasting.nextMonth.confidence} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Next Quarter Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Predicted Revenue</span>
                  <span className="font-bold">{formatCurrency(data.forecasting.nextQuarter.predictedRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Predicted Orders</span>
                  <span className="font-bold">{data.forecasting.nextQuarter.predictedOrders.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence Level</span>
                    <span className="font-bold">{data.forecasting.nextQuarter.confidence}%</span>
                  </div>
                  <Progress value={data.forecasting.nextQuarter.confidence} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Seasonal Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.forecasting.seasonalTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${((value as number) * 100).toFixed(0)}%`, "Sales Multiplier"]} />
                  <Line type="monotone" dataKey="multiplier" stroke="#ec4899" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Recommendations */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.recommendations.map((rec: any, index: number) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div
                className={`p-2 rounded-full ${
                  rec.priority === "high"
                    ? "bg-red-100 text-red-600 dark:bg-red-900/20"
                    : rec.priority === "medium"
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
                }`}
              >
                {rec.type === "inventory" && <AlertTriangle className="h-4 w-4" />}
                {rec.type === "pricing" && <TrendingUp className="h-4 w-4" />}
                {rec.type === "marketing" && <Target className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <Badge
                    variant={
                      rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"
                    }
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                <p className="text-sm font-medium text-green-600">{rec.impact}</p>
              </div>
              <Button size="sm" variant="outline">
                Apply
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
