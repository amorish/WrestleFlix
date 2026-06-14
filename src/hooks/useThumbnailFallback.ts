import { useState, useEffect } from 'react';

export function useThumbnailFallback(initialSrc: string) {
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    let currentUrl = initialSrc;
    setSrc(currentUrl);
    let isMounted = true;

    const checkImage = (url: string) => {
      if (!url.includes('youtube.com')) return;

      const img = new Image();
      img.onload = () => {
        if (!isMounted) return;
        // YouTube's grey placeholder image is exactly 120px wide
        if (img.naturalWidth <= 120) {
          handleFallback(url);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        handleFallback(url);
      };
      img.src = url;
    };

    const handleFallback = (url: string) => {
      let nextUrl = url;
      if (url.includes('maxresdefault.jpg')) {
        nextUrl = url.replace('maxresdefault.jpg', 'hqdefault.jpg');
      } else if (url.includes('hqdefault.jpg')) {
        nextUrl = url.replace('hqdefault.jpg', 'mqdefault.jpg');
      } else if (!url.includes('placehold.co')) {
        nextUrl = 'https://placehold.co/640x360/000000/ffffff?text=Not+Available';
      }

      if (nextUrl !== url) {
        setSrc(nextUrl);
        checkImage(nextUrl); // Recursively check the fallback
      }
    };

    checkImage(currentUrl);

    return () => {
      isMounted = false;
    };
  }, [initialSrc]);

  return src;
}
