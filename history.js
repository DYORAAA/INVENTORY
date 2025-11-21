// history.js
// Helper sederhana untuk menyimpan dan menampilkan riwayat peminjaman
// Menyimpan di localStorage dengan key 'loanHistory'

(function(){
  const KEY = 'loanHistory';

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch (e) { console.warn('getHistory error', e); return []; }
  }

  function saveHistory(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); }
    catch (e) { console.warn('saveHistory error', e); }
  }

  window.addHistory = function(entry) {
    const h = getHistory();
    h.unshift(entry); // newest first
    // cap history to reasonable size (e.g., 1000 entries)
    if (h.length > 1000) h.length = 1000;
    saveHistory(h);
  };

  window.getHistory = getHistory;

  window.clearHistory = function() {
    localStorage.removeItem(KEY);
  };

  window.exportHistoryCSV = function() {
    const rows = getHistory().map(r => {
      const time = r.waktu || '';
      const type = r.type || '';
      const nama = r.nama || '';
      const kode = r.kode || '';
      const details = JSON.stringify(r.peminjam ? { peminjam: r.peminjam } : (r.keterangan ? { keterangan: r.keterangan } : (r.detail || {})));
      return `"${time}","${type}","${nama}","${kode}","${details}"`;
    });
    const csv = ["waktu,type,nama,kode,details", ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'riwayat_peminjaman.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // UI helper: render history table (used by history.html)
  window.renderHistory = function() {
    const body = document.getElementById('history-body');
    if (!body) return;
    const h = getHistory() || [];
    body.innerHTML = '';
    if (h.length === 0) {
      body.innerHTML = '<tr><td colspan="5">Belum ada riwayat.</td></tr>';
      return;
    }
    h.forEach(item => {
      const waktu = item.waktu ? new Date(item.waktu).toLocaleString() : (item.waktu || '');
      const tipe = item.type || '';
      const nama = item.nama || '';
      const kode = item.kode || '';
      const detail = item.peminjam ? `Peminjam: ${item.peminjam}` : (item.keterangan ? `Keterangan: ${item.keterangan}` : JSON.stringify(item.detail || {}));
      const tr = `<tr><td>${waktu}</td><td>${tipe}</td><td>${nama}</td><td>${kode}</td><td>${detail}</td></tr>`;
      body.innerHTML += tr;
    });
  };

  // auto-render if page has history table
  try { if (document.readyState === 'complete' || document.readyState === 'interactive') { setTimeout(() => { const b = document.getElementById('history-body'); if (b) window.renderHistory(); }, 0); } else { document.addEventListener('DOMContentLoaded', () => { const b = document.getElementById('history-body'); if (b) window.renderHistory(); }); } } catch(e) {}
})();
