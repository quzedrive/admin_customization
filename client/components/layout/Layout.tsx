'use client'

import React from 'react'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFloating from '../Whatsapp'
import { usePathname } from 'next/navigation'
import { useSiteSettingsQueries } from '@/lib/hooks/queries/useSiteSettingsQueries'

function Layout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const { useSiteSettings } = useSiteSettingsQueries();
  const { data: settings, isLoading } = useSiteSettings();

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