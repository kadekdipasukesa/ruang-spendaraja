export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ status: 'error', error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { scriptUrl, payload } = req.body || {};
    const targetUrl =
      scriptUrl ||
      'https://script.google.com/a/macros/guru.smp.belajar.id/s/AKfycbxzlOsy8mXTGNL9EKXaIK1czzrY-Yytt4cucshshqLXe_neMr53QabznFAS-gTowIkknA/exec';

    if (!payload) {
      return res.status(400).json({ status: 'error', error: 'Data payload tidak boleh kosong' });
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const responseText = await response.text();
    let responseJson = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch {
      responseJson = {
        status: 'success',
        message: 'Data berhasil dikirim ke Google Apps Script',
        raw: responseText.slice(0, 500),
      };
    }

    return res.status(200).json(responseJson);
  } catch (err) {
    console.error('Error proxying to Google Apps Script on Vercel:', err);
    return res.status(500).json({
      status: 'error',
      error: 'Gagal menghubungkan ke Google Apps Script: ' + (err.message || err.toString()),
    });
  }
}
