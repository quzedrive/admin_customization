'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import PopupHost from '../PopupHost';
import PopupUser from '../PopupUser'
import Nav from '../Nav';
import Image from 'next/image';
import Link from 'next/link'

export const navList = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Experiences",
    href: "/experiences",
  },
  {
    name: "Investor Relations",
    href: "/investor-relations",
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

export default function Header() {
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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center transition-transform duration-300 ease-in-out px-[5.4%] pt-5 ${visible ? 'translate-y-0' : '-translate-y-full'} ${prevScrollPos > 10 ? 'bg-white backdrop-blur-md pb-5 shadow-sm' : 'bg-transparent'}`}
    >

      <Link href='/' className='p-0'>
        <Image
          src="/logo (2).webp"
          alt="QuzeeDrive"
          width={100}
          height={100}
          className='w-16 h-16 3xl:w-full 3xl:h-auto'
        />
      </Link>

      {/* Show nav on all pages */}
      <nav className={`hidden md:flex items-center font-roboto ${pathname === '/' && prevScrollPos < 10 ? 'text-white' : 'text-black'}`}>
        <ul className="flex justify-center items-center gap-16 ">
          {/* Map through navList to create navigation items */}
          {navList.map((item, index) => (
            <li key={index} className="relative group pt-2">
              <a
                href={item.href}
                className="relative group 4xl:text-xl"
              >
                {item.name}
                <span className={`absolute left-0 -bottom-1 w-0 h-0.5 rounded-full group-hover:w-full transition-all duration-300 ${pathname === '/' && prevScrollPos < 10 ? 'bg-white' : 'bg-black'}`}></span>
              </a>
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
              className='hidden md:flex cursor-pointer bg-btn text-white px-4 py-2 rounded-full items-center justify-center'
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
            className="md:hidden md:p-8 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open menu"
          >
            <Image
              src='/menu.svg'
              alt='Menu'
              width={40}
              height={40}
            />
          </button>
        </>
      )}
      {toggleNav && (
        <Nav
          close={navToggler}
          openHostPopup={() => setShowPopup(true)}
        />
      )}

      {showUserPopup && <PopupUser onClose={() => setShowUserPopup(!showUserPopup)} />}
      {showPopup && <PopupHost onClose={() => setShowPopup(!showPopup)} />}
    </header>
  );
}