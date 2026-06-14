export interface Match {
  id: string;
  date: string;
  match: string;
  promotion: string;
  event: string;
  rating: string;
  videoId?: string | string[];
  videoSource?: 'youtube' | 'dailymotion' | 'vk' | 'bilibili' | 'archive' | 'wwe' | 'reddit' | 'twitter';
  timestamp?: string;
  endTimestamp?: string;
  thumbnailId?: string;
  description?: string;
  category?: string;
}
