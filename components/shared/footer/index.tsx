import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CgFacebook } from 'react-icons/cg';
import { FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';
import Section from '@/components/ui/features/Section';
import Container from '@/components/ui/features/Container';
import SocialIcon from '@/components/ui/features/Socialicon';

const Footer = () => {
  return (
    <Section className="bg-[#111111] text-white pt-10 relative flex-col">
      <Container className="w-full flex flex-col gap-5">
        <div className="w-full flex justify-center flex-col items-center gap-7">
          <div className="rounded-[100%] bg-[#111111] p-5 absolute -top-[75px] left-1/2 -translate-x-1/2">
            <Image
              src="/logo/logo.png"
              alt=""
              width={1000000}
              height={100000}
              quality={100}
              className="w-[120px] select-none"
            />
          </div>
          <div className="mt-7">
            <Image
              src="/logo/logo_name.png"
              alt=""
              width={1000000}
              height={1000000}
              quality={100}
              className="w-[350px] select-none"
            />
          </div>
          <div className="flex gap-5">
            <SocialIcon
              color="#000"
              className="bg-neutral-400 hover:bg-gray-100 transition duration-150"
              icon={CgFacebook}
              href="/"
            />
            <SocialIcon
              color="#000"
              className="bg-neutral-400 hover:bg-gray-100 transition duration-150"
              icon={FaInstagram}
              href="/"
            />
            <SocialIcon
              color="#000"
              className="bg-neutral-400 hover:bg-gray-100 transition duration-150"
              icon={FaYoutube}
              href="/"
            />
            <SocialIcon
              color="#000"
              className="bg-neutral-400 hover:bg-gray-100 transition duration-150"
              icon={IoIosMail}
              href="/"
            />
            <SocialIcon
              color="#000"
              className="bg-neutral-400 hover:bg-gray-100 transition duration-150"
              icon={FaLinkedinIn}
              href="/"
            />
          </div>
        </div>
        <div className="border-b border-neutral-400"></div>
        <div className="flex flex-wrap items-center justify-around gap-7 font-medium text-center">
          <Link
            className="hover:underline hover:text-[#D9C1A3] transition duration-100"
            href={'/'}
          >
            About Us
          </Link>
          <Link
            className="hover:underline hover:text-[#D9C1A3] transition duration-100"
            href={'/legal/privacy-policy'}
          >
            Privacy Policy
          </Link>
          <Link
            className="hover:underline hover:text-[#D9C1A3] transition duration-100"
            href={'/legal/tnc'}
          >
            Terms & Conditions
          </Link>
          <Link
            className="hover:underline hover:text-[#D9C1A3] transition duration-100"
            href={'/'}
          >
            FAQ
          </Link>
          <Link
            className="hover:underline hover:text-[#D9C1A3] transition duration-100"
            href={'/'}
          >
            Contact Us
          </Link>
        </div>
        <div className="border-b border-neutral-400"></div>
        <div className="px-5">
          <span className="uppercase text-2xl font-semibold">Get in touch</span>
          <div className="mt-5 flex flex-wrap justify-between gap-10">
            <div>
              <span className="font-semibold text-lg">Call us at</span>
              <div className="flex flex-col mt-3 text-neutral-400">
                <span>+91 8506097080</span>
                <span>Monday to Friday: 09:00 AM - 09:00 PM</span>
                <span>Saturday: 09:00 AM - 07:00 PM</span>
              </div>
            </div>
            <div>
              <span className="font-semibold text-lg">Support</span>
              <div className="flex flex-col mt-3 text-neutral-400">
                <span>support@advancedbeauty.in</span>
              </div>
            </div>
            <div>
              <span className="font-semibold text-lg">Address</span>
              <div className="flex flex-col mt-3 text-neutral-400">
                <span>House no 120, Mata Wali Gali,</span>
                <span>Near Aggarwal Dharamshala Road,</span>
                <span>Molar band Extension, Mithapur,</span>
                <span>New Delhi, Delhi 110044</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="w-full mt-5 mb-12 lg:mb-0">
        <div className="border-b border-neutral-400"></div>
        <Container className="w-full py-5 flex justify-center items-center gap-2 md:gap-5 md:justify-between px-8 font-semibold text-sm flex-wrap text-center">
          <span>Copyright © 2025 ADVANCED BEAUTY. All rights reserved.</span>
          <span>
            Designed with{' '}
            <span className={`text-red-500 text-lg select-none`}>&#x2665;</span>{' '}
            by{' '}
            <Link
              href={`https://diwakarjha.vercel.app/`}
              target="_blank"
              className={`text-red-500 hover:underline font-semibold`}
            >
              Diwakar Jha
            </Link>
            .
          </span>
        </Container>
      </div>
    </Section>
  );
};

export default Footer;
