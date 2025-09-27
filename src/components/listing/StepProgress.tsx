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
	// Make steps clickable when provided
	goToStep?: (step: number) => void;
	totalSteps?: number;
}

export function StepProgress({
	currentStep,
	completedSteps,
	goToStep,
}: StepProgressProps) {
	return (
		<div className="w-full bg-card border-b border-card-border md:border md:rounded-lg md:bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-4 md:p-4">
				<div className="flex flex-col space-y-4">
					{/* Progress Bar */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="h-1 w-full bg-muted rounded-full">
								<div
									className="h-1 bg-primary rounded-full transition-smooth"
									style={{
										width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
									}}
								/>
							</div>
						</div>
						<div className="relative flex justify-between">
							{steps.map((step) => {
								const isActive = step.id === currentStep;
								const isCompleted = completedSteps.includes(step.id);
								const isPast = step.id < currentStep;
								const clickable = Boolean(goToStep);

								return (
									<button
										key={step.id}
										type="button"
										aria-label={`Go to step ${step.id}: ${step.title}`}
										onClick={clickable ? () => goToStep?.(step.id) : undefined}
										className={cn(
											"flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-smooth ring-1 ring-border",
											clickable && "cursor-pointer hover:ring-primary/40",
											isActive && "bg-primary text-primary-foreground ring-primary",
											isCompleted && "bg-success text-success-foreground ring-success/80",
											!isActive &&
												!isCompleted &&
												!isPast &&
												"bg-muted text-muted-foreground",
											isPast && !isCompleted && "bg-success text-success-foreground/90"
										)}
									>
										{isCompleted || isPast ? (
											<Check className="h-4 w-4" />
										) : (
											step.id
										)}
									</button>
								);
							})}
						</div>
					</div>

					{/* Step Labels */}
					<div className="grid grid-cols-4 lg:grid-cols-8 gap-1 text-center">
						{steps.map((step) => {
							const isActive = step.id === currentStep;
							const clickable = Boolean(goToStep);

							return (
								<button
									key={step.id}
									type="button"
									onClick={clickable ? () => goToStep?.(step.id) : undefined}
									className={cn(
										"flex flex-col space-y-1 rounded-md p-1 transition-colors",
										clickable && "cursor-pointer hover:bg-muted"
									)}
								>
									<span
										className={cn(
											"text-xs font-medium",
											isActive ? "text-foreground" : "text-muted-foreground"
										)}
									>
										{step.title}
									</span>
									<span className="text-xs text-muted-foreground hidden sm:block">
										{step.subtitle}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}