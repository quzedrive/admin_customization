'use client'

import React from 'react'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFloating from '../Whatsapp'
import { usePathname } from 'next/navigation'
import { useSiteSettingsQueries } from '@/lib/hooks/queries/useSiteSettingsQueries'
import MaintenanceScreen from '../MaintenanceScreen'

function Layout({ children }: { children: React.ReactNode }) {

  const { useSiteSettings } = useSiteSettingsQueries();
  const { data: settings, isLoading } = useSiteSettings();

  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');

  // Check if maintenance mode is active (1) and we are not on an admin route
  const isMaintenanceMode = settings?.maintenance?.status === 1 && !isAdminRoute;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!isAdminRoute && isMaintenanceMode) {
    return (
      <MaintenanceScreen
        title={settings?.maintenance?.title}
        message={settings?.maintenance?.message}
        siteTitle={settings?.general?.siteTitle}
      />
    );
  }

  return (
    <>
      {!isAdminRoute && <Header />}
      <main>{children}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppFloating />}
    </>
  )
}

export default Layout