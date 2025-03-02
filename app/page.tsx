import React from 'react';
import Footer from '@/components/shared/footer';
import Faqsection from '@/components/home/faq';
import FooterBar from '@/components/shared/footer/footer-bar';
import SubscribeNewsletter from '@/components/shared/subscribe-newsletter';
import NavbarMarginLayout from '@/components/shared/navbar/navbar-margin-layout';
import Herosection from '@/components/home/hero';

import data from '@/lib/data';
import Certificatesection from '@/components/home/certificate';
import Awardsection from '@/components/home/award';
import Testimonialsection from '@/components/home/testimonial';
import InstagramHighlight from '@/components/home/instagramhighlight';


const page = () => {
  return (
    <NavbarMarginLayout>
      <Herosection items={data.herosection_carousels}/>
      <InstagramHighlight />
      <Testimonialsection />
      <Awardsection />
      <Certificatesection />
      <Faqsection />
      <SubscribeNewsletter />
      <FooterBar />
      <Footer />
    </NavbarMarginLayout>
  );
};

export default page;
