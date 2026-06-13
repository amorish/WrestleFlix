import { useState, useMemo } from 'react';
import matchesData from './data/matches.json';
import type { Match } from './types';
import { HeroBanner } from './components/HeroBanner';
import { MatchRow } from './components/MatchRow';
import { VideoModal } from './components/VideoModal';
import { FilterSortBar } from './components/FilterSortBar';
import { DetailedMatchCard } from './components/DetailedMatchCard';

import logoUrl from './assets/layout/wrestleflix_logo.webp';

const historyOfWrestling: Match[] = [
  { id: 'hist-1', match: 'AEW 2019-2025: A Crash Course in Rivalries, Violence & Lore', event: 'Documentary', promotion: 'AEW', date: '2025', rating: '0', videoId: 'F_fHUyoCmeM', videoSource: 'youtube', thumbnailId: 'F_fHUyoCmeM' },
  { id: 'hist-2', match: 'The COMPLETE History of WWE (4+ Hours)', event: 'Documentary', promotion: 'WWE', date: '2024', rating: '0', videoId: 'DxvetzhrFKQ', videoSource: 'youtube', thumbnailId: 'DxvetzhrFKQ' },
  { id: 'hist-3', match: 'The Complete History Of TNA Wrestling', event: 'Documentary', promotion: 'TNA', date: '2023', rating: '0', videoId: 'sIF-utqM9Y0', videoSource: 'youtube', thumbnailId: 'sIF-utqM9Y0' },
  { id: 'hist-4', match: 'History of NJPW', event: 'Documentary', promotion: 'NJPW', date: '2023', rating: '0', videoId: ['7YzFktVht00','wDQne6e0P2A','Akf_zR7MVOs','yvwFfeLZ1PY','gZUUuVNCChc','SDTEEZIWRF8','gLFO_3TFtic','y0ruXurGgic','SfQ6essKrqE','mX8z4Cy8CN8','4ldw4uK_I54','SICVli3WaOY','iHqsdbcplSg','jZsaWDqR1oQ','3Cpqtk2h6dQ','j4f1vsjE8E8','QU4D60AHXLE','d2hADjLDKRM','3jhPvQB91W0','Y3Ka_7kVHLo','QHCl3RlQfnE','pYjCf6nQ0bI','zhCiXsYvsGA','CCRtSC0vugk','YLJiyxMydYc','GNwxJ_kVvZw','Ew2V61pwFEY','NZK-3N0tC8g','1CCD8rMmMNY','KUdCC2H6q44','T8GgjSh86sI','xBvm6nwID8E','tmSFsJeQSMo','T34zD00hEoo'], videoSource: 'youtube' },
  { id: 'hist-5', match: 'The Rise And Fall Of Ring Of Honor', event: 'Documentary', promotion: 'ROH', date: '2022', rating: '0', videoId: 'xUxrbJDWoCw', videoSource: 'youtube', thumbnailId: 'xUxrbJDWoCw' },
  { id: 'hist-6', match: 'The Entire History of Triple AAA | Documentary', event: 'Documentary', promotion: 'AAA', date: '2022', rating: '0', videoId: 'Olu2ZJlB4EY', videoSource: 'youtube', thumbnailId: 'Olu2ZJlB4EY' },
  { id: 'hist-7', match: 'The Rise And Fall Of All Japan Pro Wrestling', event: 'Documentary', promotion: 'AJPW', date: '2021', rating: '0', videoId: 'I68GwY8DO4I', videoSource: 'youtube', thumbnailId: 'I68GwY8DO4I' },
  { id: 'hist-8', match: 'The Complete History Of ECW', event: 'Documentary', promotion: 'ECW', date: '2021', rating: '0', videoId: 'q0vmLUV6aI4', videoSource: 'youtube', thumbnailId: 'q0vmLUV6aI4' },
  { id: 'hist-9', match: 'FULL DOCUMENTARY: The Rise & Fall of WCW', event: 'Documentary', promotion: 'WCW', date: '2020', rating: '0', videoId: 'JXmJXS5DElM', videoSource: 'youtube', thumbnailId: 'JXmJXS5DElM' },
  { id: 'hist-10', match: 'Complete History Of Wrestling Moves (Wrestling Documentary)', event: 'Documentary', promotion: 'Various', date: '2020', rating: '0', videoId: 'I8pwiKdIJjM', videoSource: 'youtube', thumbnailId: 'I8pwiKdIJjM' },
];

const fullEvents: Match[] = [
  { id: 'fe-1', match: 'WWE TRIPLE AAA - Full Shows in Order', event: 'Full Event', promotion: 'WWE', date: 'Various', rating: '0', videoId: ['LwDFoIoHRT4','v4M2vvIWahQ','0BrCXBwZPJM','hlEh2jFg7Gs','Qw9GqNZOuk8','c9VmuA1odjI','SSjB0e4GaHk','nMcvmowVjyI','_63EdrT95mc','Bam_cgxz_Rs','0GWXChf0Z9o','cYTxMPAmSeY','HrOuk738a40','zBNhmXH5ae8','j1Iex1FQvIs','w1gCU5R01_c','6ZzxvpWWR1A','MhZmL95ICcs','sgAPeC58GXs','pTYGTDXjC1g','fJSZilffo9o','SU_zEL8iUXQ','9ec9BtLQMtg','X3qT79-w7y8','zncixG4Gj4E','wl_9w92dHiM','iOJ-DW6EgiI'], videoSource: 'youtube' },
  { id: 'fe-2', match: 'Full-Length Events from the WWE Vault', event: 'Full Event', promotion: 'WWE', date: 'Various', rating: '0', videoId: ['C-k753Y_uks','J8MrM2p7EX4','YaHhYDqfeug','7FfvJbHq2MU','rfP5SXOhVt4','4Bgg4P-xnHY','n2LuB0j2yZs','7NgUlmC7GhU','iMTvgEXscK4','KMP0y5jXWkY','evq6wnWPrHs','oq9BupiHWG8','EK5VE-z0Kwg','n5eDTM9pW5I','xJzs24XFhP8','P-0JmpmHf4A','ecWwy2R8Mgs','8aotvq6P0DY','uOpeX5Tj0VU','VbZ9KstxIrM','vYGsqesisl0','Y-PKTZ8cSG0','vw5KBulNTzo','LeALKtW10Sc','flqbBRYUEHM','6-VgrLs83zk','7PwsIw3Qhxo','bcdvgHrEOXs','TaxPCLeK4M0','ZzyCb105h4o','UyJoEaUmiik','7BubCuvg5Zs','NZ9fCZ8oIr0','f5tTFplq_Mk','d2_1k7ZhS6A','IX2l0210CXY','veYqszwHZmk','GHIUzPgSwKs','KVWB4uXcaic','E6I3qX1QPA0','HF7OmDVpir8','7l4D0x4IM98','zlAXE02XxAU','9CYO_4qQNLY','X4MXn6foHV8','CSPBU2TQRds','90rDq88N3BQ','WNLukCeIAqk','7TY8LwJzAwk','y2Hn7mSK5VQ','IQgcy6r3nn4','Htz6N-I5Lho','n5xNQPgR4Fg','rOb8KeNwWnA','1v3fTLOxQqA','-J7W1hpPNds','YdZOJHjEsx0','CNk33Tev5xo','0yRpW2N1ivc','cyy1c6r4_5o','2mykcQhMIcM','2B-jsn9tXGg','9GA3Eglfu-k','Jz9nvwgCGsc','8fFKUUYPjrA','bYiTi_pc_iQ','u7G2Zj-DebY','phLpQ1Mgny4','VBoKCLEyoic','IrcVzCfW5Xw','y02KCZXH9j0','IOtrGZ-okOU','kJRzqQwZ7po','4qlpQyqFqcs','tNjIClDfm4o'], videoSource: 'youtube' },
  { id: 'fe-3', match: 'NXT Full Events', event: 'Full Event', promotion: 'WWE', date: 'Various', rating: '0', videoId: ['jtt6REzP4dA','gs16-KEHdOk','1bTBL_AaLZI','1PcSCiztgeQ','m9Tzjh9eOno','zFKvSfcD5xc','zN5Ok4oa7iE','1FIMnukDgN8','nrmgRf-hd8o','IIDlCZ40aKI','peoelMTwYSU','3mGCQCbBHIE','tWMferRqCmE','PZXkApfEBRI','M2ZfYV4zZvk','merdRizP0zc','H0OCQFtvQXE','hkeLr1ysHaQ','yp6zci9m00g','QAJGyeXt8JA','R363bBoq9xQ','rJDZCqsrCjI','WkzVpFen5UA','iji4v2ytG6E','6AK05EB95u4','HfFMnluxJ58','jOb9QqnuGc0','6FkRLpEZmOQ','iFyw4CitczY','Ayhn-vbbrKY','jdoZVVBV5Kw','cPNqrn7Se3I','pT43lzw50Do','YY8F_O7ABmM','8vCoUJFUbjE','1YzVPzjHDvo','wK8bhsVVxCY','7ZgXb27F8_M','JOJkWBofJKQ','3n4_nTg2Biw','yMdQUEiBOws','MtDGbc_Lgu0','KCa3BNrHkJs','PKUMW0beZ0Y','-HKBwav1vWA','0dA60NkBVyw','NZTv1ZnggyQ','OwvazF54pFM','ZywLvctwZj8','PkIMm6DoXsc','wdZ8YdOaoNk','woJyRmfia-M','lHwaNVbGSjc','WhoBAHlwvrM','9bClzbWfOnA','HQXsUKjhhAU','t4P4YjPjcX8','raSPoXwF-ek','7JxX0SHrtNw','WpYIVS7Xkxk','mfItWOx0wbY','CSG6lqST-hc','ekSK2simxnU'], videoSource: 'youtube' },
];

function App() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest_rated'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState('All Years');

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
