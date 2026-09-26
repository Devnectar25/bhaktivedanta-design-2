import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud, Image as ImageIcon, Trash2, Eye, EyeOff,
  MoveUp, MoveDown, CheckCircle2, RefreshCw, Plus,
  Layers, AlertCircle, Sparkles, ExternalLink, Sliders
} from 'lucide-react';
import {
  getHeroBanners,
  createHeroBanner,
  bulkCreateHeroBanners,
  updateHeroBanners,
  deleteHeroBanner,
  defaultHeroBanners
} from '../../../utils/api';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../utils/swal';

const MAX_BANNERS = 10;

export default function HeroBanners({ embedded = false }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [saving, setSaving] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [previewAutoPlay, setPreviewAutoPlay] = useState(true);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Load banners on mount
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await getHeroBanners();
      if (Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
        setBanners(sorted);
      }
    } catch (err) {
      console.error('Error fetching hero banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();

    const handleSync = () => fetchBanners();
    window.addEventListener('hero_banners_updated', handleSync);
    window.addEventListener('admin_data_updated', handleSync);

    return () => {
      window.removeEventListener('hero_banners_updated', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
    };
  }, []);

  // Filter active banners for preview
  const activeBanners = banners.filter(b => b.isActive !== false);

  // Auto-play preview cycling
  useEffect(() => {
    if (!previewAutoPlay || activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActivePreviewIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [previewAutoPlay, activeBanners.length]);

  // Compress image file to size-optimized Base64 URL via canvas
  const processImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('Failed to load image into canvas'));
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1920; // 1080p full-bleed hero resolution
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Use WebP with JPEG fallback for high quality and minimal storage footprint
          let dataUrl = canvas.toDataURL('image/webp', 0.84);
          if (!dataUrl || dataUrl.indexOf('data:image/webp') !== 0) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }
          resolve({
            dataUrl,
            fileName: file.name
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle multiple files uploaded at once (Validated: Max 10 images total)
  const handleMultipleFiles = async (files) => {
    if (!files || files.length === 0) return;

    // Validation: Maximum 10 images limit
    if (banners.length >= MAX_BANNERS) {
      showErrorAlert(
        'Limit Reached (Max 10 Images)',
        `Maximum ${MAX_BANNERS} background images are allowed in the database. Please delete an existing image below before uploading more.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showErrorAlert('Invalid File', 'Please select valid image files (JPG, PNG, WebP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validation: Check if selection exceeds remaining available slots
    const availableSlots = MAX_BANNERS - banners.length;
    if (validFiles.length > availableSlots) {
      showErrorAlert(
        'Limit Exceeded (Max 10 Images)',
        `You selected ${validFiles.length} images, but only ${availableSlots} more image${availableSlots === 1 ? '' : 's'} can be added. Maximum limit is ${MAX_BANNERS} images (currently ${banners.length} in database).`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setUploadProgress(`Processing 0 / ${validFiles.length} images...`);

    const newBannerItems = [];
    const currentMaxOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order || 0)) : 0;

    try {
      for (let i = 0; i < validFiles.length; i++) {
        setUploadProgress(`Processing & optimizing image ${i + 1} of ${validFiles.length}...`);
        const { dataUrl, fileName } = await processImageFile(validFiles[i]);

        const cleanTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        newBannerItems.push({
          id: `hero-banner-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          imageUrl: dataUrl,
          title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
          subtitle: 'Bhaktivedanta Hospital & Research Institute',
          order: currentMaxOrder + i + 1,
          isActive: true,
          createdAt: new Date().toISOString()
        });
      }

      setUploadProgress('Saving to database...');
      await bulkCreateHeroBanners(newBannerItems);

      const updatedList = [...banners, ...newBannerItems];
      setBanners(updatedList);
      showSuccessAlert(
        'Upload Successful!',
        `${newBannerItems.length} background image${newBannerItems.length > 1 ? 's' : ''} uploaded and saved to database.`
      );
    } catch (err) {
      console.error('Batch upload error:', err);
      showErrorAlert('Upload Failed', err?.message || 'An error occurred while uploading background images.');
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add banner via URL (Validated: Max 10 images total)
  const handleAddUrlBanner = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (banners.length >= MAX_BANNERS) {
      showErrorAlert(
        'Limit Reached (Max 10 Images)',
        `Maximum ${MAX_BANNERS} background images are allowed. Please remove an existing image before adding a new one.`
      );
      return;
    }

    try {
      setSaving(true);
      const currentMaxOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order || 0)) : 0;
      const newBanner = {
        id: `hero-banner-${Date.now()}`,
        imageUrl: urlInput.trim(),
        title: urlTitle.trim() || 'Bhaktivedanta Hospital Campus',
        subtitle: 'Bhaktivedanta Hospital & Research Institute',
        order: currentMaxOrder + 1,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      await createHeroBanner(newBanner);
      setBanners([...banners, newBanner]);
      setUrlInput('');
      setUrlTitle('');
      setShowUrlModal(false);
      showSuccessAlert('Image Added', 'New background image added from URL.');
    } catch (err) {
      showErrorAlert('Error', 'Failed to save background image.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (id) => {
    const updated = banners.map(b => (b.id === id ? { ...b, isActive: !b.isActive } : b));
    setBanners(updated);
    try {
      await updateHeroBanners(updated);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Reorder items
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const copy = [...banners];
    const [movedItem] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, movedItem);

    // Re-assign order indices
    const reordered = copy.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setBanners(reordered);
    try {
      await updateHeroBanners(reordered);
    } catch (err) {
      console.error('Failed to save reordering:', err);
    }
  };

  // Delete banner
  const handleDelete = async (id, title) => {
    if (banners.length <= 1) {
      showErrorAlert('Cannot Delete', 'At least one background image must remain in the database.');
      return;
    }

    const confirmed = await showConfirmDialog(
      'Delete Background Image?',
      `Are you sure you want to remove "${title || 'this background image'}" from the database?`
    );

    if (confirmed) {
      try {
        await deleteHeroBanner(id);
        const filtered = banners.filter(b => b.id !== id);
        setBanners(filtered);
        showSuccessAlert('Deleted', 'Background image has been removed.');
      } catch (err) {
        showErrorAlert('Error', 'Failed to delete background image.');
      }
    }
  };

  // Reset to default original banner
  const handleResetToDefault = async () => {
    const confirmed = await showConfirmDialog(
      'Reset to Default Banner?',
      'This will reset the background images back to the original default hospital building photo.'
    );

    if (confirmed) {
      try {
        setSaving(true);
        await updateHeroBanners(defaultHeroBanners);
        setBanners(defaultHeroBanners);
        showSuccessAlert('Reset Successful', 'Hero background reset to original default image.');
      } catch (err) {
        showErrorAlert('Error', 'Failed to reset hero banners.');
      } finally {
        setSaving(false);
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultipleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className={`space-y-6 ${embedded ? 'w-full' : 'max-w-7xl mx-auto pb-16'}`}>
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {!embedded && (
            <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
              <span>Dashboard</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-600 font-bold">Hero Background Banners</span>
            </nav>
          )}
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800">Hero Background Banners</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              banners.length >= MAX_BANNERS
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {banners.length} / {MAX_BANNERS} Images in Database {banners.length >= MAX_BANNERS ? '(Limit Reached)' : ''}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Upload up to {MAX_BANNERS} background images for the homepage hero. Images auto-rotate smoothly on the public website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
            title="Reset back to factory default background"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (banners.length >= MAX_BANNERS) {
                showErrorAlert(
                  'Limit Reached (Max 10 Images)',
                  `Maximum ${MAX_BANNERS} background images are allowed in the database. Please delete an image below before adding another.`
                );
                return;
              }
              setShowUrlModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Add via URL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (banners.length >= MAX_BANNERS) {
                showErrorAlert(
                  'Limit Reached (Max 10 Images)',
                  `Maximum ${MAX_BANNERS} background images are allowed in the database. Please delete an image below before uploading more.`
                );
                return;
              }
              fileInputRef.current?.click();
            }}
            disabled={uploading}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors shadow-sm ${
              banners.length >= MAX_BANNERS
                ? 'bg-slate-400 cursor-not-allowed hover:bg-slate-400'
                : 'bg-[#1e3a8a] hover:bg-blue-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Images</span>
          </button>
        </div>
      </div>

      {/* Hidden Multi-file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleMultipleFiles(e.target.files)}
      />

      {/* Drag & Drop Multi-Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (uploading) return;
          if (banners.length >= MAX_BANNERS) {
            showErrorAlert(
              'Limit Reached (Max 10 Images)',
              `Maximum ${MAX_BANNERS} background images are allowed in the database. Please delete an existing image below to free up space.`
            );
            return;
          }
          fileInputRef.current?.click();
        }}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          banners.length >= MAX_BANNERS
            ? 'border-amber-300 bg-amber-50/40 cursor-not-allowed'
            : dragOver
              ? 'border-[#1e3a8a] bg-blue-50/70 scale-[1.01] cursor-pointer'
              : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50 shadow-sm cursor-pointer'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto pointer-events-none">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            banners.length >= MAX_BANNERS
              ? 'bg-amber-100 text-amber-700'
              : dragOver
                ? 'bg-[#1e3a8a] text-white'
                : 'bg-blue-50 text-[#1e3a8a]'
          }`}>
            {uploading ? (
              <div className="w-6 h-6 border-2 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
            ) : banners.length >= MAX_BANNERS ? (
              <AlertCircle className="w-7 h-7 text-amber-600" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-800">
              {uploading
                ? uploadProgress
                : banners.length >= MAX_BANNERS
                  ? 'Maximum 10 Images Limit Reached'
                  : 'Click or Drag & Drop Multiple Images Here'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {banners.length >= MAX_BANNERS
                ? 'You have reached the maximum allowed limit of 10 background images. Delete an image from the list below to upload new ones.'
                : `Select 1 to ${MAX_BANNERS - banners.length} images at once. Images will be optimized and saved directly into the database.`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <span>Supports JPG, PNG, WebP</span>
            <span>•</span>
            <span>Max 1920px Full-HD</span>
            <span>•</span>
            <span className={banners.length >= MAX_BANNERS ? 'text-amber-600 font-bold' : 'text-[#fea619] font-bold'}>
              {banners.length >= MAX_BANNERS
                ? '10 of 10 slots filled'
                : `Max 10 Images Total (${MAX_BANNERS - banners.length} slots available)`}
            </span>
          </div>
        </div>
      </div>

      {/* Live Hero Simulation / Interactive Preview Box */}
      {activeBanners.length > 0 && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 relative">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-950/80 border-b border-white/10 text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Homepage Hero Preview</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">
                Slide {activePreviewIndex + 1} of {activeBanners.length}
              </span>
              <button
                type="button"
                onClick={() => setPreviewAutoPlay(!previewAutoPlay)}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-semibold transition-colors"
              >
                {previewAutoPlay ? 'Pause Preview' : 'Auto Play'}
              </button>
            </div>
          </div>

          {/* Mini Hero Mockup */}
          <div className="relative h-64 md:h-80 w-full overflow-hidden flex items-center">
            {activeBanners.map((banner, idx) => (
              <div
                key={banner.id}
                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                style={{ opacity: idx === activePreviewIndex ? 1 : 0 }}
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'Hero Banner'}
                  className="w-full h-full object-cover object-center"
                />
                {/* Brand Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, rgba(12, 26, 53, 0.94) 0%, rgba(12, 26, 53, 0.65) 45%, rgba(12, 26, 53, 0.15) 100%)'
                  }}
                />
              </div>
            ))}

            {/* Overlaid mock text to see exact contrast */}
            <div className="relative z-10 px-8 max-w-xl text-white">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
                Hospital Homepage Hero
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Compassionate Care with <span className="text-amber-400">Advanced Technology</span>
              </h3>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                Where expert healing wisdom meets modern medical excellence. We are dedicated to your wellness.
              </p>
              <div className="flex gap-2.5 mt-4">
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#fea619] text-slate-900 shadow">
                  Explore Services
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/40 text-white">
                  Contact Us
                </span>
              </div>
            </div>

            {/* Thumbnail dots selector */}
            {activeBanners.length > 1 && (
              <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {activeBanners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePreviewIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === activePreviewIndex
                        ? 'w-6 h-2 bg-[#fea619]'
                        : 'w-2 h-2 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Background Images List / Management Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Database Background Images ({banners.length})
            </h3>
            <p className="text-xs text-slate-500">
              Drag or use arrows to change slide order. Toggle the eye button to show or hide from homepage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {activeBanners.length} Active on Homepage
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-slate-500">Loading background images...</span>
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No background images found</p>
            <p className="text-xs text-slate-400 mt-1">Upload images or reset to default to get started.</p>
            <button
              onClick={handleResetToDefault}
              className="mt-4 px-4 py-2 bg-[#1e3a8a] text-white text-xs font-bold rounded-lg hover:bg-blue-900 transition-colors"
            >
              Load Default Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`bg-white rounded-xl border transition-all duration-200 shadow-sm overflow-hidden flex flex-col ${
                  banner.isActive !== false
                    ? 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                {/* Image Thumbnail with Overlay controls */}
                <div className="relative h-44 bg-slate-100 overflow-hidden group">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Hero Banner'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Order Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-slate-900/80 backdrop-blur text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow">
                    <span>#{banner.order || index + 1}</span>
                    {index === 0 && <span className="text-[#fea619] text-[10px] ml-1">(Main Slide)</span>}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${
                      banner.isActive !== false
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-500 text-white'
                    }`}>
                      {banner.isActive !== false ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  {/* Reordering Floating Arrows */}
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-slate-900/80 backdrop-blur p-1 rounded-lg">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      className="p-1 text-white hover:text-[#fea619] disabled:opacity-30 disabled:hover:text-white transition-colors"
                      title="Move Left / Earlier"
                    >
                      <MoveUp className="w-3.5 h-3.5 rotate-[-90deg]" />
                    </button>
                    <button
                      type="button"
                      disabled={index === banners.length - 1}
                      onClick={() => handleMove(index, 1)}
                      className="p-1 text-white hover:text-[#fea619] disabled:opacity-30 disabled:hover:text-white transition-colors"
                      title="Move Right / Later"
                    >
                      <MoveDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <input
                      type="text"
                      className="w-full font-bold text-sm text-slate-800 border-b border-transparent hover:border-slate-200 focus:border-[#1e3a8a] outline-none px-1 py-0.5 transition-colors"
                      value={banner.title || ''}
                      placeholder="Image label (e.g. Main Hospital Building)"
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setBanners(prev => prev.map(b => (b.id === banner.id ? { ...b, title: newTitle } : b)));
                      }}
                      onBlur={() => updateHeroBanners(banners)}
                    />
                    <p className="text-[11px] text-slate-400 mt-1 px-1">
                      {banner.imageUrl.startsWith('data:') ? 'Stored in Database (Base64)' : banner.imageUrl}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        banner.isActive !== false
                          ? 'bg-blue-50 text-[#1e3a8a] hover:bg-blue-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {banner.isActive !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(banner.id, banner.title)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete from database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Add via URL */}
      {showUrlModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#1e3a8a]">
                <ExternalLink className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-800">Add Background via URL</h3>
              </div>
              <button
                onClick={() => setShowUrlModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUrlBanner} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Image Web URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/hospital-building.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full text-xs border border-slate-200 focus:border-[#1e3a8a] rounded-lg px-3 py-2 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Image Title / Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. New Wing Building"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  className="w-full text-xs border border-slate-200 focus:border-[#1e3a8a] rounded-lg px-3 py-2 outline-none"
                />
              </div>

              {urlInput && (
                <div className="h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                  <img
                    src={urlInput}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !urlInput.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#1e3a8a] hover:bg-blue-900 rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Add to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
