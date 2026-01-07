'use client';

import { useWhatsApp } from '@/app/context/WhatsappContext';
import Image from 'next/image';
import Lottie from "lottie-react";
import waLogo from "../public/wa-logo.json";
import Link from 'next/link';

// type ExtType = 

export default function WhatsAppFloating() {
  const { isOpen, toggle, close } = useWhatsApp();


  return (
    <>
      {/* Floating Icon */}
      <div className="fixed bottom-6 right-4 z-50">
        <button
          onClick={toggle}
          className="p-2 cursor-pointer"
          aria-label="Open WhatsApp Chat"
        >
          <Lottie
            animationData={waLogo}
            loop={true}
            autoplay={true}
            style={{ width: 90, height: 90 }}
          />
        </button>

        {/* Popup on top of icon */}
        <div className={`absolute bottom-20 right-0 md:bottom-auto md:top-[-330px] md:right-0
                           transition-all duration-300 ease-in-out
                           ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'}`}>
          <div className="rounded-2xl shadow-xl min-w-[90vw] min-h-80 max-w-lg md:min-w-96 md:h-84 flex flex-col justify-between"
            style={{
              backgroundImage: `url(/wa-bg.webp)`,
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          >
            <div className="w-full h-fit flex bg-green-600 justify-between items-center gap-2 p-2 rounded-b rounded-2xl ">
              <div className="flex items-center gap-2 px-4">
                <Image
                  src='/whatsapp.png'
                  alt=''
                  width={24}
                  height={24}
                />
                <h2 className="text-xl font-semibold text-white">WhatsApp</h2>
              </div>
              <button
                onClick={close}
                className="cursor-pointer text-gray-500 hover:text-black transition"
              >
                <Image src='/close-circle.svg' alt='Close' width={24} height={24} />
              </button>
            </div>

            <div className="flex flex-col gap-4 my-4 items-center text-sm text-gray-700">
              <div className='w-full flex justify-start items-center gap-4 px-4'>
                <Image
                  src="/logo (2).png"
                  alt="Agent"
                  width={86}
                  height={86}
                  className="h-auto max-w-18 rounded-full border border-gray-300"
                />
                <div className='w-full h-fit flex items-center gap-1'>
                  <h4 className="font-semibold text-xl uppercase pt-2.5">Quzeedrive</h4>
                  <Image
                    src='/blue-tick.png'
                    alt='verified'
                    width={16}
                    height={16}
                    className='h-4 w-auto'
                  />
                </div>
              </div>
              <p className="mt-1 px-6 leading-[175%]">
                Rent a car for a few hours or a few days. No driver, no hassle – just
                freedom to drive anywhere, anytime across Chennai and Tamil Nadu.
              </p>
            </div>
            <div className='w-fit m-5 flex items-center justify-center  bg-yellow-400 hover:bg-yellow-500 rounded-full'>
              <Link
                href="https://api.whatsapp.com/send/?phone=9344784676&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex gap-4 text-black font-semibold py-2 px-4 text-sm"
              >
                <Image src={'/send.svg'} alt='>' width={24} height={24} />
                Send us a message
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
