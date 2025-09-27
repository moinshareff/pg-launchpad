import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { MapPin, Building2 } from "lucide-react";

interface GeneralInfoStepProps {
  onDataChange: (data: any) => void;
  initialData: any;
}

export function GeneralInfoStep({ onDataChange, initialData }: GeneralInfoStepProps) {
  const handleInputChange = (field: string, value: any) => {
    onDataChange({ ...initialData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="font-semibold">
              Basic Information <span className="ml-1">🏠</span>
            </span>
          </CardTitle>
          <CardDescription>Tell us about your PG and its location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pgName">PG Name *</Label>
            <Input
              id="pgName"
              placeholder="Enter your PG name"
              value={initialData.pgName || ""}
              onChange={(e) => handleInputChange("pgName", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Type of PG *</Label>
            <RadioGroup
              value={initialData.pgType || ""}
              onValueChange={(value) => handleInputChange("pgType", value)}
              className="grid grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {[
                { value: "boys", label: "Boys Only", icon: "👨" },
                { value: "girls", label: "Girls Only", icon: "👩" },
                { value: "co-living", label: "Co-Living", icon: "👥" },
                { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
                { value: "mixed", label: "Mixed", icon: "🏠" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                    <span className="text-lg">{option.icon}</span>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Enter location (we'll add map integration later)"
                className="pl-10"
                value={initialData.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                placeholder="Your contact number"
                value={initialData.contactPhone || ""}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="Your email address"
                value={initialData.contactEmail || ""}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}