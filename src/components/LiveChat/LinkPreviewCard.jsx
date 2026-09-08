import React, { useState, useEffect } from 'react';
import { ExternalLink, Globe, Play, Video, X, Image as ImageIcon } from 'lucide-react';

// Cache in-memory agar link yang sama tidak perlu di-fetch berulang kali
const previewCache = new Map();

// Regex untuk mendeteksi URL (http, https, www)
export const URL_REGEX = /(?:https?:\/\/|www\.)[^\s<>"']+/gi;

/**
 * Membersihkan tanda baca di akhir URL jika pengguna menulis "cek https://contoh.com."
 */
export const cleanUrl = (rawUrl) => {
    if (!rawUrl) return '';
    let cleaned = rawUrl.replace(/[.,;:!?)\]]+$/, '');
    if (cleaned.startsWith('www.')) {
        cleaned = `https://${cleaned}`;
    }
    return cleaned;
};

/**
 * Mengambil URL pertama yang ditemukan di dalam teks pesan
 */
export const extractFirstUrl = (text) => {
    if (!text || typeof text !== 'string') return null;
    const matches = text.match(URL_REGEX);
    if (!matches || matches.length === 0) return null;
    return cleanUrl(matches[0]);
};

/**
 * Ekstraksi Video ID YouTube dari berbagai format URL
 */
export const getYouTubeVideoId = (urlStr) => {
    try {
        const url = new URL(urlStr);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, '');

        if (hostname === 'youtu.be') {
            return url.pathname.slice(1).split('/')[0]?.split('?')[0] || null;
        }
        if (hostname.includes('youtube.com')) {
            if (url.searchParams.get('v')) return url.searchParams.get('v');
            if (url.pathname.includes('/shorts/')) return url.pathname.split('/shorts/')[1]?.split('/')[0]?.split('?')[0];
            if (url.pathname.includes('/embed/')) return url.pathname.split('/embed/')[1]?.split('/')[0]?.split('?')[0];
            if (url.pathname.includes('/live/')) return url.pathname.split('/live/')[1]?.split('/')[0]?.split('?')[0];
        }
        return null;
    } catch {
        return null;
    }
};

/**
 * Menghasilkan URL thumbnail YouTube resmi
 */
export const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

/**
 * Generator screenshot halaman web otomatis via WordPress mShots
 */
export const getWebpageThumbnail = (urlStr) => {
    try {
        return `https://s0.wp.com/mshots/v1/${encodeURIComponent(urlStr)}?w=600`;
    } catch {
        return null;
    }
};

/**
 * Mendeteksi apakah link mengarah langsung ke file gambar
 */
export const isDirectImageUrl = (urlStr) => {
    return /\.(png|jpe?g|gif|webp|svg|bmp)(\?.*)?$/i.test(urlStr);
};

/**
 * Mendeteksi metadata instan untuk platform populer sebelum fetch server selesai
 */
const getInstantPlatformPreview = (urlStr) => {
    try {
        const url = new URL(urlStr);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, '');

        // 1. YouTube Video
        const ytId = getYouTubeVideoId(urlStr);
        if (ytId) {
            return {
                url: urlStr,
                domain: 'youtube.com',
                title: 'Video YouTube',
                description: 'Tonton video di YouTube',
                image: getYouTubeThumbnail(ytId),
                siteName: 'YouTube',
                isVideo: true,
                videoId: ytId
            };
        }

        // 2. Direct Image Link
        if (isDirectImageUrl(urlStr)) {
            const fileName = decodeURIComponent(urlStr.split('/').pop()?.split('?')[0] || 'Gambar');
            return {
                url: urlStr,
                domain: hostname,
                title: fileName,
                description: 'Pratinjau File Gambar',
                image: urlStr,
                siteName: hostname,
                isImage: true
            };
        }

        // 3. Scratch Project
        if (hostname.includes('scratch.mit.edu')) {
            const match = url.pathname.match(/\/projects\/(\d+)/);
            const projectId = match ? match[1] : null;
            return {
                url: urlStr,
                domain: 'scratch.mit.edu',
                title: 'Proyek Scratch',
                description: 'Animasi atau game pemrograman visual Scratch',
                image: projectId ? `https://cdn2.scratch.mit.edu/get_image/project/${projectId}_480x360.png` : null,
                siteName: 'Scratch'
            };
        }

        // 4. Google Workspace
        if (hostname.includes('docs.google.com') || hostname.includes('drive.google.com')) {
            let title = 'Google Drive';
            if (url.pathname.includes('/forms/')) title = 'Google Formulir';
            else if (url.pathname.includes('/document/')) title = 'Google Dokumen';
            else if (url.pathname.includes('/spreadsheets/')) title = 'Google Spreadsheet';
            else if (url.pathname.includes('/presentation/')) title = 'Google Slides';

            return {
                url: urlStr,
                domain: hostname,
                title,
                description: 'Dokumen / file bersama di Google Workspace',
                image: getWebpageThumbnail(urlStr),
                siteName: 'Google'
            };
        }

        // 5. Default Website Thumbnail (Screenshot Halaman Web)
        return {
            url: urlStr,
            domain: hostname,
            title: hostname,
            description: '',
            image: getWebpageThumbnail(urlStr),
            siteName: hostname
        };
    } catch {
        return null;
    }
};

/**
 * Komponen Kartu Preview Link ala WhatsApp dengan Thumbnail Video & Halaman Web
 */
export default function LinkPreviewCard({ url }) {
    const targetUrl = cleanUrl(url);

    const [preview, setPreview] = useState(() => {
        if (!targetUrl) return null;
        return previewCache.get(targetUrl) || getInstantPlatformPreview(targetUrl);
    });
    const [imgFailed, setImgFailed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!targetUrl) return;

        // Gunakan cache jika sudah tersedia
        if (previewCache.has(targetUrl)) {
            setPreview(previewCache.get(targetUrl));
            return;
        }

        const instantData = getInstantPlatformPreview(targetUrl);
        let isMounted = true;

        const fetchPreview = async () => {
            try {
                const res = await fetch(`/api/link-preview?url=${encodeURIComponent(targetUrl)}`);
                if (!res.ok) throw new Error('Preview fetch failed');
                const data = await res.json();
                if (isMounted && data && !data.error) {
                    const ytId = getYouTubeVideoId(targetUrl);
                    // Pastikan thumbnail tetap ada: data.image -> fallback YouTube thumbnail -> fallback screenshot halaman web
                    const effectiveImage =
                        data.image ||
                        (ytId ? getYouTubeThumbnail(ytId) : getWebpageThumbnail(targetUrl));

                    const merged = {
                        ...instantData,
                        ...data,
                        image: effectiveImage,
                        isVideo: !!ytId || data.isVideo,
                        videoId: ytId || data.videoId,
                        isImage: isDirectImageUrl(targetUrl) || data.isImage
                    };

                    previewCache.set(targetUrl, merged);
                    setPreview(merged);
                }
            } catch {
                // Gunakan fallback instant jika server preview gagal
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

    if (!preview || !targetUrl) return null;

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${preview.domain || 'google.com'}&sz=64`;
    const isVideo = preview.isVideo || !!preview.videoId;
    const videoId = preview.videoId || getYouTubeVideoId(targetUrl);

    return (
        <div className="mt-2 w-full max-w-full min-w-0 rounded-xl overflow-hidden bg-slate-900/90 border border-slate-700/90 hover:border-slate-500 hover:bg-slate-900 transition-all text-left group shadow-lg">
            {/* 1. KONTEN PEMUTAR VIDEO ATAU THUMBNAIL */}
            {isPlaying && videoId ? (
                // Pemutar Video YouTube Inline (Hanya dimuat saat tombol Play ditekan)
                <div className="w-full aspect-video bg-black relative border-b border-slate-800">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={preview.title || 'Pemutar Video YouTube'}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsPlaying(false);
                        }}
                        className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/80 hover:bg-red-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow transition-colors z-20"
                    >
                        <X size={12} />
                        <span>Tutup</span>
                    </button>
                </div>
            ) : (
                // Tampilan Thumbnail (Video / Halaman Web / Gambar Langsung)
                (preview.image && !imgFailed) && (
                    <div className="w-full aspect-video max-h-40 sm:max-h-44 bg-slate-950 relative overflow-hidden group/thumb border-b border-slate-800">
                        <img
                            src={preview.image}
                            alt={preview.title || 'Thumbnail Pratinjau'}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top group-hover/thumb:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                // Fallback berjenjang: maxresdefault -> hqdefault -> screenshot web
                                if (videoId && !e.currentTarget.src.includes('hqdefault')) {
                                    e.currentTarget.src = getYouTubeThumbnail(videoId);
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
                        {isVideo && videoId && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsPlaying(true);
                                }}
                                title="Putar video langsung"
                                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-xl shadow-black/60 hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
                            >
                                <Play size={20} className="fill-white translate-x-0.5" />
                            </button>
                        )}

                        {/* Badge Label Kategori di Pojok Kanan Bawah */}
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white flex items-center gap-1 shadow">
                            {isVideo ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                    <span>Video</span>
                                </>
                            ) : preview.isImage ? (
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
                    <span className="truncate">{preview.domain || preview.siteName}</span>
                    <ExternalLink size={10} className="shrink-0 text-slate-400 ml-auto group-hover:text-white transition-colors" />
                </div>

                <div className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-sky-300 transition-colors break-words [overflow-wrap:anywhere]">
                    {preview.title || preview.domain}
                </div>

                {preview.description ? (
                    <div className="text-[11px] text-slate-300/90 line-clamp-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                        {preview.description}
                    </div>
                ) : null}
            </a>
        </div>
    );
}

/**
 * Merender teks pesan dengan tautan URL yang dapat diklik serta tidak tembus jendela
 */
export function renderMessageText(rawText, isMe) {
    if (!rawText || typeof rawText !== 'string') return '';

    const parts = [];
    let lastIndex = 0;
    let match;

    const regex = new RegExp(URL_REGEX.source, 'gi');

    while ((match = regex.exec(rawText)) !== null) {
        const matchIndex = match.index;
        const matchedUrl = match[0];
        const actualUrl = cleanUrl(matchedUrl);

        // Teks sebelum link
        if (matchIndex > lastIndex) {
            parts.push(rawText.slice(lastIndex, matchIndex));
        }

        // Tag Link yang ramah klik & anti-tembus (break-all + overflow-wrap:anywhere)
        parts.push(
            <a
                key={`link-${matchIndex}`}
                href={actualUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`underline font-medium break-all [overflow-wrap:anywhere] transition-colors ${
                    isMe 
                        ? 'text-sky-200 hover:text-white' 
                        : 'text-sky-400 hover:text-sky-300'
                }`}
            >
                {matchedUrl}
            </a>
        );

        lastIndex = matchIndex + matchedUrl.length;
    }

    // Teks sisa setelah link terakhir
    if (lastIndex < rawText.length) {
        parts.push(rawText.slice(lastIndex));
    }

    return parts.length > 0 ? parts : rawText;
}
