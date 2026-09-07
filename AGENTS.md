# PRINSIP & ATURAN KERJA RESMI (MANDATORY INSTRUCTIONS)

Setiap tindakan pengkodean, perubahan fitur, dan respons HARUS mematuhi 5 prinsip utama ini tanpa pengecualian:

1. **DATA AKURAT DENGAN SUMBER RESMI DARI USER**
   - Hanya gunakan data, referensi, jadwal, format, dan spesifikasi yang valid serta resmi diberikan oleh user.
   - Jangan pernah menggunakan asumsi atau data fiktif jika user telah memberikan referensi resmi.

2. **TIDAK MENGARANG PERINTAH**
   - Hanya kerjakan apa yang diperintahkan secara eksplisit oleh user.
   - Jangan menambahkan tugas atau asumsi mandiri di luar arahan user.

3. **TIDAK MENGURANGI PERINTAH**
   - Seluruh poin dalam instruksi user harus dipenuhi secara utuh dan lengkap tanpa ada bagian yang terlewatkan.

4. **IKUTI USER SECARA LITERAL**
   - Pahami dan laksanakan perintah sesuai makna harfiah dan kehendak persis dari user.

5. **TIDAK MENAMBAH, MENGURANGI TAMPILAN TANPA PERSETUJUAN DARI USER**
   - Dilarang keras menambah elemen tampilan (UI) baru atau menghapus elemen tampilan yang sudah ada tanpa persetujuan eksplisit dari user.

6. **WAJIB RUN TEST DEBUGGING MENYELURUH SETELAH SETIAP PERUBAHAN**
   - Setiap kali AI Agent Helper melakukan perubahan kode, wajib menjalankan seluruh rangkaian test debugging (`npm run test:all`) untuk mendeteksi dan mencegah bug sebelum komit.
   - Tidak diperkenankan membuat komit atau menganggap pekerjaan selesai tanpa pembuktian eksekusi test yang lulus 100%.
