import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { StepProgress } from "./StepProgress";
import { GeneralInfoStep } from "./steps/GeneralInfoStep";
import { RoomSharingStep } from "./steps/RoomSharingStep";
import { FoodOptionsStep } from "./steps/FoodOptionsStep";
import { AmenitiesStep } from "./steps/AmenitiesStep";
import { PricingStep } from "./steps/PricingStep";
import { RulesStep } from "./steps/RulesStep";
import { MediaUploadStep } from "./steps/MediaUploadStep";
import { PreviewStep } from "./steps/PreviewStep";

const TOTAL_STEPS = 8;

export function PGListingWizard() {
  const [currentStep, setCurrentStep] = useState(5);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [listingData, setListingData] = useState({});
  const { toast } = useToast();

  // Auto-save functionality
  const autoSave = (data: any) => {
    setListingData(data);
    // In a real app, save to localStorage or backend
    localStorage.setItem("pg-listing-draft", JSON.stringify(data));
    
    // Show auto-save confirmation (optional)
    if (Object.keys(data).length > 0) {
      // Could show a subtle indicator that draft is saved
    }
  };

  const updateStepData = (stepData: any) => {
    const updatedData = { ...listingData, ...stepData };
    autoSave(updatedData);
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: // General Info
        return !!(listingData as any).pgName && !!(listingData as any).pgType && !!(listingData as any).location;
      case 2: // Room & Sharing
        return !!(listingData as any).roomConfigs && (listingData as any).roomConfigs.length > 0;
      case 3: // Food Options
        return !!(listingData as any).foodType;
      case 4: // Amenities
        return !!(listingData as any).amenities && (listingData as any).amenities.length > 0;
      case 5: // Pricing
        return !!(listingData as any).securityDeposit && !!(listingData as any).advancePayment;
      case 6: // Rules
        return !!(listingData as any).curfewPolicy && !!(listingData as any).visitorPolicy;
      case 7: // Media Upload
        const photos = (listingData as any).photos;
        if (!photos) return false;
        const totalPhotos = Object.values(photos).reduce((total: number, arr: unknown) => {
          return total + (Array.isArray(arr) ? arr.length : 0);
        }, 0) as number;
        return totalPhotos >= 5;
      case 8: // Preview
        return true; // Preview step doesn't require validation
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      // In a real app, submit to backend
      console.log("Submitting listing data:", listingData);
      
      toast({
        title: "Listing Submitted Successfully! 🎉",
        description: "Your PG listing has been submitted for review. We'll notify you once it's approved.",
        variant: "default",
      });

      // Clear draft from localStorage
      localStorage.removeItem("pg-listing-draft");
      
      // Could redirect to dashboard or show success page
    } else {
      toast({
        title: "Submission Failed",
        description: "Please complete all required sections before submitting.",
        variant: "destructive",
      });
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      data: listingData,
      onUpdate: updateStepData,
    };

    switch (currentStep) {
      case 1:
        return <GeneralInfoStep {...commonProps} />;
      case 2:
        return <RoomSharingStep {...commonProps} />;
      case 3:
        return <FoodOptionsStep {...commonProps} />;
      case 4:
        return <AmenitiesStep {...commonProps} />;
      case 5:
        return <PricingStep {...commonProps} />;
      case 6:
        return <RulesStep {...commonProps} />;
      case 7:
        return <MediaUploadStep {...commonProps} />;
      case 8:
        return (
          <PreviewStep
            data={listingData}
            onEdit={goToStep}
            onSubmit={handleSubmit}
          />
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create PG Listing</h1>
              <p className="text-muted-foreground">
                Step {currentStep} of {TOTAL_STEPS}: Complete all steps to list your PG
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Draft auto-saved ✓
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <StepProgress currentStep={currentStep} completedSteps={completedSteps} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        {currentStep !== 8 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="text-sm text-muted-foreground">
                  Step {currentStep} of {TOTAL_STEPS}
                </div>

                <Button
                  onClick={goToNextStep}
                  className="flex items-center gap-2 bg-gradient-primary"
                >
                  {currentStep === TOTAL_STEPS ? "Submit" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}