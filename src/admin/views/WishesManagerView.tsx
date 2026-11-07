import React from 'react';
import { ShayariManagerView } from './ShayariManagerView';
import { ShayariWishRecord, CategoryItem } from '../../services/supabase';

interface WishesManagerViewProps {
  records: ShayariWishRecord[];
  categories: CategoryItem[];
  onRefresh: () => Promise<void>;
}

export const WishesManagerView: React.FC<WishesManagerViewProps> = ({
  records,
  categories,
  onRefresh,
}) => {
  // Filter only items tagged as wish or under heartwarming / friendship categories
  const wishRecords = records.filter(
    (r) =>
      r.type === 'wish' ||
      r.category_id === 'heartwarming' ||
      r.category_id === 'friendship'
  );

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-surface border border-secondary/20 shadow-soft paper-texture">
        <h3 className="font-serif-indian text-lg font-bold text-text">
          Heartwarming & Friendship Wishes
        </h3>
        <p className="text-xs font-sans text-secondary mt-0.5">
          Dedicated view to manage meaningful blessings, emotional messages, and friendships.
        </p>
      </div>

      <ShayariManagerView
        records={wishRecords}
        categories={categories}
        onRefresh={onRefresh}
      />
    </div>
  );
};
