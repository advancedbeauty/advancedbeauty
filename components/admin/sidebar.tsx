'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Logo from '@/components/ui/features/Logo';
import { IoLogOutOutline } from 'react-icons/io5';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DashboardSideBar = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut();
  };

  const getLinkClassName = (href: string) => {
    return `w-full flex gap-2 items-center hover:bg-neutral-700 py-2 px-3 rounded cursor-pointer transition-colors duration-200 ${
      pathname === href ? 'bg-neutral-800' : ''
    }`;
  };

  return (
    <Sidebar className="text-white bg-black">
      <SidebarHeader className="bg-black">
        <Logo />
      </SidebarHeader>

      <hr />

      <SidebarContent className="bg-black text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Link
              href={'/admin/dashboard'}
              className={getLinkClassName('/admin/dashboard')}
            >
              Dashboard
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">
            Manage services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Link
              href={'/admin/create/service-item'}
              className={getLinkClassName('/admin/create/service-item')}
            >
              Service item
            </Link>
          </SidebarGroupContent>
          <SidebarGroupContent>
            <Link
              href={'/admin/manage/orders'}
              className={getLinkClassName('/admin/manage/orders')}
            >
              Orders
            </Link>
          </SidebarGroupContent>
          <SidebarGroupContent>
            <Link
              href={'/admin/create/offers'}
              className={getLinkClassName('/admin/create/offers')}
            >
              Offers
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">
            Layout
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Link
              href={'/admin/create/hero-banner'}
              className={getLinkClassName('/admin/create/hero-banner')}
            >
              Hero Section
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <hr />

      <SidebarFooter className="bg-black">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="w-full flex gap-2 items-center bg-neutral-800 hover:bg-neutral-700 py-2 px-3 rounded cursor-pointer transition-colors duration-200">
              <IoLogOutOutline size={24} />
              <span className="font-medium">Logout</span>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to log out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will be signed out of your current session. You can always
                log back in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="mr-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600"
              >
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSideBar;
