import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsProps {
  onBack: () => void;
}

export function Terms({ onBack }: TermsProps) {
  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back to Home
        </button>
        <h1 className="page-title">Terms, Security & Disclaimer</h1>
      </div>
      <div className="page-content glass-effect">
        <section className="terms-section">
          <h2>Disclaimer</h2>
          <p className="page-text">
            WrestleFlix does not host or provide any of the videos shown. All videos are publicly available on the internet and embedded from third-party platforms (such as YouTube). We act merely as an organized directory for core wrestling fans.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>Terms of Use</h2>
          <p className="page-text">
            By using this website, you agree to these terms. The content provided is for informational and entertainment purposes only. We do not claim ownership over any of the wrestling promotions, brands, or footage featured.
          </p>
        </section>

        <section className="terms-section">
          <h2>Security</h2>
          <p className="page-text">
            We are committed to ensuring your experience is safe. We do not collect unnecessary personal data. Any feedback provided through our forms is handled securely and confidentially.
          </p>
        </section>
      </div>
    </div>
  );
}
