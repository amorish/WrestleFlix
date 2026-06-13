import type { Match } from '../types';
import { generateThumbnail, getPromotionLogo } from './utils';
import { Play } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface MatchCardProps {
  match: Match;
  onPlay: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onPlay }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  return (
    <div ref={ref} className="match-card-wrapper" onClick={() => onPlay(match)}>
      {inView ? (
        <>
          <div className="match-card-image-wrapper">
            <img src={generateThumbnail(match)} alt={match.match} className="match-card-bg" />
            <img src={getPromotionLogo(match.promotion)} alt={match.promotion} className="promo-logo" />
            <div className="match-card-hover-overlay">
              <Play className="play-icon-large" size={48} />
            </div>
          </div>
          <div className="match-card-info">
            <div className="match-card-title-row">
              <h4>{match.match}</h4>
              <div className="rating-stars">{match.rating}</div>
            </div>
            <p className="match-card-meta">{match.date} • {match.event}</p>
          </div>
        </>
      ) : (
        <div className="match-card-placeholder"></div>
      )}
    </div>
  );
};
