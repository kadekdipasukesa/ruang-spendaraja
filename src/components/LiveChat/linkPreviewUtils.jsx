import React from 'react';

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
        if (!urlStr || typeof urlStr !== 'string') return null;
        let formattedUrl = urlStr.trim().replace(/&amp;/g, '&');
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`;
        }
        const url = new URL(formattedUrl);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, '');

        if (hostname === 'youtu.be') {
            return url.pathname.slice(1).split('/')[0]?.split('?')[0] || null;
        }
        if (hostname.includes('youtube.com')) {
            if (url.searchParams.get('v')) return url.searchParams.get('v');
            if (url.pathname.includes('/shorts/')) return url.pathname.split('/shorts/')[1]?.split('/')[0]?.split('?')[0] || null;
            if (url.pathname.includes('/embed/')) return url.pathname.split('/embed/')[1]?.split('/')[0]?.split('?')[0] || null;
            if (url.pathname.includes('/live/')) return url.pathname.split('/live/')[1]?.split('/')[0]?.split('?')[0] || null;
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
 * Ekstraksi info Instagram (Reel, Post, TV)
 */
export const getInstagramInfo = (urlStr) => {
    try {
        const url = new URL(urlStr);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
        if (!hostname.includes('instagram.com')) return null;

        const match = url.pathname.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i);
        const shortcode = match ? match[1] : null;
        const isReel = url.pathname.includes('/reel/');

        return {
            isInstagram: true,
            shortcode,
            isReel
        };
    } catch {
        return null;
    }
};

/**
 * Ekstraksi info TikTok (vt.tiktok.com, vm.tiktok.com, tiktok.com)
 */
export const getTikTokInfo = (urlStr) => {
    try {
        const url = new URL(urlStr);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
        if (!hostname.includes('tiktok.com')) return null;

        const isShortLink = hostname.startsWith('vt.') || hostname.startsWith('vm.');
        const match = url.pathname.match(/\/video\/(\d+)/i);
        const videoId = match ? match[1] : null;

        return {
            isTikTok: true,
            isShortLink,
            videoId
        };
    } catch {
        return null;
    }
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
export const getInstantPlatformPreview = (urlStr) => {
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
                platform: 'youtube',
                videoId: ytId
            };
        }

        // 2. TikTok Video
        const ttInfo = getTikTokInfo(urlStr);
        if (ttInfo) {
            return {
                url: urlStr,
                domain: 'tiktok.com',
                title: 'Video TikTok',
                description: 'Tonton video di TikTok',
                image: getWebpageThumbnail(urlStr),
                siteName: 'TikTok',
                isVideo: true,
                platform: 'tiktok',
                videoId: ttInfo.videoId
            };
        }

        // 3. Instagram Video / Post
        const igInfo = getInstagramInfo(urlStr);
        if (igInfo) {
            return {
                url: urlStr,
                domain: 'instagram.com',
                title: igInfo.isReel ? 'Reel Instagram' : 'Postingan Instagram',
                description: 'Lihat postingan di Instagram',
                image: getWebpageThumbnail(urlStr),
                siteName: 'Instagram',
                isVideo: igInfo.isReel,
                platform: 'instagram',
                videoId: igInfo.shortcode
            };
        }

        // 4. Direct Image Link
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

        // 5. Scratch Project
        if (hostname.includes('scratch.mit.edu')) {
            const match = url.pathname.match(/\/projects\/(\d+)/);
            const projectId = match ? match[1] : null;
            return {
                url: urlStr,
                domain: 'scratch.mit.edu',
                title: 'Proyek Scratch',
                description: 'Animasi atau game pemrograman visual Scratch',
                image: projectId ? `https://cdn2.scratch.mit.edu/get_image/project/${projectId}_480x360.png` : null,
                siteName: 'Scratch',
                platform: 'scratch',
                videoId: projectId
            };
        }

        // 6. Google Workspace
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

        // 7. Default Website Thumbnail
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
