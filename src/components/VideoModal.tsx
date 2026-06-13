import type { Match } from '../types';
import { X } from 'lucide-react';
import youtubeBtn from '../assets/layout/watch it on youtube.webp';
import dailymotionBtn from '../assets/layout/watch it on dailymotion.webp';

interface VideoModalProps {
  match: Match | null;
  onClose: () => void;
}

const CustomStarRating = ({ rating }: { rating: string }) => {
  const numericRating = parseFloat(rating) || 0;
  
  return (
    <div className="custom-star-rating">
      <div className="stars-container">
        {[0, 1, 2, 3, 4].map(index => {
          let fillPercentage = 0;
          if (numericRating >= index + 1) fillPercentage = 100;
          else if (numericRating > index) fillPercentage = (numericRating - index) * 100;
          
          return (
            <div key={index} className="star-box">
              <svg viewBox="0 0 24 24" className="star-svg star-empty" stroke="none">
                 <path fill="#333" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div className="star-fill-wrapper" style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}>
                <svg viewBox="0 0 24 24" className="star-svg star-filled" stroke="none">
                   <path fill="#FFC107" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
      <span className="rating-number">{rating}</span>
    </div>
  );
};

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
          
          <CustomStarRating rating={match.rating} />
          
          {match.description && (
            <div className="match-context">
              <h3>The Story</h3>
              <p>{match.description}</p>
            </div>
          )}
          
          <div className="video-buttons-container">
            <a 
              href={match.videoId && match.videoSource !== 'dailymotion' ? `https://www.youtube.com/watch?v=${match.videoId}` : `https://www.youtube.com/results?search_query=${searchQuery}`} 
              target="_blank" 
              rel="noreferrer" 
            >
              <img src={youtubeBtn} alt="Watch on YouTube" className="video-btn-img" />
            </a>
            <a 
              href={match.videoId && match.videoSource === 'dailymotion' ? `https://www.dailymotion.com/video/${match.videoId}` : `https://www.dailymotion.com/search/${searchQuery}`} 
              target="_blank" 
              rel="noreferrer" 
            >
              <img src={dailymotionBtn} alt="Watch on DailyMotion" className="video-btn-img" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
