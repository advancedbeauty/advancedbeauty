import React from 'react';
import ScrollToTop from './Scrolltotop';
import { WhatsAppSolid } from '@/public/svgs';

const FloatingActions = () => {
  return (
    <div className="fixed bottom-24 lg:bottom-10 right-3 cursor-pointer flex flex-col gap-3 z-40">
      <ScrollToTop />
      <a
        href={`https://api.whatsapp.com/send?phone=%2B918826207080`}
        target="_blank"
        rel="noopener noreferrer"
        className=""
      >
        <WhatsAppSolid
          height="2.5rem"
          width="2.5rem"
          fillColor="#FF5956"
          strokeWidth="0"
          strokeColor="currentColor"
        />
      </a>
    </div>
  );
};

export default FloatingActions;
