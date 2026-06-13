export interface Match {
  id: string;
  date: string;
  match: string;
  promotion: string;
  event: string;
  rating: string;
  videoId?: string | string[];
  videoSource?: 'youtube' | 'dailymotion' | 'vk' | 'bilibili' | 'archive';
  timestamp?: string;
  thumbnailId?: string;
}
