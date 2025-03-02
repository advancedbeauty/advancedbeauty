'use client';

import * as React from 'react';
import AwardsCard from './awardcard';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import data from '@/lib/data';

const Awardsection = () => {
  const carouselRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Create smooth continuous scrolling effect
    const scrollContent = () => {
      if (!carouselRef.current) return;

      const content = carouselRef.current;
      const scrollAmount = 2; // Slightly increased for faster scrolling

      // Increment scroll position
      content.scrollLeft += scrollAmount;

      // If reached the end, reset to beginning
      if (content.scrollLeft >= content.scrollWidth - content.clientWidth) {
        content.scrollLeft = 0;
      }

      // Continue animation
      requestAnimationFrame(scrollContent);
    };

    // Start the animation
    const animation = requestAnimationFrame(scrollContent);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animation);
    };
  }, []);

  return (
    <Section className="py-16 md:py-20">
      <Container className="w-full overflow-hidden">
        <div className="relative w-full">
          <div
            ref={carouselRef}
            className="flex overflow-x-scroll"
            style={{
              scrollBehavior: 'auto',
              scrollbarWidth: 'none' /* Firefox */,
              msOverflowStyle: 'none' /* IE and Edge */,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* CSS to hide scrollbar for Chrome/Safari/Opera */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Double the items to create a seamless loop */}
            {[...data.HomeAwardsData, ...data.HomeAwardsData].map(
              (card, index) => (
                <div
                  key={`award-${index}`}
                  className="flex-none w-full xs:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 px-2"
                >
                  <AwardsCard src={card.src} />
                </div>
              ),
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Awardsection;
