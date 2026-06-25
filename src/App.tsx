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
  { id: 'hist-4', match: 'History of NJPW', event: 'Documentary', promotion: 'NJPW', date: '2023', rating: '0', videoId: ['7YzFktVht00','wDQne6e0P2A','Akf_zR7MVOs','yvwFfeLZ1PY','gZUUuVNCChc','SDTEEZIWRF8','gLFO_3TFtic','y0ruXurGgic','SfQ6essKrqE','mX8z4Cy8CN8','4ldw4uK_I54','SICVli3WaOY','iHqsdbcplSg','jZsaWDqR1oQ','3Cpqtk2h6dQ','j4f1vsjE8E8','QU4D60AHXLE','d2hADjLDKRM','3jhPvQB91W0','Y3Ka_7kVHLo','QHCl3RlQfnE','pYjCf6nQ0bI','zhCiXsYvsGA','CCRtSC0vugk','YLJiyxMydYc','GNwxJ_kVvZw','Ew2V61pwFEY','NZK-3N0tC8g','1CCD8rMmMNY','KUdCC2H6q44','T8GgjSh86sI','xBvm6nwID8E','tmSFsJeQSMo','T34zD00hEoo'], videoSource: 'youtube', thumbnailId: '7YzFktVht00', playlistId: 'PLgqDyJZN9OYlC7dbsNRrLqTuw_f7OE3fc' },
  { id: 'hist-5', match: 'The Rise And Fall Of Ring Of Honor', event: 'Documentary', promotion: 'ROH', date: '2022', rating: '0', videoId: 'xUxrbJDWoCw', videoSource: 'youtube', thumbnailId: 'xUxrbJDWoCw' },
  { id: 'hist-6', match: 'The Entire History of Triple AAA | Documentary', event: 'Documentary', promotion: 'AAA', date: '2022', rating: '0', videoId: 'Olu2ZJlB4EY', videoSource: 'youtube', thumbnailId: 'Olu2ZJlB4EY' },
  { id: 'hist-7', match: 'The Rise And Fall Of All Japan Pro Wrestling', event: 'Documentary', promotion: 'AJPW', date: '2021', rating: '0', videoId: 'I68GwY8DO4I', videoSource: 'youtube', thumbnailId: 'I68GwY8DO4I' },
  { id: 'hist-8', match: 'The Complete History Of ECW', event: 'Documentary', promotion: 'ECW', date: '2021', rating: '0', videoId: 'q0vmLUV6aI4', videoSource: 'youtube', thumbnailId: 'q0vmLUV6aI4' },
  { id: 'hist-9', match: 'FULL DOCUMENTARY: The Rise & Fall of WCW', event: 'Documentary', promotion: 'WCW', date: '2020', rating: '0', videoId: 'JXmJXS5DElM', videoSource: 'youtube', thumbnailId: 'JXmJXS5DElM' },
  { id: 'hist-10', match: 'Complete History Of Wrestling Moves (Wrestling Documentary)', event: 'Documentary', promotion: 'Various', date: '2020', rating: '0', videoId: 'I8pwiKdIJjM', videoSource: 'youtube', thumbnailId: 'I8pwiKdIJjM' },
];

const fullEvents: Match[] = [
  { id: 'fe-1', match: 'WWE TRIPLE AAA - Full Shows in Order', event: 'Full Event', promotion: 'WWE', date: 'Various', rating: '0', videoId: ['LwDFoIoHRT4','v4M2vvIWahQ','0BrCXBwZPJM','hlEh2jFg7Gs','Qw9GqNZOuk8','c9VmuA1odjI','SSjB0e4GaHk','nMcvmowVjyI','_63EdrT95mc','Bam_cgxz_Rs','0GWXChf0Z9o','cYTxMPAmSeY','HrOuk738a40','zBNhmXH5ae8','j1Iex1FQvIs','w1gCU5R01_c','6ZzxvpWWR1A','MhZmL95ICcs','sgAPeC58GXs','pTYGTDXjC1g','fJSZilffo9o','SU_zEL8iUXQ','9ec9BtLQMtg','X3qT79-w7y8','zncixG4Gj4E','wl_9w92dHiM','iOJ-DW6EgiI'], videoSource: 'youtube', thumbnailId: 'LwDFoIoHRT4', playlistId: 'PLlj3Hc_QGrSdOnoJnKeMOR7Rg2UK1HY0v' },
  { id: 'fe-2', match: 'Full-Length Events from the WWE Vault', event: 'Full Event', promotion: 'WWE', date: 'Various', rating: '0', videoId: ['C-k753Y_uks','J8MrM2p7EX4','YaHhYDqfeug','7FfvJbHq2MU','rfP5SXOhVt4','4Bgg4P-xnHY','n2LuB0j2yZs','7NgUlmC7GhU','iMTvgEXscK4','KMP0y5jXWkY','evq6wnWPrHs','oq9BupiHWG8','EK5VE-z0Kwg','n5eDTM9pW5I','xJzs24XFhP8','P-0JmpmHf4A','ecWwy2R8Mgs','8aotvq6P0DY','uOpeX5Tj0VU','VbZ9KstxIrM','vYGsqesisl0','Y-PKTZ8cSG0','vw5KBulNTzo','LeALKtW10Sc','flqbBRYUEHM','6-VgrLs83zk','7PwsIw3Qhxo','bcdvgHrEOXs','TaxPCLeK4M0','ZzyCb105h4o','UyJoEaUmiik','7BubCuvg5Zs','NZ9fCZ8oIr0','f5tTFplq_Mk','d2_1k7ZhS6A','IX2l0210CXY','veYqszwHZmk','GHIUzPgSwKs','KVWB4uXcaic','E6I3qX1QPA0','HF7OmDVpir8','7l4D0x4IM98','zlAXE02XxAU','9CYO_4qQNLY','X4MXn6foHV8','CSPBU2TQRds','90rDq88N3BQ','WNLukCeIAqk','7TY8LwJzAwk','y2Hn7mSK5VQ','IQgcy6r3nn4','Htz6N-I5Lho','n5xNQPgR4Fg','rOb8KeNwWnA','1v3fTLOxQqA','-J7W1hpPNds','YdZOJHjEsx0','CNk33Tev5xo','0yRpW2N1ivc','cyy1c6r4_5o','2mykcQhMIcM','2B-jsn9tXGg','9GA3Eglfu-k','Jz9nvwgCGsc','8fFKUUYPjrA','bYiTi_pc_iQ','u7G2Zj-DebY','phLpQ1Mgny4','VBoKCLEyoic','IrcVzCfW5Xw','y02KCZXH9j0','IOtrGZ-okOU','kJRzqQwZ7po','4qlpQyqFqcs','tNjIClDfm4o'], videoSource: 'youtube', thumbnailId: 'C-k753Y_uks', playlistId: 'PLfalIYDZtGGDBmKl0slVTSSHEbbi1iTRu' },
  { id: 'fe-3', match: 'NXT Full Events', event: 'Full Event', promotion: 'WWE', date: 'Various', rating: '0', videoId: ['jtt6REzP4dA','gs16-KEHdOk','1bTBL_AaLZI','1PcSCiztgeQ','m9Tzjh9eOno','zFKvSfcD5xc','zN5Ok4oa7iE','1FIMnukDgN8','nrmgRf-hd8o','IIDlCZ40aKI','peoelMTwYSU','3mGCQCbBHIE','tWMferRqCmE','PZXkApfEBRI','M2ZfYV4zZvk','merdRizP0zc','H0OCQFtvQXE','hkeLr1ysHaQ','yp6zci9m00g','QAJGyeXt8JA','R363bBoq9xQ','rJDZCqsrCjI','WkzVpFen5UA','iji4v2ytG6E','6AK05EB95u4','HfFMnluxJ58','jOb9QqnuGc0','6FkRLpEZmOQ','iFyw4CitczY','Ayhn-vbbrKY','jdoZVVBV5Kw','cPNqrn7Se3I','pT43lzw50Do','YY8F_O7ABmM','8vCoUJFUbjE','1YzVPzjHDvo','wK8bhsVVxCY','7ZgXb27F8_M','JOJkWBofJKQ','3n4_nTg2Biw','yMdQUEiBOws','MtDGbc_Lgu0','KCa3BNrHkJs','PKUMW0beZ0Y','-HKBwav1vWA','0dA60NkBVyw','NZTv1ZnggyQ','OwvazF54pFM','ZywLvctwZj8','PkIMm6DoXsc','wdZ8YdOaoNk','woJyRmfia-M','lHwaNVbGSjc','WhoBAHlwvrM','9bClzbWfOnA','HQXsUKjhhAU','t4P4YjPjcX8','raSPoXwF-ek','7JxX0SHrtNw','WpYIVS7Xkxk','mfItWOx0wbY','CSG6lqST-hc','ekSK2simxnU'], videoSource: 'youtube', thumbnailId: 'jtt6REzP4dA', playlistId: 'PLEpTCGDuJrIlSuw9dmXVmpqQX80CjN4aP' },
  { id: 'fe-4', match: 'TNA Full Events', event: 'Full Event', promotion: 'TNA', date: 'Various', rating: '0', videoId: ['q0FXyyw9k7g', '8Iy4td3AB80', 'nZc0N8PE_x0', 'cn8l9KW_1Bw', 'Lkb-ZAcp6Us', 'ECB1ScMpAho', 'J_qFiRq2Vdw', '9y8625mCfpQ', 'OV4tx2tNu2w', 'VZRYtYmprNY', 'UOKIk5BDqXw', 'dYti9B15sN4', 'WI9VeRs4HGk', '2qm_eGsh5pE', 'klx8Al5Sumo', '4mdHhEyaK04', 'Q93wFtQMrNI', 'szVZ97Bhufw', '7DT1FZFML8o', 'Aw7mLyujC88', '-qXtrRJqI8w', 'nE7jcvHG7t0', '56-690pSWsU', 'pegSTA0hS78', 'C5oxCebqK4k', 'QtVZ4PSXWdw', '8EZ1RFxQTLs', '-a6KPTzlQJI', 'NZueelk65SE', '0RhfsxC4L20', 'EXdAdB65PrU', 'q02HlXb0rm0', 'H2dz6vmX3pw', 'A1Br16mlkJo', 'pmzMHXD-xZY', '1jJEyuTuQSA', 'mOCj3kKTp0Y', '6PohJ0wClDs', 'SEwaoQNnVxo', 'sjmInUW-qlc', 'xw_3UgD1f1g', '045FWBiIl2U', '3ZcJirCf5ZI', 'Q82QT8qEmJk', '7FGA3LkT6cU', 'JeaMtC_St48', 'nsWQMFX0QE8', 'mTm3IQBzKmI', 'tNOlWkZQYNw', '7K0h84Wnw-Q', 'TLlxx7bwMzc', '_u6fXzz3seo', 'lm-RAqVvgtU', 'x80fvo64LyI', '9X_U_HMgvjM', 'VY58LJdVci0', 'QjQzKqF2_RQ', 'usZG0Cxm5vI', 'E1vyaN-eUvg', 'libeP_CTfyk', 'XQwBPXqZI1s', '0mas2mbvqiQ', 'YTrzR9xzgkg', '-oZD8yf289Y', 'rn7SlynjiT8', 'Qbs9A_s3BFc', 'uECe0LuZgFE', 'MjNoOrNcp7c', 'tJm469NMB44', 'LzWSkF3A-Xk', 'p7TdWKpcq40', 'zX9NhUG2LTk', 'KviPbpNWyPQ', 'j9rpFQ0v2uY', '16s9k0LV8mw', 'Fvd9Z6Qivuo', 'gKf7_d7vVqo', 'yn3seqmpBeA', 'r_Tyom8vtPw', 'vVR3d-82czU', 'frmqsZslULo', 'u9v5b9BkGC0', '0kzB_13wC68', 'ki83L_Y_KhE', '7064qyW3JO8', '6WndJe07l4s', 'lQ7KrsF0sV8', '9ck4wfTrtmk', 'xiZq-OaSuVM', 'b9ayCBzwlnQ', 'ImQtBbxv4gg'], videoSource: 'youtube', thumbnailId: 'nZc0N8PE_x0', playlistId: 'PLcovtt7Bdo9NjP43R0_lJH1tq3pyJnPRw' },
];

const epicStories: Match[] = [
  { id: 'story-1', match: 'The Complete Story of The Bloodline', event: 'Story', promotion: 'WWE', date: '2023', rating: '0', videoId: ['GEpdhKHK4EI', 'z19Cad44Jdo', '2yvsrNv1fRU'], videoSource: 'youtube', thumbnailId: 'GEpdhKHK4EI' },
  { id: 'story-2', match: 'History of BULLET CLUB', event: 'Story', promotion: 'NJPW', date: '2024', rating: '0', videoId: ['UFb8Dxypi00', 'x9Kv4EaP4zg', 'MmOH2Asi8QE', '4yW5KswJ0kc', 'gvn7s3mIiKQ', 'sWJrhJ48jYg'], videoSource: 'youtube', thumbnailId: 'UFb8Dxypi00', playlistId: 'PLuY6JE3lpYAOcId_BCad-4hE8N-da2f1G' },
  { id: 'story-3', match: 'The nWo: A definitive history', event: 'Story', promotion: 'WCW', date: 'Various', rating: '0', videoId: ['baU1J1uJdvk', 'QBO4Bf2cspQ', 'U1bIhyMZ50s', '8Grora5WMm0'], videoSource: 'youtube', thumbnailId: 'baU1J1uJdvk' },
  { id: 'story-4', match: 'Complete history of The Shield', event: 'Story', promotion: 'WWE', date: 'Various', rating: '0', videoId: ['FKfBo1G83ao', '1oi6DXYcyrc'], videoSource: 'youtube', thumbnailId: 'FKfBo1G83ao' },
  { id: 'story-5', match: 'The Complete Story of Austin vs McMahon', event: 'Story', promotion: 'WWE', date: 'Various', rating: '0', videoId: 'Gis8GM1LQYc', videoSource: 'youtube', thumbnailId: 'Gis8GM1LQYc' },
  { id: 'story-6', match: 'The Montreal Screwjob: What Really Happened', event: 'Story', promotion: 'WWE', date: '1997', rating: '0', videoId: '0YsiF2RKj-0', videoSource: 'youtube', thumbnailId: '0YsiF2RKj-0' },
  { id: 'story-7', match: 'The Complete Story of CM Punk', event: 'Story', promotion: 'WWE', date: 'Various', rating: '0', videoId: 'WrevIta43xk', videoSource: 'youtube', thumbnailId: 'WrevIta43xk' },
  { id: 'story-8', match: 'Undertaker: The Last Ride (Docuseries Premiere)', event: 'Story', promotion: 'WWE', date: '2020', rating: '0', videoId: ['k8yQlJIr7EY', 'uEI8GRs2Luc', 'mEWofnlOMCU', 'OUIS4irgm2I', '4l1byoIAGJA', '2saDZobHKjc'], videoSource: 'youtube', thumbnailId: 'k8yQlJIr7EY', playlistId: 'PLjiTlB5CNrDcO0UHEf9FPCDDzH4vLLdhv' },
  { id: 'story-9', match: 'The Hangman Adam Page Saga', event: 'Story', promotion: 'AEW', date: '2021', rating: '0', videoId: 'cNkk8UI3GVw', videoSource: 'youtube', thumbnailId: 'cNkk8UI3GVw' },
  { id: 'story-10', match: 'The Monday Night War', event: 'Story', promotion: 'WWE/WCW', date: 'Various', rating: '0', videoId: ['s-1tuH29YdA', 'KvCJys7Rhk0', 'Y7A1BtU68z4', 'RQ4qYHPdMBU', 'tRBKFFaKsk8', 'Vv0rMYDMP98', '2C7yaDC3Z5Y', 'irgSU2Vzfc8', 'lW4zwhbLm3E', 'tIQkb8JqDp0', 'YUQrLswyNFs', '_D-X0XdZH3g', 'KSiNmLX6lRk', 'ou8IGP-I7-0', 'uRCACunLsJk', 'ge9ZuZQ8dlo', 'XOEYWDFbbhw', 'ypXr6Tyt42Y', 'qnhi017sMBY', 'bbQRRPkIvew', 'KlBZ_T-2pTw'], videoSource: 'youtube', thumbnailId: 's-1tuH29YdA', playlistId: 'PLLjPN7dJlmnyXRRQ3iIwJy8xgNYXqBNaG' }
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
