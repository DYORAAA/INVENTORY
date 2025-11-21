/* excel.js — Export CSV + XLSX dengan Foto (Base64) */

// =============================
// EXPORT CSV
// =============================
function exportCSV() {
  const data = JSON.parse(localStorage.getItem('inventarisTKJ')) || [];

  const rows = [
    ['NISN', 'Nama', 'Kode', 'Jumlah', 'Status', 'FotoBase64']
  ];

  data.forEach(item => {
    rows.push([
      item.nisn || '',
      item.nama || '',
      item.kode || '',
      item.jumlah || '',
      item.status || '',
      item.foto || ''
    ]);
  });

  const csv = rows
    .map(r => r.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventaris_tkj.csv';
  a.click();

  URL.revokeObjectURL(url);
}



// =============================
// EXPORT XLSX (dengan foto base64)
// =============================
function exportXLSX() {
  if (typeof XLSX === 'undefined') {
    alert('Library XLSX tidak ditemukan. Pastikan CDN-nya aktif di dashboard.html.');
    return;
  }

  const data = JSON.parse(localStorage.getItem('inventarisTKJ')) || [];

  const aoa = [
    ['NISN', 'Nama', 'Kode', 'Jumlah', 'Status', 'FotoBase64']
  ];

  data.forEach(item => {
    aoa.push([
      item.nisn || '',
      item.nama || '',
      item.kode || '',
      item.jumlah || '',
      item.status || '',
      item.foto || ''
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventaris + Foto');
  XLSX.writeFile(wb, 'inventaris_tkj_foto.xlsx');
}
