import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image, Video, Camera } from "lucide-react";

interface MediaUploadStepProps {
  // Support both the old and new prop styles
  data?: any;
  onUpdate?: (data: any) => void;
  initialData?: any;
  onDataChange?: (data: any) => void;
}

const photoCategories = [
  { id: "rooms", label: "Room Photos", icon: "🛏️", required: true, minPhotos: 2 },
  { id: "bathrooms", label: "Bathroom Photos", icon: "🚿", required: true, minPhotos: 1 },
  { id: "common", label: "Common Areas", icon: "🏢", required: true, minPhotos: 1 },
  { id: "kitchen", label: "Kitchen/Mess", icon: "🍽️", required: false, minPhotos: 1 },
  { id: "exterior", label: "Building Exterior", icon: "🏠", required: true, minPhotos: 1 },
];

export function MediaUploadStep({ data, onUpdate, initialData, onDataChange }: MediaUploadStepProps) {
  const theData = initialData ?? data ?? {};
  const update = (payload: any) => (onDataChange ?? onUpdate)?.(payload);

  const [dragOver, setDragOver] = useState<string | null>(null);
  
  const photos: Record<string, any[]> = theData.photos || {};
  const videos: any[] = theData.videos || [];

  const handlePhotoUpload = (categoryId: string, files: FileList) => {
    const newPhotos = { ...photos } as Record<string, any[]>;
    if (!newPhotos[categoryId]) newPhotos[categoryId] = [];
    
    // Simulate file upload (in real app, upload to cloud storage)
    Array.from(files).forEach((file) => {
      const mockUrl = URL.createObjectURL(file);
      newPhotos[categoryId].push({ id: Date.now() + Math.random(), url: mockUrl, name: file.name, size: file.size });
    });
    
    update({ ...theData, photos: newPhotos });
  };

  const removePhoto = (categoryId: string, photoId: number) => {
    const newPhotos = { ...photos } as Record<string, any[]>;
    newPhotos[categoryId] = newPhotos[categoryId].filter((p: any) => p.id !== photoId);
    update({ ...theData, photos: newPhotos });
  };

  const handleVideoUpload = (files: FileList) => {
    const newVideos = [...videos];
    Array.from(files).forEach((file) => {
      const mockUrl = URL.createObjectURL(file);
      newVideos.push({ id: Date.now() + Math.random(), url: mockUrl, name: file.name, size: file.size, type: file.type });
    });
    update({ ...theData, videos: newVideos });
  };

  const removeVideo = (videoId: number) => {
    const newVideos = videos.filter((v: any) => v.id !== videoId);
    update({ ...theData, videos: newVideos });
  };

  const getTotalPhotos = (): number => {
    return Object.values(photos).reduce((total: number, categoryPhotos: any[]) => total + (categoryPhotos?.length || 0), 0);
  };

  const getRequiredPhotosStatus = (): { total: number; completed: number } => {
    const requiredCategories = photoCategories.filter((cat) => cat.required);
    const completedRequired = requiredCategories.filter((cat) => {
      const categoryPhotos = photos[cat.id];
      return Array.isArray(categoryPhotos) && categoryPhotos.length >= cat.minPhotos;
    });
    return { total: requiredCategories.length, completed: completedRequired.length };
  };

  const requiredStatus = getRequiredPhotosStatus();
  const totalPhotos = getTotalPhotos();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              📸
            </div>
            Photo Upload
          </CardTitle>
          <CardDescription>
            Upload high-quality photos of your PG (minimum 5 photos required)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Upload Progress</span>
              <span className="text-sm text-muted-foreground">
                {totalPhotos}/5 minimum • {requiredStatus.completed}/{requiredStatus.total} required categories
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-smooth"
                style={{ width: `${Math.min((totalPhotos / 5) * 100, 100)}%` }}
              />
            </div>
            {totalPhotos >= 5 && requiredStatus.completed === requiredStatus.total && (
              <p className="text-success text-sm mt-2">✅ All requirements met!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {photoCategories.map((category) => {
        const categoryPhotos = photos[category.id] || [];
        const isComplete = categoryPhotos.length >= category.minPhotos;
        
        return (
          <Card key={category.id}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  {category.label}
                  {category.required && <span className="text-destructive text-sm">*</span>}
                </div>
                <span className={`text-sm ${isComplete ? 'text-success' : 'text-muted-foreground'}`}>
                  {categoryPhotos.length}/{category.minPhotos} min
                  {isComplete && " ✓"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-fast cursor-pointer ${
                  dragOver === category.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:bg-muted/50'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(category.id);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  if (e.dataTransfer.files.length > 0) {
                    handlePhotoUpload(category.id, e.dataTransfer.files);
                  }
                }}
              >
                <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop photos here or click to upload
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) handlePhotoUpload(category.id, files);
                    };
                    input.click();
                  }}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Choose Photos
                </Button>
              </div>
              
              {categoryPhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {categoryPhotos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-fast"
                        onClick={() => removePhoto(category.id, photo.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs p-1 rounded truncate">
                        {photo.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
              🎥
            </div>
            Video Tour (Optional)
          </CardTitle>
          <CardDescription>
            Upload a video tour or 360° view of your PG for better engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-fast cursor-pointer ${
              dragOver === 'video' 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:bg-muted/50'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver('video');
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(null);
              if (e.dataTransfer.files.length > 0) {
                handleVideoUpload(e.dataTransfer.files);
              }
            }}
          >
            <Video className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drop video files here or click to upload
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'video/*';
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) handleVideoUpload(files);
                };
                input.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Videos
            </Button>
          </div>
          
          {videos.length > 0 && (
            <div className="space-y-3 mt-4">
              {videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Video className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{video.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(video.size / (1024 * 1024)).toFixed(1)} MB
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeVideo(video.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl mb-2">📷</div>
            <h3 className="text-lg font-medium mb-2">
              Media Upload Tips
            </h3>
            <div className="text-left max-w-md mx-auto">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use good lighting and clear, high-resolution photos</li>
                <li>• Show rooms from multiple angles</li>
                <li>• Include photos of amenities and common areas</li>
                <li>• Keep photos recent and accurately represent current state</li>
                <li>• Videos should be under 50MB for best performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}