"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, BookOpen, BarChart3, Zap, ArrowRight, X } from "lucide-react"

const onboardingSteps = [
  {
    icon: Zap,
    title: "Create Tasks",
    description: "Add your study tasks with deadlines, categories, and priorities. Organize everything you need to accomplish.",
    color: "from-amber-500/10 to-background/80",
  },
  {
    icon: CheckCircle2,
    title: "Track Progress",
    description: "Mark tasks as completed and watch your completion rate grow. Build a consistent study habit.",
    color: "from-emerald-500/10 to-background/80",
  },
  {
    icon: BookOpen,
    title: "Manage Notes",
    description: "Capture quick study notes, pin important concepts, and keep your revision cards organized.",
    color: "from-sky-500/10 to-background/80",
  },
  {
    icon: BarChart3,
    title: "View Analytics",
    description: "Visualize your productivity trends, study sessions, and task completion patterns with interactive charts.",
    color: "from-purple-500/10 to-background/80",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSkipped, setIsSkipped] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
    if (hasSeenOnboarding) {
      router.push("/dashboard")
    }
  }, [router])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleSkip = () => {
    setIsSkipped(true)
    completeOnboarding()
  }

  const completeOnboarding = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    router.push("/dashboard")
  }

  const step = onboardingSteps[currentStep]
  const StepIcon = step.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-3">
            StudyFlow
          </h1>
          <p className="text-lg text-muted-foreground">Your ultimate study companion</p>
        </div>

        {/* Main Card */}
        <Card className="rounded-3xl border border-border/80 bg-card/95 shadow-2xl shadow-black/20 overflow-hidden">
          <CardHeader className="relative p-8 pb-4">
            <button
              onClick={handleSkip}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Skip onboarding"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <StepIcon className="h-12 w-12 text-primary" />
              </div>
            </div>

            <CardTitle className="text-center text-3xl font-bold mb-2">
              {step.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 pt-4">
            <p className="text-center text-lg text-muted-foreground mb-8">
              {step.description}
            </p>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {onboardingSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-primary w-8"
                      : index < currentStep
                        ? "bg-primary/50 w-2"
                        : "bg-primary/20 w-2"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Feature List */}
            <div className="space-y-3 mb-8">
              {onboardingSteps.map((s, index) => {
                const Icon = s.icon
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg transition ${
                      index === currentStep
                        ? "bg-primary/10 border border-primary/30"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{s.title}</p>
                      <p className="text-sm opacity-75">{s.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1 rounded-full py-6 text-base"
              >
                Skip for now
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 rounded-full py-6 text-base flex items-center justify-center gap-2"
              >
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            {/* Progress text */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Step {currentStep + 1} of {onboardingSteps.length}
            </p>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>💡 You can revisit this guide anytime from settings</p>
        </div>
      </div>
    </div>
  )
}
