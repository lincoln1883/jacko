import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'default' | 'highlighted';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  variant = 'default',
}) => {
  const cardClasses =
    variant === 'highlighted'
      ? 'relative group p-8 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl hover:border-primary/30 transition-all duration-300 hover:scale-105'
      : 'relative group p-8 bg-card border border-border rounded-2xl hover:border-border/80 transition-all duration-300 hover:scale-105';

  const iconClasses =
    variant === 'highlighted'
      ? 'w-12 h-12 text-primary mb-4'
      : 'w-12 h-12 text-muted-foreground group-hover:text-primary mb-4 transition-colors duration-300';

  return (
    <div className={cardClasses}>
      {variant === 'highlighted' && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Popular
          </div>
        </div>
      )}

      <Icon className={iconClasses} />
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
