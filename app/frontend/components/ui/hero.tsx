import React from 'react';
import { Link } from '@inertiajs/react';
import HeroWorkersImage from '../../assets/images/hero-workers.jpeg';
import HeroWorkersImage320 from '../../assets/images/hero-workers-320.jpg';
import HeroWorkersImage640 from '../../assets/images/hero-workers-640.jpg';
import HeroWorkersImage1024 from '../../assets/images/hero-workers-1024.jpg';

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
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 min-h-[500px] flex items-center justify-center">
      {/* Background image */}
      <picture>
        <source media="(max-width: 320px)" srcSet={HeroWorkersImage320} />
        <source media="(max-width: 640px)" srcSet={HeroWorkersImage640} />
        <source media="(max-width: 1024px)" srcSet={HeroWorkersImage1024} />
        <img
          src={HeroWorkersImage}
          alt="Construction workers at a job site"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      </picture>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        {/* Main heading */}
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white opacity-90">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={primaryCta.href}
            className="group inline-flex items-center gap-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline-offset-2 focus-visible:outline-blue-200 transition-all duration-200"
          >
            {primaryCta.text}
            {/* <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" /> */}
          </Link>
          <Link
            href={secondaryCta.href}
            className="text-sm font-semibold leading-6 text-white hover:text-blue-200 transition-colors duration-200"
          >
            {secondaryCta.text} <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-sm text-blue-100">Tradespeople</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-white">1,200+</div>
            <div className="text-sm text-blue-100">Projects</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-sm text-blue-100">Satisfaction</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-sm text-blue-100">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};
