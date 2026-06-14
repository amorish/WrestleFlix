import type { Match } from '../types';
import { generateThumbnail, getPromotionLogo } from './utils';
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

  const isPlaylist = Array.isArray(match.videoId) || (typeof match.videoId === 'string' && match.videoId.startsWith('PL'));
  const videoCount = Array.isArray(match.videoId) ? match.videoId.length : null;
  const mainPromotions = ['WWE', 'AEW', 'NJPW', 'ROH', 'TNA'];
  const isOthers = !mainPromotions.includes(match.promotion);
  const specialCategories = ['Unsanctioned & Hardcore', 'Hidden Gems', 'Legendary Rivalries', 'Dream Matches'];
  const isSpecialCategory = match.category && specialCategories.includes(match.category);
  const needsTag = (isOthers || isSpecialCategory) && match.promotion.toLowerCase() !== 'various';

  return (
    <div ref={ref} className="match-card-wrapper" onClick={() => onPlay(match)}>
      {inView ? (
        <>
          <div className={isPlaylist ? "playlist-stack-container" : ""}>
            <div className="match-card-image-wrapper">
              <img 
                src={generateThumbnail(match)} 
                alt={match.match} 
                className="match-card-bg" 
                onLoad={(e) => {
                  const target = e.currentTarget;
                  // YouTube's grey placeholder image is exactly 120px wide
                  if (target.naturalWidth <= 120 && target.src.includes('youtube.com')) {
                    if (target.src.includes('maxresdefault.jpg')) {
                      target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                    } else if (!target.src.includes('placehold.co')) {
                      target.src = 'https://placehold.co/640x360/000000/ffffff?text=Not+Available';
                    }
                  }
                }}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('maxresdefault.jpg')) {
                    target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                  } else if (target.src.includes('hqdefault.jpg')) {
                    target.src = target.src.replace('hqdefault.jpg', 'mqdefault.jpg');
                  } else if (!target.src.includes('placehold.co')) {
                    target.src = 'https://placehold.co/640x360/000000/ffffff?text=Not+Available';
                  }
                }}
              />
              {needsTag ? (
                <div className="promo-tag">#{match.promotion}</div>
              ) : (
                getPromotionLogo(match.promotion) && <img src={getPromotionLogo(match.promotion) as string} alt={match.promotion} className="promo-logo" />
              )}
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
