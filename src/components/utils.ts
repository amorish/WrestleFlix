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

export function generateThumbnail(match: Match): string {
  if (match.videoId) {
    if (match.videoSource === 'dailymotion') {
      return `https://www.dailymotion.com/thumbnail/video/${match.videoId}`;
    }
    return `https://img.youtube.com/vi/${match.videoId}/hqdefault.jpg`;
  }
  // Fallback to random placeholder image if no video ID
  const hash = match.id.charCodeAt(0) + (match.match.charCodeAt(0) || 0);
  const images = [
    'https://placehold.co/600x400/1e1e1e/ffffff?text=WrestleFlix',
    'https://placehold.co/600x400/141414/e50914?text=WrestleFlix',
    'https://placehold.co/600x400/000000/ffffff?text=Match+Not+Found'
  ];
  return images[hash % images.length];
}
