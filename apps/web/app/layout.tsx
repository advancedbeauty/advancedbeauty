import '@workspace/ui/globals.css'

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Poppins } from 'next/font/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Footer from '@/components/footer'
import FooterBar from '@/components/footer/footer-bar'
import SubscribeNewsletter from '@/components/subscribe-newsletter'
import NavbarMarginLayout from '@/components/navbar/navbar-margin-layout'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const customFont = localFont({
  src: [
    {
      path: '../public/fonts/quentin.ttf',
      weight: '400',
    },
  ],
  variable: '--font-quentin',
})

export const metadata: Metadata = {
  title: {
    default: 'Advanced Beauty | Best Home Salon',
    template: '%s',
  },
  description:
    'Experience premium salon services from the comfort of your home in Noida, Greater Noida, and Delhi NCR. Skip the hassle of traveling to a salon, our expert team brings professional treatments right to your doorstep. Enjoy the luxury of personalized beauty care without stepping out!',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${customFont.variable} ${poppins.className} antialiased`}>
        <GoogleOAuthProvider clientId={`${process.env.CLIENT_ID}`}>
        <Toaster position="top-center" />
          <NavbarMarginLayout>
            <main className="flex flex-col items-center justify-start w-full overflow-x-hidden">
              {children}
              <SubscribeNewsletter />
              <FooterBar />
              <Footer />
            </main>
          </NavbarMarginLayout>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
