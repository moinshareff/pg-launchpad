import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface RoomSharingStepProps {
  onDataChange: (data: any) => void;
  initialData: any;
}

const roomTypes = [
  { id: "single", label: "Single Occupancy", icon: "🛏️" },
  { id: "double", label: "Double Sharing", icon: "🛏️🛏️" },
  { id: "triple", label: "Triple Sharing", icon: "🛏️🛏️🛏️" },
  { id: "quad", label: "4+ Sharing", icon: "🛏️🛏️🛏️🛏️" },
];

const furnishingOptions = [
  { value: "furnished", label: "Fully Furnished" },
  { value: "semi-furnished", label: "Semi Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

const facilitiesOptions = [
  { id: "mattress", label: "Mattress", icon: "🛏️" },
  { id: "cupboard", label: "Cupboard", icon: "🗄️" },
  { id: "study_table", label: "Study Table", icon: "📚" },
  { id: "chair", label: "Chair", icon: "🪑" },
  { id: "balcony", label: "Balcony", icon: "🌅" },
  { id: "ac", label: "Air Conditioning", icon: "❄️" },
];

export function RoomSharingStep({ onDataChange, initialData }: RoomSharingStepProps) {
  const roomConfigs = initialData.roomConfigs || [];

  const addRoomType = (roomType: string) => {
    const newConfig = {
      type: roomType,
      bedsAvailable: 1,
      rentPerBed: "",
      attachedBath: false,
      furnishing: "",
      facilities: [],
    };
    
    onDataChange({
      ...initialData,
      roomConfigs: [...roomConfigs, newConfig],
    });
  };

  const removeRoomType = (index: number) => {
    const updatedConfigs = roomConfigs.filter((_: any, i: number) => i !== index);
    onDataChange({ ...initialData, roomConfigs: updatedConfigs });
  };

  const updateRoomConfig = (index: number, field: string, value: any) => {
    const updatedConfigs = roomConfigs.map((config: any, i: number) => 
      i === index ? { ...config, [field]: value } : config
    );
    onDataChange({ ...initialData, roomConfigs: updatedConfigs });
  };

  const toggleFacility = (roomIndex: number, facilityId: string) => {
    const config = roomConfigs[roomIndex];
    const facilities = config.facilities || [];
    const updatedFacilities = facilities.includes(facilityId)
      ? facilities.filter((f: string) => f !== facilityId)
      : [...facilities, facilityId];
    
    updateRoomConfig(roomIndex, "facilities", updatedFacilities);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              🛏️
            </div>
            Room Types & Sharing Options
          </CardTitle>
          <CardDescription>
            Configure the different room options you offer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {roomTypes.map((roomType) => {
              const isAdded = roomConfigs.some((config: any) => config.type === roomType.id);
              
              return (
                <Button
                  key={roomType.id}
                  variant={isAdded ? "default" : "outline"}
                  onClick={() => !isAdded && addRoomType(roomType.id)}
                  disabled={isAdded}
                  className="h-auto flex-col py-4 space-y-2"
                >
                  <span className="text-2xl">{roomType.icon}</span>
                  <span className="text-xs">{roomType.label}</span>
                  {isAdded && <span className="text-xs opacity-70">Added ✓</span>}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {roomConfigs.map((config: any, index: number) => {
        const roomType = roomTypes.find(rt => rt.id === config.type);
        
        return (
          <Card key={index}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-xl">{roomType?.icon}</span>
                  {roomType?.label}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeRoomType(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Beds Available *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={config.bedsAvailable || ""}
                    onChange={(e) => updateRoomConfig(index, "bedsAvailable", parseInt(e.target.value))}
                    placeholder="Number of beds"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rent per {config.type === "single" ? "Room" : "Bed"} *</Label>
                  <Input
                    type="number"
                    value={config.rentPerBed || ""}
                    onChange={(e) => updateRoomConfig(index, "rentPerBed", e.target.value)}
                    placeholder="Amount in ₹"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Furnishing Level *</Label>
                  <Select 
                    value={config.furnishing || ""} 
                    onValueChange={(value) => updateRoomConfig(index, "furnishing", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select furnishing" />
                    </SelectTrigger>
                    <SelectContent>
                      {furnishingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Attached Bathroom</Label>
                  <p className="text-sm text-muted-foreground">
                    Does this room type have attached bathroom?
                  </p>
                </div>
                <Switch
                  checked={config.attachedBath || false}
                  onCheckedChange={(checked) => updateRoomConfig(index, "attachedBath", checked)}
                />
              </div>

              <div className="space-y-3">
                <Label>Room Facilities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {facilitiesOptions.map((facility) => (
                    <div key={facility.id} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-primary/5 transition-fast">
                      <Checkbox
                        id={`${index}-${facility.id}`}
                        checked={(config.facilities || []).includes(facility.id)}
                        onCheckedChange={() => toggleFacility(index, facility.id)}
                      />
                      <Label
                        htmlFor={`${index}-${facility.id}`}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <span>{facility.icon}</span>
                        {facility.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {roomConfigs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-lg font-medium mb-2">No Room Types Added</h3>
            <p className="text-muted-foreground mb-4">
              Select room types above to start configuring your PG offerings
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}