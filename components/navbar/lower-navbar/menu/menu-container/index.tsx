'use client';

import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import Logo from '@/components/ui/features/Logo';
import UpperNavbar from '@/components/navbar/upper-navbar';
import Container from '@/components/ui/features/Container';
import Section from '@/components/ui/features/Section';

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
      <div className="w-full fixed z-40 top-0 left-0 max-w-[640px] h-screen bg-white">
        <UpperNavbar />
        <Section className="py-2 shadow bg-[#111111] text-white">
          <Container className="w-full flex items-center justify-between gap-20">
            <Logo className="" />
            <div className="flex items-center justify-center gap-4 lg:hidden">
              <div className="w-[66px] flex items-center justify-end gap-4">
                <IoClose size={32} color="#FBF1EA" onClick={onClose} />
              </div>
            </div>
          </Container>
        </Section>
      </div>
    </>
  );
};

export default MenuContainer;
