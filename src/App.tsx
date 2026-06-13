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

function App() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest_rated'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
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
    if (selectedPromotion !== 'All') {
      result = result.filter(m => m.promotion === selectedPromotion);
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
  }, [matches, selectedPromotion, sortOrder, searchQuery]);

  const rowsByPromotion = useMemo(() => {
    if (searchQuery || selectedPromotion !== 'All') return null;
    
    const topPromos = ['WWE', 'AEW', 'NJPW', 'WCW'];
    const rows = topPromos.map(promo => ({
      title: promo,
      matches: matches.filter(m => m.promotion.includes(promo)).slice(0, 15)
    }));
    
    rows.push({
      title: 'Other Promotions',
      matches: matches.filter(m => !topPromos.some(p => m.promotion.includes(p))).slice(0, 15)
    });
    
    return rows.filter(r => r.matches.length > 0);
  }, [matches, searchQuery, selectedPromotion]);

  const heroMatch = useMemo(() => {
    return filteredAndSortedMatches.length > 0 ? filteredAndSortedMatches[0] : matches[0];
  }, [filteredAndSortedMatches, matches]);

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
        <div className="logo-container">
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
              />
            </div>
            {rowsByPromotion.map(row => (
              <MatchRow key={row.title} title={row.title} matches={row.matches} onPlay={setSelectedMatch} />
            ))}
          </>
        ) : (
          <div className="detailed-results-container">
            <div className="detailed-list">
              {filteredAndSortedMatches.map(match => (
                <DetailedMatchCard key={match.id} match={match} onPlay={setSelectedMatch} />
              ))}
            </div>
          </div>
        )}
      </div>

      <VideoModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
}

export default App;
