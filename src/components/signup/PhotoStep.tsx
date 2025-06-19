
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, User, Loader2 } from 'lucide-react';

interface PhotoStepProps {
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (data: { profilePhoto?: File }) => void;
}

const PhotoStep = ({ onNext, onPrev, onUpdate }: PhotoStepProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    
    // Update parent component with the selected file
    onUpdate({ profilePhoto: file });
    
    setIsUploading(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setSelectedFile(null);
    onUpdate({ profilePhoto: undefined });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Add a Photo</h2>
        <p className="text-gray-600">Help other parents recognize you</p>
      </div>

      <Card className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage 
              src={previewUrl} 
              alt="Profile preview" 
              className="object-cover"
            />
            <AvatarFallback>
              <User className="w-12 h-12 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {!selectedFile ? (
            <Button 
              variant="outline" 
              onClick={handleUploadClick}
              disabled={isUploading}
              className="mb-4"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 mr-2" />
              )}
              {isUploading ? 'Processing...' : 'Upload Photo'}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleRemovePhoto}
                className="text-red-600 hover:text-red-700"
              >
                Remove Photo
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Optional - you can skip this step
        </p>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={onPrev}
          variant="outline"
          className="flex-1 py-6 text-lg"
        >
          Back
        </Button>
        
        <Button
          onClick={onNext}
          className="flex-1 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PhotoStep;
