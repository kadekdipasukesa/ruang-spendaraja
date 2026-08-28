import sys

with open('/app/applet/docs/JURNAL_LAB.md', 'r', encoding='utf-8') as f:
    c = f.read()

target = "   - **Pencegahan Tabrakan Jadwal Real-Time (Schedule Collision Prevention)**:\n     - Setiap kali tanggal atau rentang jam diubah, sistem mengevaluasi apakah ada jadwal bertabrakan di lab yang sama `(startA < endB) && (endA > startB)` (kecuali pengajuan ditolak).\n     - **Banner Peringatan Merah Berkedip**: Menampilkan kotak merah beranimasi denyut (*pulse/ping dot*) dengan rincian nama peminjam, mapel, kelas, dan rentang jam yang bentrok.\n     - **Kunci Tombol Otomatis**: Tombol pengajuan dinonaktifkan (*disabled*) dan berganti tampilan menjadi merah berkedip bertuliskan *\"Jadwal Bertabrakan (Terkunci)\"* sehingga tidak dapat diklik."

replacement = "   - **Pencegahan Tabrakan Jadwal Real-Time (Schedule Collision Prevention)**:\n     - Validasi tabrakan jadwal berlaku **ketat hanya jika**: (1) Laboratorium yang dipilih sama, (2) Tanggal peminjaman sama (zona WITA), dan (3) Jam pelaksanaan saling bertabrakan/tumpang-tindih `(startA < endB) && (endA > startB)`. Pengajuan yang ditolak (*rejected*) atau pengajuan di tanggal/lab lain tidak akan mengunci tombol.\n     - **Banner Peringatan Merah Berkedip**: Menampilkan kotak merah beranimasi denyut (*pulse/ping dot*) dengan rincian nama peminjam, mapel, kelas, dan rentang jam yang bentrok.\n     - **Kunci Tombol Otomatis & Label Kedip Merah**: Tombol pengajuan dinonaktifkan (*disabled*) dan berganti tampilan menjadi merah berkedip bertuliskan *\"Jadwal Bertabrakan (Terkunci)\"*. Di bawah tombol juga ditampilkan label keterangan kecil berkedip merah: *\"⚠️ Tidak bisa melakukan pengajuan: Jadwal di tanggal, lab, dan jam ini sudah terisi.\"* sehingga peminjam segera mengetahui penyebab tombol terkunci."

if target in c:
    c = c.replace(target, replacement)
    with open('/app/applet/docs/JURNAL_LAB.md', 'w', encoding='utf-8') as f:
        f.write(c)
    print("SUCCESS")
else:
    print("NOT_MATCHED")
