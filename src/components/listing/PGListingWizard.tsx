import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { computeInitialAvailability, getAvailability, setAvailability } from "@/lib/availability";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [listingData, setListingData] = useState<any>({});
  const { toast } = useToast();

  // A pseudo listingId; in real life this would come from backend or route
  const listingId = useMemo(() => (listingData.pgName?.trim() || "new-listing").toLowerCase().replace(/\s+/g, "-"), [listingData.pgName]);

  // Keep availability in localStorage and recompute when roomConfigs change
  useEffect(() => {
    const initial = computeInitialAvailability(listingData);
    if (initial > 0) {
      const current = getAvailability(listingId, initial);
      if (current !== initial && current === 0) setAvailability(listingId, initial);
    }
  }, [listingData.roomConfigs, listingId]);

  // Auto-save
  const autoSave = (data: any) => {
    setListingData(data);
    localStorage.setItem("pg-listing-draft", JSON.stringify(data));
  };

  const updateStepData = (stepData: any) => autoSave({ ...listingData, ...stepData });

  const validateCurrentStep = () => true;

  const goToNextStep = () => {
    if (!validateCurrentStep()) return toast({ title: "Incomplete Information", description: "Please fill in all required fields before proceeding.", variant: "destructive" });
    setCompletedSteps((p) => [...new Set([...p, currentStep])]);
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
  };

  const goToPreviousStep = () => currentStep > 1 && setCurrentStep((s) => s - 1);
  const goToStep = (step: number) => setCurrentStep(step);

  const handleSubmit = () => {
    toast({ title: "Listing Submitted!", description: "Your PG listing has been successfully submitted." });
    console.log("Submitting listing data:", listingData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GeneralInfoStep onDataChange={updateStepData} initialData={listingData} />;
      case 2:
        return <RoomSharingStep onDataChange={updateStepData} initialData={listingData} />;
      case 3:
        return <FoodOptionsStep onDataChange={updateStepData} initialData={listingData} />;
      case 4:
        return <AmenitiesStep onDataChange={updateStepData} initialData={listingData} />;
      case 5:
        return <PricingStep onDataChange={updateStepData} initialData={listingData} />;
      case 6:
        return <RulesStep onDataChange={updateStepData} initialData={listingData} />;
      case 7:
        return <MediaUploadStep onDataChange={updateStepData} initialData={listingData} />;
      case 8:
        return <PreviewStep data={listingData} onEdit={goToStep} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  const available = getAvailability(listingId, computeInitialAvailability(listingData));

  const ActionButtons = () => (
    <div className="flex w-full items-center justify-between gap-3">
      <Button onClick={goToPreviousStep} disabled={currentStep === 1} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      {currentStep < TOTAL_STEPS ? (
        <Button onClick={goToNextStep}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={handleSubmit}>Submit Listing</Button>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
      <div className="mb-4 lg:mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">List your PG</h1>
          <p className="text-muted-foreground mt-1">Complete the steps below to create your listing.</p>
        </div>
        <div className="rounded-lg border bg-card px-4 py-2 text-sm">
          <span className="text-muted-foreground">Available beds</span>
          <span className="mx-2">•</span>
          <span className="font-medium">{available}</span>
        </div>
      </div>

      <div className="mb-4 lg:mb-6">
        <StepProgress currentStep={currentStep} completedSteps={completedSteps} goToStep={goToStep} />
      </div>

      <Card>
        <CardContent className="p-4 md:p-6 lg:p-8">{renderStep()}</CardContent>
      </Card>

      <div className="mt-6 hidden md:block">
        <ActionButtons />
      </div>

      <div className="md:hidden sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t py-3 mt-4">
        <div className="max-w-6xl mx-auto px-4">
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}