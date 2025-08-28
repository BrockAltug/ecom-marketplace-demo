import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  change: number
  period: string
  icon?: React.ReactNode
  format?: "currency" | "number" | "percentage"
}

export function KpiCard({ title, value, change, period, icon, format = "number" }: KpiCardProps) {
  const isPositive = change > 0
  const formattedValue =
    format === "currency"
      ? `$${typeof value === "number" ? value.toLocaleString() : value}`
      : format === "percentage"
        ? `${value}%`
        : typeof value === "number"
          ? value.toLocaleString()
          : value

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge
            variant="secondary"
            className={cn(
              "flex items-center gap-1",
              isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50",
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change)}%
          </Badge>
          <span>{period}</span>
        </div>
      </CardContent>
    </Card>
  )
}
