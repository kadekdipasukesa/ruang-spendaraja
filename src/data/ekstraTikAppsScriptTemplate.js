/**
 * Template Kode Google Apps Script untuk Guru Pembina Ekstra TIK
 * Target Sheet Absen: "Ekstra_Tik_7_2026" (Format Matriks Tanggal)
 * Target Sheet Tugas: "tugas_ekstra_kelas_7_2026"
 * Target Folder Drive: "tugas_ekstra_kelas_7_2026"
 */

export const CODE_TEMPLATE_APPS_SCRIPT = `/**
 * GOOGLE APPS SCRIPT - EKSTRAKURIKULER TIK SMP NEGERI 2 SINGARAJA
 * 
 * Target Sheet Absen: "Ekstra_Tik_7_2026" (Format Matriks Tanggal)
 * Target Sheet Tugas: "tugas_ekstra_kelas_7_2026"
 * Target Folder Drive: "tugas_ekstra_kelas_7_2026"
 */

function doGet(e) {
  return handleGetRiwayat(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    var action = data.action || (e.parameter ? e.parameter.action : "");

    if (action === "get_riwayat" || action === "get_data") {
      return handleGetRiwayat(data || {});
    }

    if (action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Google Apps Script Ekstra TIK Terhubung Aktif!",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. PRESENSI SISWA (FORMAT MATRIKS TANGGAL)
    if (action === "presensi") {
      var sheetAbsen = ss.getSheetByName("Ekstra_Tik_7_2026") || ss.getSheets()[0];
      var targetTanggal = data.tanggalKolom || (function() {
        var dt = new Date();
        return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
      })();

      var lastCol = sheetAbsen.getLastColumn();
      var headers = sheetAbsen.getRange(1, 1, 1, Math.max(lastCol, 1)).getValues()[0];
      var colIndex = -1;

      for (var c = 0; c < headers.length; c++) {
        var hVal = headers[c];
        var hStr = (hVal instanceof Date) ? (hVal.getDate() + "/" + (hVal.getMonth() + 1) + "/" + hVal.getFullYear()) : String(hVal || "").trim();
        if (hStr === targetTanggal || hStr === data.tanggalKolom) {
          colIndex = c + 1;
          break;
        }
      }

      // Jika kolom tanggal belum ada di sheet, buatkan kolom baru di sebelah kanan
      if (colIndex === -1) {
        colIndex = lastCol + 1;
        var headerCell = sheetAbsen.getRange(1, colIndex);
        headerCell.setValue(targetTanggal);
        headerCell.setFontWeight("bold");
        headerCell.setHorizontalAlignment("center");
        headerCell.setBackground("#FEF3C7");
      }

      var lastRow = sheetAbsen.getLastRow();
      if (lastRow < 2) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Data sheet kosong atau belum memiliki baris siswa"
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var dataRows = sheetAbsen.getRange(2, 1, lastRow - 1, Math.min(lastCol, 6)).getValues();
      var targetRow = -1;
      var clean = function(str) { return String(str || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim(); };
      var inputNama = clean(data.nama);
      var inputAbsen = data.noAbsen ? parseInt(data.noAbsen, 10) : null;
      var inputKelas = clean(data.kelas);

      for (var r = 0; r < dataRows.length; r++) {
        var rowNama = clean(dataRows[r][1]);
        var rowKelas = clean(dataRows[r][2]);
        var rowAbsen = parseInt(dataRows[r][3], 10);

        if (inputNama && (rowNama === inputNama || (rowNama.length >= 8 && (rowNama.indexOf(inputNama) !== -1 || inputNama.indexOf(rowNama) !== -1)))) {
          targetRow = r + 2;
          break;
        }
        if (inputAbsen && rowAbsen === inputAbsen && (rowKelas === inputKelas || rowKelas.replace("7.", "7") === inputKelas.replace("7", ""))) {
          targetRow = r + 2;
          break;
        }
      }

      if (targetRow === -1) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Siswa '" + data.nama + "' belum terdaftar di sheet Ekstra_Tik_7_2026"
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var statusValue = data.status || "Hadir";
      var targetCell = sheetAbsen.getRange(targetRow, colIndex);
      targetCell.setValue(statusValue);
      targetCell.setHorizontalAlignment("center");

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Presensi (" + statusValue + ") berhasil dicatat",
        tanggal: targetTanggal,
        baris: targetRow,
        kolom: colIndex
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. KUMPUL TUGAS KE GOOGLE DRIVE & SHEET "tugas_ekstra_kelas_7_2026"
    if (action === "kumpul_tugas") {
      var folderName = "tugas_ekstra_kelas_7_2026";
      // ID Folder manual yang dibuat guru:
      var MANUAL_FOLDER_ID = "1s0dRtW5K8ATrb2f2G1salRSg-dMk1D_9";
      var targetFolder = null;

      // 1. Coba ambil langsung berdasarkan ID folder guru jika tersedia
      if (MANUAL_FOLDER_ID && MANUAL_FOLDER_ID.trim() !== "") {
        try {
          targetFolder = DriveApp.getFolderById(MANUAL_FOLDER_ID.trim());
        } catch (errId) {
          Logger.log("getFolderById error: " + errId);
        }
      }

      // 2. Jika belum ditemukan dari ID, cari apakah spreadsheet ini berada di dalam folder Drive
      if (!targetFolder) {
        try {
          var ssFile = DriveApp.getFileById(ss.getId());
          var parents = ssFile.getParents();
          if (parents.hasNext()) {
            var parentFolder = parents.next();
            var subFolders = parentFolder.getFoldersByName(folderName);
            if (subFolders.hasNext()) {
              targetFolder = subFolders.next();
            } else {
              targetFolder = parentFolder.createFolder(folderName);
            }
          }
        } catch (errParent) {
          // Lanjutkan jika folder induk tidak bisa diakses
        }
      }

      // 3. Jika masih belum ditemukan, cari di Root Drive
      if (!targetFolder) {
        var folders = DriveApp.getFoldersByName(folderName);
        if (folders.hasNext()) {
          targetFolder = folders.next();
        } else {
          targetFolder = DriveApp.createFolder(folderName);
        }
      }

      // 4. Fallback mutlak ke Root jika folder masih null
      if (!targetFolder) {
        targetFolder = DriveApp.getRootFolder();
      }

      // Pastikan izin folder terbuka untuk yang memiliki tautan (View)
      try {
        targetFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (errShareFolder) {}

      // Decode file Base64 dan simpan ke folder
      var rawBase64 = data.fileBase64.replace(/^data:.*,/, "");
      var decoded = Utilities.base64Decode(rawBase64);
      var blob = Utilities.newBlob(decoded, data.fileType, data.fileName);
      var file = targetFolder.createFile(blob);

      try {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (errShareFile) {}

      var fileId = file.getId();
      var fileUrl = file.getUrl();
      var previewUrl = "https://drive.google.com/file/d/" + fileId + "/preview";

      // Simpan metadata ke sheet: "tugas_ekstra_kelas_7_2026"
      var targetSheetName = "tugas_ekstra_kelas_7_2026";
      var sheetTugas = ss.getSheetByName(targetSheetName) || ss.getSheetByName("Tugas");
      if (!sheetTugas) {
        sheetTugas = ss.insertSheet(targetSheetName);
      }

      // Jika sheet masih baru (belum ada baris header)
      if (sheetTugas.getLastRow() === 0) {
        sheetTugas.appendRow([
          "Timestamp",
          "NISN",
          "Nama Siswa",
          "Kelas",
          "No Absen",
          "Judul Tugas",
          "Nama File",
          "Link Google Drive",
          "Catatan"
        ]);
        sheetTugas.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#DDD6FE");
        sheetTugas.setFrozenRows(1);
      }

      sheetTugas.appendRow([
        new Date(),
        data.nisn || "",
        data.nama || "",
        data.kelas || "",
        data.noAbsen || "",
        data.judulTugas || "",
        data.fileName || "",
        fileUrl,
        data.catatan || "-"
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Tugas berhasil disimpan di folder Google Drive & Sheet " + targetSheetName,
        fileId: fileId,
        fileUrl: fileUrl,
        previewUrl: previewUrl,
        folderName: folderName,
        sheetName: targetSheetName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Action tidak dikenal: " + action
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function handleGetRiwayat(params) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var presensiList = [];
  var tugasList = [];

  // Baca Sheet Absen
  var sheetAbsen = ss.getSheetByName("Ekstra_Tik_7_2026") || ss.getSheets()[0];
  if (sheetAbsen) {
    var lastRow = sheetAbsen.getLastRow();
    var lastCol = sheetAbsen.getLastColumn();
    if (lastRow >= 2 && lastCol >= 8) {
      var headers = sheetAbsen.getRange(1, 1, 1, lastCol).getValues()[0];
      var dateCols = [];
      for (var c = 7; c < lastCol; c++) {
        var h = headers[c];
        var hStr = (h instanceof Date) ? (h.getDate() + "/" + (h.getMonth() + 1) + "/" + h.getFullYear()) : String(h || "").trim();
        if (hStr) dateCols.push({ colIndex: c + 1, tanggal: hStr });
      }

      var rows = sheetAbsen.getRange(2, 1, lastRow - 1, lastCol).getValues();
      for (var r = 0; r < rows.length; r++) {
        var rNama = String(rows[r][1] || "").trim();
        var rKelas = String(rows[r][2] || "").trim();
        var rAbsen = rows[r][3];

        for (var d = 0; d < dateCols.length; d++) {
          var val = String(rows[r][dateCols[d].colIndex - 1] || "").trim();
          var isHadir = Boolean(val);
          var statusPresensi = isHadir ? val : "Tidak Hadir";
          presensiList.push({
            id: "sh_" + (r + 2) + "_" + dateCols[d].tanggal.replace(/[^0-9]/g, ""),
            nama: rNama,
            kelas: rKelas,
            noAbsen: rAbsen,
            tanggalKolom: dateCols[d].tanggal,
            tanggal: dateCols[d].tanggal,
            status: statusPresensi,
            waktu: isHadir ? "14:30 WITA" : "-",
            keterangan: isHadir ? "Tercatat di Google Sheets Ekstra_Tik_7_2026" : "Tidak hadir pada pertemuan ini"
          });
        }
      }
    }
  }

  // Baca Sheet Tugas (Cek tugas_ekstra_kelas_7_2026 lalu Tugas)
  var sheetTugas = ss.getSheetByName("tugas_ekstra_kelas_7_2026") || ss.getSheetByName("Tugas");
  if (sheetTugas && sheetTugas.getLastRow() >= 2) {
    var tRows = sheetTugas.getRange(2, 1, sheetTugas.getLastRow() - 1, 9).getValues();
    for (var t = 0; t < tRows.length; t++) {
      var row = tRows[t];
      var fileUrl = String(row[7] || "");
      var previewUrl = fileUrl.indexOf("drive.google.com") !== -1
        ? fileUrl.replace("/view?usp=drivesdk", "/preview").replace("/view", "/preview")
        : fileUrl;

      tugasList.push({
        id: "tugas_sh_" + (t + 2),
        timestamp: row[0],
        nisn: String(row[1] || ""),
        nama: String(row[2] || ""),
        kelas: String(row[3] || ""),
        noAbsen: row[4],
        judulTugas: String(row[5] || ""),
        fileName: String(row[6] || ""),
        fileUrl: fileUrl,
        previewUrl: previewUrl,
        catatan: String(row[8] || "-")
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    presensi: presensiList,
    tugas: tugasList
  })).setMimeType(ContentService.MimeType.JSON);
}
`;
