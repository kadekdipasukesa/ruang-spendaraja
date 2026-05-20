// src/components/Games1Typing/WordItem.jsx
import React from 'react';

const renderChar = (word, wordIdx, char, charIdx, userInput, currentIndex, wordHistory) => {
  let colorClass = "text-slate-500";
  
  if (wordIdx < currentIndex) {
    // Kata yang sudah lewat: Hijau redup jika benar, Merah jika salah
    colorClass = wordHistory[wordIdx] ? "text-emerald-600/70" : "text-rose-600/70 line-through";
  } else if (wordIdx === currentIndex) {
    // Kata yang sedang aktif diketik
    if (charIdx < userInput.length) {
      // Per karakter: Hijau jika pas, Merah + Underline jika salah ketik
      colorClass = char === userInput[charIdx] ? "text-emerald-400 font-bold" : "text-rose-500 underline decoration-2 font-bold bg-rose-500/10";
    } else {
      // Karakter yang belum diketik pada kata aktif
      colorClass = "text-white font-medium";
    }
  }
  
  return <span key={charIdx} className={colorClass}>{char}</span>;
};

// Menggunakan React.forwardRef agar parent (TypingGame) bisa melacak koordinat offsetTop
const WordItem = React.forwardRef(({ word, wordIdx, currentIndex, userInput, wordHistory }, ref) => {
  const isActive = wordIdx === currentIndex;
  
  return (
    <span 
      // KUNCI: Ref hanya dipasang pada kata yang sedang aktif agar scroller tahu targetnya
      ref={isActive ? ref : null} 
      className={`transition-all duration-200 px-2 py-0.5 rounded-xl text-xl md:text-3xl font-medium whitespace-nowrap ${
        isActive 
          ? 'bg-blue-600/20 ring-2 ring-blue-500/50 shadow-lg shadow-blue-950/50 scale-105 mx-1' 
          : 'mx-0.5'
      }`}
    >
      {word.split('').map((char, cIdx) => 
        renderChar(word, wordIdx, char, cIdx, userInput, currentIndex, wordHistory)
      )}
    </span>
  );
});

WordItem.displayName = "WordItem";

// Tetap gunakan React.memo agar rendering performanya super enteng saat ngetik cepat
export default React.memo(WordItem);