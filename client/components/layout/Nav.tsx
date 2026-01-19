'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'
import PopupHost from '../PopupHost'

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


export default function Nav({
  close,
  openHostPopup,
}: {
  close: () => void;
  openHostPopup: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col ">
      <div className="flex justify-between items-center">
        <a onClick={close} href="#home">
          <Image
            src="/logo (2).png"
            alt="quzeeedrive-logo"
            width={125}
            height={44}
            className="w-32 h-auto"
          />
        </a>

        <button
          onClick={close}
          className="hover:bg-gray-800 rounded-full transition-colors p-4 pr-6"
          aria-label="Close menu"
        >
          <Image
            src="/close.svg"
            alt="Close menu"
            width={40}
            height={40}
            className="w-10 h-auto"
          />
        </button>
      </div>

      <div className="h-full flex flex-col justify-around p-4">
        <div className="flex flex-col justify-start items-start gap-8 text-xl">
          {navList.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={close}
              className="w-full flex justify-between pb-2 border-b border-gray-400"
            >
              {link.name}
            </a>
          ))}
        </div>

          <button
            onClick={() => {
              close(); // close the menu
              openHostPopup(); // open popup from Header
            }}
            className="bg-btn text-2xl text-white px-4 py-2 gap-4 rounded-full flex items-center justify-center"
          >
            BECOME A HOST
            <Image
              src={"/icons/arrow-right.svg"}
              alt="Arrow Right Icon"
              width={24}
              height={24}
              className="w-12 h-auto ml-2 inline-block"
            />
          </button>
      </div>
    </div>
  );
}

