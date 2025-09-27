import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PricingStepProps {
  onDataChange: (data: any) => void;
  initialData: any;
}

const advanceOptions = [
  { value: "1-month", label: "1 Month Advance" },
  { value: "2-months", label: "2 Months Advance" },
  { value: "3-months", label: "3 Months Advance" },
  { value: "custom", label: "Custom Amount" },
];

export function PricingStep({ onDataChange, initialData }: PricingStepProps) {
  const handleInputChange = (field: string, value: any) => {
    onDataChange({ ...initialData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              💰
            </div>
            Pricing Structure
          </CardTitle>
          <CardDescription>
            Set your pricing and deposit requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                <Input
                  id="securityDeposit"
                  type="number"
                  placeholder="25000"
                  className="pl-8"
                  value={initialData.securityDeposit || ""}
                  onChange={(e) => handleInputChange("securityDeposit", e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Refundable security amount
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenanceCharges">Maintenance Charges</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                <Input
                  id="maintenanceCharges"
                  type="number"
                  placeholder="1000"
                  className="pl-8"
                  value={initialData.maintenanceCharges || ""}
                  onChange={(e) => handleInputChange("maintenanceCharges", e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Monthly maintenance (if any)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Advance Payment Terms *</Label>
            <RadioGroup
              value={initialData.advancePayment || ""}
              onValueChange={(value) => handleInputChange("advancePayment", value)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {advanceOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-fast">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {initialData.advancePayment === "custom" && (
              <div className="mt-3 space-y-2">
                <Label htmlFor="customAdvance">Custom Advance Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                  <Input
                    id="customAdvance"
                    type="number"
                    placeholder="30000"
                    className="pl-8"
                    value={initialData.customAdvance || ""}
                    onChange={(e) => handleInputChange("customAdvance", e.target.value)}
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
            <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
              ⚡
            </div>
            Utility Charges
          </CardTitle>
          <CardDescription>
            Specify how electricity and water charges are handled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Electricity Charges *</Label>
              <RadioGroup
                value={initialData.electricityCharges || ""}
                onValueChange={(value) => handleInputChange("electricityCharges", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-fast">
                  <RadioGroupItem value="included" id="elect-included" />
                  <Label htmlFor="elect-included" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <span>⚡</span>
                      <div>
                        <div className="font-medium">Included in Rent</div>
                        <div className="text-sm text-muted-foreground">No extra electricity charges</div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-fast">
                  <RadioGroupItem value="extra" id="elect-extra" />
                  <Label htmlFor="elect-extra" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <span>💡</span>
                      <div>
                        <div className="font-medium">Extra as per Usage</div>
                        <div className="text-sm text-muted-foreground">Charged based on meter reading</div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-fast">
                  <RadioGroupItem value="fixed" id="elect-fixed" />
                  <Label htmlFor="elect-fixed" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <span>📊</span>
                      <div>
                        <div className="font-medium">Fixed Monthly Amount</div>
                        <div className="text-sm text-muted-foreground">Fixed electricity charge per month</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              
              {initialData.electricityCharges === "fixed" && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="fixedElectAmount">Fixed Monthly Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                    <Input
                      id="fixedElectAmount"
                      type="number"
                      placeholder="500"
                      className="pl-8"
                      value={initialData.fixedElectricityAmount || ""}
                      onChange={(e) => handleInputChange("fixedElectricityAmount", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Water Charges *</Label>
              <RadioGroup
                value={initialData.waterCharges || ""}
                onValueChange={(value) => handleInputChange("waterCharges", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-fast">
                  <RadioGroupItem value="included" id="water-included" />
                  <Label htmlFor="water-included" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <span>💧</span>
                      <div>
                        <div className="font-medium">Included in Rent</div>
                        <div className="text-sm text-muted-foreground">No extra water charges</div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-fast">
                  <RadioGroupItem value="extra" id="water-extra" />
                  <Label htmlFor="water-extra" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <span>🚰</span>
                      <div>
                        <div className="font-medium">Extra as per Usage</div>
                        <div className="text-sm text-muted-foreground">Charged based on usage</div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-fast">
                  <RadioGroupItem value="fixed" id="water-fixed" />
                  <Label htmlFor="water-fixed" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <span>📊</span>
                      <div>
                        <div className="font-medium">Fixed Monthly Amount</div>
                        <div className="text-sm text-muted-foreground">Fixed water charge per month</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              
              {initialData.waterCharges === "fixed" && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="fixedWaterAmount">Fixed Monthly Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                    <Input
                      id="fixedWaterAmount"
                      type="number"
                      placeholder="200"
                      className="pl-8"
                      value={initialData.fixedWaterAmount || ""}
                      onChange={(e) => handleInputChange("fixedWaterAmount", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              📜
            </div>
            Refund & Cancellation Policy
          </CardTitle>
          <CardDescription>
            Define your refund and cancellation terms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="refundPolicy">Refund Policy *</Label>
            <Textarea
              id="refundPolicy"
              placeholder="e.g., Security deposit will be refunded within 30 days after checkout, subject to deductions for damages if any..."
              rows={4}
              value={initialData.refundPolicy || ""}
              onChange={(e) => handleInputChange("refundPolicy", e.target.value)}
            />
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">💡 Refund Policy Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Specify exact timeline for deposit refund</li>
              <li>• Mention any deductions for damages/cleaning</li>
              <li>• Include notice period requirements</li>
              <li>• Be clear about non-refundable fees</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}