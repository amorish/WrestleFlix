import type { Match } from '../types';

import wweLogo from '../assets/promotions/wwe.svg';
import aewLogo from '../assets/promotions/aew.svg';
import njpwLogo from '../assets/promotions/njpw.svg';
import wcwLogo from '../assets/promotions/Wcw.svg';
import tnaLogo from '../assets/promotions/TNA.svg';
import rohLogo from '../assets/promotions/ROH.svg';
import aaaLogo from '../assets/promotions/aaa.svg';
import ecwLogo from '../assets/promotions/ecw.svg';

export function getPromotionLogo(promotion: string): string | null {
  const lower = promotion.toLowerCase();
  if (lower.includes('wwe') || lower.includes('wwf')) return wweLogo;
  if (lower.includes('aew')) return aewLogo;
  if (lower.includes('njpw')) return njpwLogo;
  if (lower.includes('wcw')) return wcwLogo;
  if (lower.includes('tna')) return tnaLogo;
  if (lower.includes('roh')) return rohLogo;
  if (lower.includes('aaa')) return aaaLogo;
  if (lower.includes('ecw')) return ecwLogo;
  
  // For ones that don't have a local logo yet, return null so it falls back to text tag
  if (lower.includes('cmll')) return 'https://logo.clearbit.com/cmll.com';
  if (lower.includes('stardom')) return 'https://logo.clearbit.com/wwr-stardom.com';
  if (lower.includes('noah')) return 'https://logo.clearbit.com/noah.co.jp';
  if (lower.includes('ajpw')) return 'https://logo.clearbit.com/all-japan.co.jp';
  return null;
}
import grandeImg from '../assets/matches thumbnail/WWE/AAANoches_GrandeGrande_ENCORE_16x9.jpg';

const localThumbnails = import.meta.glob('../assets/matches thumbnail/**/*.{jpg,jpeg,png,avif,webp}', { eager: true, import: 'default' }) as Record<string, string>;

export function generateThumbnail(match: Match): string {
  if (match.match === 'El Grande Americano vs. "The Original" El Grande Americano') {
    return grandeImg;
  }

  if (match.match.toLowerCase().includes('unreal')) {
    // If wwe unreal thumbnail is imported, we can return it. But since it is in localThumbnails, let's just find it manually from the localThumbnails object.
    const unrealKey = Object.keys(localThumbnails).find(key => key.toLowerCase().includes('wwe unreal thumbnail.png'));
    if (unrealKey) {
      return localThumbnails[unrealKey];
    }
  }

  const normalizedMatchName = match.match.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  const matchNameNoParens = match.match.toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  const normalizedEventName = match.event ? match.event.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim() : '';
  const normalizedDate = match.date ? match.date.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim() : '';
  const normalizedRating = match.rating ? match.rating.toString().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim() : '';
  
  const validNumbers: string[] = `${normalizedMatchName} ${normalizedEventName} ${normalizedDate} ${normalizedRating}`.match(/\b\d+\b/g) || [];
  
  let bestMatchUrl = '';
  let highestScore = 0;

  for (const [path, url] of Object.entries(localThumbnails)) {
    const decodedPath = decodeURIComponent(path);
    const filename = decodedPath.split('/').pop()?.toLowerCase().replace(/[_-]/g, ' ').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim() || '';
    
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
    const matchWords = matchNameNoParens.split(' ').filter(w => w.length > 2 && w !== 'the' && w !== 'and' && w !== 'vs');
    let score = 0;
    
    if (filename.includes(matchNameNoParens) || filename.includes(normalizedMatchName)) {
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

  // Not available
  if (!match.videoId || match.videoId === 'Z1V1V0Z4r34' || match.videoId === 'TODO' || (Array.isArray(match.videoId) && match.videoId.length === 0)) {
    return 'https://placehold.co/640x360/000000/ffffff?text=N/A';
  }

  const outerSources = ['vk', 'wwe', 'reddit', 'twitter', 'archive'];
  if (match.videoSource && outerSources.includes(match.videoSource)) {
    if (match.thumbnailId && match.thumbnailId.startsWith('http')) {
      return match.thumbnailId;
    }
    const titleText = match.match.length > 50 ? match.match.substring(0, 47) + '...' : match.match;
    return `https://placehold.co/640x360/000000/ffffff?text=${encodeURIComponent(titleText)}`;
  }

  if (match.videoId || match.thumbnailId) {
    if (match.videoSource === 'dailymotion') {
      return match.thumbnailId || `https://www.dailymotion.com/thumbnail/video/${match.videoId}`;
    }
    const targetId = match.thumbnailId || (Array.isArray(match.videoId) ? match.videoId[0] : match.videoId);
    if (targetId && !targetId.startsWith('PL')) {
      if (targetId.startsWith('http')) {
        return targetId;
      }
      return `https://img.youtube.com/vi/${targetId}/maxresdefault.jpg`;
    }
  }

  return 'https://placehold.co/640x360/000000/ffffff?text=N/A';
}
