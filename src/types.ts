export interface Match {
  id: string;
  date: string;
  match: string;
  promotion: string;
  event: string;
  rating: string;
  videoId?: string | string[];
  videoSource?: 'youtube' | 'dailymotion' | 'bilibili' | 'twitter' | 'wwe' | 'reddit' | 'vk' | 'archive';
  timestamp?: string;
  endTimestamp?: string;
  thumbnailId?: string;
  description?: string;
  category?: string;
  externalOnly?: boolean;
}
