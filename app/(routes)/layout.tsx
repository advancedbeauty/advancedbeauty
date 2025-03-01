import React from 'react';
import Footer from '@/components/footer';
import FooterBar from '@/components/footer/footer-bar';
import SubscribeNewsletter from '@/components/subscribe-newsletter';
import NavbarMarginLayout from '@/components/ui/navbar-margin-layout';

interface RoutesLayoutProps {
  children: React.ReactNode;
}

const RoutesLayout: React.FC<RoutesLayoutProps> = ({ children }) => {
  return (
    <NavbarMarginLayout>
      {children}
      <SubscribeNewsletter />
      <FooterBar />
      <Footer />
    </NavbarMarginLayout>
  );
};

export default RoutesLayout;
