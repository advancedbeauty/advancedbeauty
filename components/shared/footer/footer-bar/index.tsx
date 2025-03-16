'use client';

import React from 'react';
import IconLink from '@/components/ui/features/Iconlink';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { RiAccountCircleFill, RiAccountCircleLine } from 'react-icons/ri';
import { IoSearchOutline } from 'react-icons/io5';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { BsHandbag, BsHandbagFill } from 'react-icons/bs';

const FooterBar = () => {
  return (
    <div className="fixed bottom-0 bg-[#111111] w-full z-30 px-3 py-2 border-t-[0.1px] border-gray-500 text-white lg:hidden flex justify-around">
      <IconLink activeIcon={GoHomeFill} icon={GoHome} href="/" text={'Home'} />
      <IconLink
        activeIcon={IoSearchOutline}
        icon={IoSearchOutline}
        href="/search"
        text={'Search'}
      />
      <IconLink
        activeIcon={IoIosHeart}
        icon={IoIosHeartEmpty}
        href="/wishlist"
        text={'Wishlist'}
      />
      <IconLink
        activeIcon={RiAccountCircleFill}
        icon={RiAccountCircleLine}
        href="/auth"
        text={'Account'}
      />
      <IconLink
        activeIcon={BsHandbagFill}
        icon={BsHandbag}
        href="/cart"
        text={'Cart'}
      />
    </div>
  );
};

export default FooterBar;
