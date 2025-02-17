import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

interface SocialIconProps {
    icon: IconType;
    href: string;
    size?: number;
    color?: string;
    className?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon: Icon, href, size=20, color, className }) => {
    return (
        <Link
            href={href}
            className=''
        >
            <div className={`${className} p-2 rounded-full`}>
                <Icon size={size} color={color}/>
            </div>
        </Link>
    );
};

export default SocialIcon;
