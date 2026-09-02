import { useState } from 'react';
import { soundEffects } from '../../../../utils/gameAudio';
import { triggerMissionFireworkAnimation, playMissionSuccessSound } from '../../../../utils/missionCelebration';
import { triggerGrandConfetti } from '../../../../utils/confettiHelper';

/**
 * Triggers fireworks & cheerful sound effects when points are earned
 */
export function celebratePointGain(isGrand = false) {
  try {
    if (isGrand) {
      soundEffects.playCelebrationFirework();
      playMissionSuccessSound();
      triggerGrandConfetti();
      setTimeout(() => {
        triggerMissionFireworkAnimation();
      }, 200);
    } else {
      soundEffects.playCelebrationFirework();
      triggerMissionFireworkAnimation();
    }
  } catch (err) {
    console.warn('Celebration error:', err);
  }
}

/**
 * Real authentic image URLs for 20 Hardware Components
 */
export const HARDWARE_REAL_IMAGES = {
  hw_keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=80', // Mechanical Keyboard
  hw_mouse: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&auto=format&fit=crop&q=80', // Optical Gaming Mouse
  hw_mic: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&auto=format&fit=crop&q=80', // Studio Condenser Mic
  hw_webcam: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=80', // HD Webcam
  hw_scanner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flatbed_scanner.jpg/320px-Flatbed_scanner.jpg', // Document Scanner
  hw_barcode: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=200&auto=format&fit=crop&q=80', // Barcode Reader
  hw_cpu: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=200&auto=format&fit=crop&q=80', // CPU Processor Chip
  hw_gpu: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&auto=format&fit=crop&q=80', // Dedicated GPU Graphics Card
  hw_mobo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80', // ATX Motherboard
  hw_soundcard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Sound_blaster_live_5.1.jpg/320px-Sound_blaster_live_5.1.jpg', // Sound Card
  hw_ram: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=200&auto=format&fit=crop&q=80', // DDR RAM Sticks
  hw_ssd: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=200&auto=format&fit=crop&q=80', // NVMe M.2 SSD
  hw_hdd: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=200&auto=format&fit=crop&q=80', // 3.5" HDD Platter
  hw_flashdisk: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=200&auto=format&fit=crop&q=80', // USB Flash Drive
  hw_monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&auto=format&fit=crop&q=80', // Frameless IPS Monitor
  hw_speaker: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&auto=format&fit=crop&q=80', // Stereo Audio Speakers
  hw_printer: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200&auto=format&fit=crop&q=80', // Color Inkjet Printer
  hw_projector: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=200&auto=format&fit=crop&q=80', // Digital Projector
  hw_psu: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200&auto=format&fit=crop&q=80', // Power Supply Unit
  hw_cooler: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=200&auto=format&fit=crop&q=80', // Tower Cooler & RGB Fan
};

/**
 * Real authentic official brand logo URLs for Software, OS & Applications
 */
export const SOFTWARE_REAL_LOGOS = {
  // OS (Misi 1)
  sw_win11: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg',
  sw_linux: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Logo-ubuntu_cof-orange-hex.svg/320px-Logo-ubuntu_cof-orange-hex.svg.png',
  sw_macos: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  sw_android: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg',
  sw_ios: 'https://upload.wikimedia.org/wikipedia/commons/6/63/IOS_wordmark_%282017%29.svg',
  sw_chromeos: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Chrome_OS_logo_%282022%29.svg',

  // Apps (Misi 1)
  sw_word: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg',
  sw_excel: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg',
  sw_chrome: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg',
  sw_wa: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
  sw_photoshop: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg',
  sw_vlc: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/VLC_Icon.svg',
  sw_capcut: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Capcut-icon.svg',
  sw_spotify: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
  sw_canva: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
  sw_zoom: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg',
  sw_scratch: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Scratch_logo.svg',
  sw_roblox: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Roblox_player_icon_black.svg',
  sw_duolingo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Duolingo_logo.svg',
  sw_maps: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg',

  // 20 Digital Tools (Misi 3)
  app_whatsapp: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
  app_zoom: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg',
  app_discord: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Discord_Color_Text_Logo_%282021%29.svg',
  app_gmail: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
  app_youtube: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
  app_spotify: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
  app_netflix: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  app_roblox: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Roblox_player_icon_black.svg',
  app_docs: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg',
  app_excel: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg',
  app_canva: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
  app_trello: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Trello-logo-blue.svg',
  app_classroom: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png',
  app_duolingo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Duolingo_logo.svg',
  app_scratch: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Scratch_logo.svg',
  app_ruangguru: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Ruangguru_logo.png',
  app_drive: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
  app_maps: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg',
  app_antivirus: 'https://upload.wikimedia.org/wikipedia/id/thumb/e/e0/Smadav_logo.png/250px-Smadav_logo.png',
  app_zip: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/7-Zip_Logo.svg',
};

/**
 * Visual Thumbnail Component for Hardware / Software with real images & graceful fallback
 */
export function RealAssetThumbnail({
  id,
  name,
  fallbackIcon: FallbackIcon,
  isSoftware = false,
  size = 'md' // 'sm' | 'md' | 'lg'
}) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = isSoftware ? SOFTWARE_REAL_LOGOS[id] : HARDWARE_REAL_IMAGES[id];

  const sizeClasses = {
    sm: 'w-7 h-7 min-w-[28px]',
    md: 'w-9 h-9 min-w-[36px]',
    lg: 'w-12 h-12 min-w-[48px]'
  }[size] || 'w-9 h-9 min-w-[36px]';

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size] || 'w-5 h-5';

  if (!imageUrl || hasError) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-amber-400 shrink-0 shadow-inner`}>
        {FallbackIcon ? <FallbackIcon className={iconSizes} /> : <span>📦</span>}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses} rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-inner group-hover:border-amber-500/50 transition-colors`}>
      <img
        src={imageUrl}
        alt={name || id}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`w-full h-full ${isSoftware ? 'object-contain' : 'object-cover rounded-lg'}`}
      />
    </div>
  );
}
