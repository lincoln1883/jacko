import React from 'react';
import { Card, CardContent } from './card';
import { PortfolioImage as PortfolioImageInterface } from '../../types/profile';

interface PortfolioImageProps {
  image: PortfolioImageInterface;
}

export const PortfolioImage: React.FC<PortfolioImageProps> = ({ image }) => {
  return (
    <Card className="overflow-hidden rounded-lg shadow-sm">
      <img
        src={image.image_url}
        alt={image.image_alt_text || image.title || 'Portfolio image'}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground">{image.title}</h3>
        {image.description && (
          <p className="text-muted-foreground text-sm mt-1">
            {image.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
