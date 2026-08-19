import { useState } from 'react';
import { useSimulasiFolder } from '../../hooks/RuangBelajar/TugasKhusus/Tugas1/useSimulasiFolder';

// Extracted Modular Components
import MisiHeader from '../../components/RuangBelajar/TugasKhusus/Tugas1/MisiHeader';
import FloatingMissionPanel from '../../components/RuangBelajar/TugasKhusus/Tugas1/FloatingMissionPanel';
import ExplorerToolbar from '../../components/RuangBelajar/TugasKhusus/Tugas1/ExplorerToolbar';
import ExplorerBreadcrumb from '../../components/RuangBelajar/TugasKhusus/Tugas1/ExplorerBreadcrumb';
import ExplorerSidebar from '../../components/RuangBelajar/TugasKhusus/Tugas1/ExplorerSidebar';
import ExplorerMainView from '../../components/RuangBelajar/TugasKhusus/Tugas1/ExplorerMainView';
import ExplorerStatusBar from '../../components/RuangBelajar/TugasKhusus/Tugas1/ExplorerStatusBar';

// Extracted Interactive Modals
import ModalNewFolder from '../../components/RuangBelajar/TugasKhusus/Tugas1/ModalNewFolder';
import ModalNewFile from '../../components/RuangBelajar/TugasKhusus/Tugas1/ModalNewFile';
import ModalRename from '../../components/RuangBelajar/TugasKhusus/Tugas1/ModalRename';
import ModalMove from '../../components/RuangBelajar/TugasKhusus/Tugas1/ModalMove';
import ModalDelete from '../../components/RuangBelajar/TugasKhusus/Tugas1/ModalDelete';
import ModalSubmissionSuccess from '../../components/RuangBelajar/TugasKhusus/Tugas1/ModalSubmissionSuccess';

export default function TugasSimulasiFolder() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const {
    // Session
    student,
    handleOpenLogin,
    previousSubmission,

    // File Explorer Core
    items,
    currentFolderId,
    selectedItem,
    setSelectedItem,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    allFolders,
    currentItems,
    breadcrumbs,

    // History & Navigation
    historyIndex,
    historyLength,
    navigateToFolder,
    navigateBack,
    navigateForward,
    navigateUp,

    // Missions & Evaluation (25 targets)
    evalResult,
    activeCategoryFilter,
    setActiveCategoryFilter,
    isMissionDrawerOpen,
    setIsMissionDrawerOpen,
    recentCompletedMission,
    setRecentCompletedMission,

    // Actions & CRUD
    handleCreateFolder,
    handleCreateFile,
    handleRename,
    handleDelete,
    handleMove,
    handleResetSimulation,
    handleSubmitSimulation,

    // Modals
    showNewFolderModal,
    setShowNewFolderModal,
    showNewFileModal,
    setShowNewFileModal,
    renameTarget,
    setRenameTarget,
    moveTarget,
    setMoveTarget,
    deleteTarget,
    setDeleteTarget,
    showSuccessModal,
    setShowSuccessModal,
    isSubmitting
  } = useSimulasiFolder();

  const currentFolder = items.find((it) => it.id === currentFolderId);
  const currentFolderName = currentFolder ? currentFolder.name : 'Drive Utama (C:)';

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 font-sans pb-16 pt-20 sm:pt-24">
      {/* Floating Translucent Left Sliding Mission Drawer & Celebrations */}
      <FloatingMissionPanel
        evalResult={evalResult}
        isOpen={isMissionDrawerOpen}
        setIsOpen={setIsMissionDrawerOpen}
        activeCategoryFilter={activeCategoryFilter}
        setActiveCategoryFilter={setActiveCategoryFilter}
        recentCompletedMission={recentCompletedMission}
        onDismissCelebration={() => setRecentCompletedMission(null)}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-5">
        {/* 1. Unified Modernized Hero Header */}
        <MisiHeader
          student={student}
          handleOpenLogin={handleOpenLogin}
          previousSubmission={previousSubmission}
          handleResetSimulation={handleResetSimulation}
          handleSubmitSimulation={handleSubmitSimulation}
          isSubmitting={isSubmitting}
          evalResult={evalResult}
          onOpenMissions={() => setIsMissionDrawerOpen(true)}
        />

        {/* 2. Authentic File Explorer Main Window */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col min-h-[580px]">
          {/* File Explorer Top Toolbar */}
          <ExplorerToolbar
            selectedItem={selectedItem}
            onOpenNewFolder={() => setShowNewFolderModal(true)}
            onOpenNewFile={() => setShowNewFileModal(true)}
            onRename={() => setRenameTarget(selectedItem)}
            onMove={() => setMoveTarget(selectedItem)}
            onDelete={() => setDeleteTarget(selectedItem)}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalCurrentItems={currentItems.length}
          />

          {/* Explorer Address Bar / Breadcrumbs */}
          <ExplorerBreadcrumb
            breadcrumbs={breadcrumbs}
            currentFolderId={currentFolderId}
            navigateToFolder={navigateToFolder}
            navigateBack={navigateBack}
            navigateForward={navigateForward}
            navigateUp={navigateUp}
            historyIndex={historyIndex}
            historyLength={historyLength}
            totalItems={currentItems.length}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />

          {/* Explorer Workspace (Sidebar Tree + File Grid/List Canvas) */}
          <div className="flex flex-col md:flex-row flex-1 min-h-[420px]">
            {/* Left Sidebar Directory Tree */}
            <ExplorerSidebar
              items={items}
              currentFolderId={currentFolderId}
              navigateToFolder={navigateToFolder}
              isSidebarOpen={isSidebarOpen}
              onCloseMobileSidebar={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <ExplorerMainView
              currentItems={currentItems}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              navigateToFolder={navigateToFolder}
              viewMode={viewMode}
              onOpenNewFolder={() => setShowNewFolderModal(true)}
              onOpenNewFile={() => setShowNewFileModal(true)}
            />
          </div>

          {/* Bottom Status Bar */}
          <ExplorerStatusBar
            totalItems={currentItems.length}
            selectedItem={selectedItem}
            currentFolderId={currentFolderId}
            items={items}
          />
        </div>
      </div>

      {/* Interactive Action Modals */}
      <ModalNewFolder
        isOpen={showNewFolderModal}
        onClose={() => setShowNewFolderModal(false)}
        onSubmit={handleCreateFolder}
        currentFolderName={currentFolderName}
      />

      <ModalNewFile
        isOpen={showNewFileModal}
        onClose={() => setShowNewFileModal(false)}
        onSubmit={handleCreateFile}
        currentFolderName={currentFolderName}
      />

      <ModalRename
        isOpen={Boolean(renameTarget)}
        targetItem={renameTarget}
        onClose={() => setRenameTarget(null)}
        onSubmit={handleRename}
      />

      <ModalMove
        isOpen={Boolean(moveTarget)}
        targetItem={moveTarget}
        allFolders={allFolders}
        onClose={() => setMoveTarget(null)}
        onSubmit={handleMove}
      />

      <ModalDelete
        isOpen={Boolean(deleteTarget)}
        targetItem={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <ModalSubmissionSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        evalResult={evalResult}
        student={student}
        handleOpenLogin={handleOpenLogin}
      />
    </div>
  );
}
