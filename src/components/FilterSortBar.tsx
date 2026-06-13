import { Search, ArrowDownAZ } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

interface FilterSortBarProps {
  promotions: string[];
  selectedPromotion: string;
  onPromotionChange: (promo: string) => void;
  sortOrder: 'newest' | 'oldest' | 'highest_rated';
  onSortChange: (order: 'newest' | 'oldest' | 'highest_rated') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterSortBar: React.FC<FilterSortBarProps> = ({
  sortOrder,
  onSortChange,
  searchQuery,
  onSearchChange
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'highest_rated', label: 'Highest Rated' }
  ];

  return (
    <div className="inline-filter-sort">
      <div className="compact-search">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search Match" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <CustomDropdown 
        options={sortOptions}
        value={sortOrder}
        onChange={(v) => onSortChange(v as any)}
      />
    </div>
  );
};
