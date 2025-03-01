import React from 'react';
import FooterBar from '@/components/footer/footer-bar';
import Footer from '@/components/footer';
import NavbarMarginLayout from '@/components/navbar/navbar-margin-layout';
import Faqsection from '@/components/home/Faq.section';
import SubscribeNewsletter from '@/components/subscribe-newsletter';

const page = () => {
  return (
    <NavbarMarginLayout>
      <Faqsection />
      <SubscribeNewsletter />
      <FooterBar />
      <Footer />
    </NavbarMarginLayout>
  );
};

export default page;
