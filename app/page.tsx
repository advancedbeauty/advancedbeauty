import React from 'react';
import Footer from '@/components/shared/footer';
import Faqsection from '@/components/home/faq';
import FooterBar from '@/components/shared/footer/footer-bar';
import SubscribeNewsletter from '@/components/shared/subscribe-newsletter';
import NavbarMarginLayout from '@/components/shared/navbar/navbar-margin-layout';
import Herosection from '@/components/home/hero';
import Certificatesection from '@/components/home/certificate';
import Awardsection from '@/components/home/award';
import Testimonialsection from '@/components/home/testimonial';
import InstagramHighlight from '@/components/home/instagramhighlight';
import ServiceCategory from '@/components/home/servicecategory';
import TrendingServices from '@/components/home/trendingservices';
import Aboutsection from '@/components/home/about';
import FloatingActions from '@/components/ui/features/Floatingactions';
import { getHeroBanners } from '@/actions/herobanner.action';

export interface HeroBanner {
  id: string;
  image: string;
  mdImage: string;
  link: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const page = async () => {
  const hero_response = await getHeroBanners();
  const items =
    hero_response.success && Array.isArray(hero_response.data)
      ? hero_response.data.map((banner: HeroBanner) => ({
          url: banner.link,
          image: banner.image,
          mdImage: banner.mdImage,
          isPublished: banner.isPublished,
        }))
      : [];
  return (
    <NavbarMarginLayout>
      <Herosection items={items} />
      <ServiceCategory />
      <TrendingServices />
      <Aboutsection />
      <InstagramHighlight />
      <Testimonialsection />
      <Awardsection />
      <Certificatesection />
      <Faqsection />
      <SubscribeNewsletter />
      <FloatingActions />
      <FooterBar />
      <Footer />
    </NavbarMarginLayout>
  );
};

export default page;
