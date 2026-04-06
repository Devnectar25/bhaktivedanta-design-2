import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InfoSlider from './components/InfoSlider';
import About from './components/About';
import Services from './components/Services';
import Doctors from './components/Doctors';
import Stats from './components/Stats';
import Infrastructure from './components/Infrastructure';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <InfoSlider />
        <About />
        <Services />
        <Doctors />
        <Stats />
        <Infrastructure />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
