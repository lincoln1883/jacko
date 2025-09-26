import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface CallToActionProps {
  title: string;
  subtitle: string;
  benefits: string[];
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton: {
    text: string;
    href: string;
  };
}

export const CallToAction: React.FC<CallToActionProps> = ({
  title,
  subtitle,
  benefits,
  primaryButton,
  secondaryButton,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Benefits list */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                <span className="text-white text-lg">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
            <Link
              href={primaryButton.href}
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline-offset-2 focus-visible:outline-blue-200 transition-all duration-200"
            >
              {primaryButton.text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
            <Link
              href={secondaryButton.href}
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white/50 px-6 py-3 text-base font-semibold text-white hover:border-white hover:bg-white/10 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
            >
              {secondaryButton.text}
            </Link>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
            <div className="bg-blue-800/20 border border-blue-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">Free</div>
              <div className="text-sm text-blue-100">To Join</div>
            </div>
            <div className="bg-blue-800/20 border border-blue-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">Secure</div>
              <div className="text-sm text-blue-100">Payments</div>
            </div>
            <div className="bg-blue-800/20 border border-blue-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">Verified</div>
              <div className="text-sm text-blue-100">Profiles</div>
            </div>
            <div className="bg-blue-800/20 border border-blue-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
