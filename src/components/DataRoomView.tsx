import React, { useState } from 'react';
import { 
  Lock, 
  FileText, 
  Upload, 
  ShieldCheck, 
  Eye, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { VDRFolder, VDRFile, VDRAccessLog, NDA } from '../types';

interface DataRoomViewProps {
  folders: VDRFolder[];
  files: VDRFile[];
  accessLogs: VDRAccessLog[];
  ndas: NDA[];
  onSignNDA: (ndaId: string) => Promise<void>;
  onUploadFile: (fileData: Partial<VDRFile>) => Promise<void>;
}

export const DataRoomView: React.FC<DataRoomViewProps> = ({
  folders,
  files,
  accessLogs,
  ndas,
  onSignNDA,
  onUploadFile,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('ALL');
  const [showSignModal, setShowSignModal] = useState(false);
  const [activeNdaToSign, setActiveNdaToSign] = useState<NDA | null>(null);
  const [signerName, setSignerName] = useState('Alex Mercer');
  const [signerTitle, setSignerTitle] = useState('VP Corporate Development');

  const filteredFiles = files.filter((f) => {
    if (selectedFolderId === 'ALL') return true;
    return f.folderId === selectedFolderId;
  });

  const handleOpenSignModal = (nda: NDA) => {
    setActiveNdaToSign(nda);
    setShowSignModal(true);
  };

  const handleConfirmSign = async () => {
    if (!activeNdaToSign) return;
    await onSignNDA(activeNdaToSign.id);
    setShowSignModal(false);
    setActiveNdaToSign(null);
  };

  return (
    <div id="data-room-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Virtual Data Room (VDR) & NDA Vault
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise tier-1 secure document storage with dynamic watermarking, NDA gated access, and immutable access audits.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" />
            <span>256-bit AES Encrypted</span>
          </div>
        </div>
      </div>

      {/* NDA Status & Digital Signing Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 text-indigo-400" />
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Mutual Non-Disclosure Agreements (NDAs)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ndas.map((nda) => {
            const isSigned = nda.status === 'SIGNED';
            return (
              <div
                key={nda.id}
                id={`nda-card-${nda.id}`}
                className="rounded-xl bg-slate-950/70 p-4 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-white">{nda.buyerName}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      isSigned ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {nda.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {isSigned ? `Signed on ${new Date(nda.signedAt!).toLocaleDateString()}` : 'Awaiting Digital Signature'}
                  </span>
                </div>

                {!isSigned ? (
                  <button
                    id={`sign-nda-${nda.id}-btn`}
                    onClick={() => handleOpenSignModal(nda)}
                    className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>Execute NDA</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Authorized</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Signing Modal */}
      {showSignModal && activeNdaToSign && (
        <div id="sign-nda-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-white">Digital NDA Signature Execution</h3>
            <p className="text-xs text-slate-400">
              Executing this document authorizes bilateral access to sensitive Virtual Data Room financial and architecture files.
            </p>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs text-slate-300">
              <span className="font-bold text-white block">Standard Bilateral M&A Non-Disclosure Provisions:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By clicking Execute, the parties agree to maintain strict confidentiality regarding all proprietary software, client lists, and trade secrets disclosed during due diligence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Signer Legal Name</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 p-2.5 text-xs text-slate-100 border border-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 p-2.5 text-xs text-slate-100 border border-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowSignModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                id="confirm-sign-nda-btn"
                onClick={handleConfirmSign}
                className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Execute & Unlock Data Room</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Data Room Vault: Folders & Files */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Folders list (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Categorized Vaults
          </span>

          <button
            onClick={() => setSelectedFolderId('ALL')}
            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
              selectedFolderId === 'ALL'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span>All Documents ({files.length})</span>
          </button>

          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            return (
              <button
                key={folder.id}
                id={`vdr-folder-${folder.id}`}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div>
                  <span className="text-xs block">{folder.name}</span>
                  <span className="text-[10px] text-slate-500 block">{folder.fileCount} files • {folder.accessRequirement}</span>
                </div>
                <Lock className="h-3.5 w-3.5 text-slate-500" />
              </button>
            );
          })}
        </div>

        {/* Right: Files Table & Live Access Logs (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Secure Files ({filteredFiles.length})
              </span>
              <span className="text-[10px] text-slate-400">Dynamic Watermark: CONFIDENTIAL - DATADOG M&amp;A</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {filteredFiles.map((file) => (
                <div key={file.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-indigo-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{file.name}</span>
                      <span className="text-[10px] text-slate-400">{file.category} • {file.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                      {file.permissionLevel}
                    </span>
                    <button className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access Logs Audit */}
          <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              VDR Immutable Access Audit Stream
            </span>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {accessLogs.map((log) => (
                <div key={log.id} className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{log.viewerName}</span>
                    <span className="text-slate-500 mx-1.5">•</span>
                    <span className="text-indigo-400 font-mono text-[11px]">{log.action}</span>
                    <span className="text-slate-400 ml-1.5 text-[11px]">({log.fileId})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
