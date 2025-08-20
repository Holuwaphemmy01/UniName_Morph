import React from 'react'
import HeroSection from '../components/landingPage/HeroSection'
import Header from '../components/landingPage/Header'
import FeatureSection from '../components/landingPage/FeatureSection'
import ActionSection from '../components/landingPage/ActionSection'
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <FeatureSection/>
      <ActionSection />
      <Footer />
    </div>
  )
}

export default LandingPage
