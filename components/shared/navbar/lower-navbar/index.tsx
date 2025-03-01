'use client';

import React from 'react';
import Logo from '@/components/ui/features/Logo';
import Section from '@/components/ui/features/Section';
import Menu from '@/components/shared/navbar/lower-navbar/menu';
import IconLink from '@/components/ui/features/Iconlink';
import Container from '@/components/ui/features/Container';
import Navlinks from '@/components/shared/navbar/lower-navbar/navlinks';

import { GoSearch } from 'react-icons/go';
import { BiSolidOffer } from 'react-icons/bi';
import { BsHandbag, BsHandbagFill } from 'react-icons/bs';
import { RiAccountCircleFill, RiAccountCircleLine } from 'react-icons/ri';

const LowerNavbar = () => {
  return (
    <Section className="py-2 shadow bg-[#111111] text-white">
      <Container className="w-full flex items-center justify-between gap-20">
        <Logo className="" />
        <div className="flex items-center justify-center gap-4 lg:hidden">
          <IconLink
            activeIcon={BiSolidOffer}
            icon={BiSolidOffer}
            href="/offers"
          />
          <Menu />
        </div>
        <div className="hidden lg:flex items-center gap-5">
          <Navlinks />
        </div>
        <div className="hidden lg:flex justify-end items-center gap-7 w-[250px]">
          <IconLink activeIcon={GoSearch} icon={GoSearch} href="/search" />
          <IconLink
            activeIcon={RiAccountCircleLine}
            icon={RiAccountCircleLine}
            href="/auth"
          />
          <IconLink activeIcon={BsHandbagFill} icon={BsHandbag} href="/cart" />
          {/* {isSignedIn ? (
            <button
              onClick={() => signOut()}
              className="bg-[#D9C1A3] rounded-[2px] p-2 text-neutral-950 font-semibold text-sm"
            >
              <span>LOGOUT</span>
            </button>
          ) : (
            <Link
              href={'/auth'}
              className="bg-[#D9C1A3] rounded-[2px] p-2 text-neutral-950 font-semibold text-sm"
            >
              <span>LOGIN</span>
            </Link>
          )} */}
        </div>
      </Container>
    </Section>
  );
};

export default LowerNavbar;
