import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Upload, Camera, X, Loader2, Check } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import apiClient from '../services/api';

const PhotoUpload = ({ currentAvatar, onUploadSuccess, userName }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const validateFile = (file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPEG, PNG, GIF, or WebP)",
        variant: "destructive"
      });
      return false;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const uploadFile = async (file) => {
    if (!validateFile(file)) return;

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to backend
      const response = await apiClient.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const fullAvatarUrl = `${process.env.REACT_APP_BACKEND_URL}${response.data.avatar_url}`;
        setPreviewUrl(fullAvatarUrl);
        onUploadSuccess(fullAvatarUrl);
        
        toast({
          title: "🎩 Photo Uploaded!",
          description: "Your magical avatar has been updated successfully."
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.response?.data?.detail || "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>Profile Photo</Label>
      
      {/* Current Avatar Display */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20 border-4 border-[#BE5F93]/20">
          <AvatarImage src={previewUrl} alt={userName} />
          <AvatarFallback className="bg-[#BE5F93]/10 text-[#BE5F93] text-2xl">
            {userName?.charAt(0) || 'M'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">
            Upload a new profile photo. Images will be resized to 300x300 pixels.
          </p>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileSelect}
              disabled={isUploading}
              className="border-[#BE5F93]/20 hover:border-[#BE5F93]/40"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Choose Photo
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-[#BE5F93] bg-[#BE5F93]/5'
            : 'border-gray-300 hover:border-[#BE5F93]/40'
        } ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileSelect}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#BE5F93] mb-2" />
            <p className="text-sm text-gray-600">Uploading your magical photo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-[#BE5F93]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              JPEG, PNG, GIF, or WebP (max 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default PhotoUpload;