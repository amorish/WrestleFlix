import type { Match } from '../types';
import { generateThumbnail } from './utils';
import { Play } from 'lucide-react';
import wweLogo from '../assets/promotions/wwe.svg';
import aewLogo from '../assets/promotions/aew.svg';
import njpwLogo from '../assets/promotions/njpw.svg';
import wcwLogo from '../assets/promotions/Wcw.svg';
import tnaLogo from '../assets/promotions/TNA.svg';
import rohLogo from '../assets/promotions/ROH.svg';

interface HeroBannerProps {
  match: Match | null;
  onPlay: (match: Match) => void;
  promotions: string[];
  selectedPromotion: string;
  onPromotionChange: (promo: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  match, 
  onPlay,
  selectedPromotion,
  onPromotionChange
}) => {
  if (!match) return <div className="spatial-hero-wrapper skeleton"></div>;

  const bgImage = generateThumbnail(match);
  const dockPromotions = [
    { id: 'All', label: 'All', logo: null },
    { id: 'WWE', label: 'WWE', logo: wweLogo },
    { id: 'AEW', label: 'AEW', logo: aewLogo },
    { id: 'NJPW', label: 'NJPW', logo: njpwLogo },
    { id: 'WCW', label: 'WCW', logo: wcwLogo },
    { id: 'TNA', label: 'TNA', logo: tnaLogo },
    { id: 'ROH', label: 'ROH', logo: rohLogo },
  ];

  return (
    <div className="spatial-hero-wrapper">
      <div className="spatial-hero-container" style={{ backgroundImage: `url("${bgImage}")` }}>
        <div className="hero-overlay-spatial"></div>
        
        <div className="spatial-hero-content">
          <div className="hero-text-content">
            <h1 className="hero-spatial-title">{match.match}</h1>
            
            <div className="hero-spatial-meta">
              <span className="imdb-badge">{match.rating}</span>
              <span>{match.date}</span>
              <span>{match.promotion}</span>
            </div>
            
            <p className="hero-spatial-desc">
              Featured 5-star classic from <strong>{match.event}</strong>. Watch one of the most highly rated wrestling matches in history.
            </p>
            
            <div className="hero-spatial-actions">
              <button className="btn btn-spatial-primary" onClick={() => onPlay(match)}>
                <Play fill="currentColor" size={20} /> Watch Now
              </button>
            </div>
          </div>
        </div>

      </div>
      
      <div className="spatial-dock-container">
        {dockPromotions.map(promo => (
          <div 
            key={promo.id}
            className={`dock-item ${selectedPromotion === promo.id ? 'active' : ''}`}
            onClick={() => onPromotionChange(promo.id)}
          >
            {promo.logo ? <img src={promo.logo} alt={promo.label} /> : promo.label}
          </div>
        ))}
      </div>
    </div>
  );
};
