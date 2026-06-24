import React from 'react';
import { CustomDropdown } from './CustomDropdown';

interface FilterSortBarProps {
  promotions: string[];
  selectedPromotion: string;
  onPromotionChange: (promo: string) => void;
  sortOrder: 'newest' | 'oldest' | 'highest_rated';
  onSortChange: (order: 'newest' | 'oldest' | 'highest_rated') => void;
  selectedDecade: string;
  onDecadeChange: (decade: string) => void;
}

export const FilterSortBar: React.FC<FilterSortBarProps> = ({
  sortOrder,
  onSortChange,
  selectedDecade,
  onDecadeChange
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'highest_rated', label: 'Highest Rated' }
  ];

  const decadeOptions = [
    { value: 'All Years', label: 'All Years' },
    { value: '1980s', label: '1980s' },
    { value: '1990s', label: '1990s' },
    { value: '2000s', label: '2000s' },
    { value: '2010s', label: '2010s' },
    { value: '2020s', label: '2020s' }
  ];

  return (
    <div className="inline-filter-sort">
      <CustomDropdown 
        options={decadeOptions}
        value={selectedDecade}
        onChange={onDecadeChange}
      />

      <CustomDropdown 
        options={sortOptions}
        value={sortOrder}
        onChange={(v) => onSortChange(v as "newest" | "oldest" | "highest_rated")}
      />
    </div>
  );
};
