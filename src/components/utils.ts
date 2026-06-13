import type { Match } from '../types';

export function getPromotionLogo(promotion: string): string {
  const lower = promotion.toLowerCase();
  if (lower.includes('wwe') || lower.includes('wwf')) return 'https://logo.clearbit.com/wwe.com';
  if (lower.includes('aew')) return 'https://logo.clearbit.com/allelitewrestling.com';
  if (lower.includes('njpw')) return 'https://logo.clearbit.com/njpw1972.com';
  if (lower.includes('wcw')) return 'https://logo.clearbit.com/wwe.com';
  if (lower.includes('tna')) return 'https://logo.clearbit.com/tnawrestling.com';
  if (lower.includes('roh')) return 'https://logo.clearbit.com/rohwrestling.com';
  if (lower.includes('cmll')) return 'https://logo.clearbit.com/cmll.com';
  if (lower.includes('aaa')) return 'https://logo.clearbit.com/luchalibreaaa.com';
  if (lower.includes('stardom')) return 'https://logo.clearbit.com/wwr-stardom.com';
  if (lower.includes('noah')) return 'https://logo.clearbit.com/noah.co.jp';
  if (lower.includes('ajpw')) return 'https://logo.clearbit.com/all-japan.co.jp';
  if (lower.includes('ecw')) return 'https://logo.clearbit.com/wwe.com';
  return 'https://placehold.co/100x50/141414/ffffff?text=' + encodeURIComponent(promotion);
}
import grandeImg from '../assets/matches thumbnail/WWE/AAANoches_GrandeGrande_ENCORE_16x9.jpg';

const localThumbnails = import.meta.glob('../assets/matches thumbnail/**/*.{jpg,jpeg,png,avif,webp}', { eager: true, import: 'default' }) as Record<string, string>;

export function generateThumbnail(match: Match): string {
  if (match.match === 'El Grande Americano vs. "The Original" El Grande Americano') {
    return grandeImg;
  }

  const normalizedMatchName = match.match.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  const normalizedEventName = match.event ? match.event.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim() : '';
  const normalizedDate = match.date ? match.date.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim() : '';
  
  const validNumbers: string[] = `${normalizedMatchName} ${normalizedEventName} ${normalizedDate}`.match(/\b\d+\b/g) || [];
  
  let bestMatchUrl = '';
  let highestScore = 0;

  for (const [path, url] of Object.entries(localThumbnails)) {
    const decodedPath = decodeURIComponent(path);
    const filename = decodedPath.split('/').pop()?.toLowerCase().replace(/[_\-]/g, ' ').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim() || '';
    
    // Check for mismatched numbers (e.g. Dominion 6.11 vs 6.9)
    const filenameNumbers: string[] = filename.match(/\b\d+\b/g) || [];
    let hasWrongNumber = false;
    for (const num of filenameNumbers) {
      if (!validNumbers.includes(num)) {
        hasWrongNumber = true;
        break;
      }
    }
    
    if (hasWrongNumber) continue;

    // Fuzzy token match for typos
    const matchWords = normalizedMatchName.split(' ').filter(w => w.length > 2 && w !== 'the' && w !== 'and' && w !== 'vs');
    let score = 0;
    
    if (filename.includes(normalizedMatchName)) {
      score += 100;
    }

    for (const word of matchWords) {
      if (filename.includes(word)) {
        score += 10;
      }
    }
    
    const matchPercentage = (score >= 100 ? 1 : (score / 10) / Math.max(1, matchWords.length));
    if (matchPercentage < 0.7) continue;

    // Factor in event words to pick the best specific event image
    const eventWords = normalizedEventName.split(' ').filter(w => w.length > 2 && w !== 'the' && w !== 'and' && w !== 'vs' && w !== 'in');
    for (const word of eventWords) {
      if (filename.includes(word)) {
        score += 5;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatchUrl = url;
    }
  }

  if (bestMatchUrl) {
    return bestMatchUrl;
  }

  if (match.videoId) {
    if (match.videoSource === 'dailymotion') {
      return `https://www.dailymotion.com/thumbnail/video/${match.videoId}`;
    }
    return `https://img.youtube.com/vi/${match.videoId}/mqdefault.jpg`;
  }
  // Fallback to random placeholder image if no video ID
  const hash = match.id.charCodeAt(0) + (match.match.charCodeAt(0) || 0);
  const images = [
    'https://placehold.co/640x360/1e1e1e/ffffff?text=WrestleFlix',
    'https://placehold.co/640x360/141414/e50914?text=WrestleFlix',
    'https://placehold.co/640x360/000000/ffffff?text=Match+Not+Found'
  ];
  return images[hash % images.length];
}
