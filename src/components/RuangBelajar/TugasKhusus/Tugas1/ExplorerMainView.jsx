import {
  Folder,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileCode,
  FileAudio,
  FileArchive,
  FileQuestion,
  File,
  ChevronRight,
  FolderPlus,
  FilePlus,
  Clock,
  HardDrive
} from 'lucide-react';

export function getFileVisual(item) {
  if (item.type === 'folder') {
    return {
      icon: Folder,
      color: 'text-amber-500 fill-amber-300',
      bgColor: 'bg-amber-50 border-amber-200',
      tag: 'Folder',
      badgeClass: 'bg-amber-100 text-amber-800'
    };
  }

  const ext = (item.ext || (item.name.includes('.') ? `.${item.name.split('.').pop()}` : '')).toLowerCase();
  const fileType = item.fileType;

  if (ext === '.docx' || ext === '.doc' || fileType === 'doc') {
    return {
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      tag: 'Word .docx',
      badgeClass: 'bg-blue-100 text-blue-800'
    };
  }

  if (ext === '.xlsx' || ext === '.xls' || fileType === 'sheet') {
    return {
      icon: FileSpreadsheet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
      tag: 'Excel .xlsx',
      badgeClass: 'bg-emerald-100 text-emerald-800'
    };
  }

  if (ext === '.pptx' || ext === '.ppt' || fileType === 'slide') {
    return {
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      tag: 'PowerPoint .pptx',
      badgeClass: 'bg-orange-100 text-orange-800'
    };
  }

  if (ext === '.pdf' || fileType === 'pdf') {
    return {
      icon: FileText,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-200',
      tag: 'Dokumen PDF',
      badgeClass: 'bg-rose-100 text-rose-800'
    };
  }

  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || fileType === 'img') {
    return {
      icon: FileImage,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
      tag: 'Gambar .png',
      badgeClass: 'bg-purple-100 text-purple-800'
    };
  }

  if (ext === '.mp3' || ext === '.wav' || fileType === 'audio') {
    return {
      icon: FileAudio,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 border-cyan-200',
      tag: 'Audio .mp3',
      badgeClass: 'bg-cyan-100 text-cyan-800'
    };
  }

  if (ext === '.sb3' || fileType === 'code') {
    return {
      icon: FileCode,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
      tag: 'Scratch .sb3',
      badgeClass: 'bg-amber-100 text-amber-900'
    };
  }

  if (ext === '.zip' || ext === '.rar' || fileType === 'zip') {
    return {
      icon: FileArchive,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-200',
      tag: 'Arsip .zip',
      badgeClass: 'bg-indigo-100 text-indigo-800'
    };
  }

  if (ext === '.tmp' || fileType === 'temp') {
    return {
      icon: FileQuestion,
      color: 'text-slate-400',
      bgColor: 'bg-slate-100 border-slate-300',
      tag: 'Berkas Sementara',
      badgeClass: 'bg-slate-200 text-slate-700'
    };
  }

  return {
    icon: FileText,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 border-slate-200',
    tag: 'Teks .txt',
    badgeClass: 'bg-slate-100 text-slate-700'
  };
}

export default function ExplorerMainView({
  currentItems,
  selectedItem,
  setSelectedItem,
  navigateToFolder,
  viewMode,
  onOpenNewFolder,
  onOpenNewFile
}) {
  if (currentItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white min-h-[360px]">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <Folder className="w-8 h-8 stroke-1" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Folder ini masih kosong</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Gunakan tombol di bawah untuk membuat subfolder atau membuat berkas sesuai petunjuk checklist misi Anda.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewFolder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Buat Folder</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewFile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition"
          >
            <FilePlus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Buat Berkas</span>
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex-1 overflow-x-auto bg-white p-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <th className="py-2.5 px-3">Nama</th>
              <th className="py-2.5 px-3 hidden sm:table-cell">Tipe</th>
              <th className="py-2.5 px-3">Ukuran</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const isFolder = item.type === 'folder';
              const visual = getFileVisual(item);
              const IconComp = visual.icon;

              return (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  onDoubleClick={() => {
                    if (isFolder) navigateToFolder(item.id);
                  }}
                  className={`cursor-pointer transition select-none ${
                    isSelected
                      ? 'bg-indigo-50/80 font-bold text-indigo-900'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <td className="py-2.5 px-3 flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 flex-shrink-0 ${visual.color}`} />
                    <span className="truncate max-w-[200px] sm:max-w-xs">{item.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 hidden sm:table-cell">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${visual.badgeClass}`}>
                      {visual.tag}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                    {isFolder ? 'Folder' : item.size || '12 KB'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {isFolder ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToFolder(item.id);
                        }}
                        className="px-2 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100/70 rounded-lg transition"
                      >
                        Buka &rarr;
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Berkas</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Default: Grid View (Responsive 2 cols on mobile, 3 on sm, 4 on md, 5 on xl)
  return (
    <div className="flex-1 p-3 sm:p-5 bg-white overflow-y-auto min-h-[380px]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {currentItems.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          const isFolder = item.type === 'folder';
          const visual = getFileVisual(item);
          const IconComp = visual.icon;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              onDoubleClick={() => {
                if (isFolder) navigateToFolder(item.id);
              }}
              className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col items-center justify-between text-center relative group ${
                isSelected
                  ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-indigo-200 hover:bg-slate-50/60 hover:shadow-2xs'
              }`}
              id={`item-${item.id}`}
            >
              {/* Type Badge */}
              <div className="w-full flex items-center justify-between mb-1">
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md truncate max-w-[80px] ${visual.badgeClass}`}>
                  {isFolder ? 'Folder' : visual.tag.split(' ')[0]}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">
                  {isFolder ? '' : item.size}
                </span>
              </div>

              {/* Large Visual Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center my-1 group-hover:scale-105 transition-transform">
                {isFolder ? (
                  <Folder className="w-12 h-12 sm:w-14 sm:h-14 text-amber-400 fill-amber-300 drop-shadow-xs" />
                ) : (
                  <IconComp className={`w-10 h-10 sm:w-12 sm:h-12 ${visual.color}`} />
                )}
              </div>

              {/* Item Name */}
              <div className="w-full mt-1">
                <span className="text-xs font-bold text-slate-800 break-words line-clamp-2 leading-tight">
                  {item.name}
                </span>
              </div>

              {/* Action Hint / Mobile Tap to Open */}
              {isFolder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToFolder(item.id);
                  }}
                  className="mt-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition w-full"
                >
                  Buka Folder &rarr;
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
