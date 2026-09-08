import React from 'react';
import { X, ExternalLink } from 'lucide-react';

/**
 * Komponen Pemutar Video Inline Terpadu (YouTube, TikTok, Instagram, Scratch)
 * Dilengkapi tombol Tutup (X) dan kontrol eksklusif agar tidak tumpang tindih
 */
export default function VideoPlayerEmbed({ preview, onClose }) {
    if (!preview) return null;

    const platform = preview.platform || '';
    const videoId = preview.videoId;
    const targetUrl = preview.url;

    // Render iframe berdasarkan platform
    const renderEmbedContent = () => {
        // 1. YouTube Player
        if (platform === 'youtube' || (!platform && videoId)) {
            return (
                <div className="w-full aspect-video bg-black relative">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={preview.title || 'Pemutar Video YouTube'}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            );
        }

        // 2. TikTok Player
        if (platform === 'tiktok') {
            if (videoId) {
                return (
                    <div className="w-full bg-black flex justify-center py-1">
                        <div className="w-full max-w-[340px] aspect-[9/16] max-h-[440px] bg-black">
                            <iframe
                                src={`https://www.tiktok.com/embed/v2/${videoId}`}
                                title={preview.title || 'Pemutar TikTok'}
                                className="w-full h-full border-0 rounded-lg"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                );
            }
            // Fallback jika tidak ada videoId langsung
            return (
                <div className="w-full p-4 bg-slate-950 text-center space-y-2">
                    <p className="text-xs text-slate-300 font-medium">Buka langsung di aplikasi TikTok untuk memutar video lengkap</p>
                    <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow"
                    >
                        <span>Buka di TikTok</span>
                        <ExternalLink size={12} />
                    </a>
                </div>
            );
        }

        // 3. Instagram Player
        if (platform === 'instagram') {
            const shortcode = videoId;
            if (shortcode) {
                return (
                    <div className="w-full bg-black flex justify-center py-1">
                        <div className="w-full max-w-[340px] aspect-[9/16] max-h-[440px] bg-black">
                            <iframe
                                src={`https://www.instagram.com/p/${shortcode}/embed/captioned/`}
                                title={preview.title || 'Instagram Post'}
                                className="w-full h-full border-0 rounded-lg"
                                allowFullScreen
                            />
                        </div>
                    </div>
                );
            }
            return (
                <div className="w-full p-4 bg-slate-950 text-center space-y-2">
                    <p className="text-xs text-slate-300 font-medium">Lihat postingan langsung di Instagram</p>
                    <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 text-white text-xs font-semibold shadow"
                    >
                        <span>Buka di Instagram</span>
                        <ExternalLink size={12} />
                    </a>
                </div>
            );
        }

        // 4. Scratch Player
        if (platform === 'scratch' && videoId) {
            return (
                <div className="w-full aspect-[4/3] bg-black relative">
                    <iframe
                        src={`https://scratch.mit.edu/projects/${videoId}/embed`}
                        title={preview.title || 'Proyek Scratch'}
                        className="w-full h-full border-0"
                        allowFullScreen
                    />
                </div>
            );
        }

        // Fallback Umum
        return null;
    };

    return (
        <div className="w-full bg-black relative border-b border-slate-800">
            {renderEmbedContent()}

            {/* Tombol Tutup Player Melayang di Kanan Atas */}
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onClose) onClose();
                }}
                title="Tutup pemutar video"
                className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/80 hover:bg-red-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg transition-colors z-30 cursor-pointer border border-white/20"
            >
                <X size={12} />
                <span>Tutup</span>
            </button>
        </div>
    );
}
