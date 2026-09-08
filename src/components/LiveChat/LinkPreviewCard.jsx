import React, { useState, useEffect, useId } from 'react';
import { ExternalLink, Globe, Play, Image as ImageIcon } from 'lucide-react';
import {
    URL_REGEX,
    cleanUrl,
    extractFirstUrl,
    getYouTubeVideoId,
    getYouTubeThumbnail,
    getWebpageThumbnail,
    getInstantPlatformPreview,
    isDirectImageUrl,
    renderMessageText
} from './linkPreviewUtils';
import VideoPlayerEmbed from './VideoPlayerEmbed';

// Ekspor utilitas agar komponen lain (seperti LiveChat.jsx) dapat mengimpor langsung
export { URL_REGEX, cleanUrl, extractFirstUrl, renderMessageText };

// Cache in-memory agar link yang sama tidak perlu di-fetch berulang kali
const previewCache = new Map();

/**
 * Komponen Kartu Preview Link ala WhatsApp dengan Thumbnail & Pemutar Video Eksklusif
 * (Jika satu video diputar, video lain di chat otomatis tertutup agar tidak berbunyi bersamaan)
 */
export default function LinkPreviewCard({ url, text, isMe }) {
    const rawUrl = url || (text ? extractFirstUrl(text) : '');
    const targetUrl = cleanUrl(rawUrl);

    // ID unik untuk setiap kartu preview agar event playback eksklusif dapat saling berkoordinasi
    const cardId = useId();

    const [preview, setPreview] = useState(() => {
        if (!targetUrl) return null;
        return previewCache.get(targetUrl) || getInstantPlatformPreview(targetUrl);
    });
    const [imgFailed, setImgFailed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Mekanisme Exclusive Video Playback:
    // Mendengarkan event global jika ada video lain yang mulai diputar, video ini otomatis ditutup!
    useEffect(() => {
        const handleOtherVideoPlay = (e) => {
            if (e.detail?.cardId !== cardId) {
                setIsPlaying(false);
            }
        };

        window.addEventListener('livechat-active-video-play', handleOtherVideoPlay);
        return () => {
            window.removeEventListener('livechat-active-video-play', handleOtherVideoPlay);
        };
    }, [cardId]);

    // Fetching metadata preview dari server
    useEffect(() => {
        if (!targetUrl) return;

        // Gunakan cache jika sudah tersedia
        if (previewCache.has(targetUrl)) {
            setPreview(previewCache.get(targetUrl));
            return;
        }

        const instantData = getInstantPlatformPreview(targetUrl);
        if (instantData) {
            setPreview((prev) => prev || instantData);
        }

        let isMounted = true;

        const fetchPreview = async () => {
            try {
                const res = await fetch(`/api/link-preview?url=${encodeURIComponent(targetUrl)}`);
                if (!res.ok) throw new Error('Preview fetch failed');
                const data = await res.json();
                if (isMounted && data && !data.error) {
                    const ytId = getYouTubeVideoId(targetUrl);
                    const effectiveImage =
                        data.image ||
                        (ytId ? getYouTubeThumbnail(ytId) : getWebpageThumbnail(targetUrl));

                    const merged = {
                        ...instantData,
                        ...data,
                        url: targetUrl,
                        image: effectiveImage,
                        isVideo: !!ytId || Boolean(data.isVideo) || Boolean(instantData?.isVideo),
                        platform: data.platform || instantData?.platform || (ytId ? 'youtube' : ''),
                        videoId: data.videoId || ytId || instantData?.videoId,
                        isImage: isDirectImageUrl(targetUrl) || data.isImage
                    };

                    previewCache.set(targetUrl, merged);
                    setPreview(merged);
                }
            } catch {
                // Fallback instant jika fetch gagal
                if (isMounted && instantData) {
                    previewCache.set(targetUrl, instantData);
                    setPreview(instantData);
                }
            }
        };

        fetchPreview();

        return () => {
            isMounted = false;
        };
    }, [targetUrl]);

    if (!targetUrl) return null;

    const ytVideoId = getYouTubeVideoId(targetUrl);
    const activePreview = preview || getInstantPlatformPreview(targetUrl);
    if (!activePreview) return null;

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${activePreview.domain || 'google.com'}&sz=64`;
    const isVideo = Boolean(activePreview.isVideo || activePreview.videoId || ytVideoId);
    const platform = activePreview.platform || (ytVideoId ? 'youtube' : '');
    const displayImage = activePreview.image || (ytVideoId ? getYouTubeThumbnail(ytVideoId) : null);

    // Fungsi untuk memutar video dengan menyiarkan event penutup video lain
    const handleStartPlayback = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Siarkan sinyal ke semua kartu LinkPreviewCard lainnya agar menutup pemutarnya
        window.dispatchEvent(
            new CustomEvent('livechat-active-video-play', {
                detail: { cardId }
            })
        );

        setIsPlaying(true);
    };

    return (
        <div className="mt-2 w-full max-w-full min-w-0 rounded-xl overflow-hidden bg-slate-900/90 border border-slate-700/90 hover:border-slate-500 hover:bg-slate-900 transition-all text-left group shadow-lg">
            {/* 1. KONTEN PEMUTAR VIDEO ATAU THUMBNAIL */}
            {isPlaying && isVideo ? (
                // Komponen Pemutar Video Inline (YouTube, TikTok, Instagram, Scratch)
                <VideoPlayerEmbed
                    preview={activePreview}
                    onClose={() => setIsPlaying(false)}
                />
            ) : (
                // Tampilan Thumbnail (Video / Halaman Web / Gambar Langsung)
                (displayImage && !imgFailed) && (
                    <div className="w-full aspect-video max-h-40 sm:max-h-44 bg-slate-950 relative overflow-hidden group/thumb border-b border-slate-800">
                        <img
                            src={displayImage}
                            alt={activePreview.title || 'Thumbnail Pratinjau'}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top group-hover/thumb:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                const ytId = activePreview.videoId || getYouTubeVideoId(targetUrl);
                                if (ytId && !e.currentTarget.src.includes('hqdefault')) {
                                    e.currentTarget.src = getYouTubeThumbnail(ytId);
                                } else if (!e.currentTarget.src.includes('mshots')) {
                                    e.currentTarget.src = getWebpageThumbnail(targetUrl);
                                } else {
                                    setImgFailed(true);
                                }
                            }}
                        />

                        {/* Vignette Gradasi Halus */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                        {/* Tombol Play Interaktif jika Berupa Video */}
                        {isVideo && (
                            <button
                                type="button"
                                onClick={handleStartPlayback}
                                title="Putar video langsung"
                                className={`absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center shadow-xl shadow-black/60 hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer ${
                                    platform === 'tiktok'
                                        ? 'bg-slate-950/90 border border-cyan-400/60 hover:bg-slate-900 text-white'
                                        : platform === 'instagram'
                                        ? 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 hover:opacity-90 text-white'
                                        : 'bg-red-600/90 hover:bg-red-600 text-white'
                                }`}
                            >
                                <Play size={20} className="fill-white translate-x-0.5" />
                            </button>
                        )}

                        {/* Badge Label Kategori di Pojok Kanan Bawah */}
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white flex items-center gap-1 shadow">
                            {platform === 'tiktok' ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                    <span>TikTok</span>
                                </>
                            ) : platform === 'instagram' ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                                    <span>Instagram</span>
                                </>
                            ) : isVideo ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                    <span>Video</span>
                                </>
                            ) : activePreview.isImage ? (
                                <>
                                    <ImageIcon size={10} className="text-sky-400" />
                                    <span>Gambar</span>
                                </>
                            ) : (
                                <>
                                    <Globe size={10} className="text-emerald-400" />
                                    <span>Halaman Web</span>
                                </>
                            )}
                        </div>
                    </div>
                )
            )}

            {/* 2. INFORMASI METADATA TAUTAN (Dapat diklik membuka URL asli) */}
            <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block p-2.5 space-y-1 min-w-0 max-w-full overflow-hidden hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold truncate">
                    <img
                        src={faviconUrl}
                        alt=""
                        className="w-3.5 h-3.5 rounded-xs shrink-0 bg-white/10"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span className="truncate">{activePreview.domain || activePreview.siteName}</span>
                    <ExternalLink size={10} className="shrink-0 text-slate-400 ml-auto group-hover:text-white transition-colors" />
                </div>

                <div className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-sky-300 transition-colors break-words [overflow-wrap:anywhere]">
                    {activePreview.title || activePreview.domain}
                </div>

                {activePreview.description ? (
                    <div className="text-[11px] text-slate-300/90 line-clamp-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                        {activePreview.description}
                    </div>
                ) : null}
            </a>
        </div>
    );
}
