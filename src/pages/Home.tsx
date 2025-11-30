import React from 'react';
import HeroBanner from '../components/HeroBanner/HeroBanner';
import About from '../components/About/About';
import MarqueeSection from '../components/MarqueeSection/MarqueeSection';
import Projects from '../components/Projects/Projects';
import Education from '../components/Education/Education';
import Contact from '../components/Contact/Contact';

const Home: React.FC = () => {
    return (
        <main>
            <HeroBanner />
            <About />
            <MarqueeSection />
            <Projects />
            <Education />
            <Contact />
        </main>
    );
};

export default Home;
