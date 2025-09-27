import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AmenitiesStepProps {
  onDataChange: (data: any) => void;
  initialData: any;
}

const amenityCategories = [
  {
    title: "Connectivity & Technology",
    icon: "📡",
    amenities: [
      { id: "wifi", label: "WiFi Internet", icon: "📶" },
      { id: "tv", label: "Television", icon: "📺" },
      { id: "power_backup", label: "Power Backup", icon: "🔋" },
    ]
  },
  {
    title: "Water & Utilities",
    icon: "💧",
    amenities: [
      { id: "ro_water", label: "RO Water Purifier", icon: "💧" },
      { id: "geyser", label: "Hot Water/Geyser", icon: "🚿" },
      { id: "refrigerator", label: "Refrigerator", icon: "❄️" },
    ]
  },
  {
    title: "Housekeeping & Maintenance",
    icon: "🧹",
    amenities: [
      { id: "laundry", label: "Laundry Service", icon: "👔" },
      { id: "housekeeping", label: "Housekeeping", icon: "🧹" },
      { id: "maintenance", label: "24/7 Maintenance", icon: "🔧" },
    ]
  },
  {
    title: "Common Areas",
    icon: "🏢",
    amenities: [
      { id: "common_lounge", label: "Common Lounge", icon: "🛋️" },
      { id: "recreation_area", label: "Recreation Area", icon: "🎮" },
      { id: "gym", label: "Gym/Fitness Center", icon: "💪" },
      { id: "terrace", label: "Terrace Access", icon: "🌅" },
    ]
  },
  {
    title: "Parking & Mobility",
    icon: "🚗",
    amenities: [
      { id: "parking_2w", label: "Two Wheeler Parking", icon: "🏍️" },
      { id: "parking_4w", label: "Four Wheeler Parking", icon: "🚗" },
      { id: "lift", label: "Elevator/Lift", icon: "🛗" },
    ]
  },
  {
    title: "Security & Safety",
    icon: "🔒",
    amenities: [
      { id: "cctv", label: "CCTV Surveillance", icon: "📹" },
      { id: "biometric", label: "Biometric Access", icon: "👆" },
      { id: "security_guard", label: "Security Guard", icon: "👮" },
      { id: "fire_safety", label: "Fire Safety Equipment", icon: "🧯" },
    ]
  }
];

export function AmenitiesStep({ onDataChange, initialData }: AmenitiesStepProps) {
  const selectedAmenities = initialData.amenities || [];

  const toggleAmenity = (amenityId: string) => {
    const updatedAmenities = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter((id: string) => id !== amenityId)
      : [...selectedAmenities, amenityId];
    
    onDataChange({ ...initialData, amenities: updatedAmenities });
  };

  const selectAllInCategory = (categoryAmenities: any[]) => {
    const categoryIds = categoryAmenities.map(a => a.id);
    const allSelected = categoryIds.every(id => selectedAmenities.includes(id));
    
    if (allSelected) {
      // Deselect all in category
      const updatedAmenities = selectedAmenities.filter((id: string) => !categoryIds.includes(id));
      onDataChange({ ...initialData, amenities: updatedAmenities });
    } else {
      // Select all in category
      const newAmenities = [...new Set([...selectedAmenities, ...categoryIds])];
      onDataChange({ ...initialData, amenities: newAmenities });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              ⭐
            </div>
            Amenities & Facilities
          </CardTitle>
          <CardDescription>
            Select all the amenities and facilities available at your PG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-primary">
              💡 <strong>Tip:</strong> More amenities make your PG more attractive to potential residents. 
              Select all that apply to get better visibility.
            </p>
          </div>
        </CardContent>
      </Card>

      {amenityCategories.map((category, categoryIndex) => {
        const categoryIds = category.amenities.map(a => a.id);
        const selectedInCategory = categoryIds.filter(id => selectedAmenities.includes(id)).length;
        const allSelected = selectedInCategory === categoryIds.length;
        const someSelected = selectedInCategory > 0 && selectedInCategory < categoryIds.length;

        return (
          <Card key={categoryIndex}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-xl">{category.icon}</span>
                  {category.title}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({selectedInCategory}/{categoryIds.length})
                  </span>
                </CardTitle>
                <button
                  onClick={() => selectAllInCategory(category.amenities)}
                  className="text-sm text-primary hover:text-primary-dark transition-fast"
                >
                  {allSelected ? "Deselect All" : "Select All"}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.amenities.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity.id);
                  
                  return (
                    <div
                      key={amenity.id}
                      className={`flex items-center space-x-3 border rounded-lg p-3 transition-fast cursor-pointer ${
                        isSelected 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'hover:bg-primary/5 border-border'
                      }`}
                      onClick={() => toggleAmenity(amenity.id)}
                    >
                      <Checkbox
                        id={amenity.id}
                        checked={isSelected}
                        onChange={() => {}} // Handled by parent div click
                      />
                      <Label
                        htmlFor={amenity.id}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <span className="text-lg">{amenity.icon}</span>
                        {amenity.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-lg font-medium mb-2">
              {selectedAmenities.length} Amenities Selected
            </h3>
            <p className="text-muted-foreground">
              {selectedAmenities.length === 0 && "Select amenities to make your PG more attractive"}
              {selectedAmenities.length > 0 && selectedAmenities.length < 5 && "Good start! Consider adding more amenities for better visibility"}
              {selectedAmenities.length >= 5 && selectedAmenities.length < 10 && "Great! Your PG offers good facilities"}
              {selectedAmenities.length >= 10 && "Excellent! Your PG offers comprehensive facilities"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}