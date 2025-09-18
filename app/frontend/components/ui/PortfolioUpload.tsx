import React, { useState, useCallback, useRef } from 'react';
import { Button } from './button';
import { useToast } from '../../contexts/ToastContext';
import {
  Loader2,
  Image as ImageIcon,
  Edit,
  Trash2,
  Maximize,
} from 'lucide-react';

interface PortfolioImage {
  id: number;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  file_size_mb: number;
  image_alt_text: string;
  active: boolean;
  position: number;
}

interface PortfolioMeta {
  can_add_more: boolean;
  storage_used_mb: number;
  storage_limit_mb: number;
}

interface PortfolioUploadProps {
  portfolioImages: PortfolioImage[];
  meta: PortfolioMeta;
  onUpload: (files: FileList) => Promise<void>;
  onUpdate: (id: number, data: Partial<PortfolioImage>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onReorder: (imageIds: number[]) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

export const PortfolioUpload: React.FC<PortfolioUploadProps> = ({
  portfolioImages,
  meta,
  onUpload,
  onUpdate,
  onDelete,
  onReorder,
  loading,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const [isDragOver, setIsDragOver] = useState(false);
  const [editImageId, setEditImageId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAltText, setEditAltText] = useState('');

  const handleFileSelect = useCallback(
    (files: FileList) => {
      if (!files || files.length === 0) return;

      const filesToUpload = Array.from(files).filter((file) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          addToast({
            type: 'error',
            title: 'Invalid file type',
            message: `File ${file.name}: Only JPEG, PNG, or WebP images are allowed.`,
          });
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          // Max 5MB per file
          addToast({
            type: 'error',
            title: 'File too large',
            message: `File ${file.name}: Max 5MB per image.`,
          });
          return false;
        }
        return true;
      });

      if (filesToUpload.length > 0) {
        onUpload(filesToUpload as unknown as FileList)
          .then(() => {
            addToast({
              type: 'success',
              title: 'Upload successful',
              message: 'Images uploaded successfully.',
            });
          })
          .catch((err) => {
            addToast({
              type: 'error',
              title: 'Upload failed',
              message: err.message || 'Failed to upload images.',
            });
          });
      }
    },
    [onUpload, addToast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
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
    if (e.target.files) {
      handleFileSelect(e.target.files);
      e.target.value = ''; // Clear the input after selection
    }
  };

  const triggerFileInput = () => {
    if (meta.can_add_more) {
      fileInputRef.current?.click();
    } else {
      addToast({
        type: 'info',
        title: 'Limit Reached',
        message: `You can upload a maximum of ${meta.storage_limit_mb}MB of portfolio images.`,
      });
    }
  };

  const startEdit = (image: PortfolioImage) => {
    setEditImageId(image.id);
    setEditTitle(image.title);
    setEditDescription(image.description);
    setEditAltText(image.image_alt_text);
  };

  const cancelEdit = () => {
    setEditImageId(null);
    setEditTitle('');
    setEditDescription('');
    setEditAltText('');
  };

  const saveEdit = async () => {
    if (editImageId === null) return;

    try {
      await onUpdate(editImageId, {
        title: editTitle,
        description: editDescription,
        image_alt_text: editAltText,
      });
      cancelEdit();
      addToast({
        type: 'success',
        title: 'Update Successful',
        message: 'Image details updated.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: (err as Error).message || 'Failed to update image details.',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await onDelete(id);
        addToast({
          type: 'success',
          title: 'Delete Successful',
          message: 'Image deleted.',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: (err as Error).message || 'Failed to delete image.',
        });
      }
    }
  };

  // Basic drag and drop for reordering (visual only for now, backend `onReorder` needs proper implementation)
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDragOverReorder = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropReorder = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    const draggedId = Number(e.dataTransfer.getData('text/plain'));
    const draggedImage = portfolioImages.find((img) => img.id === draggedId);
    const targetImage = portfolioImages.find((img) => img.id === targetId);

    if (draggedImage && targetImage) {
      const newOrder = [...portfolioImages];
      const draggedIndex = newOrder.indexOf(draggedImage);
      const targetIndex = newOrder.indexOf(targetImage);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedImage);

      onReorder(newOrder.map((img) => img.id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Portfolio Images
      </h2>
      <p className="text-sm text-muted-foreground">
        Showcase your best work. Upload images of your completed projects.
      </p>

      {error && (
        <div className="text-red-500 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
        {loading && !isDragOver ? (
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
            <p className="text-gray-700 font-medium">
              Drag and drop images here, or
              <Button
                type="button"
                variant="link"
                onClick={triggerFileInput}
                className="p-0 h-auto align-baseline leading-none"
                disabled={!meta.can_add_more}
              >
                click to browse
              </Button>
            </p>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP up to 5MB each. Max {meta.storage_limit_mb}MB
              total. ({meta.storage_used_mb}MB used).
            </p>
            {!meta.can_add_more && (
              <p className="text-sm text-red-500 mt-2">
                Storage limit reached. Cannot upload more images.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Portfolio Gallery */}
      {portfolioImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {portfolioImages.map((image) => (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, image.id)}
              onDragOver={handleDragOverReorder}
              onDrop={(e) => handleDropReorder(e, image.id)}
              className="relative group overflow-hidden rounded-lg border bg-card aspect-square"
            >
              <img
                src={image.thumbnail_url || image.image_url}
                alt={image.image_alt_text || image.title || 'Portfolio image'}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center space-x-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => startEdit(image)}
                  title="Edit details"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(image.id)}
                  title="Delete image"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {/* Optional: Full size view */}
                <a
                  href={image.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    title="View full size"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </a>
              </div>
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-sm font-medium truncate">
                  {image.title}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Image Modal (simplified, could be a proper dialog) */}
      {editImageId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Image Details</h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground">
                  Title
                </span>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground">
                  Description
                </span>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                ></textarea>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-muted-foreground">
                  Alt Text
                </span>
                <input
                  type="text"
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
              </label>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button onClick={saveEdit}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
