import type { Match } from '../types';
import { generateThumbnail } from './utils';
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

  const isPlaylist = Array.isArray(match.videoId) || (typeof match.videoId === 'string' && match.videoId.startsWith('PL'));
  const videoCount = Array.isArray(match.videoId) ? match.videoId.length : null;

  return (
    <div ref={ref} className="detailed-match-card">
      {inView ? (
        <>
          <div className={isPlaylist ? "playlist-stack-container" : ""}>
            <div className="detailed-thumbnail" onClick={() => onPlay(match)}>
              <img 
                src={generateThumbnail(match)} 
                alt={match.match} 
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('maxresdefault.jpg')) {
                    target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                  } else if (target.src.includes('hqdefault.jpg')) {
                    target.src = target.src.replace('hqdefault.jpg', 'mqdefault.jpg');
                  }
                }}
              />
              <div className="play-overlay">
                <Play fill="white" size={40} />
              </div>
              <div className="promo-tag">#{match.promotion}</div>
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
