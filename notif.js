/* notif.js */
/* Peringatan: memasukkan BOT_TOKEN pada client-side tidak aman.
   Untuk demo lokal ini kami mendukung dua opsi:
   1) Letakkan token/chat id di file `config.json` (TIDAK disertakan di repo).
   2) Isi langsung di bawah (tidak direkomendasikan).
   Untuk produksi buat endpoint server yang menyimpan token aman. */

let BOT_TOKEN = '8457534346:AAF79PenS89B5pcgaI9qVSYPTnopCDnfZmE';
let CHAT_ID = '7234756809';

// fallback static values (kosong agar token tidak bocor)
const FALLBACK_BOT_TOKEN = '';
const FALLBACK_CHAT_ID = '';

async function loadConfig() {
  // coba load config.json dari root proyek (di-host bersama file statis)
  try {
    const resp = await fetch('config.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error('no-config');
    const cfg = await resp.json();
    BOT_TOKEN = cfg.BOT_TOKEN || '';
    CHAT_ID = cfg.CHAT_ID || '';
  } catch (e) {
    // jika tidak ada config.json di-host, gunakan fallback kosong
    BOT_TOKEN = FALLBACK_BOT_TOKEN;
    CHAT_ID = FALLBACK_CHAT_ID;
  }
}

async function sendTelegramMessage(message) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('BOT_TOKEN atau CHAT_ID belum diset. Tidak mengirim ke Telegram.');
    return null;
  }
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Error kirim Telegram:', err);
    return null;
  }
}

// public notif functions
window.notifPinjam = async function(namaBarang, peminjam, kode) {
  const waktu = new Date().toLocaleString();
  const pesan = `📦 <b>BARANG DIPINJAM</b>\nNama: <b>${namaBarang}</b>\nKode: <b>${kode}</b>\nPeminjam: <b>${peminjam}</b>\nWaktu: ${waktu}`;
  await sendTelegramMessage(pesan);
  alert('Notifikasi pinjam dikirim (jika token valid).');
};

window.notifRusak = async function(namaBarang, keterangan, kode) {
  const waktu = new Date().toLocaleString();
  const pesan = `⚠️ <b>LAPORAN BARANG RUSAK</b>\nNama: <b>${namaBarang}</b>\nKode: <b>${kode}</b>\nKerusakan: ${keterangan}\nWaktu: ${waktu}`;
  await sendTelegramMessage(pesan);
  alert('Notifikasi rusak dikirim (jika token valid).');
};

// optional: notifikasi pengembalian
window.notifKembali = async function(namaBarang, kode) {
  const waktu = new Date().toLocaleString();
  const pesan = `✅ <b>BARANG DIKEMBALIKAN</b>\nNama: <b>${namaBarang}</b>\nKode: <b>${kode}</b>\nWaktu: ${waktu}`;
  await sendTelegramMessage(pesan);
};

// Load config on script load
loadConfig();
