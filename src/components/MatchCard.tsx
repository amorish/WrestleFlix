import type { Match } from '../types';
import { generateThumbnail, getPromotionLogo, isWhiteLogoPromotion } from './utils';
import { useThumbnailFallback } from '../hooks/useThumbnailFallback';
import { Play, ListVideo } from 'lucide-react';
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

  const fallbackThumbnailUrl = useThumbnailFallback(generateThumbnail(match));

  const isPlaylist = Array.isArray(match.videoId) || (typeof match.videoId === 'string' && match.videoId.startsWith('PL'));
  const videoCount = Array.isArray(match.videoId) ? match.videoId.length : null;
  const logoUrl = getPromotionLogo(match.promotion);
  const showTag = !logoUrl && match.promotion.toLowerCase() !== 'various';

  return (
    <div 
      ref={ref} 
      className="match-card-wrapper" 
      onClick={() => onPlay(match)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onPlay(match);
      }}
    >
      {inView ? (
        <>
          <div className={isPlaylist ? "playlist-stack-container" : ""}>
            <div className="match-card-image-wrapper">
              <img 
                src={fallbackThumbnailUrl} 
                alt={match.match} 
                className="match-card-bg"
                loading="lazy"
              />
              {logoUrl ? (
                <img src={logoUrl as string} alt={match.promotion} className={`promo-logo ${isWhiteLogoPromotion(match.promotion) ? 'logo-white' : ''}`} />
              ) : showTag ? (
                <div className="promo-tag">#{match.promotion}</div>
              ) : null}
              {isPlaylist && (
                <div className="playlist-badge">
                  <ListVideo size={14} /> {videoCount ? `${videoCount} videos` : 'Playlist'}
                </div>
              )}
              <div className="match-card-hover-overlay">
                <Play className="play-icon-large" size={48} />
              </div>
            </div>
          </div>
          <div className="match-card-info">
            <div className="match-card-title-row">
              <h4>{match.match}</h4>
              {match.rating !== '0' && <div className="rating-stars">{match.rating}</div>}
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
