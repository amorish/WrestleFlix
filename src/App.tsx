import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUrlState } from './hooks/useUrlState';
import { useDebounce } from './hooks/useDebounce';
import matchesData from './data/matches.json';
import type { Match } from './types';
import { HeroBanner } from './components/HeroBanner';
import { MatchRow } from './components/MatchRow';
import { VideoModal } from './components/VideoModal';
import { FilterSortBar } from './components/FilterSortBar';
import { DetailedMatchCard } from './components/DetailedMatchCard';
import { SkeletonLoader } from './components/SkeletonLoader';
import { AboutUs } from './components/AboutUs';
import { Terms } from './components/Terms';
import { FeedbackForm } from './components/FeedbackForm';
import { Search } from 'lucide-react';
import sunIconUrl from './assets/layout/sun.svg';
import moonIconUrl from './assets/layout/moon.svg';

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
  { id: 'fe-4', match: 'TNA Full Events', event: 'Full Event', promotion: 'TNA', date: 'Various', rating: '0', videoId: 'PLcovtt7Bdo9NjP43R0_lJH1tq3pyJnPRw', videoSource: 'youtube', thumbnailId: 'nZc0N8PE_x0' },
];

const epicStories: Match[] = [
  { id: 'story-1', match: 'The Complete Story of The Bloodline', event: 'Story', promotion: 'WWE', date: '2023', rating: '0', videoId: 'GEpdhKHK4EI', videoSource: 'youtube', thumbnailId: 'GEpdhKHK4EI' },
  { id: 'story-2', match: 'History of BULLET CLUB', event: 'Story', promotion: 'NJPW', date: '2024', rating: '0', videoId: 'UFb8Dxypi00', videoSource: 'youtube', thumbnailId: 'UFb8Dxypi00' },
  { id: 'story-3', match: 'The nWo: A definitive history', event: 'Story', promotion: 'WCW', date: 'Various', rating: '0', videoId: 'baU1J1uJdvk', videoSource: 'youtube', thumbnailId: 'baU1J1uJdvk' },
  { id: 'story-4', match: 'Complete history of The Shield', event: 'Story', promotion: 'WWE', date: 'Various', rating: '0', videoId: 'FKfBo1G83ao', videoSource: 'youtube', thumbnailId: 'FKfBo1G83ao' },
  { id: 'story-5', match: 'The Complete Story of Austin vs McMahon', event: 'Story', promotion: 'WWE', date: 'Various', rating: '0', videoId: 'ZWdF_NexO0g', videoSource: 'youtube', thumbnailId: 'ZWdF_NexO0g' },
  { id: 'story-6', match: 'The Montreal Screwjob: What Really Happened', event: 'Story', promotion: 'WWE', date: '1997', rating: '0', videoId: 'GdlSrYNr3HM', videoSource: 'youtube', thumbnailId: 'GdlSrYNr3HM' },
  { id: 'story-7', match: 'The Complete Story of CM Punk', event: 'Story', promotion: 'WWE', date: 'Various', rating: '0', videoId: 'WrevIta43xk', videoSource: 'youtube', thumbnailId: 'WrevIta43xk' },
  { id: 'story-8', match: 'Undertaker: The Last Ride (Docuseries Premiere)', event: 'Story', promotion: 'WWE', date: '2020', rating: '0', videoId: 'k8yQlJIr7EY', videoSource: 'youtube', thumbnailId: 'k8yQlJIr7EY' },
  { id: 'story-9', match: 'The Hangman Adam Page Saga', event: 'Story', promotion: 'AEW', date: '2021', rating: '0', videoId: 'cNkk8UI3GVw', videoSource: 'youtube', thumbnailId: 'cNkk8UI3GVw' },
  { id: 'story-10', match: 'The Monday Night War', event: 'Story', promotion: 'WWE/WCW', date: 'Various', rating: '0', videoId: 'td1TQ2D4pYI', videoSource: 'youtube', thumbnailId: 'td1TQ2D4pYI' }
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useUrlState<string | null>('match', null);
  const [selectedPromotion, setSelectedPromotion] = useUrlState<string>('promo', 'All');
  const [sortOrder, setSortOrder] = useUrlState<'newest' | 'oldest' | 'highest_rated'>('sort', 'newest');
  const [searchQuery, setSearchQuery] = useUrlState<string>('q', '');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedDecade, setSelectedDecade] = useUrlState<string>('decade', 'All Years');
  const [currentPage, setCurrentPage] = useUrlState<string>('page', 'home');
  const [isLightMode, setIsLightMode] = useState(() => {
    try {
      return localStorage.getItem('themeMode') === 'light';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      try { localStorage.setItem('themeMode', 'light'); } catch {}
    } else {
      document.body.classList.remove('light-mode');
      try { localStorage.setItem('themeMode', 'dark'); } catch {}
    }
  }, [isLightMode]);

  const matches: Match[] = matchesData as Match[];
  
  const selectedMatch = useMemo(() => {
    if (!selectedMatchId) return null;
    const allMatchesCombined = [...matches, ...historyOfWrestling, ...fullEvents, ...epicStories];
    return allMatchesCombined.find(m => m.id === selectedMatchId) || null;
  }, [selectedMatchId, matches]);

  const handleSelectMatch = useCallback((match: Match | null) => {
    setSelectedMatchId(match ? match.id : null);
  }, [setSelectedMatchId]);
  
  const promotions = useMemo(() => {
    const promos = new Set(matches.map(m => m.promotion));
    return Array.from(promos).sort();
  }, [matches]);

  const filteredAndSortedMatches = useMemo(() => {
    let result = [...matches];
    if (selectedPromotion === 'Others') {
      const topPromos = ['WWE', 'AEW', 'NJPW', 'WCW', 'TNA', 'ROH', 'AAA', 'ECW'];
      result = result.filter(m => !topPromos.some(p => m.promotion.includes(p)) && !m.category);
    } else if (selectedPromotion !== 'All') {
      result = result.filter(m => m.promotion === selectedPromotion && !m.category);
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
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
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
  }, [matches, selectedPromotion, selectedDecade, sortOrder, debouncedSearchQuery]);

  const heroMatch = useMemo(() => {
    return filteredAndSortedMatches.length > 0 ? filteredAndSortedMatches[0] : matches[0];
  }, [filteredAndSortedMatches, matches]);

  const remainingMatches = useMemo(() => {
    return filteredAndSortedMatches.filter(m => m.id !== heroMatch.id);
  }, [filteredAndSortedMatches, heroMatch]);

  const rowsByPromotion = useMemo(() => {
    if (debouncedSearchQuery || selectedPromotion !== 'All') return null;
    
    const rows = [];
    
    // Group matches by category
    const categories = [
      'Legacy Matches',
      'Moments',
      'Iconic Entrances & Themes',
      'Comedy & Botches',
      'Behind the Curtain',
      'Mic Masters',
      'Dream Matches',
      'Legendary Rivalries',
      'Hidden Gems',
      'Unsanctioned & Hardcore',
      'Psychological / Philosophical'
    ];

    const mixedMatches = remainingMatches.filter(m => !m.category && m.event !== 'History of Wrestling' && m.event !== 'FULL EVENT');
    
    if (mixedMatches.length > 0) {
      rows.push({
        title: 'Mixed',
        matches: mixedMatches.slice(0, 15)
      });
    }

    rows.push({
      title: 'History of Wrestling',
      matches: historyOfWrestling
    });

    rows.push({
      title: 'Epic Stories & Documentaries',
      matches: epicStories
    });

    rows.push({
      title: 'FULL EVENT',
      matches: fullEvents
    });

    // Add dynamic categories
    categories.forEach(category => {
      const categoryMatches = matches.filter(m => m.category === category);
      if (categoryMatches.length > 0) {
        rows.push({
          title: category,
          matches: categoryMatches
        });
      }
    });

    return rows.filter(r => r.matches.length > 0);
  }, [remainingMatches, matches, debouncedSearchQuery, selectedPromotion]);



  useEffect(() => {
    // Simulate loading to display the skeleton loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="app-container">
      <div className="spatial-background"></div>
      
      <nav className="floating-topbar" style={{ justifyContent: 'space-between' }}>
        <div className="logo-container">
          <a href="https://wrestleflix.pages.dev/" style={{ display: 'flex' }}>
            <img src={logoUrl} alt="WrestleFlix Logo" className="logo-image" style={{ cursor: 'pointer' }} />
          </a>
        </div>
        
        <div className={`header-right-actions ${currentPage === 'home' ? 'home-layout' : ''}`}>
          {currentPage === 'home' && (
            <div className="compact-search">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search Match" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          
          <button 
            className="settings-toggle-btn" 
            onClick={() => setIsLightMode(!isLightMode)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            <img 
              src={isLightMode ? moonIconUrl : sunIconUrl} 
              alt="Toggle Theme" 
              style={{ width: '24px', height: '24px', filter: isLightMode ? 'none' : 'invert(1)' }} 
            />
          </button>
        </div>
      </nav>

      {currentPage === 'home' && (
        <>
          <HeroBanner 
            match={heroMatch} 
            onPlay={handleSelectMatch} 
        promotions={promotions}
        selectedPromotion={selectedPromotion}
        onPromotionChange={setSelectedPromotion}
      />

      <div className="main-content">
        {!rowsByPromotion && (
          <div className="explore-header-container">
            <div className="explore-header-text">
              <h2>Explore matches curated for you</h2>
            </div>
            <FilterSortBar 
              promotions={promotions}
              selectedPromotion={selectedPromotion}
              onPromotionChange={setSelectedPromotion}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
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
              </div>
              <FilterSortBar 
                promotions={promotions}
                selectedPromotion={selectedPromotion}
                onPromotionChange={setSelectedPromotion}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                selectedDecade={selectedDecade}
                onDecadeChange={setSelectedDecade}
              />
            </div>
            {rowsByPromotion.map(row => (
              <MatchRow key={row.title} title={row.title} matches={row.matches} onPlay={handleSelectMatch} />
            ))}
          </>
        ) : (
          <div className="detailed-results-container">
            <div className="detailed-list">
              {remainingMatches.map(match => (
                <DetailedMatchCard key={match.id} match={match} onPlay={handleSelectMatch} />
              ))}
            </div>
          </div>
        )}
      </div>
        </>
      )}

      {currentPage === 'about' && <AboutUs onBack={() => { setCurrentPage('home'); window.scrollTo(0,0); }} />}
      {currentPage === 'terms' && <Terms onBack={() => { setCurrentPage('home'); window.scrollTo(0,0); }} />}
      {currentPage === 'forms' && <FeedbackForm onBack={() => { setCurrentPage('home'); window.scrollTo(0,0); }} />}

      <footer className="site-disclaimer">
        <div className="footer-links">
          <button className="nav-link" onClick={() => { setCurrentPage('about'); window.scrollTo(0,0); }}>Our Mission</button>
          <button className="nav-link" onClick={() => { setCurrentPage('terms'); window.scrollTo(0,0); }}>Legal & Security</button>
          <button className="nav-link" onClick={() => { setCurrentPage('forms'); window.scrollTo(0,0); }}>Contact Support</button>
        </div>
      </footer>

      {selectedMatch && <VideoModal match={selectedMatch} onClose={() => handleSelectMatch(null)} />}
    </div>
  );
}

export default App;
