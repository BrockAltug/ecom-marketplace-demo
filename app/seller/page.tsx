"use client"

import { PageShell } from "@/components/layout/page-shell"
import { KpiCard } from "@/components/seller/kpi-card"
import { SalesChart } from "@/components/seller/sales-chart"
import { ListingsTable } from "@/components/seller/listings-table"
import { PayoutsTable } from "@/components/seller/payouts-table"
import { AdvancedAnalyticsDashboard } from "@/components/seller/advanced-analytics-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, ShoppingCart, TrendingUp, Star, BarChart3, Settings, Package } from "lucide-react"
import kpis from "@/src/data/kpis.json"
import salesData from "@/src/data/sales-timeseries.json"
import listings from "@/src/data/listings.json"
import payouts from "@/src/data/payouts.json"
import advancedAnalytics from "@/src/data/advanced-analytics.json"

export default function SellerDashboard() {
  const handleEditListing = (listing: any) => {
    // Non-functional edit
    console.log("Edit listing:", listing)
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 fade-in-up">
          <h1 className="text-3xl font-bold gradient-text">Seller Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's how your store is performing.</p>
        </div>

        {/* Enhanced Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* KPI Cards with animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade-in">
              <KpiCard
                title="Total Revenue"
                value={kpis.revenue.value}
                change={kpis.revenue.change}
                period={kpis.revenue.period}
                format="currency"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              />
              <KpiCard
                title="Orders"
                value={kpis.orders.value}
                change={kpis.orders.change}
                period={kpis.orders.period}
                icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
              />
              <KpiCard
                title="Conversion Rate"
                value={kpis.conversion.value}
                change={kpis.conversion.change}
                period={kpis.conversion.period}
                format="percentage"
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
              />
              <KpiCard
                title="Average Rating"
                value={kpis.rating.value}
                change={kpis.rating.change}
                period={kpis.rating.period}
                icon={<Star className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            {/* Sales Chart */}
            <div className="slide-up">
              <SalesChart data={salesData} />
            </div>

            {/* Payouts Table */}
            <div className="fade-in-up">
              <PayoutsTable payouts={payouts} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <AdvancedAnalyticsDashboard data={advancedAnalytics} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-8">
            <div className="fade-in-up">
              <ListingsTable listings={listings} onEdit={handleEditListing} />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <div className="text-center py-16 fade-in-up">
              <Settings className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Settings Panel</h3>
              <p className="text-muted-foreground">Configure your seller preferences and account settings.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  )
}
