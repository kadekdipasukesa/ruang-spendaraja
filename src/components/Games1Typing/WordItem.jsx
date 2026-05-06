import React from 'react';

const renderChar = (word, wordIdx, char, charIdx, userInput, currentIndex, wordHistory) => {
  let colorClass = "text-slate-500";
  if (wordIdx < currentIndex) {
    colorClass = wordHistory[wordIdx] ? "text-green-900" : "text-red-900";
  } else if (wordIdx === currentIndex) {
    if (charIdx < userInput.length) {
      colorClass = char === userInput[charIdx] ? "text-green-400" : "text-red-500 underline decoration-2";
    } else {
      colorClass = "text-white";
    }
  }
  return <span key={charIdx} className={colorClass}>{char}</span>;
};

const WordItem = ({ word, wordIdx, currentIndex, userInput, wordHistory }) => {
  const isActive = wordIdx === currentIndex;
  return (
    <span className={`transition-all duration-200 px-2 py-0.5 rounded-lg text-xl md:text-4xl font-medium whitespace-nowrap ${isActive ? 'bg-blue-600/30 ring-1 ring-blue-500/50 scale-110' : ''}`}>
      {word.split('').map((char, cIdx) => renderChar(word, wordIdx, char, cIdx, userInput, currentIndex, wordHistory))}
    </span>
  );
};

export default React.memo(WordItem);