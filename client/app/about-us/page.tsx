'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about-us/AboutHero';
import OurMission from '@/components/about-us/OurMission';
import StatsSection from '@/components/about-us/StatsSection';
import WhyChooseUs from '@/components/about-us/WhyChooseUs';

export default function AboutUsPage() {
  return (
    <main className="bg-white min-h-screen">
      <AboutHero />
      <OurMission />
      <StatsSection />
      <WhyChooseUs />
    </main>
  );
}