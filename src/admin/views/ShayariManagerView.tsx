import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  X,
  Save,
  Flame,
} from 'lucide-react';
import {
  ShayariWishRecord,
  saveShayariRecord,
  deleteShayariRecord,
  CategoryItem,
} from '../../services/supabase';

interface ShayariManagerViewProps {
  records: ShayariWishRecord[];
  categories: CategoryItem[];
  onRefresh: () => Promise<void>;
  isModalOpenByDefault?: boolean;
  onCloseDefaultModal?: () => void;
}

export const ShayariManagerView: React.FC<ShayariManagerViewProps> = ({
  records,
  categories,
  onRefresh,
  isModalOpenByDefault = false,
  onCloseDefaultModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenByDefault);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formType, setFormType] = useState<'shayari' | 'wish'>('shayari');
  const [formCategory, setFormCategory] = useState<string>('funny');
  const [formHindi, setFormHindi] = useState('');
  const [formEnglish, setFormEnglish] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formEmoji, setFormEmoji] = useState('🪔');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered List
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false;
      }
      // Status match
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Search match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const inHindi = (item.hindi || '').toLowerCase().includes(query);
        const inEnglish = (item.english || '').toLowerCase().includes(query);
        const inTag = (item.tag || '').toLowerCase().includes(query);
        if (!inHindi && !inEnglish && !inTag) return false;
      }
      return true;
    });
  }, [records, selectedCategory, statusFilter, searchQuery]);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormType('shayari');
    setFormCategory('funny');
    setFormHindi('');
    setFormEnglish('');
    setFormTag('Diwali Blessing');
    setFormEmoji('🍬');
    setFormImageUrl('');
    setFormStatus('published');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ShayariWishRecord) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormType(item.type);
    setFormCategory(item.category_id || 'funny');
    setFormHindi(item.hindi);
    setFormEnglish(item.english || '');
    setFormTag(item.tag);
    setFormEmoji(item.emoji || '🪔');
    setFormImageUrl(item.image_url || '');
    setFormStatus(item.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (onCloseDefaultModal) onCloseDefaultModal();
  };

  // Save Record
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHindi.trim()) {
      setFormError('Please enter the main Hindi / verse content.');
      return;
    }

    setFormSaving(true);
    setFormError(null);

    const payload: Partial<ShayariWishRecord> = {
      id: editingId || undefined,
      type: formType,
      category_id: formCategory,
      hindi: formHindi.trim(),
      english: formEnglish.trim() || undefined,
      tag: formTag.trim() || 'Festive Verse',
      emoji: formEmoji.trim() || '🪔',
      image_url: formImageUrl.trim() || undefined,
      status: formStatus,
    };

    const { error } = await saveShayariRecord(payload);

    if (error) {
      setFormError(error);
      setFormSaving(false);
      return;
    }

    await onRefresh();
    setFormSaving(false);
    closeModal();
  };

  // Toggle Publish Status
  const handleToggleStatus = async (item: ShayariWishRecord) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    await saveShayariRecord({
      id: item.id,
      status: nextStatus,
    });
    await onRefresh();
  };

  // Delete Record
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this verse?')) {
      await deleteShayariRecord(id);
      await onRefresh();
    }
  };

  // Copy Content
  const handleCopy = (item: ShayariWishRecord) => {
    const textToCopy = `${item.hindi}\n\n${item.english ? item.english + '\n\n' : ''}✨ Shubh Deepavali! ✨`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-indian text-2xl font-bold text-text">Shayari & Wishes Manager</h2>
          <p className="text-xs font-sans text-secondary">
            Total {records.length} verses • {filteredRecords.length} showing
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#A64C28] text-surface font-sans text-xs sm:text-sm font-medium shadow-soft transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Shayari</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-secondary/20 shadow-soft paper-texture space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Hindi lyrics, English meaning, or tag..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-secondary/30 text-xs sm:text-sm text-text outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans text-secondary font-medium hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs font-sans text-text outline-none focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-secondary/15">
          <span className="text-[11px] font-sans font-medium text-secondary mr-1">Categories:</span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-sans transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-surface font-medium'
                : 'bg-background hover:bg-secondary/15 text-text border border-secondary/25'
            }`}
          >
            All Categories ({records.length})
          </button>

          {categories.map((cat) => {
            const count = records.filter((r) => r.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-sans transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-primary text-surface font-medium'
                    : 'bg-background hover:bg-secondary/15 text-text border border-secondary/25'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Shayari Cards */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-2xl bg-surface border border-secondary/20 shadow-soft">
          <Flame className="w-8 h-8 text-secondary/40 mx-auto mb-2" />
          <h3 className="font-serif-indian text-lg text-text font-bold">No verses found</h3>
          <p className="text-xs font-sans text-secondary mt-1">
            Try adjusting your search query or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRecords.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl bg-surface border transition-all paper-texture flex flex-col justify-between shadow-soft ${
                item.status === 'draft'
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-secondary/25 hover:border-primary/40'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-secondary/15">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl select-none">{item.emoji || '🪔'}</span>
                    <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#F3EBDD] border border-secondary/20 text-secondary">
                      {item.tag || item.category_id}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.status === 'published'
                        ? 'bg-green-500/10 text-green-700 border border-green-500/25'
                        : 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                    }`}
                  >
                    {item.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Hindi Verse */}
                <p className="font-serif-indian text-sm sm:text-base text-text leading-relaxed whitespace-pre-line mb-3">
                  {item.hindi}
                </p>

                {/* English Meaning */}
                {item.english && (
                  <p className="font-sans text-xs text-text/75 italic leading-relaxed pt-2 border-t border-secondary/15 mb-3">
                    "{item.english}"
                  </p>
                )}

                {/* Optional Image Preview */}
                {item.image_url && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-secondary/20 h-28 bg-background">
                    <img
                      src={item.image_url}
                      alt={item.tag}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Action Buttons */}
              <div className="pt-3 border-t border-secondary/15 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Toggle Status */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    title={item.status === 'published' ? 'Unpublish to draft' : 'Publish live'}
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                      item.status === 'published'
                        ? 'border-secondary/25 text-secondary hover:bg-background'
                        : 'border-green-600/30 text-green-700 bg-green-50'
                    }`}
                  >
                    {item.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="text-[11px] font-sans hidden sm:inline">
                      {item.status === 'published' ? 'Draft' : 'Publish'}
                    </span>
                  </button>

                  {/* Copy Text */}
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    title="Copy verse text"
                    className="p-1.5 rounded-lg border border-secondary/25 hover:bg-background text-text text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-secondary" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-surface hover:bg-background border border-secondary/30 text-primary hover:border-primary text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-sans font-medium">Edit</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    title="Delete verse"
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-text/50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT MODAL WITH LIVE PREVIEW */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-text/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-surface border border-secondary/30 rounded-2xl shadow-earthy paper-texture overflow-hidden max-h-[90vh] flex flex-col my-auto">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-secondary/20 flex items-center justify-between bg-background/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-indian text-lg font-bold text-text">
                    {isEditing ? 'Edit Shayari / Wish' : 'Create New Shayari / Wish'}
                  </h3>
                  <p className="text-[11px] font-sans text-secondary">
                    Changes will sync live to your public Diwali site upon saving.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-text/60 hover:text-text hover:bg-background"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two Columns on Desktop (Form on left, Live Card Preview on right) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Form Controls */}
              <form onSubmit={handleSaveForm} id="shayari-form" className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-medium text-text mb-1">
                      Type
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs text-text outline-none focus:border-primary"
                    >
                      <option value="shayari">Shayari (शायरी)</option>
                      <option value="wish">Wish / Blessing (शुभकामना)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-medium text-text mb-1">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs text-text outline-none focus:border-primary"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.emoji} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-medium text-text mb-1">
                    Main Verse / Message (Hindi or Hinglish) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formHindi}
                    onChange={(e) => setFormHindi(e.target.value)}
                    placeholder="Diwali par mithai khoob khaana,&#10;Khushiyon ke saath selfie bhi banana..."
                    className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs sm:text-sm text-text outline-none focus:border-primary font-serif-indian leading-relaxed placeholder:font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-medium text-text mb-1">
                    English Translation / Context (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formEnglish}
                    onChange={(e) => setFormEnglish(e.target.value)}
                    placeholder="Eat as much sweets as your heart desires..."
                    className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs text-text outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-medium text-text mb-1">
                      Tag / Theme Label
                    </label>
                    <input
                      type="text"
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value)}
                      placeholder="Mithai & Calories"
                      className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs text-text outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-medium text-text mb-1">
                      Emoji Accent
                    </label>
                    <input
                      type="text"
                      value={formEmoji}
                      onChange={(e) => setFormEmoji(e.target.value)}
                      placeholder="🍬 or 🪔"
                      className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs text-text outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-medium text-text mb-1">
                    Image Attachment URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://... (or from Media Library)"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs text-text outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-medium text-text mb-1">
                    Publish Status
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-1.5 text-xs font-sans cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formStatus === 'published'}
                        onChange={() => setFormStatus('published')}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="font-medium text-green-700">Published (Live)</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs font-sans cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formStatus === 'draft'}
                        onChange={() => setFormStatus('draft')}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="font-medium text-amber-700">Draft (Private)</span>
                    </label>
                  </div>
                </div>
              </form>

              {/* Right Column: Live Card Preview */}
              <div className="flex flex-col">
                <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-secondary mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Live Website Preview</span>
                </div>

                <div className="flex-1 p-6 rounded-2xl bg-surface border-2 border-primary/30 shadow-earthy paper-texture flex flex-col justify-between text-center relative">
                  <div>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EBDD] border border-secondary/25 text-xs font-sans text-secondary font-medium mb-4 shadow-soft">
                      <span>{formEmoji || '🪔'}</span>
                      <span>{formTag || 'Diwali Blessing'}</span>
                    </div>

                    {/* Hindi Verse */}
                    <p className="font-serif-indian text-base sm:text-lg text-text leading-relaxed whitespace-pre-line mb-4 font-normal">
                      {formHindi || 'यहाँ आपकी शायरी या शुभकामना का पूर्वावलोकन दिखाई देगा...'}
                    </p>

                    {/* English Context */}
                    {formEnglish && (
                      <p className="font-sans text-xs text-text/80 italic leading-relaxed pt-3 border-t border-secondary/15">
                        "{formEnglish}"
                      </p>
                    )}

                    {/* Attached Image Preview */}
                    {formImageUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-secondary/20 max-h-36">
                        <img
                          src={formImageUrl}
                          alt="Attached media"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-secondary/15 text-[11px] font-sans text-secondary/70">
                    Status: <span className="font-semibold capitalize text-primary">{formStatus}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-secondary/20 bg-background/50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-secondary/30 text-xs font-sans text-text hover:bg-background"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="shayari-form"
                disabled={formSaving}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-[#A64C28] text-surface font-sans text-xs sm:text-sm font-medium shadow-soft transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{formSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Verse'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
