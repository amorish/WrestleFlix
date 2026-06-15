import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AboutUsProps {
  onBack: () => void;
}

export function AboutUs({ onBack }: AboutUsProps) {
  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back to Home
        </button>
        <h1 className="page-title">About Us</h1>
      </div>
      <div className="page-content glass-effect">
        <p className="page-text">
          Welcome to WrestleFlix. We are the <strong>only platform/website where wrestling matches (special + 5-star) are available for free in a well-organized manner for core fans</strong>.
        </p>
        <p className="page-text">
          Our mission is to preserve the rich history, epic stories, and unbelievable moments of professional wrestling, curating the ultimate library for fans around the world.
        </p>
      </div>
    </div>
  );
}
