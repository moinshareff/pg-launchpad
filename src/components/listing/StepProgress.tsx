import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { id: 1, title: "General Info", subtitle: "Basic details" },
  { id: 2, title: "Room & Sharing", subtitle: "Room options" },
  { id: 3, title: "Food Options", subtitle: "Meal plans" },
  { id: 4, title: "Amenities", subtitle: "Facilities" },
  { id: 5, title: "Pricing", subtitle: "Costs & terms" },
  { id: 6, title: "Rules", subtitle: "Restrictions" },
  { id: 7, title: "Media Upload", subtitle: "Photos & videos" },
  { id: 8, title: "Preview", subtitle: "Review & submit" },
];

interface StepProgressProps {
  currentStep: number;
  completedSteps: number[];
}

export function StepProgress({ currentStep, completedSteps }: StepProgressProps) {
  return (
    <div className="w-full bg-card border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col space-y-4">
          {/* Progress Bar */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="h-1 w-full bg-muted rounded-full">
                <div 
                  className="h-1 bg-gradient-primary rounded-full transition-smooth"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
            <div className="relative flex justify-between">
              {steps.map((step) => {
                const isActive = step.id === currentStep;
                const isCompleted = completedSteps.includes(step.id);
                const isPast = step.id < currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-smooth",
                      isActive && "bg-step-active text-step-text-active shadow-primary",
                      isCompleted && "bg-step-complete text-step-text-complete",
                      !isActive && !isCompleted && !isPast && "bg-step-inactive text-step-text-inactive",
                      isPast && !isCompleted && "bg-step-complete text-step-text-complete"
                    )}
                  >
                    {isCompleted || isPast ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Step Labels */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-1 text-center">
            {steps.map((step) => {
              const isActive = step.id === currentStep;
              
              return (
                <div key={step.id} className="flex flex-col space-y-1">
                  <span className={cn(
                    "text-xs font-medium transition-smooth",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {step.subtitle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}