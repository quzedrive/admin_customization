import type { Metadata } from "next";
import '@ant-design/v5-patch-for-react-19';
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
import client from "@/lib/api/client";

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

async function fetchSettings() {
  try {
    const { data } = await client.get('/settings/site-settings');
    return data;
  } catch (error) {
    // console.error("Failed to load settings in metadata");
    return null;
  }
}

async function fetchAppearanceSettings() {
  try {
    const { data } = await client.get('/settings/appearance');
    return data;
  } catch (error) {
    // console.error("Failed to load appearance settings");
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("host") ?? "";
  const isTarget = host === "admin-customization.vercel.app";

  const settings = await fetchSettings();

  const title = settings?.seo?.metaTitle || settings?.general?.siteTitle || "Quzeedrive";
  const description = settings?.seo?.metaDescription || settings?.general?.description || "A car rental & touring app";
  const favicon = settings?.general?.favicon || "/favicon.ico";

  return {
    title: {
      default: title,
      template: `%s | ${settings?.general?.siteTitle || "Quzeedrive"}`,
    },
    description: description,
    keywords: settings?.general?.keywords
      ? (settings.general.keywords as string).split(',').map((k: string) => k.trim())
      : [],
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    authors: [{ name: "Quzeedrive" }],
    creator: "Quzeedrive",
    publisher: "Quzeedrive",
    category: "Technology",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `https://${host}`,
      title: title as string,
      description: description as string,
      siteName: settings?.general?.siteTitle || "Quzeedrive",
      images: [
        {
          url: settings?.seo?.ogImage || "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${settings?.general?.siteTitle || "Quzeedrive"} - Mobile App & Web Development`,
        },
      ],
    },
    robots: isTarget
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appearanceSettings = await fetchAppearanceSettings();

  const primaryColor = appearanceSettings?.primaryColor || '#2563eb';
  const secondaryColor = appearanceSettings?.secondaryColor || '#4f46e5';
  const iconColor = appearanceSettings?.iconColor || '#3b82f6';

  const themeStyles = `
    :root {
      --color-primary: ${primaryColor};
      --color-secondary: ${secondaryColor};
      --color-icon: ${iconColor};
    }
  `;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="google-site-verification" content="enaqBdW0v5V_eTawkpiALwGQ_n6dAy7qDwA_P8QE8q0" />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
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
