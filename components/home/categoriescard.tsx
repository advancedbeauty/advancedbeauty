import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface CategoriesCardProps {
    src?: string;
    alt?: string;
    href?: string;
    title?: string;
    isLoading?: boolean;
}

const CategoriesCard: React.FC<CategoriesCardProps> = ({ src, alt, href, title, isLoading = false }) => {
    if (isLoading) {
        return <LoadingImageCard />;
    }

    const hrefs = href || '';
    return (
        <Link href={hrefs} className="flex flex-col items-center group transition-transform hover:scale-105">
            <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-lg">
                <Image
                    src={`${src}`}
                    alt={`${alt}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="(max-width: 768px) 5rem, 6rem"
                />
            </div>
            <div className="mt-2 text-center text-sm md:text-base font-medium capitalize">{title}</div>
        </Link>
    );
};

const LoadingImageCard = () => {
    return (
        <div className="flex flex-col items-center w-24">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-200 animate-pulse" />
            <div className="mt-2 w-16 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
    );
};

export default CategoriesCard;
