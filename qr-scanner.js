// qr-scanner.js
// Handles QR camera init and scan callbacks for qr-scanner.html

(function() {
    let html5QrScannerPage = null;
    let isScanning = false;

    // Cek login sederhana
    function cekLogin() {
        if (localStorage.getItem('login') !== 'true') {
            // Jika di tes lokal tanpa login, remark baris bawah ini
            // window.location.href = 'index.html'; 
        }
    }

    // Fungsi untuk mencari data barang berdasarkan kode atau nama.
    // Mencari di beberapa key localStorage yang umum digunakan oleh aplikasi:
    // 'items', 'inventarisTKJ', dan 'barang_inventory'.
    // Menangani beberapa format decodedText: JSON, "nama|kode", atau plain text.
    function cariBarang(decodedText) {
        if (!decodedText) return null;

        // Jika QR berisi JSON, coba parse dan ambil field kode/nama
        let kodeToFind = null;
        try {
            const parsed = JSON.parse(decodedText);
            if (parsed && typeof parsed === 'object') {
                if (parsed.kode) kodeToFind = String(parsed.kode);
                else if (parsed.code) kodeToFind = String(parsed.code);
            }
        } catch (e) {
            // not JSON, ignore
        }

        // Jika format "nama|kode"
        if (!kodeToFind && typeof decodedText === 'string' && decodedText.includes('|')) {
            const parts = decodedText.split('|').map(p => p.trim());
            // prefer second part as kode if present
            if (parts.length >= 2 && parts[1]) kodeToFind = parts[1];
            else kodeToFind = parts[0];
        }

        // fallback: treat the whole decodedText as kode or name
        if (!kodeToFind) kodeToFind = String(decodedText).trim();

        const keysToCheck = ['items', 'inventarisTKJ', 'barang_inventory'];
        const allItems = [];
        for (const k of keysToCheck) {
            const s = localStorage.getItem(k);
            if (!s) continue;
            try {
                const arr = JSON.parse(s);
                if (Array.isArray(arr)) allItems.push(...arr);
            } catch (e) {
                // ignore parse errors
            }
        }

        // dedupe by id or kode
        const seen = new Set();
        const uniq = [];
        for (const it of allItems) {
            const id = it && (it.id || it.kode || JSON.stringify(it));
            if (!id) continue;
            if (seen.has(id)) continue;
            seen.add(id);
            uniq.push(it);
        }

        const needle = String(kodeToFind).trim().toLowerCase();
        // search by kode exact, then kode contains, then name contains
        let found = uniq.find(it => it && it.kode && String(it.kode).trim().toLowerCase() === needle);
        if (!found) found = uniq.find(it => it && it.kode && String(it.kode).trim().toLowerCase().includes(needle));
        if (!found) found = uniq.find(it => it && it.nama && String(it.nama).trim().toLowerCase().includes(needle));

        return found || null;
    }

    window.initScannerPage = async function() {
        cekLogin();
        
        // Pastikan instance bersih sebelum mulai
        if(html5QrScannerPage) {
            try { await html5QrScannerPage.stop(); } catch(e){}
        }
        
        html5QrScannerPage = new Html5Qrcode("reader");

        try {
            const devices = await Html5Qrcode.getCameras();
            const sel = document.getElementById('cameraSelect');
            sel.innerHTML = '';

            if (devices && devices.length) {
                devices.forEach((d, i) => {
                    const opt = document.createElement('option');
                    opt.value = d.id;
                    opt.text = d.label || `Kamera ${i + 1}`;
                    sel.appendChild(opt);
                });

                // Pilih kamera belakang secara default jika ada
                const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('belakang'));
                const initialCamId = backCam ? backCam.id : devices[0].id;
                
                sel.value = initialCamId;
                startQrCamera(initialCamId);
            } else {
                // Fallback jika device array kosong tapi izin diberikan
                startQrCamera({ facingMode: "environment" });
            }

            sel.onchange = () => {
                if(isScanning) {
                   stopQrCamera().then(() => {
                       startQrCamera(sel.value);
                   });
                } else {
                    startQrCamera(sel.value);
                }
            };

        } catch (err) {
            console.error("Error akses kamera:", err);
            alert("Gagal mengakses kamera. Pastikan izin diberikan dan menggunakan HTTPS.");
        }
    };

    window.startQrCamera = function(cameraIdOrConfig) {
        isScanning = true;
        
        // Konfigurasi agar responsif di HP
        const config = {
            fps: 10,
            qrbox: function(viewfinderWidth, viewfinderHeight) {
                const minEdgePercentage = 0.70; // 70% dari lebar/tinggi terkecil
                const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
                const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
                return {
                    width: qrboxSize,
                    height: qrboxSize
                };
            }
        };

        html5QrScannerPage.start(
            cameraIdOrConfig,
            config,
            (decodedText, decodedResult) => {
                // --- SUKSES SCAN ---
                console.log(`Code scanned = ${decodedText}`, decodedResult);
                
                // 1. Isi Kode
                document.getElementById('hasil_kode').innerText = decodedText;

                // 2. Cari detail barang (Nama, Status, dll)
                const item = cariBarang(decodedText);
                
                if (item) {
                    document.getElementById('hasil_nama').innerText = item.nama || '-';
                    document.getElementById('hasil_status').innerText = item.status || '-';
                    document.getElementById('hasil_jumlah').innerText = item.jumlah || '-';
                } else {
                    document.getElementById('hasil_nama').innerText = 'Tidak Ditemukan';
                    document.getElementById('hasil_status').innerText = '-';
                    document.getElementById('hasil_jumlah').innerText = '-';
                }

                // Opsional: Stop scanning setelah dapat hasil agar hemat baterai
                // window.stopQrCamera(); 
                // alert("Berhasil Scan: " + decodedText);
            },
            (errorMessage) => {
                // Abaikan error scanning frame kosong
            }
        ).catch(err => {
            console.error("Start failed", err);
            isScanning = false;
        });
    };

    window.stopQrCamera = async function() {
        if (html5QrScannerPage && isScanning) {
            try {
                await html5QrScannerPage.stop();
                isScanning = false;
                console.log("Kamera berhenti.");
            } catch (e) {
                console.warn('Stop error', e);
            }
        }
    };

    window.switchQrCamera = function(newId) {
        window.stopQrCamera().then(() => {
            window.startQrCamera(newId);
        });
    };

    window.confirmPinjamFromScanner = function() {
        const kode = document.getElementById('hasil_kode').innerText;
        const namaBarang = document.getElementById('hasil_nama').innerText;

        if (!kode || kode === '-' || namaBarang === 'Tidak Ditemukan') {
            alert('Scan barang yang valid terlebih dahulu!');
            return;
        }

        const peminjam = prompt(`Meminjam ${namaBarang} (${kode}).\nMasukkan nama peminjam:`);
        if (!peminjam) return;

        // Cek apakah fungsi global tersedia (dari script.js lain)
        if (typeof window.konfirmasiPinjamByKode === 'function') {
            window.konfirmasiPinjamByKode(kode, peminjam);
        } else {
            // Fallback jika fungsi global belum ada
            console.log("Fungsi konfirmasiPinjamByKode tidak ditemukan, melakukan log manual.");
            alert(`Simulasi: Peminjaman ${namaBarang} oleh ${peminjam} berhasil dicatat.`);
            // Redirect kembali ke dashboard
            window.location.href = 'dashboard.html';
        }
    };

})();
