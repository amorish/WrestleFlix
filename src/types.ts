export interface Match {
  id: string;
  date: string;
  match: string;
  promotion: string;
  event: string;
  rating: string;
  videoId?: string;
  videoSource?: 'youtube' | 'dailymotion';
  description?: string;
}

