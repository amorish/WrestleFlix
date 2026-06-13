import type { Match } from '../types';
import { generateThumbnail, getPromotionLogo } from './utils';
import { Play, Star, Calendar } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface DetailedMatchCardProps {
  match: Match;
  onPlay: (match: Match) => void;
}

export const DetailedMatchCard: React.FC<DetailedMatchCardProps> = ({ match, onPlay }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  return (
    <div ref={ref} className="detailed-match-card">
      {inView ? (
        <>
          <div className="detailed-thumbnail" onClick={() => onPlay(match)}>
            <img src={generateThumbnail(match)} alt={match.match} />
            <div className="play-overlay">
              <Play fill="white" size={40} />
            </div>
            {match.videoId && typeof match.videoId === 'string' && match.videoId.startsWith('PL') && (
              <div className="playlist-badge" style={{ bottom: '35px' }}>Playlist</div>
            )}
            {match.rating !== '0' && (
              <div className="rating-badge-absolute">
                <Star fill="#f5c518" color="#f5c518" size={14} /> {match.rating}
              </div>
            )}
          </div>
          
          <div className="detailed-info">
            <div className="detailed-header">
              <h3 className="detailed-title" onClick={() => onPlay(match)}>{match.match}</h3>
              <img src={getPromotionLogo(match.promotion)} alt={match.promotion} className="detailed-promo-logo" />
            </div>
            
            <div className="detailed-meta">
              <span className="meta-item">{match.promotion}</span>
              <span className="meta-item"><Calendar size={16}/> {match.date}</span>
            </div>
            
            <p className="detailed-event">
              <span className="event-label">Event:</span> {match.event}
            </p>
            
            <div className="detailed-actions">
              <button className="btn btn-accent" onClick={() => onPlay(match)}>
                <Play fill="currentColor" size={16}/> Watch Full Match
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="detailed-match-placeholder"></div>
      )}
    </div>
  );
};
