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
      ? 'relative group p-8 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:border-blue-300 transition-all duration-300 hover:scale-105'
      : 'relative group p-8 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all duration-300 hover:scale-105';

  const iconClasses =
    variant === 'highlighted'
      ? 'w-12 h-12 text-blue-600 mb-4'
      : 'w-12 h-12 text-gray-600 group-hover:text-blue-600 mb-4 transition-colors duration-300';

  return (
    <div className={cardClasses}>
      {variant === 'highlighted' && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Popular
          </div>
        </div>
      )}

      <Icon className={iconClasses} />
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
