import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { useToast } from '../contexts/ToastContext';
import { User, Upload, X, Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  currentThumbnailUrl?: string | null;
  onUploadSuccess: (avatarUrl: string, thumbnailUrl: string) => void;
  onDeleteSuccess: () => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  currentThumbnailUrl,
  onUploadSuccess,
  onDeleteSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const uploadAvatar = useCallback(
    async (file: File) => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const method = currentAvatarUrl ? 'PATCH' : 'POST';
        const response = await fetch('/avatar', {
          method,
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-Token':
              document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
                ?.content || '',
          },
        });

        const data = await response.json();

        if (data.success) {
          onUploadSuccess(data.avatar_url, data.avatar_thumbnail_url);
          setPreviewUrl(null);
          addToast({
            type: 'success',
            title: 'Success',
            message: data.message,
          });
        } else {
          addToast({
            type: 'error',
            title: 'Upload failed',
            message: data.errors?.[0] || 'Failed to upload avatar',
          });
          setPreviewUrl(null);
        }
      } catch {
        addToast({
          type: 'error',
          title: 'Upload failed',
          message: 'An error occurred while uploading the avatar',
        });
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
      }
    },
    [currentAvatarUrl, onUploadSuccess, addToast]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        addToast({
          type: 'error',
          title: 'Invalid file type',
          message: 'Please select a JPEG, PNG, or WebP image.',
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast({
          type: 'error',
          title: 'File too large',
          message: 'Please select an image smaller than 5MB.',
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      uploadAvatar(file);
    },
    [addToast, uploadAvatar]
  );

  const deleteAvatar = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch('/avatar', {
        method: 'DELETE',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token':
            document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
              ?.content || '',
        },
      });

      const data = await response.json();

      if (data.success) {
        onDeleteSuccess();
        addToast({
          type: 'success',
          title: 'Success',
          message: data.message,
        });
      } else {
        addToast({
          type: 'error',
          title: 'Delete failed',
          message: data.message || 'Failed to delete avatar',
        });
      }
    } catch {
      addToast({
        type: 'error',
        title: 'Delete failed',
        message: 'An error occurred while deleting the avatar',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const displayUrl = previewUrl || currentThumbnailUrl || currentAvatarUrl;
  const hasAvatar = Boolean(currentAvatarUrl) && !previewUrl;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div
          className={`relative inline-block group ${
            isDragOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Avatar Display */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
              {displayUrl ? (
                <img
                  src={displayUrl}
                  alt="Profile avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100">
                  <User className="w-16 h-16 text-blue-600" />
                </div>
              )}
            </div>

            {/* Upload Overlay */}
            {!isUploading && !isDeleting && (
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Loading Overlay */}
            {(isUploading || isDeleting) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={isUploading || isDeleting}
          className="flex items-center"
        >
          <Upload className="w-4 h-4 mr-2" />
          {hasAvatar ? 'Change Avatar' : 'Upload Avatar'}
        </Button>

        {hasAvatar && (
          <Button
            type="button"
            variant="outline"
            onClick={deleteAvatar}
            disabled={isUploading || isDeleting}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload Instructions */}
      <div className="text-center text-sm text-gray-600">
        <p>Drag and drop an image, or click to browse</p>
        <p className="text-xs">
          JPEG, PNG, or WebP • Max 5MB • Recommended: 150x150px
        </p>
      </div>
    </div>
  );
};
