'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RiArrowUpDoubleFill } from 'react-icons/ri';

const ScrollToTop = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScrollTop = useCallback(() => {
    const winScroll = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    setScrollProgress(scrolled);

    if (!showScroll && window.scrollY > 400) {
      setShowScroll(true);
    } else if (showScroll && window.scrollY <= 400) {
      setShowScroll(false);
    }
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [checkScrollTop]);

  return (
    <div className="relative cursor-pointer" onClick={scrollTop}>
      <svg
        className={`${
          showScroll ? 'block' : 'hidden'
        } absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%+4px)] h-[calc(100%+4px)] -rotate-90 pointer-events-none`}
      >
        <rect
          className="text-[#D9C1A3]"
          strokeWidth="2"
          stroke="currentColor"
          fill="transparent"
          width="94%"
          height="94%"
          x="3%"
          y="3%"
          rx="10%"
          ry="10%"
        />
        <rect
          className="text-red-500"
          strokeWidth="2"
          strokeDasharray={`${2 * (94 + 94)}%`}
          strokeDashoffset={`${2 * (94 + 94) * (1 - scrollProgress / 100)}%`}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          width="94%"
          height="94%"
          x="3%"
          y="3%"
          rx="10%"
          ry="10%"
        />
      </svg>
      <div
        className={`${
          showScroll ? 'block' : 'hidden'
        } bg-[#D9C1A3] p-2 rounded relative z-10`}
      >
        <RiArrowUpDoubleFill size={24} color="black" />
      </div>
    </div>
  );
};

export default ScrollToTop;
