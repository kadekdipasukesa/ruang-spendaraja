/**
 * Cloudinary & Image Compression Helper
 * Mengompresi foto via HTML5 Canvas sebelum diunggah ke Cloudinary
 * Menggunakan kredensial publik Unsigned Upload
 */

export const CLOUDINARY_CONFIG = {
  cloudName: 'cjt4xpst',
  uploadPreset: 'jurnal_lab_preset',
  uploadPresetEkstra: 'tugas_ekstra_tik7',
  uploadUrl: 'https://api.cloudinary.com/v1_1/cjt4xpst/image/upload',
  uploadRawUrl: 'https://api.cloudinary.com/v1_1/cjt4xpst/auto/upload',
};

/**
 * Kompres gambar client-side (max dimensi 1280px, kualitas 0.75, format WebP dengan fallback JPEG)
 * @param {File} file - File foto dari kamera/input
 * @param {Object} options - Opsi kompresi (maxWidth, maxHeight, quality)
 * @returns {Promise<{ blob: Blob, file: File, dataUrl: string, originalSize: number, compressedSize: number }>}
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.75,
  } = options;

  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan gambar yang valid.'));
    }

    const originalSize = file.size;
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung aspek rasio agar tidak terdistorsi
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Gagal menginisialisasi canvas untuk kompresi.'));
        }

        // Gambar ke canvas dengan dimensi baru
        ctx.drawImage(img, 0, 0, width, height);

        // Pilih format WebP jika didukung browser, fallback ke JPEG
        const outputMimeType = 'image/webp';

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // Fallback jika toBlob webp gagal
              canvas.toBlob(
                (fallbackBlob) => {
                  if (!fallbackBlob) {
                    return reject(new Error('Gagal menghasilkan file gambar kompresi.'));
                  }
                  finishBlob(fallbackBlob, 'image/jpeg', 'jpg');
                },
                'image/jpeg',
                quality
              );
              return;
            }
            finishBlob(blob, outputMimeType, 'webp');
          },
          outputMimeType,
          quality
        );

        function finishBlob(finalBlob, mimeType, extension) {
          const fileName = file.name.replace(/\.[^/.]+$/, '') + `.${extension}`;
          const compressedFile = new File([finalBlob], fileName, {
            type: mimeType,
            lastModified: Date.now(),
          });

          const dataUrl = canvas.toDataURL(mimeType, quality);

          resolve({
            blob: finalBlob,
            file: compressedFile,
            dataUrl,
            originalSize,
            compressedSize: finalBlob.size,
          });
        }
      };

      img.onerror = () => reject(new Error('Gagal memproses file gambar.'));
      img.src = readerEvent.target.result;
    };

    reader.onerror = () => reject(new Error('Gagal membaca file dari perangkat.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Mengunggah file (blob/file) ke Cloudinary menggunakan Unsigned Upload Preset
 * @param {File|Blob} fileToUpload - File atau Blob yang akan diunggah
 * @param {string} folder - Sub-folder di Cloudinary (opsional)
 * @param {Function} onProgress - Callback progress persentase (0-100)
 * @param {string} customPreset - Upload preset custom (misal: 'tugas_ekstra_tik7')
 * @returns {Promise<string>} - Mengembalikan secure_url foto/dokumen di Cloudinary
 */
export async function uploadToCloudinary(fileToUpload, folder = 'jurnal-lab', onProgress = null, customPreset = null) {
  if (!fileToUpload) {
    throw new Error('Tidak ada file yang dipilih untuk diunggah.');
  }

  const presetToUse = customPreset || CLOUDINARY_CONFIG.uploadPreset;
  const isImage = fileToUpload.type && fileToUpload.type.startsWith('image/');
  const targetUrl = isImage ? CLOUDINARY_CONFIG.uploadUrl : CLOUDINARY_CONFIG.uploadRawUrl;

  const formData = new FormData();
  formData.append('file', fileToUpload);
  formData.append('upload_preset', presetToUse);
  if (folder) {
    formData.append('folder', folder);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', targetUrl);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.secure_url) {
            resolve(response.secure_url);
          } else {
            reject(new Error('Gagal mendapatkan URL dari Cloudinary.'));
          }
        } catch (err) {
          reject(new Error('Format respons Cloudinary tidak valid.'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Gagal unggah file (HTTP ${xhr.status}).`));
        } catch (e) {
          reject(new Error(`Gagal unggah file ke Cloudinary (HTTP ${xhr.status}).`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Terjadi kesalahan koneksi internet saat mengunggah file.'));
    };

    xhr.send(formData);
  });
}
