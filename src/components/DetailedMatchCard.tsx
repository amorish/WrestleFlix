import type { Match } from '../types';
import { generateThumbnail, getPromotionLogo, isBWLogoPromotion } from './utils';
import { useThumbnailFallback } from '../hooks/useThumbnailFallback';
import { Play, Star, Calendar, ListVideo } from 'lucide-react';
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

  const fallbackThumbnailUrl = useThumbnailFallback(generateThumbnail(match));

  const isPlaylist = Array.isArray(match.videoId) || (typeof match.videoId === 'string' && match.videoId.startsWith('PL'));
  const videoCount = Array.isArray(match.videoId) ? match.videoId.length : null;
  const logoUrl = getPromotionLogo(match.promotion);
  const showTag = !logoUrl && match.promotion.toLowerCase() !== 'various';

  return (
    <div 
      ref={ref} 
      className="detailed-match-card"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onPlay(match);
      }}
    >
      {inView ? (
        <>
          <div className={isPlaylist ? "playlist-stack-container" : ""}>
            <div className="detailed-thumbnail" onClick={() => onPlay(match)}>
              <img 
                src={fallbackThumbnailUrl} 
                alt={match.match} 
                loading="lazy"
              />
              <div className="play-overlay">
                <Play fill="white" size={40} />
              </div>
              {logoUrl ? (
                <img src={logoUrl as string} alt={match.promotion} className={`promo-logo ${isBWLogoPromotion(match.promotion) ? 'logo-bw' : ''}`} />
              ) : showTag ? (
                <div className="promo-tag">#{match.promotion}</div>
              ) : null}
              {isPlaylist && (
                <div className="playlist-badge" style={match.rating !== '0' ? { bottom: '35px' } : {}}>
                  <ListVideo size={14} /> {videoCount ? `${videoCount} videos` : 'Playlist'}
                </div>
              )}
              {match.rating !== '0' && (
                <div className="rating-badge-absolute">
                  <Star fill="#f5c518" color="#f5c518" size={14} /> {match.rating}
                </div>
              )}
            </div>
          </div>
          
          <div className="detailed-info">
            <div className="detailed-header">
              <h3 className="detailed-title" onClick={() => onPlay(match)}>{match.match}</h3>
              {logoUrl && <img src={logoUrl as string} alt={match.promotion} className={`detailed-promo-logo ${isBWLogoPromotion(match.promotion) ? 'logo-bw' : ''}`} />}
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
