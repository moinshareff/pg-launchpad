import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Upload, MapPin } from "lucide-react";

interface GeneralInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export function GeneralInfoStep({ data, onUpdate }: GeneralInfoStepProps) {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              🏠
            </div>
            Basic Information
          </CardTitle>
          <CardDescription>
            Tell us about your PG and its location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pgName">PG Name *</Label>
            <Input
              id="pgName"
              placeholder="Enter your PG name"
              value={data.pgName || ""}
              onChange={(e) => handleInputChange("pgName", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Type of PG *</Label>
            <RadioGroup
              value={data.pgType || ""}
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
                <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-fast">
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
                value={data.location || ""}
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
                value={data.contactPhone || ""}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="Your email address"
                value={data.contactEmail || ""}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
              📋
            </div>
            Verification Documents
          </CardTitle>
          <CardDescription>
            Upload required documents for verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ownership Proof *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-fast cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload property papers, lease agreement, etc.
                </p>
                <Button variant="outline" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Police Clearance</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-fast cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload police verification certificate
                </p>
                <Button variant="outline" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}