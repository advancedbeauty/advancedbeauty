import Image from 'next/image';
import React from 'react';

interface AwardsCardProps {
    src?: string;
}

const AwardsCard: React.FC<AwardsCardProps> = ({ src }) => {
    return (
        <div className="relative overflow-hidden h-[100px]">
            <Image
                fill
                src={src || '/SLIDE_01.jpg'}
                alt="serviceImg"
                className="object-contain select-none"
            />
        </div>
    );
};

export default AwardsCard;
