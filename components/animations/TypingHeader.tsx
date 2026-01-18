'use client'
import { Typewriter } from 'react-simple-typewriter';
import React from 'react';

interface TypingHeaderProps {
  className?: string;
  words: string[];
}

const TypingHeader: React.FC<TypingHeaderProps> = ({ className = '', words }) => {
  return (
    <h2 className={className}>
      <Typewriter
        words={words}
        loop={true}
        cursor
        cursorStyle="|"
        typeSpeed={40}
        deleteSpeed={50}
        delaySpeed={2000}
      />
    </h2>
  );
};

export default TypingHeader;