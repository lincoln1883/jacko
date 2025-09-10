import React, { useState, useCallback, useRef } from 'react';
import {
  Upload,
  X,
  Image,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

interface PortfolioImage {
  id: number;
  title: string;
  description: string;
  image_alt_text: string;
  display_order: number;
  active: boolean;
  file_size_mb: number;
  dimensions: {
    width: number;
    height: number;
    aspect_ratio: number;
  };
  image_urls: {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  created_at: string;
  updated_at: string;
}

interface UploadMeta {
  can_add_more: boolean;
  storage_used_mb: number;
  storage_limit_mb: number;
}

interface PortfolioUploadProps {
  portfolioImages: PortfolioImage[];
  meta: UploadMeta;
  onUpload: (files: FileList) => Promise<void>;
  onUpdate: (
    id: number,
    data: {
      title?: string;
      description?: string;
      image_alt_text?: string;
      active?: boolean;
    }
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onReorder: (imageIds: number[]) => Promise<void>;
  loading?: boolean;
  error?: string;
  className?: string;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

export const PortfolioUpload: React.FC<PortfolioUploadProps> = ({
  portfolioImages = [],
  meta,
  onUpload,
  onDelete,
  error,
  className,
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!meta.can_add_more) {
        setUploadState((prev) => ({
          ...prev,
          error: 'Portfolio image limit reached',
        }));
        return;
      }

      setUploadState({ uploading: true, progress: 0, error: null });

      try {
        await onUpload(files);
        setUploadState({ uploading: false, progress: 100, error: null });

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        setUploadState({
          uploading: false,
          progress: 0,
          error: err instanceof Error ? err.message : 'Upload failed',
        });
      }
    },
    [meta.can_add_more, onUpload]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        await handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        await handleFileUpload(e.target.files);
      }
    },
    [handleFileUpload]
  );

  const handleImageSelect = (id: number) => {
    setSelectedImages((prev) =>
      prev.includes(id)
        ? prev.filter((imageId) => imageId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;

    try {
      await Promise.all(selectedImages.map((id) => onDelete(id)));
      setSelectedImages([]);
    } catch (err) {
      console.error('Bulk delete failed:', err);
    }
  };

  const storagePercentage =
    (meta.storage_used_mb / meta.storage_limit_mb) * 100;

  return (
    <div className={cn('portfolio-upload space-y-6', className)}>
      {/* Upload Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Portfolio Images
          </h3>
          <div className="text-sm text-muted-foreground">
            {portfolioImages.length} images • {meta.storage_used_mb.toFixed(1)}
            MB / {meta.storage_limit_mb}MB used
          </div>
        </div>

        {/* Storage Usage Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Storage Usage</span>
            <span
              className={cn(
                'font-medium',
                storagePercentage > 90
                  ? 'text-red-600'
                  : storagePercentage > 70
                    ? 'text-amber-600'
                    : 'text-green-600'
              )}
            >
              {storagePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                storagePercentage > 90
                  ? 'bg-red-500'
                  : storagePercentage > 70
                    ? 'bg-amber-500'
                    : 'bg-green-500'
              )}
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Drop Zone */}
        {meta.can_add_more && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              className="hidden"
            />

            {uploadState.uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploading images...</p>
                  <div className="w-full bg-muted rounded-full h-2 max-w-xs mx-auto">
                    <div
                      className="h-2 bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    Drop images here or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPEG, PNG, and WebP files up to 10MB each
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            )}

            {uploadState.error && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{uploadState.error}</p>
              </div>
            )}
          </div>
        )}

        {!meta.can_add_more && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">
                Portfolio image limit reached
              </p>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              You can upload a maximum of 20 images. Delete some images to
              upload new ones.
            </p>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {portfolioImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              Your Portfolio ({portfolioImages.length})
            </h4>
            {selectedImages.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {selectedImages.length} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <X className="h-4 w-4 mr-1" />
                  Delete Selected
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolioImages.map((image) => (
              <div
                key={image.id}
                className={cn(
                  'group relative bg-card rounded-lg overflow-hidden border transition-all',
                  selectedImages.includes(image.id)
                    ? 'ring-2 ring-primary border-primary'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={image.image_urls.small}
                    alt={
                      image.image_alt_text || image.title || 'Portfolio image'
                    }
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleImageSelect(image.id)}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      {selectedImages.includes(image.id) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        window.open(image.image_urls.large, '_blank')
                      }
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Display Order */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{image.display_order}
                  </div>

                  {/* File Size */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {image.file_size_mb.toFixed(1)}MB
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-3">
                  <h5 className="font-medium text-sm truncate">
                    {image.title || 'Untitled'}
                  </h5>
                  {image.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  {image.dimensions && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {image.dimensions.width} × {image.dimensions.height}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm font-medium">Error</p>
          </div>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioUpload;
