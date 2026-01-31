import React from 'react';
import Hero from '../components/Hero';
import RecentJobs from '../components/RecentJobs';
import Features from '../components/Features';
import Stats from '../components/Stats';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Features />
      <RecentJobs />
      <Stats />
    </div>
  );
};

export default HomePage;