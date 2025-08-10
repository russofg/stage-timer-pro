import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import VideoDemo from './components/VideoDemo'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import Documentation from './components/Documentation'
import Download from './components/Download'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Features />
                  <VideoDemo />
                  <Pricing />
                  <Testimonials />
                  <Documentation />
                  <Download />
                </>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
