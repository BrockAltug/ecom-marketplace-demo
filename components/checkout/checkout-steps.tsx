"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description: string
}

interface CheckoutStepsProps {
  steps: Step[]
  currentStep: string
  completedSteps: string[]
}

export function CheckoutSteps({ steps, currentStep, completedSteps }: CheckoutStepsProps) {
  return (
    <nav className="mb-8">
      <ol className="flex items-center justify-center space-x-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id
          const isUpcoming = !isCompleted && !isCurrent

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium",
                    isCompleted && "bg-accent border-accent text-accent-foreground",
                    isCurrent && "border-accent text-accent",
                    isUpcoming && "border-muted-foreground text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      (isCompleted || isCurrent) && "text-foreground",
                      isUpcoming && "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className={cn("h-px w-16 ml-4", isCompleted ? "bg-accent" : "bg-muted-foreground")} />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
