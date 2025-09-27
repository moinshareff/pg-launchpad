import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface FoodOptionsStepProps {
  onDataChange: (data: any) => void;
  initialData: any;
}

const foodTypes = [
  { value: "veg-only", label: "Vegetarian Only", icon: "🥗", description: "Only vegetarian meals" },
  { value: "non-veg-only", label: "Non-Vegetarian Only", icon: "🍖", description: "Only non-vegetarian meals" },
  { value: "both", label: "Both Veg & Non-Veg", icon: "🍽️", description: "Both options available" },
  { value: "no-food", label: "No Food Service", icon: "🚫", description: "Food not provided" },
];

const mealOptions = [
  { id: "breakfast", label: "Breakfast", icon: "🌅", time: "07:00 - 10:00" },
  { id: "lunch", label: "Lunch", icon: "☀️", time: "12:00 - 15:00" },
  { id: "dinner", label: "Dinner", icon: "🌙", time: "19:00 - 22:00" },
];

export function FoodOptionsStep({ onDataChange, initialData }: FoodOptionsStepProps) {
  const handleInputChange = (field: string, value: any) => {
    onDataChange({ ...initialData, [field]: value });
  };

  const toggleMeal = (mealId: string) => {
    const currentMeals = initialData.mealPlans || [];
    const updatedMeals = currentMeals.includes(mealId)
      ? currentMeals.filter((m: string) => m !== mealId)
      : [...currentMeals, mealId];
    
    handleInputChange("mealPlans", updatedMeals);
  };

  const updateMealTiming = (mealId: string, timing: string) => {
    const timings = initialData.mealTimings || {};
    handleInputChange("mealTimings", { ...timings, [mealId]: timing });
  };

  const showMealOptions = initialData.foodType && initialData.foodType !== "no-food";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              🍽️
            </div>
            Food Service Options
          </CardTitle>
          <CardDescription>
            Configure food and meal options for your PG
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Food Type *</Label>
            <RadioGroup
              value={initialData.foodType || ""}
              onValueChange={(value) => handleInputChange("foodType", value)}
              className="space-y-3"
            >
              {foodTypes.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-primary/5 transition-fast">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="flex items-center gap-3 cursor-pointer">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {showMealOptions && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  ⏰
                </div>
                Meal Plans & Timings
              </CardTitle>
              <CardDescription>
                Select which meals you provide and set their timings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {mealOptions.map((meal) => {
                  const isSelected = (initialData.mealPlans || []).includes(meal.id);
                  
                  return (
                    <div key={meal.id} className="space-y-3">
                      <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-primary/5 transition-fast">
                        <Checkbox
                          id={meal.id}
                          checked={isSelected}
                          onCheckedChange={() => toggleMeal(meal.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={meal.id} className="flex items-center gap-3 cursor-pointer">
                            <span className="text-xl">{meal.icon}</span>
                            <div>
                              <div className="font-medium">{meal.label}</div>
                              <div className="text-sm text-muted-foreground">Default: {meal.time}</div>
                            </div>
                          </Label>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="ml-10 grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`${meal.id}-start`}>Start Time</Label>
                            <Input
                              id={`${meal.id}-start`}
                              type="time"
                              value={initialData.mealTimings?.[meal.id]?.start || ""}
                              onChange={(e) => updateMealTiming(meal.id, { ...initialData.mealTimings?.[meal.id], start: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${meal.id}-end`}>End Time</Label>
                            <Input
                              id={`${meal.id}-end`}
                              type="time"
                              value={initialData.mealTimings?.[meal.id]?.end || ""}
                              onChange={(e) => updateMealTiming(meal.id, { ...initialData.mealTimings?.[meal.id], end: e.target.value })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  👨‍🍳
                </div>
                Cooking Policies
              </CardTitle>
              <CardDescription>
                Configure cooking permissions for residents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="space-y-1">
                  <Label>Allow Self Cooking</Label>
                  <p className="text-sm text-muted-foreground">
                    Can residents cook their own food in the kitchen?
                  </p>
                </div>
                <Switch
                  checked={initialData.cookingAllowed || false}
                  onCheckedChange={(checked) => handleInputChange("cookingAllowed", checked)}
                />
              </div>
              
              {initialData.cookingAllowed && (
                <div className="ml-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Tip: Consider adding cooking timings or kitchen usage rules in the Rules section
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {initialData.foodType === "no-food" && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium mb-2">No Food Service</h3>
            <p className="text-muted-foreground">
              Residents will need to arrange their own meals. Consider mentioning nearby food options in your listing description.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}