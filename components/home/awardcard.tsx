import React from 'react';
import Image from 'next/image';

interface AwardsCardProps {
  src?: string;
}

const AwardsCard: React.FC<AwardsCardProps> = ({ src }) => {
  return (
    <div className="relative overflow-hidden h-[100px]">
      <Image
        fill
        src={src || ''}
        alt="Award"
        className="object-contain select-none"
      />
    </div>
  );
};

export default AwardsCard;
