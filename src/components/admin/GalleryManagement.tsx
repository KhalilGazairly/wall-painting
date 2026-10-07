import { useState, useEffect, type FormEvent } from 'react';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import type { GalleryItem, GalleryCategory, MediaType, GalleryItemInput } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Video as VideoIcon,
  Check,
} from 'lucide-react';

export function GalleryManagement() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setItems(data as GalleryItem[]);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);

    // Delete from storage
    await supabase.storage.from(STORAGE_BUCKET).remove([deleteTarget.storage_path]);

    // Delete from database
    const { error } = await supabase.from('gallery_items').delete().eq('id', deleteTarget.id);

    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
    setDeleteLoading(false);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">إدارة المعرض</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            إدارة وإضافة وحذف الأعمال في معرض الصور والفيديوهات
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-sm"
        >
          <Plus className="h-5 w-5" />
          إضافة عمل جديد
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-charcoal-100">
          <p className="text-3xl font-bold text-charcoal-900">{items.length}</p>
          <p className="mt-1 text-sm text-charcoal-500">إجمالي الأعمال</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-charcoal-100">
          <p className="text-3xl font-bold text-gold-600">{items.filter((i) => i.category === 'wall_paint').length}</p>
          <p className="mt-1 text-sm text-charcoal-500">دهانات حوائط</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-charcoal-100">
          <p className="text-3xl font-bold text-bronze-600">{items.filter((i) => i.category === 'artwork').length}</p>
          <p className="mt-1 text-sm text-charcoal-500">أعمال فنية</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-charcoal-100">
          <p className="text-3xl font-bold text-green-600">{items.filter((i) => i.media_type === 'video').length}</p>
          <p className="mt-1 text-sm text-charcoal-500">فيديوهات</p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl shimmer-bg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-charcoal-200 bg-charcoal-50 py-20 text-center">
          <ImageIcon className="h-12 w-12 text-charcoal-300" />
          <p className="mt-4 text-lg font-medium text-charcoal-400">لا توجد أعمال في المعرض</p>
          <p className="mt-1 text-sm text-charcoal-300">اضغط على "إضافة عمل جديد" للبدء</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-charcoal-100 transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-100">
                {item.media_type === 'video' ? (
                  <video
                    src={item.media_url}
                    className="h-full w-full object-cover"
                    muted
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={item.media_url}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-charcoal-700 backdrop-blur-sm">
                  {item.media_type === 'video' ? (
                    <span className="flex items-center gap-1">
                      <VideoIcon className="h-3 w-3" /> فيديو
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> صورة
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <span className="inline-block rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
                  {CATEGORY_LABELS[item.category]}
                </span>
                <h3 className="mt-2 text-lg font-bold text-charcoal-900">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 text-sm text-charcoal-400 line-clamp-2">{item.description}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-charcoal-100 px-4 py-2.5 text-sm font-semibold text-charcoal-700 transition-colors hover:bg-charcoal-200"
                  >
                    <Pencil className="h-4 w-4" />
                    تعديل
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <AddEditModal
          item={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSaved={(item, isNew) => {
            if (isNew) {
              setItems((prev) => [item, ...prev]);
            } else {
              setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
            }
            setShowAddModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => !deleteLoading && setDeleteTarget(null)}
        >
          <div
            className="mx-4 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <Trash2 className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-charcoal-900">تأكيد الحذف</h3>
            <p className="mt-2 text-charcoal-500">
              هل أنت متأكد من حذف "{deleteTarget.title}"؟ سيتم حذف العمل نهائياً من المعرض والتخزين.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    نعم، احذف
                  </>
                )}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="flex-1 rounded-xl bg-charcoal-100 px-5 py-3 text-sm font-semibold text-charcoal-700 transition-colors hover:bg-charcoal-200"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Add/Edit Modal ----

interface AddEditModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onSaved: (item: GalleryItem, isNew: boolean) => void;
}

function AddEditModal({ item, onClose, onSaved }: AddEditModalProps) {
  const isEdit = !!item;
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [category, setCategory] = useState<GalleryCategory>(item?.category ?? 'wall_paint');
  const [mediaType, setMediaType] = useState<MediaType>(item?.media_type ?? 'photo');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('يرجى إدخال عنوان العمل');
      return;
    }

    if (!isEdit && !file) {
      setError('يرجى اختيار ملف للرفع');
      return;
    }

    setUploading(true);

    try {
      let mediaUrl = item?.media_url ?? '';
      let storagePath = item?.storage_path ?? '';

      if (file) {
        // Upload to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, file);

        if (uploadError) throw new Error('فشل رفع الملف: ' + uploadError.message);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filePath);

        mediaUrl = urlData.publicUrl;
        storagePath = filePath;

        // If editing, delete old file from storage
        if (isEdit && item?.storage_path) {
          await supabase.storage.from(STORAGE_BUCKET).remove([item.storage_path]);
        }
      }

      const input: GalleryItemInput = {
        title: title.trim(),
        description: description.trim() || null,
        category,
        media_type: mediaType,
        media_url: mediaUrl,
        storage_path: storagePath,
      };

      if (isEdit && item) {
        const { data, error: updateError } = await supabase
          .from('gallery_items')
          .update({
            ...input,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id)
          .select('*')
          .single();

        if (updateError) throw updateError;
        if (data) {
          setSuccess(true);
          setTimeout(() => onSaved(data as GalleryItem, false), 600);
        }
      } else {
        const { data, error: insertError } = await supabase
          .from('gallery_items')
          .insert(input)
          .select('*')
          .single();

        if (insertError) throw insertError;
        if (data) {
          setSuccess(true);
          setTimeout(() => onSaved(data as GalleryItem, true), 600);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/80 backdrop-blur-sm animate-fade-in"
      onClick={() => !uploading && onClose()}
    >
      <div
        className="mx-4 my-8 w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-scale-in max-h-[90vh] lg:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-charcoal-900">
            {isEdit ? 'تعديل العمل' : 'إضافة عمل جديد'}
          </h2>
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal-100 text-charcoal-500 transition-colors hover:bg-charcoal-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="mt-4 text-lg font-bold text-charcoal-900">
              {isEdit ? 'تم تحديث العمل بنجاح' : 'تمت إضافة العمل بنجاح'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* File upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal-700">
                {isEdit ? 'تغيير الملف (اختياري)' : 'رفع الملف'} *
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-charcoal-200 bg-charcoal-50 px-4 py-8 text-center transition-colors hover:border-gold-400 hover:bg-gold-50">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                  disabled={uploading}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <Check className="h-8 w-8 text-green-600" />
                    <p className="text-sm font-medium text-charcoal-700">{file.name}</p>
                    <p className="text-xs text-charcoal-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-charcoal-300" />
                    <p className="text-sm font-medium text-charcoal-500">
                      اضغط لاختيار صورة أو فيديو
                    </p>
                    <p className="text-xs text-charcoal-400">JPG, PNG, MP4, WebM</p>
                  </div>
                )}
              </label>
            </div>

            {/* Media type toggle */}
            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal-700">نوع الوسائط</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMediaType('photo')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    mediaType === 'photo'
                      ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                      : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />
                  صورة
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    mediaType === 'video'
                      ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                      : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                  }`}
                >
                  <VideoIcon className="h-4 w-4" />
                  فيديو
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal-700">التصنيف</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                disabled={uploading}
                className="w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-800 transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              >
                <option value="wall_paint">دهانات حوائط</option>
                <option value="artwork">أعمال فنية</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal-700">العنوان *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
                required
                className="w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 text-sm text-charcoal-800 transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                placeholder="مثال: غرفة المعيشة - دهانات ديكورية"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal-700">وصف مختصر</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                rows={3}
                className="w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 text-sm text-charcoal-800 transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 resize-none"
                placeholder="وصف موجز للعمل..."
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-600 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  isEdit ? 'حفظ التعديلات' : 'إضافة العمل'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={uploading}
                className="rounded-xl bg-charcoal-100 px-5 py-3 text-sm font-semibold text-charcoal-700 transition-colors hover:bg-charcoal-200"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
