'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import PopupHost from '../PopupHost';
import PopupUser from '../PopupUser'
import Nav from './Nav';
import Image from 'next/image';
import Link from 'next/link'
import { Menu } from 'lucide-react';

export const navList = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About Us",
    href: "/about-us",
  },
  {
    name: "Our Fleet",
    href: "/our-fleet",
  },
  {
    name: "Track",
    href: "/track",
  }
]

export default function Header({ logoLight, isLoading }: { logoLight?: string, isLoading?: boolean }) {
  const transparentHeaderRoutes = ['/', '/our-fleet', '/about-us', '/track'];

  const pathname = usePathname();
  const [toggleNav, setToggleNav] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  function navToggler() {
    setToggleNav(!toggleNav);
    // Disable body scroll when nav is open
    document.body.style.overflow = toggleNav ? 'auto' : 'hidden';
  }

  if (!mounted) return null; // Prevent hydration mismatch

  const isTransparent = transparentHeaderRoutes.includes(pathname) && prevScrollPos < 10;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center transition-transform duration-300 ease-in-out px-[5.4%] pt-3 md:pt-5 pb-3 md:pb-5 ${visible ? 'translate-y-0' : '-translate-y-full'} ${prevScrollPos > 10 ? 'bg-white backdrop-blur-md shadow-xs' : 'bg-transparent'}`}
      >

        <Link href='/' className='p-0 relative'>
          {isLoading ? (
            <div className={`w-16 h-16 3xl:w-[100px] 3xl:h-[100px] animate-pulse rounded-lg ${isTransparent ? 'bg-white/30' : 'bg-gray-200'}`} />
          ) : (
            logoLight ? (
              <Image
                src={logoLight}
                alt="QuzeeDrive"
                width={100}
                height={100}
                className='w-16 h-16 3xl:w-full 3xl:h-auto'
              />
            ) : null
          )}
        </Link>

        {/* Show nav on all pages */}
        <nav className={`hidden md:flex items-center font-roboto ${transparentHeaderRoutes.includes(pathname) && prevScrollPos < 10 ? 'text-white' : 'text-black'}`}>
          <ul className="flex justify-center items-center gap-16 ">
            {/* Map through navList to create navigation items */}
            {navList.map((item, index) => (
              <li key={index} className="relative group pt-2">
                <Link
                  href={item.href}
                  className="relative group 4xl:text-xl"
                >
                  {item.name}
                  <span className={`absolute left-0 -bottom-1 w-0 h-0.5 rounded-full group-hover:w-full transition-all duration-300 ${transparentHeaderRoutes.includes(pathname) && prevScrollPos < 10 ? 'bg-white' : 'bg-black'}`}></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {pathname === '/list' ? (
          <button
            className='flex cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full items-center justify-center'
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <span className='text-white'>Logout</span>
          </button>
        ) : (
          <>
            {pathname !== '/login' && pathname !== '/thank-you' && (
              <button
                className='hidden md:flex cursor-pointer primary-btn text-white px-4 py-2 rounded-full items-center justify-center'
                onClick={() => setShowPopup(!showPopup)}
              >
                <span className='text-white'>BECOME A HOST</span>
                <Image
                  src={"/icons/arrow-right.svg"}
                  alt="Arrow Right Icon"
                  width={24}
                  height={24}
                  className='w-6 h-auto ml-2 inline-block'
                />
              </button>
            )}
            <button
              onClick={navToggler}
              className={`md:hidden md:p-8 hover:bg-gray-100 rounded-full transition-colors ${transparentHeaderRoutes.includes(pathname) && prevScrollPos < 10 ? 'text-white' : 'text-black'} `}
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </>
        )}
      </header>
      {
        toggleNav && (
          <Nav
            close={navToggler}
            openHostPopup={() => setShowPopup(true)}
          />
        )
      }

      {showUserPopup && <PopupUser onClose={() => setShowUserPopup(!showUserPopup)} />}
      {showPopup && <PopupHost onClose={() => setShowPopup(!showPopup)} />}
    </>
  );
}