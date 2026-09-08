import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { getYouTubeVideoId } from './linkPreviewUtils';

/**
 * Komponen Pemutar Video Inline Terpadu (YouTube, TikTok, Instagram, Scratch)
 * Dilengkapi tombol Layar Penuh (Fullscreen) untuk desktop/HP dan tombol Tutup (X)
 */
export default function VideoPlayerEmbed({ preview, onClose }) {
    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Memantau perubahan status fullscreen dari browser (termasuk tombol ESC di keyboard)
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentElem = document.fullscreenElement === containerRef.current || 
                                  document.webkitFullscreenElement === containerRef.current;
            setIsFullscreen(isCurrentElem);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, []);

    if (!preview) return null;

    const targetUrl = preview.url || (preview.videoId ? `https://www.youtube.com/watch?v=${preview.videoId}` : '');
    const videoId = preview.videoId || (targetUrl ? getYouTubeVideoId(targetUrl) : null);
    const platform = preview.platform || (videoId ? 'youtube' : '');

    // Toggle fullscreen menggunakan Fullscreen API browser
    const toggleFullscreen = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (containerRef.current?.requestFullscreen) {
                    await containerRef.current.requestFullscreen();
                } else if (containerRef.current?.webkitRequestFullscreen) {
                    await containerRef.current.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                }
            }
        } catch (err) {
            console.warn('Gagal mengubah mode fullscreen:', err);
        }
    };

    // Handler penutup player, keluar fullscreen terlebih dahulu jika sedang fullscreen
    const handleClose = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (document.fullscreenElement || document.webkitFullscreenElement) {
            try {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                }
            } catch {
                // Abaikan jika exit fullscreen gagal
            }
        }

        if (onClose) onClose();
    };

    // Render iframe berdasarkan platform
    const renderEmbedContent = () => {
        // 1. YouTube Player
        if (platform === 'youtube' || (!platform && videoId)) {
            return (
                <div className={`w-full bg-black relative flex items-center justify-center ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&enablejsapi=1&fs=1&rel=0`}
                        title={preview.title || 'Pemutar Video YouTube'}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                        allowFullScreen
                    />
                </div>
            );
        }

        // 2. TikTok Player
        if (platform === 'tiktok') {
            if (videoId) {
                return (
                    <div className={`w-full bg-black flex justify-center items-center py-1 ${isFullscreen ? 'h-full' : ''}`}>
                        <div className={`w-full max-w-[340px] aspect-[9/16] bg-black ${isFullscreen ? 'max-h-[85vh]' : 'max-h-[440px]'}`}>
                            <iframe
                                src={`https://www.tiktok.com/embed/v2/${videoId}`}
                                title={preview.title || 'Pemutar TikTok'}
                                className="w-full h-full border-0 rounded-lg"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                            />
                        </div>
                    </div>
                );
            }
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
                    <div className={`w-full bg-black flex justify-center items-center py-1 ${isFullscreen ? 'h-full' : ''}`}>
                        <div className={`w-full max-w-[340px] aspect-[9/16] bg-black ${isFullscreen ? 'max-h-[85vh]' : 'max-h-[440px]'}`}>
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
                <div className={`w-full bg-black relative flex items-center justify-center ${isFullscreen ? 'h-full' : 'aspect-[4/3]'}`}>
                    <iframe
                        src={`https://scratch.mit.edu/projects/${videoId}/embed`}
                        title={preview.title || 'Proyek Scratch'}
                        className="w-full h-full border-0"
                        allow="fullscreen"
                        allowFullScreen
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <div 
            ref={containerRef} 
            className={`w-full bg-black relative border-b border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[999999] h-screen w-screen flex items-center justify-center' : ''}`}
        >
            {renderEmbedContent()}

            {/* Baris Tombol Aksi Melayang di Kanan Atas: Layar Penuh & Tutup */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 z-30 pointer-events-auto">

                {/* Tombol Fullscreen / Layar Penuh */}
                <button
                    type="button"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? 'Keluar dari layar penuh' : 'Tonton layar penuh (Fullscreen)'}
                    className="px-2 py-1 rounded-full bg-black/80 hover:bg-slate-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg transition-colors cursor-pointer border border-white/20 backdrop-blur-xs"
                >
                    {isFullscreen ? (
                        <>
                            <Minimize2 size={12} />
                            <span className="hidden sm:inline">Kecilkan</span>
                        </>
                    ) : (
                        <>
                            <Maximize2 size={12} />
                            <span className="hidden sm:inline"></span>
                        </>
                    )}
                </button>

                {/* Tombol Tutup Player */}
                <button
                    type="button"
                    onClick={handleClose}
                    title="Tutup pemutar video"
                    className="px-2.5 py-1 rounded-full bg-black/80 hover:bg-red-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg transition-colors cursor-pointer border border-white/20 backdrop-blur-xs"
                >
                    <X size={12} />
                    <span></span>
                </button>
            </div>
        </div>
    );
}
