"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SalesChartProps {
  data: Array<{
    date: string
    revenue: number
    orders: number
    visitors: number
  }>
}

export function SalesChart({ data }: SalesChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} tickMargin={8} />
            <YAxis tickFormatter={formatCurrency} fontSize={12} tickMargin={8} />
            <Tooltip
              labelFormatter={(value) => formatDate(value as string)}
              formatter={(value: number, name: string) => [
                name === "revenue" ? formatCurrency(value) : value.toLocaleString(),
                name === "revenue" ? "Revenue" : name === "orders" ? "Orders" : "Visitors",
              ]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
