import React from 'react';
import { GuestLayout } from '../../components/layouts/GuestLayout';
import { Hero } from '../../components/ui/hero';
import { FeatureCard } from '../../components/ui/feature-card';
import { CallToAction } from '../../components/ui/call-to-action';
import {
  Search,
  Shield,
  Clock,
  Star,
  MessageCircle,
  CreditCard,
  Users,
  Wrench,
  Home,
  Zap,
} from 'lucide-react';

const Landing: React.FC = () => {
  // Features for tradespeople
  const tradespeopleFeatures = [
    {
      icon: Search,
      title: 'Get Found by Clients',
      description:
        'Create a professional profile and get discovered by clients looking for your specific skills and expertise.',
    },
    {
      icon: Shield,
      title: 'Verified Projects',
      description:
        'All projects are verified and clients are screened to ensure quality opportunities for your business.',
      variant: 'highlighted' as const,
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description:
        'Get paid safely and on time through our secure payment system with built-in dispute protection.',
    },
  ];

  // Features for clients
  const clientFeatures = [
    {
      icon: Star,
      title: 'Quality Professionals',
      description:
        'Find verified, skilled tradespeople with ratings and reviews from previous clients.',
    },
    {
      icon: Clock,
      title: 'Quick Responses',
      description:
        'Get quotes and responses from multiple professionals within hours, not days.',
      variant: 'highlighted' as const,
    },
    {
      icon: MessageCircle,
      title: 'Easy Communication',
      description:
        'Chat directly with professionals, share photos, and track project progress in one place.',
    },
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      icon: Users,
      title: 'Create Your Profile',
      description:
        'Sign up and create a detailed profile showcasing your skills or project needs.',
    },
    {
      icon: Search,
      title: 'Find Perfect Matches',
      description:
        'Search and connect with the right professionals or clients in your area.',
    },
    {
      icon: Wrench,
      title: 'Get Work Done',
      description:
        'Collaborate, communicate, and complete projects with confidence and security.',
    },
  ];

  return (
    <GuestLayout title="Jacko - Connect with Skilled Professionals">
      {/* Hero Section */}
      <Hero
        title="Connect with Skilled Tradespeople"
        subtitle="Whether you're a skilled professional looking for work or a client needing quality services, Jacko makes it simple to connect, collaborate, and get the job done right."
        primaryCta={{
          text: 'Get Started Today',
          href: '/sign_up',
        }}
        secondaryCta={{
          text: 'Learn more',
          href: '#features',
        }}
      />

      {/* Features for Tradespeople */}
      <div id="features" className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Wrench className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                For Tradespeople
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Grow your business with a professional platform designed for
              skilled tradespeople
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tradespeopleFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                variant={feature.variant}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features for Clients */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Home className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                For Clients
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the right professional for your project with confidence and
              ease
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {clientFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                variant={feature.variant}
              />
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How It Works
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started is simple. Follow these three easy steps to begin
              your journey
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Step content */}
                <div className="bg-card border border-border rounded-2xl p-8 pt-12 hover:border-primary/30 transition-colors duration-300">
                  <step.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-16">
                    <div className="h-0.5 bg-gradient-to-r from-primary to-primary/30"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Trusted by Professionals and Clients
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our community has to say about their experience with
              Jacko
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;Jacko helped me find consistent work and grow my plumbing
                business. The clients are serious and the payment system is
                reliable.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">JM</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    John Mitchell
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Licensed Plumber
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-primary/20 rounded-2xl p-8 relative">
              <div className="absolute -top-2 -right-2">
                <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </div>
              </div>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;Found an amazing electrician through Jacko for our home
                renovation. Professional, punctual, and excellent quality
                work.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-accent-foreground font-semibold">
                    SM
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Sarah Martinez
                  </div>
                  <div className="text-xs text-muted-foreground">Homeowner</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;As a carpenter, Jacko has connected me with clients who
                value quality craftsmanship. The platform is easy to use and
                professional.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-secondary-foreground font-semibold">
                    RT
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Robert Taylor
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Master Carpenter
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <CallToAction
        title="Ready to Get Started?"
        subtitle="Join thousands of professionals and clients who trust Jacko to connect them with quality opportunities and reliable service."
        benefits={[
          'Free to create your profile',
          'Secure payment processing',
          '24/7 customer support',
          'Verified user community',
        ]}
        primaryButton={{
          text: 'Sign Up Now',
          href: '/sign_up',
        }}
        secondaryButton={{
          text: 'Learn More',
          href: '/sign_in',
        }}
      />
    </GuestLayout>
  );
};

export default Landing;
