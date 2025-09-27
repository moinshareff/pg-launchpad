import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface RulesStepProps {
  onDataChange: (data: any) => void;
  initialData: any;
}

const curfewOptions = [
  { value: "no-curfew", label: "No Curfew", description: "24/7 access available" },
  { value: "fixed-timings", label: "Fixed Entry/Exit Times", description: "Set specific timings" },
  { value: "flexible", label: "Flexible with Prior Notice", description: "Case-by-case basis" },
];

const visitorPolicies = [
  { value: "no-visitors", label: "No Visitors Allowed", icon: "🚫" },
  { value: "same-gender", label: "Same Gender Only", icon: "👥" },
  { value: "all-allowed", label: "All Visitors Allowed", icon: "✅" },
  { value: "restricted-hours", label: "Restricted Hours Only", icon: "⏰" },
];

export function RulesStep({ onDataChange, initialData }: RulesStepProps) {
  const handleInputChange = (field: string, value: any) => {
    onDataChange({ ...initialData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              🕐
            </div>
            Entry & Exit Timings
          </CardTitle>
          <CardDescription>
            Set curfew and access timing policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Curfew Policy *</Label>
            <RadioGroup
              value={initialData.curfewPolicy || ""}
              onValueChange={(value) => handleInputChange("curfewPolicy", value)}
              className="space-y-3"
            >
              {curfewOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-primary/5 transition-fast">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="cursor-pointer">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
            
            {initialData.curfewPolicy === "fixed-timings" && (
              <div className="ml-6 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryTime">Entry Time (from)</Label>
                  <Input
                    id="entryTime"
                    type="time"
                    value={initialData.entryTimeFrom || ""}
                    onChange={(e) => handleInputChange("entryTimeFrom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exitTime">Entry Time (until)</Label>
                  <Input
                    id="exitTime"
                    type="time"
                    value={initialData.entryTimeUntil || ""}
                    onChange={(e) => handleInputChange("entryTimeUntil", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
              👥
            </div>
            Visitor Policies
          </CardTitle>
          <CardDescription>
            Configure visitor access and restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Visitor Policy *</Label>
            <RadioGroup
              value={initialData.visitorPolicy || ""}
              onValueChange={(value) => handleInputChange("visitorPolicy", value)}
              className="grid grid-cols-2 gap-3"
            >
              {visitorPolicies.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-primary/5 transition-fast">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer flex-1">
                    <span className="text-lg">{option.icon}</span>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {initialData.visitorPolicy === "restricted-hours" && (
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitorHoursFrom">Visitor Hours (from)</Label>
                  <Input
                    id="visitorHoursFrom"
                    type="time"
                    value={initialData.visitorHoursFrom || ""}
                    onChange={(e) => handleInputChange("visitorHoursFrom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitorHoursTo">Visitor Hours (to)</Label>
                  <Input
                    id="visitorHoursTo"
                    type="time"
                    value={initialData.visitorHoursTo || ""}
                    onChange={(e) => handleInputChange("visitorHoursTo", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Additional Rules</Label>
            <Textarea
              placeholder="e.g., No smoking in rooms, no loud music after 11 PM..."
              value={initialData.additionalRules || ""}
              onChange={(e) => handleInputChange("additionalRules", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
              🚭
            </div>
            Lifestyle Policies
          </CardTitle>
          <CardDescription>
            Set rules for smoking, drinking, and pets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <span>🚭</span>
                  Smoking Allowed
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow smoking inside the premises
                </p>
              </div>
              <Switch
                checked={initialData.smokingAllowed || false}
                onCheckedChange={(checked) => handleInputChange("smokingAllowed", checked)}
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <span>🍺</span>
                  Drinking Allowed
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow alcohol consumption in the premises
                </p>
              </div>
              <Switch
                checked={initialData.drinkingAllowed || false}
                onCheckedChange={(checked) => handleInputChange("drinkingAllowed", checked)}
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <span>🐕</span>
                  Pets Allowed
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow residents to keep pets
                </p>
              </div>
              <Switch
                checked={initialData.petsAllowed || false}
                onCheckedChange={(checked) => handleInputChange("petsAllowed", checked)}
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <span>🎵</span>
                  Loud Music/Parties
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow loud music or parties
                </p>
              </div>
              <Switch
                checked={initialData.loudMusicAllowed || false}
                onCheckedChange={(checked) => handleInputChange("loudMusicAllowed", checked)}
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <span>🍽️</span>
                  Non-Vegetarian Food Allowed
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow non-vegetarian food to be cooked or consumed
                </p>
              </div>
              <Switch
                checked={initialData.nonVegAllowed || false}
                onCheckedChange={(checked) => handleInputChange("nonVegAllowed", checked)}
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <span>🚻</span>
                  Opposite Gender Allowed in Rooms
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow opposite-gender visitors in private rooms
                </p>
              </div>
              <Switch
                checked={initialData.oppositeGenderAllowed || false}
                onCheckedChange={(checked) => handleInputChange("oppositeGenderAllowed", checked)}
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <span>👨‍👩‍👧‍👦</span>
                  Guardian Stay Allowed
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow guardian or family member to stay overnight
                </p>
              </div>
              <Switch
                checked={initialData.guardianStayAllowed || false}
                onCheckedChange={(checked) => handleInputChange("guardianStayAllowed", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}