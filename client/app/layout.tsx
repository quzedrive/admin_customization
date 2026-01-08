import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Inter, Montserrat } from 'next/font/google';
import "./globals.css";
import AuthLayout from "@/components/AuthLayout";
import toast, { Toaster } from 'react-hot-toast';
import { WhatsAppProvider } from './context/WhatsappContext'
import Layout from "@/components/layout/Layout";
import { ReduxProvider } from "@/redux/store/provider";
import TanstackProvider from "@/lib/providers/TanstackProvider";
import AppearanceProvider from "@/components/providers/AppearanceProvider";


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("host") ?? "";
  const isTarget = host === "quzeedrive-kappa.vercel.app";

  return {
    title: "Quzeedrive",
    description: "A car rental & touring app",
    robots: isTarget
      ? { index: false, follow: false } // -> <meta name="robots" content="noindex, nofollow">
      : { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="google-site-verification" content="enaqBdW0v5V_eTawkpiALwGQ_n6dAy7qDwA_P8QE8q0" />
      </head>
      <body
        className={`scroll-smooth ${inter.variable} font-inter ${montserrat.variable} antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K5W3PJN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <TanstackProvider>
          <ReduxProvider>
            <AppearanceProvider>
              <AuthLayout>
                <WhatsAppProvider>
                  <Layout>
                    {children}
                  </Layout>
                </WhatsAppProvider>
              </AuthLayout>
            </AppearanceProvider>
          </ReduxProvider>
        </TanstackProvider>

        {/* Google Tag Manager - Deferred */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K5W3PJN');`,
          }}
        />

        {/* Google Analytics - Deferred */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RVY3QHNNEN"
          strategy="afterInteractive"
        />
        <Script
          id="ga-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RVY3QHNNEN');
          `,
          }}
        />
      </body>
    </html>
  );
}
