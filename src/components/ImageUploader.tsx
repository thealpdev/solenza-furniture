'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    bucketName?: string;
    folderName?: string;
    currentImage?: string;
    label?: string;
}

export default function ImageUploader({
    onUpload,
    bucketName = 'product-images',
    folderName = 'general',
    currentImage,
    label = 'Görsel Yükle'
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('Lütfen bir görsel seçin.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${folderName}/${Date.now()}.${fileExt}`;

            // Upload file
            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get URL
            const { data } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName);

            if (data) {
                setPreview(data.publicUrl);
                onUpload(data.publicUrl);
                toast.success('Görsel başarıyla yüklendi!');
            }

        } catch (error: any) {
            toast.error('Görsel yüklenirken hata oluştu: ' + error.message);
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">
                {label}
            </label>

            <div className="flex items-start gap-6">
                {/* Preview */}
                <div className="relative w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                            Yükleniyor...
                        </div>
                    )}
                </div>

                {/* Action */}
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        id={`file-upload-${label.replace(/\s+/g, '-')}`}
                        className="hidden"
                    />
                    <label
                        htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 font-semibold cursor-pointer hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {preview ? 'Görseli Değiştir' : 'Görsel Seç'}
                    </label>
                    <p className="text-xs text-gray-400 mt-2">
                        PNG, JPG, GIF (Max 5MB)<br />
                        Önerilen: 1920x1080 (Hero), 800x800 (Kare)
                    </p>
                </div>
            </div>
        </div>
    );
}
