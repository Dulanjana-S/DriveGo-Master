'use client';

import Link from 'next/link';
import { ArrowRight, Users, Target, Heart, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="font-sans font-bold text-2xl text-primary">
            DriveGo
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Back Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Your Journey Starts Here
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            DriveGo is committed to making car rentals simple, affordable, and accessible to everyone. 
            We believe in empowering travelers with reliable transportation solutions.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
          <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-primary mb-2">3K+</div>
            <p className="text-muted-foreground">Happy Customers</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-primary mb-2">150+</div>
            <p className="text-muted-foreground">Premium Vehicles</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-primary mb-2">3+</div>
            <p className="text-muted-foreground">Locations Worldwide</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-primary/5 py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We exist to transform how people think about car rentals. Our mission is to provide 
                seamless, trustworthy, and affordable vehicle rental services that empower travelers 
                to explore the world on their own terms.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every booking with DriveGo comes with the assurance of well-maintained vehicles, 
                transparent pricing, and exceptional customer support. We're not just renting cars—
                we're enabling adventures.
              </p>
              <div className="flex items-start gap-3 pt-4">
                <Target className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Quality First</p>
                  <p className="text-muted-foreground">Every vehicle is inspected and maintained to the highest standards</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg h-80 flex items-center justify-center border border-primary/10">
              <div className="text-center">
                <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-foreground font-semibold">Trusted by thousands</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
          <p className="text-lg text-muted-foreground">What drives us every single day</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg hover:border-primary transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Customer First</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your satisfaction is our top priority. We listen, adapt, and improve constantly.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg hover:border-primary transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Reliability</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Dependable service you can count on, every time, everywhere.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg hover:border-primary transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Integrity</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transparent pricing, honest communication, and ethical practices always.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg hover:border-primary transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Global Reach</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Available worldwide to support your travels, wherever you go.
            </p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="bg-primary/5 py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Locations</h2>
            <p className="text-lg text-muted-foreground">Serving customers across the globe</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg hover:border-primary transition-all">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Colombo</h3>
                  <p className="text-sm text-muted-foreground">Sri Lanka</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Port of Colombo, Colombo, Sri Lanka</p>
              <p className="text-sm font-medium text-primary">+94 11 234 5678</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-12 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to Book Your Next Ride?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of satisfied customers who trust DriveGo for their rental needs.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Browse Vehicles
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-muted-foreground">
          <p>&copy; 2026 DriveGo. All rights reserved. Your trusted car rental service.</p>
        </div>
      </footer>
    </main>
  );
}
