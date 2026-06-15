import { ArrowLeft } from 'lucide-react';

interface AboutUsProps {
  onBack: () => void;
}

export function AboutUs({ onBack }: AboutUsProps) {
  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="page-title">Our Mission</h1>
      </div>
      <div className="page-content glass-effect">
        <p className="page-text">
          Welcome to WrestleFlix, an ambitious project born out of a genuine passion for the artistry of professional wrestling. We proudly stand as the <strong>only platform where elite, specially curated, and 5-star wrestling matches are available entirely for free</strong>, structured in an intuitive, well-organized manner designed explicitly for core fans.
        </p>
        <p className="page-text">
          Our journey began with a simple realization: the rich tapestry of professional wrestling—spanning decades, continents, and promotions—deserves a dedicated home. We understand the frustration of endlessly searching for legendary bouts, historic rivalries, and hidden gems scattered across the internet. Our mission is to solve that problem by meticulously archiving the most breathtaking matches, compelling documentaries, and unforgettable storylines in one accessible, high-quality environment.
        </p>
        <p className="page-text">
          We believe that wrestling is more than just entertainment; it is an incredible synthesis of athleticism, storytelling, and emotion. By preserving these moments, we aim to respect the legacy of the performers who put their bodies on the line, while giving fans—both old and new—the opportunity to witness the matches that defined generations.
        </p>
        <p className="page-text">
          WrestleFlix is built by fans, for fans. We remain deeply committed to constantly updating our library, refining our platform, and delivering the ultimate viewing experience without barriers. Thank you for joining us on this incredible journey.
        </p>
      </div>
    </div>
  );
}
