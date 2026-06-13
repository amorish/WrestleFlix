import { useState, useMemo, useEffect } from 'react';
import matchesData from './data/matches.json';
import type { Match } from './types';
import { HeroBanner } from './components/HeroBanner';
import { MatchRow } from './components/MatchRow';
import { VideoModal } from './components/VideoModal';
import { FilterSortBar } from './components/FilterSortBar';
import { DetailedMatchCard } from './components/DetailedMatchCard';
import { SkeletonLoader } from './components/SkeletonLoader';
import logoUrl from './assets/layout/wrestleflix_logo.webp';

const historyOfWrestling: Match[] = [
  { id: 'hist-1', match: 'AEW 2019-2025: A Crash Course in Rivalries, Violence & Lore', event: 'Documentary', promotion: 'AEW', date: '2025', rating: '0', videoId: 'F_fHUyoCmeM', videoSource: 'youtube', thumbnailId: 'F_fHUyoCmeM' },
  { id: 'hist-2', match: 'The COMPLETE History of WWE (4+ Hours)', event: 'Documentary', promotion: 'WWE', date: '2024', rating: '0', videoId: 'DxvetzhrFKQ', videoSource: 'youtube', thumbnailId: 'DxvetzhrFKQ' },
  { id: 'hist-3', match: 'The Complete History Of TNA Wrestling', event: 'Documentary', promotion: 'TNA', date: '2023', rating: '0', videoId: 'sIF-utqM9Y0', videoSource: 'youtube', thumbnailId: 'sIF-utqM9Y0' },
  { id: 'hist-4', match: 'History of NJPW', event: 'Documentary', promotion: 'NJPW', date: '2023', rating: '0', videoId: 'PLgqDyJZN9OYlC7dbsNRrLqTuw_f7OE3fc', videoSource: 'youtube', thumbnailId: 'qT2g-B4sTko' },
  { id: 'hist-5', match: 'The Rise And Fall Of Ring Of Honor', event: 'Documentary', promotion: 'ROH', date: '2022', rating: '0', videoId: 'xUxrbJDWoCw', videoSource: 'youtube', thumbnailId: 'xUxrbJDWoCw' },
  { id: 'hist-6', match: 'The Entire History of Triple AAA | Documentary', event: 'Documentary', promotion: 'AAA', date: '2022', rating: '0', videoId: 'Olu2ZJlB4EY', videoSource: 'youtube', thumbnailId: 'Olu2ZJlB4EY' },
  { id: 'hist-7', match: 'The Rise And Fall Of All Japan Pro Wrestling', event: 'Documentary', promotion: 'AJPW', date: '2021', rating: '0', videoId: 'I68GwY8DO4I', videoSource: 'youtube', thumbnailId: 'I68GwY8DO4I' },
  { id: 'hist-8', match: 'The Complete History Of ECW', event: 'Documentary', promotion: 'ECW', date: '2021', rating: '0', videoId: 'q0vmLUV6aI4', videoSource: 'youtube', thumbnailId: 'q0vmLUV6aI4' },
  { id: 'hist-9', match: 'FULL DOCUMENTARY: The Rise & Fall of WCW', event: 'Documentary', promotion: 'WCW', date: '2020', rating: '0', videoId: 'JXmJXS5DElM', videoSource: 'youtube', thumbnailId: 'JXmJXS5DElM' },
  { id: 'hist-10', match: 'Complete History Of Wrestling Moves (Wrestling Documentary)', event: 'Documentary', promotion: 'Various', date: '2020', rating: '0', videoId: 'I8pwiKdIJjM', videoSource: 'youtube', thumbnailId: 'I8pwiKdIJjM' },
];

const fullEvents: Match[] = [
  { id: 'fe-1', match: 'WWE TRIPLE AAA - Full Shows in Order', event: 'Full Event', promotion: 'WWE', date: 'Various', rating: '0', videoId: 'PLlj3Hc_QGrSdOnoJnKeMOR7Rg2UK1HY0v', videoSource: 'youtube', thumbnailId: 'Q1fS8F_E3O4' },
  { id: 'fe-2', match: 'Full-Length Events from the WWE Vault', event: 'Full Event', promotion: 'WWE', date: 'Various', rating: '0', videoId: 'PLfalIYDZtGGDBmKl0slVTSSHEbbi1iTRu', videoSource: 'youtube', thumbnailId: 'b7O9-N2M70Y' },
  { id: 'fe-3', match: 'NXT Full Events', event: 'Full Event', promotion: 'WWE', date: 'Various', rating: '0', videoId: 'PLEpTCGDuJrIlSuw9dmXVmpqQX80CjN4aP', videoSource: 'youtube', thumbnailId: 'u7p1g1jXm4E' },
];

function App() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest_rated'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState('All Years');
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Simulate content loading (e.g. fetching matches, caching images)
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const matches: Match[] = matchesData as Match[];
  
  const promotions = useMemo(() => {
    const promos = new Set(matches.map(m => m.promotion));
    return Array.from(promos).sort();
  }, [matches]);

  const filteredAndSortedMatches = useMemo(() => {
    let result = [...matches];
    if (selectedPromotion === 'Others') {
      const topPromos = ['WWE', 'AEW', 'NJPW', 'WCW', 'TNA', 'ROH', 'AAA', 'ECW'];
      result = result.filter(m => !topPromos.some(p => m.promotion.includes(p)));
    } else if (selectedPromotion !== 'All') {
      result = result.filter(m => m.promotion === selectedPromotion);
    }
    if (selectedDecade !== 'All Years') {
      result = result.filter(m => {
        const year = new Date(m.date).getFullYear();
        if (selectedDecade === '1980s') return year >= 1980 && year < 1990;
        if (selectedDecade === '1990s') return year >= 1990 && year < 2000;
        if (selectedDecade === '2000s') return year >= 2000 && year < 2010;
        if (selectedDecade === '2010s') return year >= 2010 && year < 2020;
        if (selectedDecade === '2020s') return year >= 2020 && year < 2030;
        return true;
      });
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.match.toLowerCase().includes(query) || 
        m.event.toLowerCase().includes(query) ||
        m.promotion.toLowerCase().includes(query)
      );
    }
    result.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOrder === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOrder === 'highest_rated') return parseFloat(b.rating) - parseFloat(a.rating);
      return 0;
    });
    return result;
  }, [matches, selectedPromotion, selectedDecade, sortOrder, searchQuery]);

  const heroMatch = useMemo(() => {
    return filteredAndSortedMatches.length > 0 ? filteredAndSortedMatches[0] : matches[0];
  }, [filteredAndSortedMatches, matches]);

  const remainingMatches = useMemo(() => {
    return filteredAndSortedMatches.filter(m => m.id !== heroMatch.id);
  }, [filteredAndSortedMatches, heroMatch]);

  const rowsByPromotion = useMemo(() => {
    if (searchQuery || selectedPromotion !== 'All') return null;
    
    const rows = [];
    
    // Add a mixed section at the top containing top matches from any promotion
    if (remainingMatches.length > 0) {
      rows.push({
        title: 'Mixed',
        matches: remainingMatches.slice(0, 15)
      });
    }

    rows.push({
      title: 'History of Wrestling',
      matches: historyOfWrestling
    });

    rows.push({
      title: 'FULL EVENT',
      matches: fullEvents
    });
    
    return rows.filter(r => r.matches.length > 0);
  }, [remainingMatches, searchQuery, selectedPromotion]);

  if (isAppLoading) {
    return (
      <div className="app-container">
        <div className="spatial-background"></div>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="spatial-background"></div>
      
      <nav className="floating-topbar">
        <div className="logo-container" onClick={() => window.location.reload()}>
          <img src={logoUrl} alt="WrestleFlix Logo" className="logo-image" />
        </div>
      </nav>

      <HeroBanner 
        match={heroMatch} 
        onPlay={setSelectedMatch} 
        promotions={promotions}
        selectedPromotion={selectedPromotion}
        onPromotionChange={setSelectedPromotion}
      />

      <div className="main-content">
        {!rowsByPromotion && (
          <div className="explore-header-container">
            <div className="explore-header-text">
              <h2>Explore matches curated for you</h2>
              <p>Discover historical classics, hidden gems, and unforgettable experiences.</p>
            </div>
            <FilterSortBar 
              promotions={promotions}
              selectedPromotion={selectedPromotion}
              onPromotionChange={setSelectedPromotion}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedDecade={selectedDecade}
              onDecadeChange={setSelectedDecade}
            />
          </div>
        )}

        {rowsByPromotion ? (
          <>
            <div className="explore-header-container" style={{ paddingBottom: '1rem' }}>
              <div className="explore-header-text">
                <h2>Explore matches curated for you</h2>
                <p>Discover historical classics, hidden gems, and unforgettable experiences.</p>
              </div>
              <FilterSortBar 
                promotions={promotions}
                selectedPromotion={selectedPromotion}
                onPromotionChange={setSelectedPromotion}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedDecade={selectedDecade}
                onDecadeChange={setSelectedDecade}
              />
            </div>
            {rowsByPromotion.map(row => (
              <MatchRow key={row.title} title={row.title} matches={row.matches} onPlay={setSelectedMatch} />
            ))}
          </>
        ) : (
          <div className="detailed-results-container">
            <div className="detailed-list">
              {remainingMatches.map(match => (
                <DetailedMatchCard key={match.id} match={match} onPlay={setSelectedMatch} />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedMatch && <VideoModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
    </div>
  );
}

export default App;
