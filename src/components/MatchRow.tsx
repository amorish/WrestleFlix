import { useRef } from 'react';
import type { Match } from '../types';
import { MatchCard } from './MatchCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MatchRowProps {
  title: string;
  matches: Match[];
  onPlay: (match: Match) => void;
}

export const MatchRow: React.FC<MatchRowProps> = ({ title, matches, onPlay }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  if (matches.length === 0) return null;

  return (
    <div className="match-row-container">
      <div className="row-header">
        <h2 className="row-title">{title}</h2>
        <div className="row-nav-arrows">
          <button className="slider-arrow-top left" onClick={() => handleScroll('left')}>
            <ChevronLeft size={20} />
          </button>
          <button className="slider-arrow-top right" onClick={() => handleScroll('right')}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="row-wrapper">
        <div className="match-row" ref={rowRef}>
          {matches.map(match => (
            <MatchCard key={match.id} match={match} onPlay={onPlay} />
          ))}
        </div>
      </div>
    </div>
  );
};
