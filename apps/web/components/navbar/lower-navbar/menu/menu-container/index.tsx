// MenuContainer.jsx
'use client';

import UpperNavbar from '@/components/navbar/upper-navbar';
import Logo from '@/components/ui/Logo';
import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

interface MenuContainerProps {
    onClose?: () => void;
}

const MenuContainer: React.FC<MenuContainerProps> = ({ onClose }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                aria-hidden="true"
                onClick={onClose}
            />

            {/* Menu Panel */}
            <div
                role="dialog"
                aria-modal="true"
                className={`fixed top-0 left-0 w-full max-w-[640px] h-screen bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out text-black overflow-y-auto`}
                
            >
                <header>
                    <UpperNavbar />
                    <div className='flex items-center justify-between gap-[70px] py-2 px-4 bg-[#111111] text-white'>
                        <Logo onClick={onClose} />
                        <IoClose size={40} color="#FBF1EA" onClick={onClose} />
                    </div>
                </header>
            </div>
        </>
    );
};

export default MenuContainer;
