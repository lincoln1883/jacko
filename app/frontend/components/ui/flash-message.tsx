import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from './alert';
import { Button } from './button';
import type { FlashMessage } from '../../types/auth';

interface FlashMessageProps {
  flash: FlashMessage;
  autoHide?: boolean;
  duration?: number;
}

export const FlashMessageComponent: React.FC<FlashMessageProps> = ({
  flash,
  autoHide = true,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  if (!isVisible) return null;

  const getVariant = () => {
    switch (flash.type) {
      case 'notice':
        return 'success' as const;
      case 'alert':
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  const getIcon = () => {
    switch (flash.type) {
      case 'notice':
        return <CheckCircle className="h-4 w-4" />;
      case 'alert':
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-4 relative">
      {getIcon()}
      <AlertDescription className="pr-8">{flash.message}</AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </Alert>
  );
};
