# NetRunner (prototipe)

Game edukasi 2D berbasis HTML5, bertema cyberpunk, materi Berpikir Komputasional (Informatika).
Tidak memakai library atau gambar eksternal, jadi tidak perlu `npm install`.

## Struktur folder

```
netrunner/
├── index.html        kerangka halaman (header, tab menu, tempat konten)
├── css/
│   └── style.css     semua gaya tampilan; warna utama ada di :root
├── js/
│   ├── levels.js     data 10 level + soal + puzzle (file yang paling sering kamu ubah)
│   └── main.js       logika game: save, nyawa, poin, peringkat, halaman, musik, engine level
└── README.md
```

Urutan pemuatan di `index.html` penting: `levels.js` harus dimuat sebelum `main.js`.

## Cara menjalankan di VS Code (Live Server)

1. **Ekstrak** file zip. Hasilnya folder `netrunner`. Pastikan `index.html`, `css`, dan `js` tetap berada di dalam satu folder yang sama.
2. Buka **VS Code**, lalu pilih **File → Open Folder...** dan pilih folder `netrunner`.
3. Install ekstensi **Live Server** (pembuat: Ritwick Dey):
   - Tekan `Ctrl+Shift+X` (Mac: `Cmd+Shift+X`).
   - Ketik `Live Server` di kolom pencarian, lalu klik **Install**.
4. Di panel **Explorer** (kiri), klik kanan `index.html`, lalu pilih **Open with Live Server**.
   Alternatif: klik tombol **Go Live** di pojok kanan bawah VS Code.
5. Browser terbuka otomatis di alamat seperti `http://127.0.0.1:5500/index.html`.
6. Klik di halaman sekali agar musik bisa mulai (browser memblokir suara otomatis).
7. Setiap kali kamu mengedit dan menekan `Ctrl+S`, halaman refresh sendiri.
8. Untuk berhenti: klik **Port: 5500** di pojok kanan bawah VS Code.

### Tanpa ekstensi

- **Cara cepat:** klik dua kali `index.html` di File Explorer. Game tetap berjalan karena semua file dipanggil lewat jalur relatif.
- **Lewat terminal VS Code:** tekan `` Ctrl+` ``, ketik `python -m http.server 8000`, lalu buka `http://localhost:8000` di browser. Hentikan dengan `Ctrl+C`.

## Cara mengubah isi game

**Soal dan puzzle** (`js/levels.js`): setiap level memakai `L('JENIS','petunjuk Cortex-9',[tugas...])`. Jenis tugas:

| Kode | Contoh | Keterangan |
|---|---|---|
| `mc(soal, [opsi], indexJawaban, petunjuk)` | `mc('2+2?',['3','4'],1,'Hitung lagi')` | pilihan ganda, `indexJawaban` mulai dari 0 |
| `ty(soal, [jawabanDiterima], petunjuk)` | `ty('Ibu kota?',['jakarta'],'...')` | ketik di terminal, tulis jawaban dalam huruf kecil |
| `{y:'pick', q, o, a:[index...], h}` | | pilih semua yang benar |
| `{y:'order', q, o:[urutan benar], h}` | | urutkan langkah (opsi diacak otomatis) |
| `{y:'grid', q, g:[baris peta], h}` | `'S...'`, `'##.#'`, `'.##G'` | `S` start, `G` bendera, `#` tembok, `.` jalan |

**Aturan game** (`js/main.js`, cari dengan `Ctrl+F`):
- `S.life-=25` untuk pengurangan nyawa per salah jawab.
- `S.pts+=10` untuk poin per gedung.
- `const rank=` untuk aturan peringkat (5 gedung = Advance Coder, 10 = Famous Hacker).
- `const BPM=92` dan `CH=[` untuk tempo dan akor musik.
- `const SK='netrunner_save_v1'` adalah nama kunci penyimpanan. Ganti angkanya kalau kamu mengubah struktur save.

**Tampilan** (`css/style.css`): warna ada di baris `:root{...}` (`--cy` cyan, `--rd` merah). Gaya gedung peta ada di `.bd`, `.mp`.

## Penyimpanan progres

Progres (nama, nyawa, poin, level selesai) disimpan di `localStorage` browser. Alamat yang berbeda punya simpanan sendiri, misalnya `127.0.0.1:5500`, `localhost:8000`, dan membuka file langsung. Untuk mengulang dari awal: buka tab Profil lalu klik Reset Progres dua kali, atau di browser tekan `F12 → Application → Local Storage` dan hapus data situs.

## Masalah umum

| Masalah | Solusi |
|---|---|
| Halaman kosong atau gaya berantakan | `css/` dan `js/` harus satu folder dengan `index.html`. Tekan `F12` lalu lihat tab Console. |
| Tidak ada musik | Klik sekali di halaman. Cek tombol SOUND tidak dalam keadaan OFF. |
| Perubahan kode tidak terlihat | Simpan dengan `Ctrl+S`, lalu tekan `Ctrl+F5` untuk refresh paksa. |
| Progres lama muncul terus | Reset di tab Profil atau hapus Local Storage (lihat di atas). |
| Salah ketik di `levels.js` membuat game blank | Buka Console (`F12`), pesan error menunjukkan baris yang salah. Biasanya kurang koma, kurung, atau tanda kutip. |
