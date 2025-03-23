import React from 'react';
import Footer from '@/components/shared/footer';
import FooterBar from '@/components/shared/footer/footer-bar';
import SubscribeNewsletter from '@/components/shared/subscribe-newsletter';
import NavbarMarginLayout from '@/components/shared/navbar/navbar-margin-layout';
import FloatingActions from '@/components/ui/features/Floatingactions';

interface RoutesLayoutProps {
  children: React.ReactNode;
}

const RoutesLayout: React.FC<RoutesLayoutProps> = ({ children }) => {
  return (
    <NavbarMarginLayout>
      {children}
      <SubscribeNewsletter />
      <FloatingActions />
      <FooterBar />
      <Footer />
    </NavbarMarginLayout>
  );
};

export default RoutesLayout;
