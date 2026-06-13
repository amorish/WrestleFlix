
import type { Match } from '../types';
import { generateThumbnail } from './utils';
import { Play } from 'lucide-react';

interface HeroBannerProps {
  match: Match | null;
  onPlay: (match: Match) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ match, onPlay }) => {
  if (!match) return <div className="hero-banner skeleton"></div>;

  return (
    <div className="hero-banner" style={{ backgroundImage: `url(${generateThumbnail(match)})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{match.match}</h1>
        <div className="hero-meta">
          <span className="hero-rating">{match.rating}</span>
          <span className="hero-date">{match.date}</span>
          <span className="hero-promotion">{match.promotion}</span>
        </div>
        <p className="hero-desc">
          Featured 5-star classic from <strong>{match.event}</strong>. Watch one of the most highly rated wrestling matches in history.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onPlay(match)}>
            <Play fill="currentColor" size={20} /> Play
          </button>
        </div>
      </div>
    </div>
  );
};
