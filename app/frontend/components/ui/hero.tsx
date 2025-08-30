import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Users, Wrench } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        {/* Icons */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
            <Wrench className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl">
            <Users className="w-8 h-8 text-accent-foreground" />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={primaryCta.href}
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200"
          >
            {primaryCta.text}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <Link
            href={secondaryCta.href}
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors duration-200"
          >
            {secondaryCta.text} <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-foreground">500+</div>
            <div className="text-sm text-muted-foreground">Tradespeople</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-foreground">1,200+</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-foreground">98%</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-foreground">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};
