// src/lib/geminiService.js

const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeLJKWithGemini = async (imageFile) => {
  console.log("=== 🔍 [GEMINI SERVICE] Mengirim gambar LJK ke server proxy /api/gemini/analyze-ljk ===");

  try {
    const imageBase64 = await fileToBase64(imageFile);

    const response = await fetch('/api/gemini/analyze-ljk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType: imageFile.type || 'image/jpeg',
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server error (Status: ${response.status})`);
    }

    const data = await response.json();
    console.log("📥 [GEMINI SERVICE] Hasil ekstraksi LJK berhasil diterima dari server:", data);
    return data;
  } catch (error) {
    console.error("❌ [GEMINI SERVICE ERROR] Gagal mengekstraksi LJK:", error);
    throw error;
  }
};