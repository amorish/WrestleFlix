import React, { useEffect, useState } from 'react';
import type { Match } from '../types';
import { X, Play } from 'lucide-react';
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!match) return null;

  const isMultiPart = Array.isArray(match.videoId);
  const videoIds = isMultiPart ? (match.videoId as string[]) : (match.videoId ? [match.videoId as string] : []);
  const [currentPart, setCurrentPart] = useState(0);

  useEffect(() => {
    setCurrentPart(0);
  }, [match.videoId]);

  useEffect(() => {
    if (!isMultiPart) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.dailymotion.com') return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.event === 'video_end') {
          setCurrentPart(prev => (prev < videoIds.length - 1 ? prev + 1 : prev));
        }
      } catch (e) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isMultiPart, videoIds.length]);

  const searchQuery = encodeURIComponent(`${match.match} ${match.promotion} ${match.date} full match`);
  
  let videoUrl = `https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=1`;
  const currentVideoId = videoIds.length > 0 ? videoIds[currentPart] : null;

  const getSeconds = (timeStr: string) => {
    const parts = timeStr.split(':').reverse();
    return parts.reduce((acc, part, i) => acc + parseInt(part, 10) * Math.pow(60, i), 0);
  };

  if (currentVideoId) {
    const startSeconds = match.timestamp ? getSeconds(match.timestamp) : null;
    const endSeconds = match.endTimestamp ? getSeconds(match.endTimestamp) : null;
    
    if (match.videoSource === 'dailymotion') {
      const startParam = startSeconds ? `&start=${startSeconds}` : '';
      const endParam = endSeconds ? `&end=${endSeconds}` : '';
      videoUrl = `https://www.dailymotion.com/embed/video/${currentVideoId}?autoplay=1&api=postMessage${startParam}${endParam}`;
    } else if (match.videoSource === 'bilibili') {
      const startParam = startSeconds ? `&t=${startSeconds}` : '';
      videoUrl = `https://player.bilibili.com/player.html?bvid=${currentVideoId}&autoplay=1${startParam}`;
    } else if (match.videoSource === 'archive') {
      const startParam = startSeconds ? `&start=${startSeconds}` : '';
      const endParam = endSeconds ? `&end=${endSeconds}` : '';
      videoUrl = `https://archive.org/embed/${currentVideoId}?autoplay=1${startParam}${endParam}`;
    } else if (match.videoSource !== 'vk') {
      const startParam = startSeconds ? `&start=${startSeconds}` : '';
      const endParam = endSeconds ? `&end=${endSeconds}` : '';
      if (currentVideoId.startsWith('PL')) {
        videoUrl = `https://www.youtube.com/embed/videoseries?list=${currentVideoId}&autoplay=1`;
      } else {
        videoUrl = `https://www.youtube.com/embed/${currentVideoId}?autoplay=1${startParam}${endParam}`;
      }
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={30} />
        </button>
        <div className="video-container">
          {match.videoSource === 'vk' ? (
            <div className="vk-fallback-container">
              <h3>This match is hosted on VK</h3>
              <p>Due to VK platform restrictions, this video cannot be embedded directly.</p>
              <a href={`https://vk.com/${currentVideoId}`} target="_blank" rel="noreferrer" className="btn btn-accent vk-btn">
                <Play fill="currentColor" size={16}/> Open Full Event on VK
              </a>
              {match.timestamp && (
                <p className="vk-timestamp">The actual match begins at <strong>{match.timestamp}</strong></p>
              )}
            </div>
          ) : (
            <iframe
              src={videoUrl}
              title="Video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
        {isMultiPart && (
          <div className="multipart-controls" style={{ padding: '15px 2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', background: '#000' }}>
            <button 
              className="btn btn-secondary"
              disabled={currentPart === 0}
              onClick={() => setCurrentPart(prev => Math.max(0, prev - 1))}
              style={{ 
                opacity: currentPart === 0 ? 0.5 : 1, 
                cursor: currentPart === 0 ? 'not-allowed' : 'pointer',
                background: '#333',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px'
              }}
            >
              Previous
            </button>
            <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {currentPart + 1} / {videoIds.length}
            </span>
            <button 
              className="btn btn-secondary"
              disabled={currentPart === videoIds.length - 1}
              onClick={() => setCurrentPart(prev => Math.min(videoIds.length - 1, prev + 1))}
              style={{ 
                opacity: currentPart === videoIds.length - 1 ? 0.5 : 1, 
                cursor: currentPart === videoIds.length - 1 ? 'not-allowed' : 'pointer',
                background: '#333',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px'
              }}
            >
              Next
            </button>
          </div>
        )}
        <div className="modal-info">
          <h2>{match.match}</h2>
          <p>{match.event} • {match.date} • {match.promotion}</p>
          
          {match.rating !== '0' && <CustomStarRating rating={match.rating} />}
          
          {match.description && (
            <div className="match-context">
              <h3>The Story</h3>
              <p>
                {isDescriptionExpanded || match.description.length <= 180 
                  ? match.description 
                  : `${match.description.slice(0, 180)}...`}
              </p>
              {match.description.length > 180 && (
                <button 
                  className="see-more-btn" 
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                >
                  {isDescriptionExpanded ? 'See Less' : 'See More'}
                </button>
              )}
            </div>
          )}
          
          <div className="video-buttons-container">
            {match.videoSource !== 'dailymotion' && (
              <a 
                href={currentVideoId ? (currentVideoId.startsWith('PL') ? `https://www.youtube.com/playlist?list=${currentVideoId}` : `https://www.youtube.com/watch?v=${currentVideoId}`) : `https://www.youtube.com/results?search_query=${searchQuery}`} 
                target="_blank" 
                rel="noreferrer" 
              >
                <img src={youtubeBtn} alt="Watch on YouTube" className="video-btn-img" />
              </a>
            )}
            {(match.videoSource === 'dailymotion' || !match.videoSource) && (
              <a 
                href={currentVideoId && match.videoSource === 'dailymotion' ? `https://www.dailymotion.com/video/${currentVideoId}` : `https://www.dailymotion.com/search/${searchQuery}`} 
                target="_blank" 
                rel="noreferrer" 
              >
                <img src={dailymotionBtn} alt="Watch on DailyMotion" className="video-btn-img" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
