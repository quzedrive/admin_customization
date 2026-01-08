'use client'

import React from 'react'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFloating from '../Whatsapp'
import { usePathname } from 'next/navigation'

function Layout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');

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