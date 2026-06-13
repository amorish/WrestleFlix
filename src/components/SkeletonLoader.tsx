import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="skeleton-container">
      {/* Topbar skeleton */}
      <div className="skeleton-topbar">
        <div className="skeleton-logo shimmer"></div>
      </div>

      {/* Hero skeleton */}
      <div className="skeleton-hero shimmer"></div>

      {/* Filter / Search skeleton */}
      <div className="skeleton-filters">
        <div className="skeleton-search shimmer"></div>
        <div className="skeleton-sort shimmer"></div>
      </div>

      <div className="skeleton-dock-bar">
        <div className="skeleton-pill shimmer"></div>
        <div className="skeleton-pill shimmer"></div>
        <div className="skeleton-pill shimmer"></div>
        <div className="skeleton-pill shimmer"></div>
      </div>

      {/* Row 1 skeleton */}
      <div className="skeleton-row-title shimmer"></div>
      <div className="skeleton-row">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-card shimmer"></div>
        ))}
      </div>

      {/* Row 2 skeleton */}
      <div className="skeleton-row-title shimmer" style={{ width: '150px' }}></div>
      <div className="skeleton-row">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-card shimmer"></div>
        ))}
      </div>
    </div>
  );
};
