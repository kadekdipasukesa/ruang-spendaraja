import React from 'react';
import { Send, MessageSquareOff } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

export default function ChatInputForm({
    isChatLockedForUser,
    newMessage,
    setNewMessage,
    handleSend,
    effectiveRoom,
    showEmoji,
    setShowEmoji,
    onEmojiClick
}) {
    if (isChatLockedForUser) {
        return (
            <div className="p-3 bg-slate-900 border-t border-slate-700 text-center">
                <div className="inline-flex items-center gap-2 text-xs text-red-400 font-bold bg-red-950/40 border border-red-500/30 px-3 py-1.5 rounded-xl">
                    <MessageSquareOff size={14} />
                    <span>Obrolan kelas Anda sedang dikunci guru.</span>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSend} className="p-2.5 bg-slate-800 border-t border-slate-700 relative">
            {showEmoji && (
                <div className="absolute bottom-full right-0 mb-2 z-[110]">
                    <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} width={300} height={400} skinTonesDisabled />
                </div>
            )}

            <div className="flex gap-2 items-center">
                <button
                    type="button"
                    onClick={() => setShowEmoji(prev => !prev)}
                    className="text-xl cursor-pointer select-none"
                    title="Sisipkan emoji"
                >
                    😀
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onFocus={() => setShowEmoji(false)}
                    placeholder={
                        effectiveRoom === 'guru' 
                            ? "Tulis pesan untuk guru..." 
                            : "Tulis pesan untuk siswa..."
                    }
                    className={`flex-1 bg-slate-900 border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-colors ${
                        effectiveRoom === 'guru' 
                            ? 'border-slate-700 focus:border-amber-500' 
                            : 'border-slate-700 focus:border-blue-500'
                    }`}
                />
                <button 
                    type="submit" 
                    title="Kirim pesan"
                    disabled={!newMessage.trim()}
                    className={`p-2 rounded-xl text-white active:scale-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        effectiveRoom === 'guru' 
                            ? 'bg-amber-600 hover:bg-amber-500' 
                            : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                >
                    <Send size={16} />
                </button>
            </div>
        </form>
    );
}
