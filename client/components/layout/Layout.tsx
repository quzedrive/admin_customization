'use client'

import React from 'react'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFloating from '../Whatsapp'
import { usePathname } from 'next/navigation'
function Layout({ children, settings }: { children: React.ReactNode, settings?: any }) {

  const pathname = usePathname();

  const isLoading = !settings;

  const location = {
    address: settings?.contact?.address,
    link: settings?.contact?.mapUrl,
  }

  const contact = {
    contactEmail: settings?.contact?.email,
    supportEmail: settings?.contact?.supportEmail,
    hostContact: settings?.contact?.hostContact,
    customerContact: settings?.contact?.customerContact,
  }

  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header logoLight={settings?.general?.lightLogo} isLoading={isLoading} />}
      <main>{children}</main>
      {!isAdminRoute &&
        <Footer
          logoLight={settings?.general?.lightLogo}
          isLoading={isLoading}
          title={settings?.general?.siteTitle}
          description={settings?.general?.description}
          location={location}
          contact={contact}
        />
      }
      {!isAdminRoute && <WhatsAppFloating />}
    </>
  )
}

export default Layout
