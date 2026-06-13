import type { Match } from '../types';
import { X } from 'lucide-react';

interface VideoModalProps {
  match: Match | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ match, onClose }) => {
  if (!match) return null;

  const searchQuery = encodeURIComponent(`${match.match} ${match.promotion} ${match.date} full match`);
  
  let videoUrl = `https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=1`;
  if (match.videoId) {
    if (match.videoSource === 'dailymotion') {
      videoUrl = `https://www.dailymotion.com/embed/video/${match.videoId}?autoplay=1`;
    } else {
      videoUrl = `https://www.youtube.com/embed/${match.videoId}?autoplay=1`;
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={30} />
        </button>
        <div className="video-container">
          <iframe
            src={videoUrl}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="modal-info">
          <h2>{match.match}</h2>
          <p>{match.event} • {match.date} • {match.promotion}</p>
          <div className="rating-badge">{match.rating}</div>
          <div className="external-links" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <a 
              href={match.videoId && match.videoSource !== 'dailymotion' ? `https://www.youtube.com/watch?v=${match.videoId}` : `https://www.youtube.com/results?search_query=${searchQuery}`} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-accent"
            >
              Watch on YouTube
            </a>
            <a 
              href={match.videoId && match.videoSource === 'dailymotion' ? `https://www.dailymotion.com/video/${match.videoId}` : `https://www.dailymotion.com/search/${searchQuery}`} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary"
            >
              Watch on DailyMotion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
