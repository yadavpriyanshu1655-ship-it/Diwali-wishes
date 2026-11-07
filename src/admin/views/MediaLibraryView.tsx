import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  uploadMediaFile,
  listMediaFiles,
  deleteMediaFile,
  MediaItem,
  isSupabaseConfigured,
} from '../../services/supabase';

export const MediaLibraryView: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    if (!isSupabaseConfigured()) return;
    setLoading(true);
    setErrorMsg(null);
    const { files, error } = await listMediaFiles();
    if (error) {
      setErrorMsg(error);
    } else {
      setMediaFiles(files);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);

    const { error } = await uploadMediaFile(file);

    if (error) {
      setErrorMsg(error);
      setUploading(false);
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    await fetchMedia();
    setUploading(false);
  };

  const handleDelete = async (fileName: string) => {
    if (window.confirm(`Delete "${fileName}" from storage?`)) {
      const { error } = await deleteMediaFile(fileName);
      if (error) {
        setErrorMsg(error);
      } else {
        await fetchMedia();
      }
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-indian text-2xl font-bold text-text">Media Library</h2>
          <p className="text-xs font-sans text-secondary">
            Upload images to your Supabase Storage 'media' bucket and copy URLs for wishes & messages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchMedia}
            disabled={loading}
            className="p-2.5 rounded-xl bg-surface hover:bg-background border border-secondary/30 text-secondary hover:text-primary transition-colors cursor-pointer"
            title="Refresh Media"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#A64C28] text-surface font-sans text-xs sm:text-sm font-medium shadow-soft transition-all cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-8 rounded-2xl bg-surface border-2 border-dashed border-secondary/30 hover:border-primary/50 text-center cursor-pointer transition-colors paper-texture group"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <Upload className="w-6 h-6" />
        </div>
        <h4 className="font-serif-indian text-base font-bold text-text">
          Click or drop an image to upload
        </h4>
        <p className="text-xs font-sans text-secondary mt-1">
          Supported formats: JPG, PNG, WEBP, SVG • Maximum size: 5 MB
        </p>
      </div>

      {/* Media Grid */}
      {mediaFiles.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-2xl bg-surface border border-secondary/20 shadow-soft">
          <ImageIcon className="w-8 h-8 text-secondary/40 mx-auto mb-2" />
          <h3 className="font-serif-indian text-lg text-text font-bold">No images in storage yet</h3>
          <p className="text-xs font-sans text-secondary mt-1">
            Upload your first photo, rangoli, or Diwali greeting card image above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaFiles.map((file) => (
            <div
              key={file.name}
              className="rounded-2xl bg-surface border border-secondary/25 overflow-hidden shadow-soft flex flex-col justify-between group hover:border-primary/40 transition-all paper-texture"
            >
              {/* Image Thumbnail */}
              <div className="aspect-square bg-background relative overflow-hidden flex items-center justify-center">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Info & Actions */}
              <div className="p-3 border-t border-secondary/15 flex flex-col justify-between flex-1">
                <div className="truncate text-xs font-sans font-medium text-text mb-2" title={file.name}>
                  {file.name}
                </div>

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-secondary/15">
                  <button
                    type="button"
                    onClick={() => handleCopy(file.url)}
                    className="p-1.5 rounded-lg border border-secondary/25 hover:bg-background text-text text-xs flex items-center gap-1 transition-colors"
                    title="Copy Public Image URL"
                  >
                    {copiedUrl === file.url ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-secondary" />
                    )}
                    <span className="text-[10px] font-sans">
                      {copiedUrl === file.url ? 'Copied' : 'Copy'}
                    </span>
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-text/50 hover:text-text hover:bg-background transition-colors"
                      title="Open full size"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(file.name)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-text/50 hover:text-red-600 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
