import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle, AlertCircle, MapPin, Users, Utensils, Star } from "lucide-react";

interface PreviewStepProps {
  // Support both prop styles
  data?: any;
  onEdit?: (step: number) => void;
  onSubmit?: () => void;
  listingData?: any;
}

export function PreviewStep({ data, onEdit, onSubmit, listingData }: PreviewStepProps) {
  const theData = data ?? listingData ?? {};

  const getStepCompletionStatus = () => {
    const d = theData as any;
    const checks = [
      { step: 1, name: "General Info", complete: d.pgName && d.pgType && d.location },
      { step: 2, name: "Room Config", complete: d.roomConfigs && d.roomConfigs.length > 0 },
      { step: 3, name: "Food Options", complete: d.foodType },
      { step: 4, name: "Amenities", complete: d.amenities && d.amenities.length > 0 },
      { step: 5, name: "Pricing", complete: d.securityDeposit && d.advancePayment },
      { step: 6, name: "Rules", complete: d.curfewPolicy && d.visitorPolicy },
      { step: 7, name: "Media", complete: d.photos && Object.values(d.photos).some((arr: any) => (arr as any[]).length > 0) },
    ];
    return checks;
  };

  const completionStatus = getStepCompletionStatus();
  const completedSteps = completionStatus.filter((s) => s.complete).length;
  const totalSteps = completionStatus.length;
  const isComplete = completedSteps === totalSteps;

  const getMainPhoto = () => {
    if (!theData.photos) return null;
    for (const category of Object.values(theData.photos) as any[]) {
      if (Array.isArray(category) && category.length > 0) return category[0].url;
    }
    return null;
  };

  const formatPrice = (amount: string | number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(amount || 0));

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <Card className={isComplete ? "border-success" : "border-warning"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isComplete ? (
              <>
                <CheckCircle className="h-6 w-6 text-success" />
                Ready to Submit
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-warning" />
                Incomplete Sections
              </>
            )}
          </CardTitle>
          <CardDescription>
            {completedSteps}/{totalSteps} sections completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {completionStatus.map((step) => {
              const panelClass = step.complete
                ? "flex items-center justify-between p-3 rounded-lg border bg-success/5 border-success/40"
                : "flex items-center justify-between p-3 rounded-lg border bg-white border-warning/40 border-l-4 pl-3";
              return (
                <div key={step.step} className={panelClass}>
                  <span className="text-sm font-medium">{step.name}</span>
                  <div className="flex items-center gap-2">
                    {step.complete ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      onEdit && (
                        <Button variant="outline" size="sm" onClick={() => onEdit(step.step)} className="h-6 px-2 text-xs">
                          Edit
                        </Button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Listing Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              👁️
            </div>
            Listing Preview
          </CardTitle>
          <CardDescription>
            This is how your listing will appear to potential residents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-card">
            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              {getMainPhoto() && (
                <div className="lg:w-1/3">
                  <img
                    src={getMainPhoto()}
                    alt={data.pgName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{data.pgName || "PG Name"}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{data.location || "Location"}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {data.pgType?.replace('-', ' ') || "Type"}
                  </Badge>
                  {data.foodType && data.foodType !== "no-food" && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Utensils className="h-3 w-3" />
                      Food Available
                    </Badge>
                  )}
                  {data.amenities && data.amenities.includes("wifi") && (
                    <Badge variant="outline">WiFi</Badge>
                  )}
                  {data.amenities && data.amenities.includes("parking_2w") && (
                    <Badge variant="outline">Parking</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Room Options */}
            {data.roomConfigs && data.roomConfigs.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Room Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.roomConfigs.map((room: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium capitalize">{room.type} Sharing</h4>
                        <Badge variant="secondary">{room.attachedBath ? "Attached Bath" : "Common Bath"}</Badge>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(room.rentPerBed)}/month
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {room.bedsAvailable} beds available • {room.furnishing}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities Preview */}
            {data.amenities && data.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {data.amenities.slice(0, 10).map((amenity: string) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity.replace('_', ' ')}
                    </Badge>
                  ))}
                  {data.amenities.length > 10 && (
                    <Badge variant="outline" className="text-xs">
                      +{data.amenities.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Pricing</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {data.securityDeposit && (
                  <div>
                    <div className="text-muted-foreground">Security Deposit</div>
                    <div className="font-medium">{formatPrice(data.securityDeposit)}</div>
                  </div>
                )}
                {data.advancePayment && (
                  <div>
                    <div className="text-muted-foreground">Advance</div>
                    <div className="font-medium">{data.advancePayment.replace('-', ' ')}</div>
                  </div>
                )}
                {data.electricityCharges && (
                  <div>
                    <div className="text-muted-foreground">Electricity</div>
                    <div className="font-medium capitalize">{data.electricityCharges}</div>
                  </div>
                )}
                {data.waterCharges && (
                  <div>
                    <div className="text-muted-foreground">Water</div>
                    <div className="font-medium capitalize">{data.waterCharges}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
              🚀
            </div>
            Submit for Review
          </CardTitle>
          <CardDescription>
            Your listing will be reviewed by our team before going live
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Our team will review your listing within 24-48 hours</li>
              <li>• We'll verify your documents and photos</li>
              <li>• Once approved, your listing will go live</li>
              <li>• You'll receive notifications when residents show interest</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => onEdit(1)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!isComplete}
              className="flex-1 bg-gradient-primary"
            >
              {isComplete ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit for Approval
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Complete All Sections
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}