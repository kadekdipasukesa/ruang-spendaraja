import { Keyboard } from 'lucide-react';

export default function TypingStart({ onStart }) {
  return (
    <div className="text-center py-10">
      <Keyboard size={50} className="mx-auto mb-4 text-blue-400" />
      <h2 className="text-2xl font-bold text-white mb-4">
        Lomba Ketik Cepat
      </h2>
      <button
        onClick={onStart}
        className="bg-blue-600 px-6 py-3 rounded-xl text-white"
      >
        Mulai
      </button>
    </div>
  );
}