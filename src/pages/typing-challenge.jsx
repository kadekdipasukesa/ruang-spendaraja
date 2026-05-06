import React from 'react';
import TypingGame from '../components/Games1Typing/TypingGame';

const TypingChallengePage = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] py-12 px-4">
      {/* Container untuk memberikan padding dan max-width */}
      <div className="container mx-auto">
        <TypingGame />
      </div>
    </div>
  );
};

export default TypingChallengePage;