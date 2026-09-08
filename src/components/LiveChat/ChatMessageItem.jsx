import React from 'react';
import { ShieldCheck, GraduationCap, Trash2 } from 'lucide-react';
import LinkPreviewCard, { extractFirstUrl, renderMessageText } from './LinkPreviewCard';
import { getShortName, getNameColor, getSenderRoleOrClass } from './chatHelpers';

export default function ChatMessageItem({ msg, currentUserId, currentStudent, senderMap, isUserAdmin, onDeleteMessage }) {
    const isMe = String(msg.sender_id || msg.student_id) === String(currentUserId);
    const sender = senderMap[String(msg.sender_id || msg.student_id)] || (isMe ? currentStudent : null);

    const senderName = sender?.NAMA || sender?.nama || msg.full_name || 'Pengguna';
    const senderRole = String(sender?.role || msg.role || '').toLowerCase();
    const isAdmin = senderRole === 'admin';
    const isGuru = senderRole === 'guru';
    const senderRoleOrClass = getSenderRoleOrClass(sender, msg);
    const hasUrl = Boolean(extractFirstUrl(msg.pesan));

    return (
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
            {!isMe && (
                <span className={`text-[10px] font-normal flex items-center gap-1 mb-0.5 ${
                    isAdmin ? 'text-yellow-400' : isGuru ? 'text-amber-400' : getNameColor(senderName)
                }`}>
                    {isAdmin && <ShieldCheck size={11} className="text-yellow-300" />}
                    {isGuru && <GraduationCap size={11} className="text-amber-300" />}
                    <span>{getShortName(senderName)}{senderRoleOrClass ? ` • ${senderRoleOrClass}` : ''}</span>
                </span>
            )}
            <div className={`flex items-end gap-1.5 min-w-0 max-w-full group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <div
                    className={`max-w-[260px] text-xs px-3 py-2 rounded-2xl break-words leading-relaxed overflow-hidden ${
                        isMe
                            ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                            : 'bg-slate-700/80 text-slate-100 rounded-bl-none shadow-sm'
                    }`}
                >
                    <p className="whitespace-pre-wrap break-words">
                        {renderMessageText(msg.pesan)}
                    </p>
                    {hasUrl && (
                        <div className="mt-2 -mx-1">
                            <LinkPreviewCard url={extractFirstUrl(msg.pesan)} text={msg.pesan} isMe={isMe} />
                        </div>
                    )}
                    <p className={`text-[9px] mt-1 text-right ${
                        isMe ? 'text-blue-200/80' : 'text-slate-400'
                    }`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                {isUserAdmin && onDeleteMessage && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteMessage?.(msg.id);
                        }}
                        title="Hapus pesan ini (Admin)"
                        className="opacity-70 hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer mb-1 shrink-0 active:scale-90"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}
