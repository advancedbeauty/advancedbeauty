import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className, onClick }) => {
    return (
        <Link href={'/'} onClick={onClick} className={`${className} select-none logo-font font-bold text-2xl flex items-center gap-3`}>
            <Image
                src="/logo/logo_full.png"
                alt="Logo"
                width={1000000}
                height={1000000}
                className="w-[250px] max-h-[61px] object-contain"
                priority
            />
        </Link>
    );
};

export default Logo;